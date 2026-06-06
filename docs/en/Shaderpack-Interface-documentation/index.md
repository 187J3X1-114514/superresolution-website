---
title: "About"
---

# About

Almost all temporal super resolution algorithms require motion vector input and a jittered color buffer, but these are difficult to implement/acquire in Minecraft. Therefore, we provide an interface for shader packs to provide these themselves.

A `schema_version` field is reserved in the interface, used to identify the version of the interface configuration file.

::: tip
 Since version **0.8.3-alpha.4**, the mod reads configuration files in descending schema version order. For example, if the latest schema version is 4, it will try `superresolution.v4.json`, `superresolution.v3.json`, `superresolution.v2.json`, `superresolution.v1.json`, and finally fall back to `superresolution.json`. The first file found is used. This allows multiple schema versions to coexist during migration.
:::

::: tip
Starting from schema version 2, you can use macros in the configuration file. The available macros are equivalent to those defined in `shaders.properties`. The mod performs macro preprocessing on any schema version, but for compatibility, do not use macros below v2.
:::

## Configuration Version Support

| Schema Version | Minimum Mod Version |
| --- | --- |
| Version 1 | 0.8.3-alpha.1 |
| Version 2 | 0.8.3-alpha.4 |