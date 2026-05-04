---
title: "光影包集成指南"
---

# 光影包集成指南 <Badge type="tip" text="v1" />

本指南主要介绍如何在你的光影包中集成 SR（Super Resolution，超分辨率）。
SR 作为一个**插件**——它不会接管或修改游戏的渲染方式，只是为Iris（或是其它光影加载器，尽管现在只支持Iris）的渲染管线添加了超分辨率功能。
你只需要了解 SR 读取哪些数据、把结果写到哪里。


## SR 的工作原理

SR **不会**改变游戏的渲染分辨率。游戏始终以屏幕分辨率进行渲染。

分辨率缩放完全由你的**光影包自己控制**（例如通过 buffer scale）。
SR 只是在你指定的 composite pass 处介入，读取你提供的输入，执行超分辨率，然后把结果写回你指定的缓冲区。

具体流程如下：

1. 你的光影正常渲染场景。分辨率缩放由光影自行管理。
2. 在你指定的 composite pass 处，SR 被触发。
3. SR 从你的缓冲区读取颜色、深度和运动矢量。
4. SR 执行超分辨率放大。
5. SR 把放大后的结果写回你指定的缓冲区。
6. 你的光影继续执行后续 pass。

如果配置文件缺失、格式错误，或者光影接口被禁用，SR 什么都不做——你的光影会像 SR 不存在一样正常运行。

> **注意：** SR 是一个插件。它为你现有的管线添加超分辨率能力。
> 它不控制渲染分辨率，也不替换你的任何 pass。


## 第一部分 — 快速上手

### 步骤 1：创建配置文件

在光影包根目录下（与 `shaders.properties` 同级）创建名为 `superresolution.json` 的文件。

### 步骤 2：编写最简配置

```json
"schema_version": 1,
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
                    "region": [0,0,-1,-1]
                },
                "depth": {
                    "enabled": true,
                    "src": "depthtex",
                    "region": [0,0,-1,-1]
                },
                "motion_vectors": {
                    "enabled": true,
                    "src": "colortex16",
                    "region": [0,0,-1,-1]
                }
            },
            "outputs": {
                "upscaled_color": {
                    "enabled": true,
                    "target": ["colortex0"],
                    "region": [0,0,-2,-2]
                }
            }
        }
    }
}
```

### 步骤 3：在光影中提供所需数据

在触发点**之前**的 composite pass 中，确保：

- **颜色**缓冲区已写入渲染好的场景（以你的缩放分辨率）。
- **深度**缓冲区可用。
- **运动矢量**缓冲区已写入运动矢量。


## 第二部分 — 配置参考

### 维度配置（Profiles）

你可以为不同维度配置不同的 SR 参数。`"profiles"` 中的每个键对应一个维度。

当加载某个维度时，SR 按以下顺序查找配置：

1. 先查找精确匹配的键（例如 `"0"` 对应主世界）。
2. 如果找不到，使用 `"*"` 作为默认配置。
3. 如果两者都不存在，该维度的超分辨率功能被禁用。

| 键       | 维度     |
| -------- | -------- |
| `"0"`  | 主世界   |
| `"-1"` | 下界     |
| `"1"`  | 末地     |
| `"*"`  | 默认回退 |

> 维度键由光影包自身的维度映射决定（即 Iris 中 `dimension.world0` 等配置使用的映射）。


### 触发点（Trigger）

```json
"trigger": {
    "type": "AFTER",
    "pass": "composite1"
}
```

- `"type"` — `"BEFORE"` 或 `"AFTER"`。决定 SR 在指定 pass **之前**还是**之后**运行。
- `"pass"` — composite pass 的名称（如 `"composite"`、`"composite1"`、`"composite2"` 等）。

**仅支持 composite pass。** 计算着色器（compute shader）的 composite pass 技术上可以使用，但目前**不稳定**，且未经充分测试。

选择触发点的原则：

- 触发点**之前**的 pass 应该已经完成颜色、深度和运动矢量的写入。
- 触发点**之后**的 pass 可以读取全屏分辨率的超分结果。


