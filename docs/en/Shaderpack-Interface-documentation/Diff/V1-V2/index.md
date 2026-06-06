---
title: "V1 → V2 Changelog"
---
# V1 → V2 Changelog `<Badge type="tip" text="v1 → v2" />`

## Added

* Macros:
  * `SR_CONFIG_SCHEMA_VERSION` - The version of the current interface configuration file, e.g. `2`, `114514`
  * `SR_UPSCALE_RATIO_HALF` - Equal to 0.5 of the upscale ratio
  * `SR_RENDER_SCALE_FACTOR_HALF` - Equal to 0.5 of the render scale factor
* Configuration file now supports macros - the available macros are equivalent to those in `shaders.properties` (excluding newly defined ones in `shaders.properties`).
* `upscale.customs.motion_vector_preprocessing_function` - Allows custom GLSL preprocessing of motion vectors before they are fed into the algorithm. Must contain a function with the signature `vec2 motionVectorPreprocessing(vec2)`. For FSR/DLSS/XeSS, the function is injected into `process_input_textures.comp` (where the motion vector Y axis has already been flipped); for other algorithms, the function runs in a standalone compute pass.

## Changed

* Important
  * For DLSS/XeSS/FSR2 and similar algorithms, manually flipping the Y axis is no longer necessary — the mod handles this automatically.

## Removed

None
