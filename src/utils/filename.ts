import type { VersionEntry } from './api'

function formatMcVersions(mcVersions: string[]): string {
    if (mcVersions.length === 0) return 'unknown'
    if (mcVersions.length === 1) return mcVersions[0]
    const newest = mcVersions[0]
    const oldest = mcVersions[mcVersions.length - 1]
    return `${oldest}..${newest}`
}

function formatLabels(labels: string[], isDev: boolean): string {
    const parts = isDev ? ['dev', ...labels] : [...labels]
    return parts.join('.')
}

export function buildFilename(version: VersionEntry): string {
    const mc = formatMcVersions(version.mc_versions)
    const labels = formatLabels(version.label, version.is_dev)
    const suffix = labels ? `+${labels}` : ''
    return `super_resolution-${version.loader}-${mc}-${version.version}${suffix}.jar`
}
