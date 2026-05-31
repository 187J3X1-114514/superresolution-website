---
title: "调试指南"
---

# 调试指南

## 文件位置

| 路径 | 说明 |
|------|------|
| `<游戏目录>/config/super_resolution/config.toml` | 主配置文件 |
| `<游戏目录>/config/super_resolution/libraries` | 原生库文件 |
| `<游戏目录>/config/super_resolution/debug` | 转存的着色器代码（启用时） |
| `<游戏目录>/config/super_resolution/error_logs` | 着色器编译错误报告 |
| `<游戏目录>/config/super_resolution/shader_caches` | 着色器缓存文件 |


## 调试模式

### 如何启用

在游戏内配置界面中启用，或在 `config.toml` 中设置 `enable_debug = true`。

### 作用

- SR 创建的 GPU 资源（纹理、帧缓冲区、着色器等）将被标记，使其在 **NVIDIA Nsight Graphics** 和 **RenderDoc** 等图形调试工具中可见且可识别。
- SR 执行的 GPU 操作将被包裹在**调试组**中，因此你可以在帧捕获中清楚地看到每个操作的开始和结束位置。


## 着色器代码转存

### 如何启用

在游戏内配置界面中启用，或在 `config.toml` 中设置 `debug_dump_shader = true`。

### 作用

启用后，SR 将所有内部着色器代码写入 `debug` 文件夹。

每个文件按以下格式命名：

```text
<着色器名称>.<着色器类型>.<图形API>.<代码类型>.glsl
```

`<代码类型>` 字段取值如下：

| 值 | 说明 |
|----|------|
| `source` | 传递给编译器的原始着色器源代码，未经过任何宏插入。 |
| `preprocessed` | 经过 Glslang 预处理后的着色器代码 — 宏已展开、include 已解析，可直接编译。 |