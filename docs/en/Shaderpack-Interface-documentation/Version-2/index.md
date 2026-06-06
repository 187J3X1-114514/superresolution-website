---
title: "Shader Pack Integration Guide"
---

# Shader Pack Integration Guide <Badge type="warning" text="0.8.3-alpha.4 ~ latest" /> <Badge type="tip" text="v2" />

**Schema Version: 2**

This guide explains how to integrate SR (Super Resolution) into your shader pack.
SR acts as a **plugin** — it does not take over or modify how the game renders, but simply adds super resolution capability to Iris's (or other shader loaders', though only Iris is currently supported) rendering pipeline.
You only need to understand what data SR reads and where it writes the result.


## How SR Works

SR does **not** change the game's rendering resolution. The game always renders at screen resolution.

Resolution scaling is entirely controlled by **your shader pack** (e.g., through buffer scale directives).
SR simply plugs into your composite pipeline at a point you choose, reads your inputs, performs super resolution, and writes the result back.

Here is the flow:

1. Your shader renders the scene normally. Resolution scaling is managed by your shader.
2. At a composite pass you specify, SR activates.
3. SR reads color, depth, and motion vectors from your buffers.
4. SR performs super resolution upscaling.
5. SR writes the upscaled result back to the buffer you specify.
6. Your shader continues with subsequent passes.

If the configuration file is missing, malformed, or the shader interface is disabled, SR does nothing — your shader runs as if SR does not exist.

::: tip
SR is a plugin. It adds super resolution capability to your existing pipeline.
It does not control rendering resolution, and it does not replace any of your passes.
:::

## Part I — Quick Start

### Step 1: Create the Configuration File

Create a file named `superresolution.json` and place it in the root of your shader pack, next to `shaders.properties`.

### Step 2: Write a Minimal Configuration

```json
{
  "schema_version": 2,
  "profiles": {
    "*": {
      "jitter": {
        "enabled": true
      },
      "upscale": {
        "enabled": true,
        "internal_format": "r11g11b10f",
        "auto_exposure": true,
        "hdr": true,
        "motion_jittered": false,
        "pre_exposure": {
            "source": "const",
            "type": "float",
            "value": 1.0
        },
        "trigger": {
          "type": "AFTER",
          "pass": "composite1"
        },
        "inputs": {
          "color": {
            "enabled": true,
            "src": "colortex0",
            "region": [0, 0, -1, -1]
          },
          "depth": {
            "enabled": true,
            "src": "depthtex",
            "region": [0, 0, -1, -1]
          },
          "motion_vectors": {
            "enabled": true,
            "src": "colortex16",
            "region": [0, 0, -1, -1]
          }
        },
        "outputs": {
          "upscaled_color": {
            "enabled": true,
            "target": ["colortex0"],
            "region": [0, 0, -2, -2]
          }
        }
      }
    }
  }
}
```

### Step 3: Provide the Required Data in Your Shader

In the composite passes **before** the trigger point, make sure:

- Your **color** buffer contains the rendered scene (at your scaled resolution).
- Your **depth** buffer is available.
- Your **motion vectors** buffer is written with motion vectors.

## Part II — Configuration Reference

### Profiles

Profiles let you configure SR differently per dimension. Each key in `"profiles"` corresponds to a dimension.

When a dimension loads, SR looks for a matching profile:

1. First, it checks for an exact match (e.g., `"0"` for Overworld).
2. If none is found, it falls back to `"*"`.
3. If neither exists, super resolution is disabled for that dimension.

| Key    | Dimension        |
|--------|------------------|
| `"0"`  | Overworld        |
| `"-1"` | Nether           |
| `"1"`  | End              |
| `"*"`  | Default fallback |

> Dimension keys are determined by the shader pack's own dimension mapping
> (the same mapping Iris uses via `dimension.world0`, etc.).

### Trigger

```json
"trigger": {
  "type": "AFTER",
  "pass": "composite1"
}
```

