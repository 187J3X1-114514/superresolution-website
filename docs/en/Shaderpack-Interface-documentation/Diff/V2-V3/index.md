---
title: "V2 → V3 Changelog"
---

# V2 → V3 Changelog <Badge type="tip" text="v2 -> v3" />

## Added

* Configuration fields:
  * `upscale.supports_frame_generation_only` (`boolean`, default `false`) - Declares that the shader pack is compatible with **Frame Generation Only mode**. Once declared, the user can select **None** as the upscaling algorithm in the mod settings to activate the mode: no upscaling is performed — SR only reads the `color`, `depth`, `motion_vectors`, and `exposure` inputs to feed frame generation, and never writes the `upscaled_color` output; the render scale is forced to `1.0` (the shader renders at native resolution). If None is selected but the pack does not declare this field, the algorithm falls back to the default at runtime (the user's configuration is left untouched).
  * `upscale.disabled_algorithms` (array of strings, default `[]`) - Declares the algorithm IDs the shader pack is incompatible with (`none`, `fsr1`, `fsr2`, `fsr`, `xess`, `dlss`, `sgsr1`, `sgsr2`, `anime4k`). If the user's currently selected algorithm is disabled, SR falls back to the default algorithm at runtime (the user's configuration is not modified and is restored once the pack is unloaded). Blank entries or unknown IDs only log a warning. Applies per dimension.
* Behavior:
  * Macro reporting in Frame Generation Only mode: `SR_SHOULD_APPLY_SCALE=0`, `SR_SHOULD_APPLY_JITTER=0`, `SR_ALGO_SUPPORTS_JITTER=0`, `SR_USING_ALGO=SR_ALGO_NONE`, `SR_RENDER_SCALE_FACTOR=1.0`, `SR_UPSCALE_RATIO=1.0`, `SR_SCALED_WIDTH`/`SR_SCALED_HEIGHT` equal the screen resolution, `SR_JITTER_SEQUENCE_LENGTH=0`. Shaders can detect the mode via `SR_SHOULD_APPLY_SCALE` or `SR_USING_ALGO == SR_ALGO_NONE`.

## Changed

* Macros:
  * `SR_CONFIG_SCHEMA_VERSION` - Now `3` when a V3 config is in use (previously hardcoded to `2`); it always reports the schema version of the configuration actually in effect.
* It is recommended to name the configuration file `superresolution.v3.json` (the mod looks for `superresolution.v3.json` → `superresolution.v2.json` → `superresolution.v1.json` → `superresolution.json` in descending version order).

## Removed

None
