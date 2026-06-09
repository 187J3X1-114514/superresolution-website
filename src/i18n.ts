export type Locale = 'zh-CN' | 'en-US'

export interface AlgorithmMessage {
    title: string
    desc: string
}

export interface LinkCardMessage {
    modrinthDesc: string
    githubDesc: string
    mcmodDesc: string
    discordDesc: string
    wikiDesc: string
}

export interface NightlyMessages {
    title: string
    mcVersionLabel: string
    loaderLabel: string
    allOption: string
    loading: string
    empty: string
    previous: string
    next: string
    pageInfo: (page: number) => string
    loadFailed: string
    downloadFailed: string
    downloadLabel: string
    closeLabel: string
}

export interface AppMessages {
    languageToggle: {
        label: string
        title: string
    }
    hero: {
        badge: string
        desc: string
        modrinth: string
        github: string
    }
    overview: {
        title: string
        paragraphs: string[]
    }
    algorithms: {
        title: string
        items: AlgorithmMessage[]
    }
    versions: {
        title: string
        latestLabel: string
        states: Record<'lts' | 'main' | 'wip' | 'deprecated', string>
    }
    issue: {
        title: string
        crashTitle: string
        crashText: string
        renderingTitle: string
        renderingText: string
        note: string
    }
    download: {
        title: string
        modrinthDesc: string
        nightlyDesc: string
    }
    links: LinkCardMessage
    nightly: NightlyMessages
}

const STORAGE_KEY = 'superresolution.locale'

