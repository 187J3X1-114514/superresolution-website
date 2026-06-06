---
title: "关于"
---

# 关于

几乎所有时间超分辨率算法都需要运动矢量输入和抖动颜色缓冲区，但在 Minecraft 中 实现/获取 这些比较困难。因此，我们提供了一个接口，供光影包自行提供这些数据。

接口中保留了 `schema_version` 字段，用于标识接口配置文件的版本。

::: tip
从 **0.8.3-alpha.4** 版本开始，模组会按 Schema 版本号从高到低依次尝试读取配置文件。例如，当前最新版本为 4 时，会依次尝试 `superresolution.v4.json`、`superresolution.v3.json`、`superresolution.v2.json`、`superresolution.v1.json`，最后回退到 `superresolution.json`，使用最先找到的文件。这使得在迁移过程中不同 Schema 版本可以共存。
:::

::: tip
从 Schema version 2 开始，你可以在配置文件中使用宏。支持的宏与 `shaders.properties` 中定义的等效。模组会对任意版本的配置进行宏预处理，但为了兼容性，请不要在 v2 以下的版本使用宏。
:::

## 配置版本支持列表

| Schema 版本 | 最低 Mod 版本 |
| --- | --- |
| Version 1 | 0.8.3-alpha.1 |
| Version 2 | 0.8.3-alpha.4 |