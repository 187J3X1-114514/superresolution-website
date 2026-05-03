# 包
`io.homo.superresolution.api`

## 1. API 入口点

核心入口类：`SuperResolutionAPI`

- `EVENT_BUS`：统一事件总线（基于 NeoForged EventBus）。
- `getOriginMinecraftFrameBuffer()`：返回原始 Minecraft 渲染目标。
- `getMinecraftFrameBuffer()`：返回当前渲染目标。
- `getScreenWidth() / getScreenHeight()`：屏幕分辨率。
- `getRenderWidth() / getRenderHeight()`：实际渲染分辨率。
- `getCurrentAlgorithmDescription()`：当前算法的描述。
- `getCurrentAlgorithm()`：当前算法实例。
- `debugRenderdocCapture*()` 和 `debugRenderdocTriggerCapture()`：RenderDoc 调试捕获入口点。

## 2. 监听事件

```java
SuperResolutionAPI.EVENT_BUS.addListener((LevelRenderStartEvent event) -> {
    // 你的代码
});
```

---

## 3. 自定义超分辨率算法

### 3.1 继承 `AbstractAlgorithm`

你需要实现以下方法：

- `init()`：初始化算法资源（着色器、缓冲区、上下文等）。仅在算法创建时调用一次。
- `dispatch(DispatchResource dispatchResource)`：每帧执行。默认实现写入 `resources`；你可以先调用 `super.dispatch(...)`。
- `resize(int width, int height)`：当分辨率变化时更新内部资源。在分辨率变化时调用。
- `destroy()`：释放资源。在游戏关闭或算法卸载时调用。
- `getOutputFrameBuffer()`：返回输出帧缓冲区。

> [!NOTE]
> `AlgorithmDescription.createNewInstance()` 会自动调用 `init()`；请确保存在无参构造函数。

> [!NOTE]
> `AlgorithmRegistry.isAlgorithmSupported(...)` 具有缓存语义；如果运行时能力发生变化，请考虑缓存失效。

可选覆写：

- `getJitterOffset(...)`：返回抖动偏移（默认 `0, 0`；单位：像素；范围 `[-1.0, 1.0]`）。
- `isSupportJitter()`：是否支持抖动（默认 `false`）。
- `getQualityPresets()`：返回可用质量预设列表（默认为空）。
- `isCustomUpscaleRatio()`：是否允许自定义放大比例（默认 `true`）。
- `getOutputTextureId()`：直接获取输出颜色纹理 ID（通常从输出 FBO 获取）。

### 3.2 输入资源

`InputResourceSet` 是一个记录，包含一组输入纹理：

- `colorTexture` — 颜色纹理
- `depthTexture` — 深度纹理
- `motionVectorsTexture` — 运动矢量纹理。格式：RG16F，包含屏幕空间运动矢量（x：水平，y：垂直；范围 `[-1.0, 1.0]`）

在 `dispatch(...)` 中通过 `dispatchResource.resources()` 访问这些资源。

### 3.3 质量预设

`QualityPreset` 描述了一个可用的质量等级：

- `upscaleRatio`：放大倍数。
- `name`：显示名称（`Component`）。
- `codeName`：内部代码名称（在所有算法中必须唯一）。

该类使用流式 setter 设计，可以按如下方式构建：

```java
QualityPreset preset = new QualityPreset()
        .setCodeName("quality")
        .setName(Component.literal("Quality"))
        .setUpscaleRatio(1.5f);
```

---

## 4. 算法注册与发现

### 4.1 `AlgorithmDescription<T>`

描述一个可注册的算法。

#### 字段：

- `briefName`：简短名称。
- `codeName`：唯一代码名称（用作索引键）。
- `displayName`：显示名称。
- `requirement`：运行时环境要求。
- `extraResources`：额外资源（例如 DLL 文件）。

#### 方法：

- `createNewInstance()`：通过反射创建新的算法实例并自动调用 `init()`。
- `getId()`：返回内部的随机 UUID。

### 4.2 `AlgorithmRegistry`

