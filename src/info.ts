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
