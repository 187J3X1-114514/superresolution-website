---
title: "About"
---

# About

Almost all temporal super resolution algorithms require motion vector input and a jittered color buffer, but these are difficult to implement/acquire in Minecraft. Therefore, we provide an interface for shader packs to provide these themselves.

A `schema_version` field is reserved in the interface, used to identify the version of the interface configuration file.