- `"type"` — `"BEFORE"` or `"AFTER"`. Determines whether SR runs before or after the specified pass.
- `"pass"` — The name of a composite pass (e.g., `"composite"`, `"composite1"`, `"composite2"`, ...).

**Only composite passes are supported.** Compute shader composite passes are technically supported but considered **unstable** — use them at your own risk.

Choose the trigger point based on your pipeline:
- The pass **before** the trigger should have finished writing color, depth, and motion vectors.
- The pass **after** the trigger can read the upscaled result at full screen resolution.

### Inputs

SR requires **three** inputs. All three must be provided and enabled. If any input is missing or disabled, super resolution will not run for that frame.

```json
"inputs": {
  "color": {
    "enabled": true,
    "src": "colortex0",
    "region": [0, 0, -1, -1]
  },
  "depth": {
    "enabled": true,
    "src": "depthtex",
    "region": [0, 0, -1, -1]
  },
  "motion_vectors": {
    "enabled": true,
    "src": "colortex16",
    "region": [0, 0, -1, -1]
  }
}
```

| Input              | Description                                        |
|--------------------|----------------------------------------------------|
| `color`            | The rendered scene color at your scaled resolution. |
| `depth`            | The depth buffer.                                   |
| `exposure`         | Exposure value, a 1×1 texture.                      |
| `motion_vectors`   | Per-pixel motion vectors in UV space (RG channels). |

**`src`** can be any of the following texture names:

| Name                            | Description                                                           |
|---------------------------------|-----------------------------------------------------------------------|
| `colortex0` – `colortex31`      | Color textures                                                        |
| `alttex0` – `alttex31`          | Color texture variants, pointing to alt textures instead of main textures |
| `autotex0` – `autotex31`        | Color texture variants, automatically handling alt vs. main read/write |
| `depthtex`                      | Main depth texture                                                    |
| `noHandDepthtex`                | Depth texture without hand                                            |
| `noTranslucentDepthtex`         | Depth texture without translucent objects                             |


### Region

The `"region"` field specifies which part of a texture to read from or write to:

```text
"region": [X, Y, W, H]
```

| Value | Meaning                          |
|-------|----------------------------------|
| `≥ 0` | Explicit pixel coordinate / size |
| `-1`  | Full **Render Resolution** (the scaled resolution your shader uses) |
| `-2`  | Full **Screen Resolution** (the actual display resolution)          |

Rules:
- `X` and `Y` must be `0` or positive. Negative values for position are not allowed.
- `W` and `H` accept positive values, `-1`, or `-2`.

If `"region"` is omitted, it defaults to `[0, 0, -1, -1]` (full render resolution).

**Typical usage:**
- Input regions use `-1` (render resolution) because your shader rendered at scaled resolution.
- Output regions use `-2` (screen resolution) because the upscaled result is at full resolution.


### Output

The `"outputs"` section must contain exactly one key: `"upscaled_color"`.

```json
"outputs": {
  "upscaled_color": {
    "enabled": true,
    "target": ["colortex0"],
    "region": [0, 0, -2, -2]
  }
}
```

- `"target"` — A list of buffer names to write the upscaled result to. If multiple targets are specified, the result is written to each one in order. All targets must have the same dimensions.
- The output is always at **screen resolution**.
- The output is always **de-jittered** (jitter is removed automatically).


### Internal Format

```json
"internal_format": "r11g11b10f"
```

Specifies the texture format SR uses internally for processing.

Supported values:

| Value         | Format       |
|---------------|--------------|
| `r11g11b10f`  | R11G11B10F |
| `rgba8`       | RGBA8        |
| `rgba16f`     | RGBA16F      |

If omitted or unrecognized, defaults to `RGBA16F`, but it is strongly recommended to specify this explicitly, as the default format may differ across SR versions. Also, SR allows the user to manually override this setting (even when the shaderpack specifies it explicitly).


### Pre-exposure

