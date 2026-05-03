# Package
`io.homo.superresolution.api`

## 1. API Entry Point

Core entry class: `SuperResolutionAPI`

- `EVENT_BUS`: Unified event bus (based on NeoForged EventBus).
- `getOriginMinecraftFrameBuffer()`: Returns the original Minecraft render target.
- `getMinecraftFrameBuffer()`: Returns the current render target.
- `getScreenWidth() / getScreenHeight()`: Screen resolution.
- `getRenderWidth() / getRenderHeight()`: Actual render resolution.
- `getCurrentAlgorithmDescription()`: Description of the current algorithm.
- `getCurrentAlgorithm()`: Current algorithm instance.
- `debugRenderdocCapture*()` and `debugRenderdocTriggerCapture()`: RenderDoc debug capture entry points.

## 2. Listening to Events

```java
SuperResolutionAPI.EVENT_BUS.addListener((LevelRenderStartEvent event) -> {
    // your code here
});
```

---

## 3. Custom Upscaling Algorithm

### 3.1 Extending `AbstractAlgorithm`

You are required to implement the following methods:

- `init()`: Initialize algorithm resources (shaders, buffers, contexts, etc.). Called only once when the algorithm is created.
- `dispatch(DispatchResource dispatchResource)`: Executed every frame. The default implementation writes into `resources`; you may call `super.dispatch(...)` first.
- `resize(int width, int height)`: Update internal resources when the resolution changes. Called whenever the resolution changes.
- `destroy()`: Release resources. Called when the game shuts down or the algorithm is unloaded.
- `getOutputFrameBuffer()`: Returns the output framebuffer.

> [!NOTE]
> `AlgorithmDescription.createNewInstance()` automatically calls `init()`; ensure that a no-argument constructor is available.

> [!NOTE]
> `AlgorithmRegistry.isAlgorithmSupported(...)` has caching semantics; consider cache invalidation if runtime capabilities change.

Optional overrides:

- `getJitterOffset(...)`: Returns the jitter offset (default `0, 0`; unit: pixels; range `[-1.0, 1.0]`).
- `isSupportJitter()`: Whether jitter is supported (default `false`).
- `getQualityPresets()`: Returns the list of available quality presets (default empty).
- `isCustomUpscaleRatio()`: Whether a custom upscale ratio is allowed (default `true`).
- `getOutputTextureId()`: Directly retrieves the output color texture ID (typically obtained from the output FBO).

### 3.2 Input Resources

`InputResourceSet` is a record that holds the set of input textures:

- `colorTexture` — Color texture
- `depthTexture` — Depth texture
- `motionVectorsTexture` — Motion vector texture. Format: RG16F, containing screen-space motion vectors (x: horizontal, y: vertical; range `[-1.0, 1.0]`)

Access these in `dispatch(...)` via `dispatchResource.resources()`.

### 3.3 Quality Presets

`QualityPreset` describes an available quality tier:

- `upscaleRatio`: Upscale multiplier.
- `name`: Display name (`Component`).
- `codeName`: Internal code name (must be unique across all algorithms).

This class uses a fluent setter design and can be constructed as follows:

```java
QualityPreset preset = new QualityPreset()
        .setCodeName("quality")
        .setName(Component.literal("Quality"))
        .setUpscaleRatio(1.5f);
```

---

## 4. Algorithm Registration and Discovery

### 4.1 `AlgorithmDescription<T>`

Describes a registerable algorithm.

#### Fields:

- `briefName`: Short name.
- `codeName`: Unique code name (used as the index key).
- `displayName`: Display name.
- `requirement`: Runtime environment requirements.
- `extraResources`: Additional resources (e.g. DLL files).

#### Methods:

- `createNewInstance()`: Creates a new algorithm instance via reflection and automatically calls `init()`.
- `getId()`: Returns the internal random UUID.

### 4.2 `AlgorithmRegistry`