### 输入（Inputs）

SR 需要**三个**必须输入。三个都必须提供且启用。如果任何一个缺失或禁用，该帧将跳过超分。

```json
"inputs": {
    "color": {
        "enabled": true,
        "src": "colortex0",
        "region": [0,0,-1,-1]
    },
    "depth": {
        "enabled": true,
        "src": "depthtex",
        "region": [0,0,-1,-1]
    },
    "motion_vectors": {
        "enabled": true,
        "src": "colortex16",
        "region": [0,0,-1,-1]
    }
}
```

| 输入               | 说明                                 |
| ------------------ | ------------------------------------ |
| `color`            | 以缩放分辨率渲染的场景颜色。         |
| `depth`            | 深度缓冲区。                         |
| `exposure`         | 曝光值，1x1的纹理。                  |
| `motion_vectors`   | UV 空间的逐像素运动矢量（RG 通道）。 |

**`src`** 可以是以下纹理名称：

| 名称                            | 说明                                                           |
| ------------------------------- | -------------------------------------------------------------- |
| `colortex0` – `colortex31`      | 颜色纹理                                                       |
| `alttex0` – `alttex31`          | 颜色纹理的变体，它指向alt纹理，而非main纹理                    |
| `autotex0` – `autotex31`        | 颜色纹理的变体，它会自动处理纹理是从alt还是main读取/写入的问题 |
| `depthtex`                      | 主深度纹理                                                     |
| `noHandDepthtex`                | 不含手部的深度纹理                                             |
| `noTranslucentDepthtex`         | 不含半透明物体的深度纹理                                       |


### 区域（Region）

`"region"` 字段指定从纹理的哪个区域读取或写入：

```text
"region": [X, Y, W, H]
```

| 值       | 含义                                               |
| -------- | -------------------------------------------------- |
| `≥ 0`    | 显式像素坐标 / 尺寸                                |
| `-1`     | 完整的**渲染分辨率**（光影使用的缩放分辨率）      |
| `-2`     | 完整的**屏幕分辨率**（实际显示分辨率）            |

规则：

- `X` 和 `Y` 必须 ≥ 0。位置不允许使用负值。
- `W` 和 `H` 可以是正数、`-1` 或 `-2`。

如果省略 `"region"`，默认为 `[0, 0, -1, -1]`（完整渲染分辨率）。

**典型用法：**

- 输入区域使用 `-1`（渲染分辨率），因为光影以缩放分辨率渲染。
- 输出区域使用 `-2`（屏幕分辨率），因为超分结果是全分辨率的。


### 输出（Output）

`"outputs"` 中必须且只能包含一个键：`"upscaled_color"`。

```json
"outputs": {
    "upscaled_color": {
        "enabled": true,
        "target": ["colortex0"],
        "region": [0, 0, -2, -2]
    }
}
```

- `"target"` — 写入超分结果的缓冲区名称列表。如果指定多个目标，结果会按顺序写入每一个。所有目标必须具有相同的尺寸。
- 输出始终为**屏幕分辨率**。
- 输出始终已**去抖动**（抖动会被移除）。


### 内部纹理格式（Internal Format）

```json
"internal_format": "r11g11b10f"
```

指定 SR 内部处理使用的纹理格式。

支持的值：

| 值             | 格式       |
| -------------- | ---------- |
| `r11g11b10f`   | R11G11B10F |
| `rgba8`        | RGBA8      |
| `rgba16f`      | RGBA16F    |

如果省略或无法识别，默认为 `RGBA16F`，但强烈建议指定，因为不同SR版本的默认格式可能不同，同时，SR允许用户手动覆盖该配置（尽管光影显性指定了）。


### 预曝光（Pre-exposure）

```json
"pre_exposure": {
    "source": "const",
    "type": "float",
    "value": 1.0
}
```