```json
"pre_exposure": {
    "source": "const",
    "type": "float",
    "value": 1.0
}
```

- **Optional field**.
- **Only accepts type**: `float`.
- **Default value**: `1.0`.
- `source` should be `"const"`, `"variable"`, or `"uniform"`.
- When `source == "const"`, `value` must be a number;
- When `source == "variable"` or `source == "uniform"`, `value` must be a non-empty string (the variable/uniform name).


### HDR Input/Output

```json
"hdr": true
```

- **Type**: `boolean`
- **Default**: `false`
- Whether to process input color with an HDR pipeline. When enabled, SR uses a higher dynamic range for internal computations.


### Auto Exposure

```json
"auto_exposure": true
```

- **Type**: `boolean`
- **Default**: `false`
- Enables automatic exposure computation.
- **Note**: If the `exposure` texture input is also enabled in `inputs`, the parser ignores `auto_exposure = true` and logs a warning (the `exposure` texture takes precedence).


### Motion Vector Jittered

```json
"motion_jittered": false
```

- **Type**: `boolean`
- **Default**: `false`
- Indicates whether the motion vectors already include jitter information.
- When set to `true`, the motion vectors are considered to already account for subpixel jitter offsets, and SR will not perform additional jitter-related motion vector correction.
- When set to `false` (default), SR assumes the motion vectors correspond to un-jittered sample positions.


### Jitter

When enabled, SR generates subpixel jitter offsets each frame. Your shader can read the jitter values through the provided uniforms (see below) and apply them to the projection matrix.

```json
"jitter": {
    "enabled": true,
    "source": "mod",
    "source_config": {
        "jitter_offset": {
            "source": "uniform",
            "type": "vector2f",
            "value": "taa_jitter_offset"
        },
        "jitter_sequence_length": {
            "source": "const",
            "type": "int",
            "value": 8
        }
    }
}
```

Corresponding `shaders.properties` configuration:

```properties
variable.vec2.taa_jitter_offset=vec2(0.1,0.2)
# uniform.vec2.taa_jitter_offset=vec2(0.1,0.2)
```

The table below explains the fields from the JSON example above:

| Field                                            | Type / Example                              | Description                                                                                                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`                                         | `"mod"` / `"shaderpack"`                 | Optional, default `"mod"` (SR generates jitter). If `"shaderpack"`, the shaderpack provides jitter; only in this mode does `source_config` take effect. This mode is experimental.                                       |
| `source_config.jitter_offset.source`             | `const` / `variable` / `uniform`             | Specifies the source type for `jitter_offset`.                                                                                                                                                                               |
| `source_config.jitter_offset.type`               | `vector2f`                                   | Must be `vector2f`, representing the X and Y components of the jitter value.                                                                                                                                                 |
| `source_config.jitter_offset.value`              | e.g. `taa_jitter_offset` or `[0.0, 0.0]`     | If `source` is `uniform`/`variable`, this is the uniform/variable name; for `const`, it is a constant array; for `variable`, it is a shaderpack variable name (the shaderpack is responsible for updating it).     |
| `source_config.jitter_sequence_length.source`    | `const` / `variable` / `uniform`             | Specifies the source type for the sequence length.                                                                                                                                                                               |
| `source_config.jitter_sequence_length.type`      | `int`                                        | Must be `int`, representing the jitter sequence length.                                                                                                                                                                      |
| `source_config.jitter_sequence_length.value`     | e.g. `8`                                     | If `source` is `const`, this is an integer; if `uniform`/`variable`, this is a name.                                                                                                                                        |

* Jitter value X, Y ∈ [-0.5, 0.5]
* If the currently active upscaling algorithm does not support jitter, jitter will not be applied — no error occurs, and the shader runs normally.


### Customs

The `customs` field sits under `upscale` and is a general-purpose extension field for providing algorithm-related custom configuration.

```json
"customs": {
    "motion_vector_preprocessing_function": "<GLSL function code>"
}
```

#### motion_vector_preprocessing_function

Allows custom GLSL preprocessing of motion vectors before they are fed into the upscaling algorithm.

**Constraints:**

- Must contain a function with the signature `vec2 motionVectorPreprocessing(vec2)`
- The `vec2` parameter is the motion vector, and the return value is the preprocessed motion vector

**Behavioral differences:**

- **FSR / DLSS / XeSS**: The motion vector passed to the function has already had its Y axis flipped (equivalent to `mv * vec2(1.0, -1.0)`). The function code is injected into `process_input_textures.comp` and called during motion vector processing:

  ```glsl
  #ifdef HAS_MOTION_VECTOR
  layout(binding = 4) uniform sampler2D inputMotionVectors;
  layout(binding = 5, rg16f) uniform writeonly image2D outputMotionVectors;
  #endif

  // ...

  void main() {
      // ...
      #ifdef HAS_MOTION_VECTOR
      vec2 mv = texelFetch(inputMotionVectors, ivec2(texelCoord.x, flippedY), 0).rg;
      mv.y = -mv.y;
      #ifdef MOTION_VECTOR_PREPROCESSING_FUNCTION_INJECTED
      mv = motionVectorPreprocessing(mv);
      #endif
      imageStore(outputMotionVectors, texelCoord, vec4(mv, 0.0, 0.0));
      #endif
      // ...
  }
  ```

- **Other algorithms**: The motion vector passed to the function is the raw data (without any transformation). The function runs in a standalone compute pass:

  ```glsl
  #version 430 core

  layout(local_size_x = 16, local_size_y = 16, local_size_z = 1) in;

  layout(binding = 0) uniform sampler2D inputMotionVectors;
  layout(binding = 1, rg16f) uniform writeonly image2D outputMotionVectors;

  // MOTION_VECTOR_PREPROCESSING_FUNCTION_PLACEHOLDER

  void main() {
      ivec2 texelCoord = ivec2(gl_GlobalInvocationID.xy);
      ivec2 texSize = imageSize(outputMotionVectors);
      if (texelCoord.x < texSize.x && texelCoord.y < texSize.y) {
          vec2 mv = texelFetch(inputMotionVectors, texelCoord, 0).rg;
          #ifdef MOTION_VECTOR_PREPROCESSING_FUNCTION_INJECTED
          mv = motionVectorPreprocessing(mv);
          #endif
          imageStore(outputMotionVectors, texelCoord, vec4(mv, 0.0, 0.0));
      }
  }
  ```

**Usage example:**

```json
{
  "schema_version": 2,
  "profiles": {
    "*": {
      "upscale": {
        "customs": {
          "motion_vector_preprocessing_function": "vec2 motionVectorPreprocessing(vec2 motionVector) { return vec2(0.0); }"
        }
      }
    }
  }
}
```

::: tip
You can use macros (e.g., `#if SR_USING_ALGO == SR_ALGO_FSR`) to conditionally enable the preprocessing function per algorithm.
:::


### Macros in Configuration

Starting from schema version 2, you can use macros in the configuration file. The available macros are equivalent to those defined in `shaders.properties` (excluding macros newly defined in `shaders.properties`).

::: warning
While the mod performs macro preprocessing on configuration files of any schema version as well, for compatibility, do not use macros in versions below v2.
:::


## Part III — Motion Vectors

Your shader **must** provide motion vectors. SR does not generate them for you.

Motion vectors must:

- Be stored in the **RG channels** of the source texture.
- Be in **UV space** (normalized −1 to 1 coordinates).
- Be computed as:

```text
motion_vector = current_uv - previous_uv
// motion_vector.x, motion_vector.y ∈ [-1.0, 1.0]
```

For example, if a pixel's motion vector value is (-1.0, -0.5), this means:

* The pixel's position in the previous frame was offset to the right by the entire screen width relative to the current frame
* The pixel's position in the previous frame was offset upward by half the screen height relative to the current frame

Where UV coordinates are based on the **render resolution** (your scaled resolution).

