# Shader Pack Integration Guide

**Schema Version: 1**

This guide explains how to integrate SR (Super Resolution) into your shader pack.
SR as a **plugin** for your traditional rendering pipeline — it does not take over or modify how the game renders.
You only need to understand what data SR reads and where it writes the result.

---

## How SR Works

SR does **not** change the game's rendering resolution. The game always renders at full screen resolution.

Resolution scaling is handled **entirely by your shader pack** (e.g., through buffer scale directives).
SR simply plugs into your composite pipeline at a point you choose, reads your inputs, performs upscaling, and writes the result back.

Here is the flow:

1. Your shader renders the scene. Resolution scaling (if any) is managed by your shader.
2. At a composite pass you specify, SR activates.
3. SR reads color, depth, and motion vectors from your buffers.
4. SR upscales the image.
5. SR writes the upscaled result back to the buffer(s) you specify.
6. Your shader continues with subsequent passes.

If the configuration file is missing, malformed, or the shader interface is disabled, SR does nothing — your shader runs as if SR does not exist.

> **Key point:** SR is a plugin. It adds upscaling capability to your existing pipeline.
> It does not control rendering resolution, and it does not replace any of your passes.

---

## Part I — Quick Start

### Step 1: Create the Configuration File

Create a file named `superresolution.json` and place it in the root of your shader pack, next to `shaders.properties`.

### Step 2: Write a Minimal Configuration

```json
{
  "schema_version": 1,
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
- Your **motion vectors** buffer is written with per-pixel motion in UV space.

That's it. SR handles the rest.

---

## Part II — Configuration Reference

### Profiles

Profiles let you configure SR differently per dimension. Each key in `"profiles"` corresponds to a dimension.

When a dimension loads, SR looks for a matching profile:

1. First, it checks for an exact match (e.g., `"0"` for Overworld).
2. If none is found, it falls back to `"*"`.
3. If neither exists, upscaling is disabled for that dimension.

| Key    | Dimension        |
|--------|------------------|
| `"0"`  | Overworld        |
| `"-1"` | Nether           |
| `"1"`  | End              |
| `"*"`  | Default fallback |

> Dimension keys are determined by the shader pack's own dimension mapping
> (the same mapping Iris uses via `dimension.world0`, etc.).

---

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

---

### Inputs

SR requires **three** inputs. All three must be provided and enabled. If any input is missing or disabled, upscaling will not run for that frame.

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
| `motion_vectors`   | Per-pixel motion vectors in UV space (RG channels). |

**`src`** can be any of the following texture names:

| Name                        | Description                       |
|-----------------------------|-----------------------------------|
| `colortex0` – `colortex31`  | Color buffer attachments          |
| `alttex0` – `alttex31`      | Alternate (flip) texture variants |
| `depthtex`                  | Main depth texture                |
| `noHandDepthtex`            | Depth texture without hand        |
| `noTranslucentDepthtex`     | Depth texture without translucents|

---

### Region

The `"region"` field specifies which part of a texture to read from or write to:

```
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

---

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
- The color space remains **SDR**.

---

### Internal Format

```json
"internal_format": "r11g11b10f"
```

Specifies the texture format SR uses internally for processing.

Supported values:

| Value         | Format       |
|---------------|--------------|
| `r11g11b10f`  | R11G11B10F (default) |
| `rgba8`       | RGBA8        |
| `rgba16f`     | RGBA16F      |

If omitted or unrecognized, defaults to `R11G11B10F`.

---

### Jitter

```json
"jitter": {
  "enabled": true
}
```

When enabled, SR generates subpixel jitter offsets each frame. Your shader can read the jitter values through the provided uniforms (see below) and apply them to the projection matrix.

If the active upscaling algorithm does not support jitter, jitter simply won't be applied — no error occurs, and your shader runs normally.

---

## Part III — Motion Vectors

Your shader **must** provide motion vectors. SR does not generate them for you.

Motion vectors must:

- Be stored in the **RG channels** of the source texture.
- Be in **UV space** (normalized 0–1 coordinates).
- Be computed as:

```
motion = previous_uv - current_uv
```

Where UV coordinates are based on the **render resolution** (your scaled resolution).

Important:
- Do **not** flip the Y axis.
- Do **not** convert to NDC.
- SR internally handles any coordinate space conversions required by the active algorithm.

---

## Part IV — Shader Macros and Uniforms

When SR is installed and a shader pack includes a valid `superresolution.json`, SR injects the following macros and uniforms into your shaders. You can use these to adapt your rendering when SR is active.

### Macros

| Macro                       | Description                                                                                      |
|-----------------------------|--------------------------------------------------------------------------------------------------|
| `SR_INSTALLED`              | Always `1` when SR is installed.                                                                 |
| `SR_ENABLE`                 | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_DISABLE`                | Inverse of `SR_ENABLE`.                                                                          |
| `SR_USING_ALGO`             | Integer ID of the currently active algorithm. `0` if upscaling is disabled.                      |
| `SR_ALGO_<NAME>`            | Integer ID for each registered algorithm (e.g., `SR_ALGO_FSR2`). Useful for comparing with `SR_USING_ALGO`. |
| `SR_ALGO_SUPPORTS_JITTER`  | `1` if the active algorithm supports jitter, `0` otherwise.                                      |
| `SR_SHOULD_APPLY_SCALE`    | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_SHOULD_APPLY_JITTER`   | `1` if upscaling is enabled, `0` otherwise.                                                     |
| `SR_SCALED_WIDTH`           | Render width (scaled resolution width). Equals screen width when upscaling is disabled.          |
| `SR_SCALED_HEIGHT`          | Render height (scaled resolution height). Equals screen height when upscaling is disabled.       |
| `SR_SCREEN_WIDTH`           | Screen width (display resolution width).                                                         |
| `SR_SCREEN_HEIGHT`          | Screen height (display resolution height).                                                       |

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

When upscaling is disabled:
- Scale values behave as `1.0`.
- Jitter offsets are `vec2(0)`.
- `SR_USING_ALGO` is `0`.
- `SR_SCALED_WIDTH` / `SR_SCALED_HEIGHT` equal the screen dimensions.

---

## Part V — Error Handling

SR is designed to never break your shader pipeline.

| Situation                              | Behavior                                    |
|----------------------------------------|---------------------------------------------|
| `superresolution.json` does not exist  | SR does nothing. Shader runs normally.       |
| JSON is malformed                      | SR disables completely.                      |
| `schema_version` is missing            | SR disables completely.                      |
| `schema_version` is unsupported        | SR disables completely.                      |
| No matching profile for current dimension | Upscaling is disabled for that dimension. |
| A required input is missing or disabled | That frame skips upscaling.                 |
| Algorithm does not support jitter      | Jitter is not applied. No error.            |

SR will log warnings when configuration issues are detected, but it will never crash or corrupt the rendering pipeline.

---

## Full Example

Here is a complete `superresolution.json` with per-dimension profiles:

```json
{
  "schema_version": 1,
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