- **可选字段**。
- **仅接受类型**：`float`。
- **默认值**：`1.0`。
- `source` 应该为 `"const"`、`"variable"` 或 `"uniform"`。
- 当 `source == "const"` 时，`value` 必须为数字；
- 当 `source == "variable"` 或 `source == "uniform"` 时，`value` 必须为非空字符串（变量/uniform 名称）。


### HDR输入/输出（HDR）

```json
"hdr": true
```

- **类型**：`boolean`
- **默认值**：`false`
- 是否按 HDR 流程处理输入颜色。启用后，SR 会在内部使用更高的动态范围进行计算。


### 自动曝光（Auto Exposure）

```json
"auto_exposure": true
```

- **类型**：`boolean`
- **默认值**：`false`
- 启用自动曝光计算。
- **注意**：若同时启用了 `inputs` 中的 `exposure` 纹理输入，解析器会忽略 `auto_exposure = true` 并记录警告（即 `exposure` 纹理优先）。


### 运动矢量抖动（Motion Vector Jittered）

```json
"motion_jittered": false
```

- **类型**：`boolean`
- **默认值**：`false`
- 指示运动矢量是否已包含抖动（jitter）信息。
- 当设为 `true` 时，表示运动矢量已经考虑了亚像素抖动偏移，SR 将不会额外处理抖动相关的运动矢量修正。
- 当设为 `false` 时（默认），SR 假设运动矢量对应的是未抖动的采样位置。


### 抖动（Jitter）

启用后，SR 会在每帧生成亚像素抖动偏移。你的光影可以通过提供的 uniform（见下文）读取抖动值，并将其应用到投影矩阵中。

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

对应的 `shaders.properties`配置：

```properties
variable.vec2.taa_jitter_offset=vec2(0.1,0.2)
# uniform.vec2.taa_jitter_offset=vec2(0.1,0.2)
```

下面为上面 JSON 示例中字段的说明：