Important:
- Do **not** flip the Y axis.
- Do **not** convert to NDC.
- SR internally handles any coordinate space conversions required by the active algorithm.


## Part IV — Shader Macros and Uniforms

When SR is installed and a shader pack includes a valid `superresolution.json`, SR injects the following macros and uniforms into your shaders. You can use these to adapt your rendering when SR is active.

### Macros

| Macro                       | Description                                                                                      |
|-----------------------------|--------------------------------------------------------------------------------------------------|
| `SR_INSTALLED`              | Always `1` when SR is installed.                                                                 |
| `SR_CONFIG_SCHEMA_VERSION`  | The version of the current interface configuration file, e.g. `2`, `114514`.                     |
| `SR_UPSCALE_RATIO_HALF`     | Equal to 0.5 of the upscale ratio.                                                               |
| `SR_RENDER_SCALE_FACTOR_HALF` | Equal to 0.5 of the render scale factor.                                                       |
| `SR_ENABLE`                 | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_DISABLE`                | Inverse of `SR_ENABLE`.                                                                          |
| `SR_USING_ALGO`             | Integer ID of the currently active algorithm. `0` if upscaling is disabled.                      |
| `SR_ALGO_<NAME>`            | Integer ID for each registered algorithm (e.g., `SR_ALGO_FSR2`). Useful for comparing with `SR_USING_ALGO`. |
| `SR_ALGO_SUPPORTS_JITTER`   | `1` if the active algorithm supports jitter, `0` otherwise.                                      |
| `SR_SHOULD_APPLY_SCALE`     | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_SHOULD_APPLY_JITTER`    | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_SCALED_WIDTH`           | Render width (scaled resolution width). Equals screen width when upscaling is disabled.          |
| `SR_SCALED_HEIGHT`          | Render height (scaled resolution height). Equals screen height when upscaling is disabled.       |
| `SR_SCREEN_WIDTH`           | Screen width (display resolution width).                                                         |
| `SR_SCREEN_HEIGHT`          | Screen height (display resolution height).                                                       |
| `SR_JITTER_SEQUENCE_LENGTH` | The length of the current jitter sequence (if jitter is enabled). `0` if jitter is unsupported or disabled. |
| `SR_RENDER_SCALE_FACTOR`    | The current render scale factor (e.g., `0.5` for 50% scale). `1.0` when upscaling is disabled.    |
| `SR_UPSCALE_RATIO`          | The current upscale ratio (screen / render). `1.0` when upscaling is disabled.                     |
| `SR_DLSS_RENDERPRESET`      | Integer ID of the current DLSS render preset (e.g., `SR_ALGO_DLSS_RENDERPRESET_J`). `0` if the active algorithm is not DLSS or upscaling is disabled. |
| `SR_ALGO_DLSS_RENDERPRESET_<PRESET>` | Integer ID for each registered DLSS render preset (e.g., `SR_ALGO_DLSS_RENDERPRESET_F`). Useful for comparing with `SR_DLSS_RENDERPRESET`. Current presets: `K`, `J`, `F`, `L`, `M`. |

### Uniforms

| Uniform                     | Type      | Description                                                                                       |
|-----------------------------|-----------|---------------------------------------------------------------------------------------------------|
| `SRRenderScale`             | `float`   | The render scale factor (e.g., `0.5` for 50% scale). `1.0` when upscaling is disabled.            |
| `SRRatio`                   | `float`   | The upscale ratio (screen / render). `1.0` when upscaling is disabled.                            |
| `SRRenderScaleLog2`         | `float`   | `log2(renderWidth / screenWidth)`. `0.0` when upscaling is disabled.                              |
| `SRScaledViewportSize`      | `vec2`    | Render resolution as `vec2(width, height)`.                                                       |
| `SROriginalViewportSize`    | `vec2`    | Screen resolution as `vec2(width, height)`.                                                       |
| `SRScaledViewportSizeI`     | `ivec2`   | Render resolution as `ivec2(width, height)`.                                                      |
| `SROriginalViewportSizeI`   | `ivec2`   | Screen resolution as `ivec2(width, height)`.                                                      |
| `SRJitterOffset`            | `vec2`    | Current frame's jitter offset in pixel space. `vec2(0)` if jitter is unsupported or disabled.     |
| `SRPreviousJitterOffset`    | `vec2`    | Previous frame's jitter offset in pixel space. `vec2(0)` if jitter is unsupported or disabled.    |
| `SRFrameCount`              | `int`     | The current frame count.                                                                           |

::: warning

Avoid using the `SR_SCALED_WIDTH`, `SR_SCALED_HEIGHT`, `SR_SCREEN_WIDTH`, and `SR_SCREEN_HEIGHT` macros in `shaders.properties`, as they do not update when the game window is resized. Use `SR_UPSCALE_RATIO` or `SR_RENDER_SCALE_FACTOR` instead — these trigger a shaderpack reload when changed.

:::

When upscaling is disabled:
- Scale values behave as `1.0`.
- Jitter offsets are `vec2(0)`.
- `SR_USING_ALGO` is `0`.
- `SR_SCALED_WIDTH` / `SR_SCALED_HEIGHT` equal the screen dimensions.


## Part V — Error Handling

SR is designed to never break your shader pipeline.

| Situation                              | Behavior                                    |
|----------------------------------------|---------------------------------------------|
| `superresolution.json` does not exist  | SR does nothing. Shader runs normally.       |
| JSON is malformed                      | SR disables completely.                      |
| `schema_version` is missing            | SR disables completely.                      |
| `schema_version` is unsupported        | SR disables completely.                      |
| No matching profile for current dimension | Super resolution is disabled for that dimension. |
| A required input is missing or disabled | That frame skips super resolution.           |
| Algorithm does not support jitter      | Jitter is not applied. No error.            |

SR will log warnings when configuration issues are detected, but it will never crash or corrupt the rendering pipeline.


## Full Example

Here is a complete `superresolution.json` with per-dimension profiles:

```json
{
  "schema_version": 2,
  "profiles": {
    "*": {
      "jitter": {
        "enabled": true
      },
      "upscale": {
        "enabled": true,
        "internal_format": "r11g11b10f",
        "trigger": {
          "type": "AFTER",
          "pass": "composite2"
        },
        "inputs": {
          "color": {
            "enabled": true,
            "src": "colortex0",
            "region": [0, 0, -1, -1]
          },
          "depth": {
            "enabled": true,
            "src": "depthtex",
            "region": [0, 0, -1, -1]
          },
          "motion_vectors": {
            "enabled": true,
            "src": "colortex16",
            "region": [0, 0, -1, -1]
          }
        },
        "outputs": {
          "upscaled_color": {
            "enabled": true,
            "target": ["colortex0"],
            "region": [0, 0, -2, -2]
          }
        }
      }
    },
    "-1": {
      "jitter": {
        "enabled": true
      },
      "upscale": {
        "enabled": true,
        "internal_format": "rgba16f",
        "trigger": {
          "type": "AFTER",
          "pass": "composite1"
        },
        "inputs": {
          "color": {
            "enabled": true,
            "src": "colortex0",
            "region": [0, 0, -1, -1]
          },
          "depth": {
            "enabled": true,
            "src": "depthtex",
            "region": [0, 0, -1, -1]
          },
          "motion_vectors": {
            "enabled": true,
            "src": "colortex16",
            "region": [0, 0, -1, -1]
          }
        },
        "outputs": {
          "upscaled_color": {
            "enabled": true,
            "target": ["colortex0"],
            "region": [0, 0, -2, -2]
          }
        }
      }
    }
  }
}
```

In this example:
- The default profile (`"*"`) triggers after `composite2`.
- The Nether (`"-1"`) uses a different trigger pass and internal format.
- The Overworld and End use the default profile since they have no explicit entry.