---
title: "V2 → V3 变更日志"
---

# V2 → V3 变更日志 <Badge type="tip" text="v2 -> v3" />

## 新增

* 配置字段：
  * `upscale.supports_frame_generation_only`（`boolean`，默认 `false`）- 声明光影包兼容**仅帧生成模式**。声明后，用户可以在模组设置中将超分算法选择为 **None** 以启用该模式：不执行超分，SR 仅读取 `color`、`depth`、`motion_vectors`、`exposure` 输入供帧生成使用，且不写入 `upscaled_color` 输出；渲染缩放强制为 `1.0`（光影以原生分辨率渲染）。若用户选择 None 但光影未声明该字段，运行时回退到默认算法（不修改用户配置）。
  * `upscale.disabled_algorithms`（字符串数组，默认 `[]`）- 声明光影包不兼容的算法 ID 列表（`none`、`fsr1`、`fsr2`、`fsr`、`xess`、`dlss`、`sgsr1`、`sgsr2`、`anime4k`）。若用户当前选择的算法被禁用，运行时回退到默认算法（不修改用户配置，卸载光影后恢复原选择）。空值与未知 ID 仅记录警告。按维度生效。
* 行为：
  * 仅帧生成模式下的宏报告：`SR_SHOULD_APPLY_SCALE=0`、`SR_SHOULD_APPLY_JITTER=0`、`SR_ALGO_SUPPORTS_JITTER=0`、`SR_USING_ALGO=SR_ALGO_NONE`、`SR_RENDER_SCALE_FACTOR=1.0`、`SR_UPSCALE_RATIO=1.0`、`SR_SCALED_WIDTH`/`SR_SCALED_HEIGHT` 等于屏幕分辨率、`SR_JITTER_SEQUENCE_LENGTH=0`。光影可通过 `SR_SHOULD_APPLY_SCALE` 或 `SR_USING_ALGO == SR_ALGO_NONE` 检测该模式。

## 更改

* 宏：
  * `SR_CONFIG_SCHEMA_VERSION` - 使用 V3 配置时值为 `3`（此前硬编码为 `2`），现在始终报告模组支持的实际生效配置的 Schema 版本。
* 建议将配置文件命名为 `superresolution.v3.json`（模组按版本号从高到低依次查找 `superresolution.v3.json` → `superresolution.v2.json` → `superresolution.v1.json` → `superresolution.json`）。

## 删除

无
