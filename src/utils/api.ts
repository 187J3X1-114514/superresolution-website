const API_BASE = 'https://api.187j3x1-114514.org'

//read only
const TOKEN = 'ce2c2e26855dea4d673719f42e5d8be3d59c040b20501b5a003f6f6277302af2'

export interface VersionEntry {
    id: number
    commit_hash: string
    is_nightly: boolean
    mod_name: string
    loader: string
    version: string
    mc_versions: string[]
    label: string[]
    is_dev: boolean
    r2_object_name: string
    created_at: number
}

interface ApiResponse<T> {
    error: { messages: string; ok: boolean }
    data?: T
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (res.status === 429) {
        throw new Error('请求过于频繁，请稍后再试')
    }

    const json: ApiResponse<T> = await res.json()

    if (!json.error.ok) {
        throw new Error(json.error.messages)
    }

    return json.data as T
}

export async function fetchVersions(params: { limit?: number; offset?: number }): Promise<VersionEntry[]> {
    const { limit = 50, offset = 0 } = params
    const data = await request<{ versions: VersionEntry[] }>(
        `/versions/get_versions?limit=${limit}&offset=${offset}`
    )
    return data.versions
}

export async function getDownloadUrl(r2ObjectName: string, expiresIn: number): Promise<string> {
    const data = await request<{ url: string }>('/versions/get_download_url', {
        method: 'POST',
        body: JSON.stringify({ r2_object_name: r2ObjectName, expires_in: expiresIn }),
    })
    return data.url
}