export const translations: Record<Locale, AppMessages> = {
    'zh-CN': {
        languageToggle: {
            label: '中文',
            title: '切换语言',
        },
        hero: {
            badge: 'Minecraft Rendering Optimization Mod',
            desc: '在 Minecraft 中内置多种超分辨率算法，包括 FSR、DLSS、XeSS 等。通过降低实际渲染分辨率，再由算法将画面重建回原分辨率，以可接受的画质损失换取帧率提升；也可将超分比例设低于 1.0，相当于高质量抗锯齿，提升画面清晰度。',
            modrinth: 'Modrinth 主页',
            github: 'GitHub 存储库',
        },
        overview: {
            title: '概述',
            paragraphs: [
                '本项目为 Minecraft 内置了多种超分辨率算法：AMD FSR 1/2/3、Intel XeSS、NVIDIA DLSS、高通 SGSR 1/2。原理是降低游戏实际渲染分辨率（例如将 1920×1080 降至 1129×635 渲染，精度 58%），再用超分算法重建画面，GPU 渲染的像素少了，帧率自然更高。超分比例大于 1.0 时损失一定画质；设为 1.0 以下时相当于高质量抗锯齿，可以提升画质。',
                '使用 DLSS、FSR3 与 XeSS 需要在高级设置里关闭「跳过初始化 Vulkan」，并在实验性功能中启用「启用实验性功能」。时域算法（FSR2/3、DLSS、XeSS 等）只有在光影包针对本模组做了专门适配的情况下，才能发挥最佳效果；否则画面可能出现拖影、鬼影、锯齿状边缘等问题。',
            ],
        },
        algorithms: {
            title: '内置算法',
            items: [
                {
                    title: 'AMD FSR 1',
                    desc: 'AMD 第一代空间域超分辨率算法。纯粹基于当前帧图像处理，不依赖历史帧或运动矢量，兼容性最强，无需光影适配即可正常工作。质量不如时域算法，但胜在简单可靠，适合不用光影或对兼容性要求较高的场景。',
                },
                {
                    title: 'AMD FSR 2 (OpenGL)',
                    desc: 'AMD 第二代时域超分辨率算法，基于 OpenGL 原生实现。利用深度、运动矢量和抖动偏移（Jitter）从历史帧中重建细节，画质显著优于 FSR1，但需要光影传递这些数据才能正常工作，否则会出现明显拖影。',
                },
                {
                    title: 'AMD FSR (Vulkan)',
                    desc: 'AMD FSR 系列的 Vulkan 原生版本，通过 Vulkan-OpenGL 互操作层接入。包含 FSR2、FSR3 等。相比 OpenGL 实现精度更高，但需要在设置中关闭「跳过初始化 Vulkan」并启用实验性功能。',
                },
                {
                    title: 'Snapdragon SGSR V1',
                    desc: '高通 Snapdragon Game Super Resolution 第一代，空间域算法。极其轻量，GPU 开销极低，适合性能非常有限的硬件。算法品质与 FSR1 相近，无需运动矢量，兼容性好。',
                },
                {
                    title: 'Snapdragon SGSR V2',
                    desc: '高通 Snapdragon Game Super Resolution 第二代，引入了时域重投影。相比 SGSR1 画面更稳定，细节更丰富，同样以轻量著称。需要光影传递运动矢量和深度数据。',
                },
                {
                    title: 'NVIDIA DLSS',
                    desc: 'NVIDIA 深度学习超采样，需要 RTX 系列显卡（Turing 及以后架构，即 RTX 20xx 及以上）。利用神经网络进行超分重建，画质通常是列表中最好的。通过 Vulkan 互操作层接入，有一定额外同步开销，需要启用实验性功能。',
                },
                {
                    title: 'Intel XeSS',
                    desc: 'Intel Xe 超级采样算法。在 Intel Arc 显卡上利用 XMX 专用加速单元提速，在其他显卡上回退到 DP4a 指令集通用路径（质量略低）。通过 Vulkan 互操作接入，需要启用实验性功能。',
                },
            ],
        },
        versions: {
            title: '支持的游戏版本与加载器',
            latestLabel: 'Latest',
            states: {
                lts: 'LTS (长期支持)',
                main: 'MAIN (主要维护)',
                wip: 'WIP (开发中)',
                deprecated: 'DEPRECATED (已弃用)',
            },
        },
        issue: {
            title: '发现了问题？',
            crashTitle: '游戏崩溃',
            crashText: '在 GitHub Issues 提交问题，附上崩溃报告（crash report）、硬件信息，以及崩溃时在做什么。',
            renderingTitle: '渲染异常（拖影、花屏、鬼影等）',
            renderingText: '附上截图、安装的模组列表，以及使用的光影名称与版本。',
            note: '请不要在某些平台评论区报告 Bug，评论区里的问题无法有效追踪与跟进。',
        },
        download: {
            title: '下载',
            modrinthDesc: '下载最新版本模组',
            nightlyDesc: '浏览历史构建版本',
        },
        links: {
            modrinthDesc: '下载最新版本模组',
            githubDesc: '探索模组源码与提交 Issue 问题',
            mcmodDesc: '访问中文 Minecraft 模组百科条目',
            discordDesc: '加入我们的社区',
            wikiDesc: '查看模组的 Wiki',
        },
        nightly: {
            title: 'Nightly 构建',
            mcVersionLabel: 'MC 版本',
            loaderLabel: '加载器',
            allOption: '全部',
            loading: '加载中...',
            empty: '没有符合条件的版本',
            previous: '上一页',
            next: '下一页',
            pageInfo: (page) => `第 ${page} 页`,
            loadFailed: '加载失败',
            downloadFailed: '下载失败',
            downloadLabel: '下载构建',
            closeLabel: '关闭',
        },
    },
    'en-US': {
        languageToggle: {
            label: 'EN',
            title: 'Switch language',
        },
        hero: {
            badge: 'Minecraft Rendering Optimization Mod',
            desc: 'Adds multiple super resolution algorithms to Minecraft, including FSR, DLSS, and XeSS. The mod lowers the internal render resolution, then reconstructs the image back to the display resolution for higher frame rates with acceptable quality loss. Ratios below 1.0 can also act as high-quality anti-aliasing for a sharper image.',
            modrinth: 'Modrinth Page',
            github: 'GitHub Repository',
        },
        overview: {
            title: 'Overview',
            paragraphs: [
                'This project brings several super resolution algorithms into Minecraft: AMD FSR 1/2/3, Intel XeSS, NVIDIA DLSS, and Snapdragon SGSR 1/2. It works by reducing the actual render resolution, for example rendering 1920x1080 at 1129x635 with 58% scale, then reconstructing the image with an upscaler. Fewer rendered pixels means higher FPS. Ratios above 1.0 trade some image quality for performance, while ratios below 1.0 can improve quality as a high-grade anti-aliasing pass.',
                'DLSS, FSR3, and XeSS require disabling "Skip Vulkan initialization" in advanced settings and enabling experimental features. Temporal algorithms such as FSR2/3, DLSS, and XeSS work best when the shader pack is adapted for this mod; otherwise the image may show smearing, ghosting, or jagged edges.',
            ],
        },
        algorithms: {
            title: 'Built-in Algorithms',
            items: [
                {
                    title: 'AMD FSR 1',
                    desc: 'AMD\'s first-generation spatial super resolution algorithm. It processes only the current frame, does not depend on history frames or motion vectors, and offers the strongest compatibility. It works without shader-pack adaptation. Quality is below temporal approaches, but it is simple, reliable, and a good fit when compatibility matters most.',
                },
                {
                    title: 'AMD FSR 2 (OpenGL)',
                    desc: 'AMD\'s second-generation temporal super resolution algorithm, implemented natively in OpenGL. It uses depth, motion vectors, and jitter offsets to reconstruct detail from previous frames. Image quality is much better than FSR1, but shader packs must provide the required data or visible smearing can occur.',
                },
                {
                    title: 'AMD FSR (Vulkan)',
                    desc: 'Native Vulkan versions of the AMD FSR family, connected through the Vulkan-OpenGL interop layer. This includes FSR2, FSR3, and related variants. It can provide higher precision than the OpenGL implementation, but requires disabling "Skip Vulkan initialization" and enabling experimental features.',
                },
                {
                    title: 'Snapdragon SGSR V1',
                    desc: 'Qualcomm Snapdragon Game Super Resolution V1 is a spatial upscaler. It is extremely lightweight, has very low GPU cost, and suits limited hardware. Quality is close to FSR1, with no motion vectors required and strong compatibility.',
                },
                {
                    title: 'Snapdragon SGSR V2',
                    desc: 'Qualcomm Snapdragon Game Super Resolution V2 adds temporal reprojection. Compared with SGSR1, it produces a more stable image with richer detail while staying lightweight. It requires shader packs to provide motion vectors and depth data.',
                },
                {
                    title: 'NVIDIA DLSS',
                    desc: 'NVIDIA Deep Learning Super Sampling requires an RTX GPU, Turing architecture or newer, meaning RTX 20 series and above. It uses neural-network reconstruction and usually delivers the best image quality in this list. It is connected through Vulkan interop, adds some synchronization overhead, and requires experimental features.',
                },
                {
                    title: 'Intel XeSS',
                    desc: 'Intel Xe Super Sampling accelerates through XMX units on Intel Arc GPUs and falls back to a general DP4a path on other GPUs, with slightly lower quality. It is connected through Vulkan interop and requires experimental features.',
                },
            ],
        },
        versions: {
            title: 'Supported Game Versions and Loaders',
            latestLabel: 'Latest',
            states: {
                lts: 'LTS',
                main: 'MAIN',
                wip: 'WIP',
                deprecated: 'DEPRECATED',
            },
        },
        issue: {
            title: 'Found an issue?',
            crashTitle: 'Game crashes',
            crashText: 'Open a GitHub Issue with the crash report, hardware information, and what you were doing when the crash happened.',
            renderingTitle: 'Rendering issues such as smearing, artifacts, or ghosting',
            renderingText: 'Attach screenshots, your installed mod list, and the shader pack name and version.',
            note: 'Please do not report bugs in platform comment sections. Those reports cannot be tracked or followed up effectively.',
        },
        download: {
            title: 'Download',
            modrinthDesc: 'Download the latest mod release',
            nightlyDesc: 'Browse historical builds',
        },
        links: {
            modrinthDesc: 'Download the latest mod release',
            githubDesc: 'Explore the source code and submit issues',
            mcmodDesc: 'Open the Chinese Minecraft mod encyclopedia entry',
            discordDesc: 'Join our community',
            wikiDesc: 'Read the mod Wiki',
        },
        nightly: {
            title: 'Nightly Builds',
            mcVersionLabel: 'MC Version',
            loaderLabel: 'Loader',
            allOption: 'All',
            loading: 'Loading...',
            empty: 'No matching versions found',
            previous: 'Previous',
            next: 'Next',
            pageInfo: (page) => `Page ${page}`,
            loadFailed: 'Failed to load',
            downloadFailed: 'Download failed',
            downloadLabel: 'Download build',
            closeLabel: 'Close',
        },
    },
}

function isLocale(value: string | null): value is Locale {
    return value === 'zh-CN' || value === 'en-US'
}

function detectBrowserLocale(): Locale {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
    return languages.some((lang) => lang.toLowerCase().startsWith('zh')) ? 'zh-CN' : 'en-US'
}

export function getInitialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLocale(stored) ? stored : detectBrowserLocale()
}

export function persistLocale(locale: Locale) {
    localStorage.setItem(STORAGE_KEY, locale)
}

export function getNextLocale(locale: Locale): Locale {
    return locale === 'zh-CN' ? 'en-US' : 'zh-CN'
}

export function applyLocale(locale: Locale) {
    document.documentElement.lang = locale
}
