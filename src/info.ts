interface Contributor {
    name: string;
    website: string;
}

interface MinecraftLoader {
    name: string;
    versions: string[];
}

interface MinecraftVersions {
    forge: MinecraftLoader;
    fabric: MinecraftLoader;
    neoforge: MinecraftLoader;
    support: string[];
}

interface SupportSystem {
    name: string;
    available: boolean;
}

interface Algorithm {
    simple_name: string;
    full_name_en: string;
    full_name_zh: string;
    github: string;
    license: string;
    available: boolean;
}

export interface Info {
    contributors: Contributor[];
    minecraft_versions: MinecraftVersions;
    algorithms: Algorithm[];
    support_systems: SupportSystem[];
    current_version: string;
}

export const info: Info = await fetch('/info.json').then(res => res.json());
info.minecraft_versions.support = [];
info.minecraft_versions.fabric.versions.forEach(version => info.minecraft_versions.support.push(version));
info.minecraft_versions.forge.versions.forEach(version => info.minecraft_versions.support.push(version));
info.minecraft_versions.neoforge.versions.forEach(version => info.minecraft_versions.support.push(version));
info.minecraft_versions.support = [...new Set(info.minecraft_versions.support)];