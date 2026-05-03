---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Super Resolution Mod"
  text: "Wiki Documentation"
  tagline: Everything you need to know about the Super Resolution mod — for mod developers and shaderpack developers
  image:
    src: /super_resolution_logo_without_bg.svg
    alt: Super Resolution Mod
  actions:
    - theme: brand
      text: Get Started
      link: /Debugging-instructions
    - theme: alt
      text: API Reference
      link: /Mod-API-Documentation

features:
  - title: For Mod Developers
    details: Learn how to integrate Super Resolution into your mod, use the API, and debug common issues.
    link: /Mod-API-Documentation
  - title: For Shaderpack Developers
    details: Understand the shaderpack interface, motion vectors, jittered color buffers, and temporal upsampling integration.
    link: /Shaderpack-Interface-documentation
  - title: Debugging & Diagnostics
    details: Find help with configuration, native libraries, shader compilation errors, and dumped shader code.
    link: /Debugging-instructions
---