| 字段                                            | 类型 / 示例                                  | 说明                                                                                                                                                              |
| ----------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`                                        | `"mod"` / `"shaderpack"`                 | 可选，默认 `"mod"`（由 SR 生成抖动）。若为 `"shaderpack"`，由 shaderpack 提供抖动；仅在此模式下 `source_config` 生效。该模式为实验性功能。                  |
| `source_config.jitter_offset.source`            | `const` / `variable` / `uniform`             | 指定 `jitter_offset` 的来源类型。                                                                                                                               |
| `source_config.jitter_offset.type`              | `vector2f`                                   | 必须为 `vector2f`，表示抖动值的 X 和 Y 分量。                                                                                                                   |
| `source_config.jitter_offset.value`             | 例如 `taa_jitter_offset` 或 `[0.0, 0.0]`     | 若 `source`为 `uniform`/`variable` 则为 uniform / variable 名称；`const` 则为常量数组；`variable` 则为 shaderpack 中的变量名（shaderpack 需负责更新）。     |
| `source_config.jitter_sequence_length.source`   | `const` / `variable` / `uniform`             | 指定序列长度的来源类型。                                                                                                                                          |
| `source_config.jitter_sequence_length.type`     | `int`                                        | 必须为 `int`，表示抖动序列长度。                                                                                                                                |
| `source_config.jitter_sequence_length.value`    | 例如 `8`                                     | 若 `source`为 `const`则为整数；若为 `uniform`/`variable` 则为名称。                                                                                             |

* 抖动值.X,抖动值.Y∈[-0.5,0.5]
* 如果当前激活的超分算法不支持抖动，那么抖动不会被应用，不会产生错误，光影正常运行。
* 由于一些原因，在使用某些算法时你需要手动翻转抖动的Y轴，这些算法有 `DLSS` `XeSS` `FSR`，你可以使用 `SR_USING_ALGO`
  宏来检测当前使用的算法。


## 第三部分 — 运动矢量

你的光影**必须**提供运动矢量。SR 不会为你生成它们。

运动矢量的要求：

- 存储在源纹理的 **RG 通道**中。
- 使用 **UV 空间**（归一化 -1–1 坐标）。
- 计算方式：

```text
motion_vector = previous_uv - current_uv
// motion_vector.x，motion_vector.y ∈ [-1.0,1.0]
```

假设某像素的运动矢量值为(-1.0,-0.5)，这相当于：

* 该像素前一帧相对于当前帧向左偏移了 整个屏幕宽度
* 该像素前一帧相对于当前帧向上偏移了 半个屏幕高度

其中 UV 坐标基于**渲染分辨率**（你的缩放分辨率）。

注意：

- **不要**翻转 Y 轴。
- **不要**转换为 NDC。
- SR 会在内部自动处理当前算法所需的坐标空间转换。


## 第四部分 — 着色器宏和 Uniform

当 SR 已安装且光影包包含有效的 `superresolution.json` 时，SR 会向你的着色器注入以下宏和 uniform。你可以利用它们在 SR
激活时调整渲染行为。

### 宏（Macros）

| 宏                                     | 说明                                                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SR_INSTALLED`                         | SR 已安装时始终为 `1`。                                                                                                                                             |
| `SR_ENABLE`                            | 超分启用时为 `1`，否则为 `0`。                                                                                                                                      |
| `SR_DISABLE`                           | `SR_ENABLE` 的反义。                                                                                                                                                |
| `SR_USING_ALGO`                        | 当前激活算法的整数 ID。超分禁用时为 `0`。                                                                                                                           |
| `SR_ALGO_<NAME>`                       | 每个已注册算法的整数 ID（如 `SR_ALGO_FSR2`）。可与 `SR_USING_ALGO` 比较使用。                                                                                     |
| `SR_ALGO_SUPPORTS_JITTER`              | 当前算法支持抖动时为 `1`，否则为 `0`。                                                                                                                              |
| `SR_SHOULD_APPLY_SCALE`                | 超分启用时为 `1`，否则为 `0`。                                                                                                                                      |
| `SR_SHOULD_APPLY_JITTER`               | 超分启用时为 `1`，否则为 `0`。                                                                                                                                      |
| `SR_SCALED_WIDTH`                      | 渲染宽度（缩放分辨率宽度）。超分禁用时等于屏幕宽度。                                                                                                                |
| `SR_SCALED_HEIGHT`                     | 渲染高度（缩放分辨率高度）。超分禁用时等于屏幕高度。                                                                                                                |
| `SR_SCREEN_WIDTH`                      | 屏幕宽度（显示分辨率宽度）。                                                                                                                                         |
| `SR_SCREEN_HEIGHT`                     | 屏幕高度（显示分辨率高度）。                                                                                                                                         |
| `SR_JITTER_SEQUENCE_LENGTH`            | 当前抖动序列的长度（如果启用抖动）。如果不支持抖动或未启用，则为 `0`。                                                                                              |
| `SR_RENDER_SCALE_FACTOR`               | 当前渲染缩放因子（如 50% 缩放时为 `0.5`）。超分禁用时为 `1.0`。                                                                                                     |
| `SR_UPSCALE_RATIO`                     | 当前放大比率（屏幕 / 渲染）。超分禁用时为 `1.0`。                                                                                                                   |
| `SR_DLSS_RENDERPRESET`                 | 当前 DLSS 渲染预设的整数 ID（如 `SR_ALGO_DLSS_RENDERPRESET_J`）。如果当前算法不是 DLSS 或未启用，则为 `0`。                                                       |
| `SR_ALGO_DLSS_RENDERPRESET_<PRESET>`   | 每个已注册 DLSS 渲染预设的整数 ID（如 `SR_ALGO_DLSS_RENDERPRESET_F`）。可与 `SR_ALGO_DLSS_RENDERPRESET` 比较使用。目前有 `K`, `J`, `F` , `L` , `M`。            |

### Uniform

