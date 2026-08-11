const API_BASE = 'https://api.187j3x1-114514.org/sr'

export interface GradientColor {
    startColor: string
    endColor: string
}

export interface SponsorSelfUpdate {
    name: string
    nameColor: GradientColor
    backgroundColor: GradientColor
}

export interface Sponsor {
    id: number
    name: string
    nameColor: GradientColor
    backgroundColor: GradientColor
    created_at: number
}

interface ApiResponse<T> {
    error: { messages: string; ok: boolean }
    data?: T
}

export class SponsorApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export async function updateSponsorSelf(token: string, update: SponsorSelfUpdate): Promise<Sponsor> {
    let res: Response
    try {
        res = await fetch(`${API_BASE}/sponsors/self`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
        })
    } catch {
        throw new SponsorApiError(0, 'network error')
    }

    const json: ApiResponse<{ sponsor: Sponsor }> = await res.json().catch(() => ({
        error: { messages: `http ${res.status}`, ok: false },
    }))

    if (!res.ok || !json.error.ok || !json.data) {
        throw new SponsorApiError(res.status, json.error.messages || `http ${res.status}`)
    }

    return json.data.sponsor
}