- `registry(AlgorithmDescription<?>)`：注册一个算法。
- `getAlgorithmMap()`：返回当前注册表映射。
- `getDescriptionByID(String id)`：通过 `codeName` 查找描述。
- `isAlgorithmSupported(AlgorithmDescription<?>)`：检查并缓存算法可用性（基于 `Requirement.check()`）。

> **注意：** 注册表在静态初始化期间执行内置算法注册，之后会触发 `AlgorithmRegisterEvent`。如果你想注册自定义算法，请监听此事件。

---

## 5. 事件（`api.event`）

以下事件可以通过 `SuperResolutionAPI.EVENT_BUS` 订阅：

- `AlgorithmRegisterEvent`：在算法注册过程完成后触发。在此处注册自定义算法。
- `AlgorithmDispatchEvent`：在算法执行前触发。提供：
  - `getAlgorithm()`
  - `getDispatchResource()`
- `AlgorithmDispatchFinishEvent`：在算法执行后触发。提供：
  - `getAlgorithm()`
  - `getOutput()`（输出 FBO）
- `AlgorithmResizeEvent`：当屏幕分辨率更新且算法实例存在时触发。提供：
  - `screenWidth / screenHeight`
  - `renderWidth / renderHeight`
  - `getAlgorithm()`
- `LevelRenderStartEvent`：世界渲染开始时触发。
- `LevelRenderEndEvent`：世界渲染结束时触发。
- `ConfigChangedEvent`：配置更改时触发（尽量避免依赖此事件）。

> [!NOTE]
> `LevelRenderStart` / `LevelRenderEnd` 的确切触发点可能会受到捕获模式的影响。
---

## 6. 需求系统（`api.utils.Requirement`）

`Requirement` 用于声明算法运行时先决条件，支持流式构建器风格：

- OpenGL 需求：
  - `glVersion(major, minor)`
  - `glMajorVersion(...)`
  - `glMinorVersion(...)`
  - `requiredGlExtension("...")`
- Vulkan 需求：
  - `requireVulkan(true)`
  - `vulkanVersion(major, minor, patch)`
  - `requireVulkanDeviceExtension("...")`
- 平台与环境：
  - `addSupportedOS(...)`
  - `developmentEnvironment(true / false)`
- 自定义条件：
  - `isTrue(Supplier<Boolean>)`
  - `isFalse(Supplier<Boolean>)`

验证入口点：

- `check()` 返回 `Requirement.Result`。
- `result.support()` 直接指示是否满足所有条件。
- `getMissingGlExtensions() / getMissingVkExtensions()` 可用于报告缺失的能力。

> [!NOTE]
> `AlgorithmRegistry.isAlgorithmSupported(...)` 具有缓存语义；如果运行时能力发生变化，请考虑缓存失效。

---

## 7. 额外资源下载（`api.registry.ExtraResource*`）

### 7.1 `ExtraResource`

表示单个外部资源（例如 `gugugaga.dll`）：

- `check(DirectoryEnsurer)`：检查资源是否已存在于目标目录中。
- `get(...)`：根据来源（本地或远程）下载或复制资源。

资源来源 `ResourceSource`：

- `Type.Local`：从本地路径复制。
- `Type.Remote`：通过 HTTP 下载。

错误码 `ErrorCode`：

- `NetworkError` — 网络错误
- `FileNotFound` — 未找到资源
- `PermissionDenied` — 权限不足
- `Cancelled` — 被用户取消
- `UnknownError` — 未知错误

### 7.2 `ExtraResources`

#### 方法：

- `checkAll(directory)`：检查缺失的资源并返回缺失列表。
- `getAll(...)`：批量获取资源（支持 `async` 多线程）。
- `cancelAll()`：取消所有正在进行的下载。
- `resetCancelState() / isCancelled()`：取消状态管理。

#### 回调：

- `ResourcesProgressListener` — 下载进度回调
- `ResourcesFinishListener` — 下载完成回调
- `ResourcesErrorListener` — Download error callback

---