- `registry(AlgorithmDescription<?>)`: Registers an algorithm.
- `getAlgorithmMap()`: Returns the current registry map.
- `getDescriptionByID(String id)`: Looks up a description by `codeName`.
- `isAlgorithmSupported(AlgorithmDescription<?>)`: Checks and caches algorithm availability (based on `Requirement.check()`).

> **Note:** The registry performs built-in algorithm registration during static initialization, after which `AlgorithmRegisterEvent` is fired. If you want to register a custom algorithm, listen to this event.

---

## 5. Events (`api.event`)

The following events can be subscribed to via `SuperResolutionAPI.EVENT_BUS`:

- `AlgorithmRegisterEvent`: Fired after the algorithm registration process completes. Register custom algorithms here.
- `AlgorithmDispatchEvent`: Fired before algorithm execution. Provides:
  - `getAlgorithm()`
  - `getDispatchResource()`
- `AlgorithmDispatchFinishEvent`: Fired after algorithm execution. Provides:
  - `getAlgorithm()`
  - `getOutput()` (output FBO)
- `AlgorithmResizeEvent`: Fired when the screen resolution is updated and an algorithm instance exists. Provides:
  - `screenWidth / screenHeight`
  - `renderWidth / renderHeight`
  - `getAlgorithm()`
- `LevelRenderStartEvent`: Fired when world rendering begins.
- `LevelRenderEndEvent`: Fired when world rendering ends.
- `ConfigChangedEvent`: Fired when the configuration changes (avoid relying on this where possible).

> [!NOTE]
> The exact trigger points of `LevelRenderStart` / `LevelRenderEnd` may be affected by capture mode.
---

## 6. Requirement System (`api.utils.Requirement`)

`Requirement` is used to declare algorithm runtime prerequisites and supports fluent builder-style construction:

- OpenGL requirements:
  - `glVersion(major, minor)`
  - `glMajorVersion(...)`
  - `glMinorVersion(...)`
  - `requiredGlExtension("...")`
- Vulkan requirements:
  - `requireVulkan(true)`
  - `vulkanVersion(major, minor, patch)`
  - `requireVulkanDeviceExtension("...")`
- Platform and environment:
  - `addSupportedOS(...)`
  - `developmentEnvironment(true / false)`
- Custom conditions:
  - `isTrue(Supplier<Boolean>)`
  - `isFalse(Supplier<Boolean>)`

Validation entry points:

- `check()` returns a `Requirement.Result`.
- `result.support()` directly indicates whether all conditions are met.
- `getMissingGlExtensions() / getMissingVkExtensions()` can be used to report missing capabilities.

> [!NOTE]
> `AlgorithmRegistry.isAlgorithmSupported(...)` has caching semantics; consider cache invalidation if runtime capabilities change.

---

## 7. Extra Resource Downloads (`api.registry.ExtraResource*`)

### 7.1 `ExtraResource`

Represents a single external resource (e.g. `gugugaga.dll`):

- `check(DirectoryEnsurer)`: Checks whether the resource already exists in the target directory.
- `get(...)`: Downloads or copies the resource based on its source (local or remote).

Resource source `ResourceSource`:

- `Type.Local`: Copy from a local path.
- `Type.Remote`: Download via HTTP.

Error codes `ErrorCode`:

- `NetworkError` — Network error
- `FileNotFound` — Resource not found
- `PermissionDenied` — Insufficient permissions
- `Cancelled` — Cancelled by user
- `UnknownError` — Unknown error

### 7.2 `ExtraResources`

#### Methods:

- `checkAll(directory)`: Checks for missing resources and returns the missing list.
- `getAll(...)`: Batch-fetches resources (supports `async` multi-threading).
- `cancelAll()`: Cancels all ongoing downloads.
- `resetCancelState() / isCancelled()`: Cancel state management.

#### Callbacks:

- `ResourcesProgressListener` — Download progress callback
- `ResourcesFinishListener` — Download completion callback
- `ResourcesErrorListener` — Download error callback

---