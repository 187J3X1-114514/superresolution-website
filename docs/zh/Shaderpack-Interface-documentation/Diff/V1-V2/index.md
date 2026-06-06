---
title: "V1 -> V2 变更日志"
---

# V1 -> V2 变更日志 <Badge type="tip" text="v1 -> v2" />

## 新增

* 宏：
  * `SR_CONFIG_SCHEMA_VERSION` - 当前接口配置文件的版本，例如 `2`、`114514`
  * `SR_UPSCALE_RATIO_HALF` - 等于 0.5 的上采样比例
  * `SR_RENDER_SCALE_FACTOR_HALF` - 等于 0.5 的渲染缩放因子
* 配置文件现在支持宏 - 支持的宏与 `shaders.properties` 中的等效（不包括 `shaders.properties` 中新定义的宏）。
* `upscale.customs.motion_vector_preprocessing_function` - 允许在运动矢量输入到算法前进行自定义 GLSL 预处理。必须包含一个签名为 `vec2 motionVectorPreprocessing(vec2)` 的函数。对于 FSR/DLSS/XeSS 算法，函数被注入到 `process_input_textures.comp` 中（此时运动矢量已被翻转 Y 轴）；对于其他算法，函数在独立的 compute pass 中执行。

## 更改

* 重要
  * 现在对于DLSS/XeSS/FSR2等算法，不需要手动翻转Y轴了，模组会自动处理这个问题。

## 删除

无