| Uniform                     | Type      | 说明                                                                                       |
| --------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `SRRenderScale`             | `float`   | 渲染缩放因子（如 50% 缩放时为 `0.5`）。超分禁用时为 `1.0`。                              |
| `SRRatio`                   | `float`   | 放大比率（屏幕 / 渲染）。超分禁用时为 `1.0`。                                             |
| `SRRenderScaleLog2`         | `float`   | `log2(渲染宽度 / 屏幕宽度)`。超分禁用时为 `0.0`，通常用作某些纹理的mipmapbias。           |
| `SRScaledViewportSize`      | `vec2`    | 渲染分辨率，`vec2(宽, 高)`。                                                              |
| `SROriginalViewportSize`    | `vec2`    | 屏幕分辨率，`vec2(宽, 高)`。                                                              |
| `SRScaledViewportSizeI`     | `ivec2`   | 渲染分辨率，`ivec2(宽, 高)`。                                                             |
| `SROriginalViewportSizeI`   | `ivec2`   | 屏幕分辨率，`ivec2(宽, 高)`。                                                             |
| `SRJitterOffset`            | `vec2`    | 当前帧的抖动偏移（像素空间）。不支持，未启用抖动或光影指定不从SR获取抖动时为 `vec2(0)`。   |
| `SRPreviousJitterOffset`    | `vec2`    | 上一帧的抖动偏移（像素空间）。不支持，未启用抖动或光影指定不从SR获取抖动时为 `vec2(0)`。   |
| `SRFrameCount`              | `int`     | 当前帧的计数。                                                                             |

注意：

* 请避免使用在shaders.properties中使用 `SR_SCALED_WIDTH` `SR_SCALED_HEIGHT` `SR_SCREEN_WIDTH` `SR_SCREEN_HEIGHT`
  宏，它们在游戏窗口大小被调整时不会更新，你应该使用 `SR_UPSCALE_RATIO` 或 `SR_RENDER_SCALE_FACTOR`，它们在被更改时会重载光影包。

超分禁用时：

- 缩放值为 `1.0`。
- 抖动偏移为 `vec2(0)`。
- `SR_USING_ALGO` 为 `0`。
- `SR_SCALED_WIDTH` / `SR_SCALED_HEIGHT` 等于屏幕尺寸。


## 第五部分 — 错误处理

| 情况                            | 行为                          |
| ------------------------------- | ----------------------------- |
| `superresolution.json` 不存在   | SR 什么都不做。光影正常运行。 |
| JSON 格式错误                   | SR 完全禁用。                 |
| 缺少 `schema_version`           | SR 完全禁用。                 |
| `schema_version` 不受支持       | SR 完全禁用。                 |
| 当前维度没有匹配的配置          | 该维度的超分功能被禁用。      |
| 某个必需输入缺失或禁用          | 该帧跳过超分。                |
| 算法不支持抖动                  | 抖动不生效，不报错。          |

SR 在检测到配置问题时会输出警告日志，但不会崩溃或破坏渲染管线。


## 完整示例

以下是一个包含多维度配置的完整 `superresolution.json`：

```json
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
                    "region": [0,0,-1,-1]
                },
                "depth": {
                    "enabled": true,
                    "src": "depthtex",
                    "region": [0,0,-1,-1]
                },
                "motion_vectors": {
                    "enabled": true,
                    "src": "colortex16",
                    "region": [0,0,-1,-1]
                }
            },
            "outputs": {
                "upscaled_color": {
                    "enabled": true,
                    "target": ["colortex0"],
                    "region": [0,0,-2,-2]
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
                    "region": [0,0,-1,-1]
                },
                "depth": {
                    "enabled": true,
                    "src": "depthtex",
                    "region": [0,0,-1,-1]
                },
                "motion_vectors": {
                    "enabled": true,
                    "src": "colortex16",
                    "region": [0,0,-1,-1]
                }
            },
            "outputs": {
                "upscaled_color": {
                    "enabled": true,
                    "target": ["colortex0"],
                    "region": [0,0,-2,-2]
                }
            }
        }
    }
}
```

在这个示例中：

- 默认配置（`"*"`）在 `composite2` 之后触发。
- 下界（`"-1"`）使用不同的触发 pass 和内部纹理格式。
- 主世界和末地没有单独的配置项，因此使用默认配置。