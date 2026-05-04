# About

Almost all temporal upsampling algorithms require motion vector input and a jittered color buffer, but these are difficult to implement in Minecraft. Therefore, we provide an interface for Shaderpack to provide these.

We have reserved a `schema_version` field for the interface, which is used to specify the version of the interface configuration file.