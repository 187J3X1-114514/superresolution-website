---
title: "Debugging Guide"
---

# Debugging Guide

## File Locations

| Path | Description |
|------|-------------|
| `<game directory>/config/super_resolution/config.toml` | Main configuration file |
| `<game directory>/config/super_resolution/libraries` | Native library files |
| `<game directory>/config/super_resolution/debug` | Dumped shader code (when enabled) |
| `<game directory>/config/super_resolution/error_logs` | Shader compilation error reports |
| `<game directory>/config/super_resolution/shader_caches` | Shader cache files |


## Debug Mode

### How to Enable

Enable it in the in-game configuration screen, or set `enable_debug = true` in `config.toml`.

### What It Does

- GPU resources created by SR (textures, framebuffers, shaders, etc.) will be labeled, making them visible and identifiable in graphics debugging tools such as **NVIDIA Nsight Graphics** and **RenderDoc**.
- GPU operations performed by SR will be wrapped in **debug groups**, so you can see clearly where each operation begins and ends in a frame capture.


## Shader Code Dump

### How to Enable

Enable it in the in-game configuration screen, or set `debug_dump_shader = true` in `config.toml`.

### What It Does

When enabled, SR writes all internal shader code to the `debug` folder.

Each file is named using the following format:

```text
<shader name>.<shader type>.<graphics API>.<code type>.glsl
```

The `<code type>` field will be one of:

| Value | Description |
|-------|-------------|
| `source` | The raw shader source as passed to the compiler, before any macro insertion. |
| `preprocessed` | The shader code after Glslang preprocessing — macros expanded, includes resolved, ready to compile directly. |