export type { Locale } from '../i18n'
export { applyLocale, getInitialLocale, getNextLocale, persistLocale } from '../i18n'

export interface SponsorMessages {
    languageToggle: {
        label: string
        title: string
    }
    title: string
    badge: string
    heading: string
    headingAccent: string
    desc: string
    preview: {
        title: string
        sectionPill: string
        namePlaceholder: string
    }
    form: {
        title: string
        tokenLabel: string
        tokenPlaceholder: string
        tokenHint: string
        tokenMissing: string
        nameLabel: string
        namePlaceholder: string
        nameColorLabel: string
        backgroundColorLabel: string
        gradientLabel: string
        startLabel: string
        endLabel: string
        save: string
        saving: string
        saveSuccess: string
        saveFailed: string
        tokenInvalid: string
        nameRequired: string
        colorInvalid: string
        networkError: string
    }
    footer: string
}

export const sponsorTranslations: Record<string, SponsorMessages> = {
    'zh-CN': {
        languageToggle: {
            label: '中文',
            title: '切换语言',
        },
        title: '赞助者设置 | Super Resolution',
        badge: 'Afdian Sponsor',
        heading: '赞助者',
        headingAccent: '设置',
        desc: '自定义你在模组内「赞助者」列表中的展示样式。修改名称、名称颜色与背景颜色，下方实时预览与游戏内实际效果一致。保存后立即生效（游戏内下次打开配置界面时更新）。',
        preview: {
            title: '实时预览',
            sectionPill: '赞助者',
            namePlaceholder: '你的名字',
        },
        form: {
            title: '展示设置',
            tokenLabel: '访问 Token',
            tokenPlaceholder: '粘贴爱发电私信中的 64 位 Token',
            tokenHint: 'Token 包含在爱发电私信中，有效期 24 小时。',
            tokenMissing: '尚未填写 Token：可以预览样式，但无法保存。',
            nameLabel: '名称',
            namePlaceholder: '输入展示名称',
            nameColorLabel: '名称颜色',
            backgroundColorLabel: '背景颜色',
            gradientLabel: '渐变',
            startLabel: '起始色',
            endLabel: '结束色',
            save: '保存修改',
            saving: '保存中…',
            saveSuccess: '已保存，游戏内将在下次打开配置界面时更新。',
            saveFailed: '保存失败',
            tokenInvalid: 'Token 无效或已过期，请核对后重试。',
            nameRequired: '名称不能为空。',
            colorInvalid: '颜色格式无效，请输入 #RRGGBB 格式的颜色值。',
            networkError: '网络错误，请检查连接后重试。',
        },
        footer: 'Hosted on',
    },
    'en-US': {
        languageToggle: {
            label: 'EN',
            title: 'Switch language',
        },
        title: 'Sponsor Settings | Super Resolution',
        badge: 'Afdian Sponsor',
        heading: 'Sponsor',
        headingAccent: 'Settings',
        desc: 'Customize how you appear in the mod\'s in-game sponsor list. Edit your name, name color and background color — the live preview below matches the actual in-game rendering. Changes take effect immediately after saving.',
        preview: {
            title: 'Live Preview',
            sectionPill: 'Sponsors',
            namePlaceholder: 'Your name',
        },
        form: {
            title: 'Display Settings',
            tokenLabel: 'Access Token',
            tokenPlaceholder: 'Paste the 64-char token from the Afdian message',
            tokenHint: 'The token is included in the Afdian private message and stays valid for 24 hours.',
            tokenMissing: 'No token yet: you can preview styles, but saving is disabled.',
            nameLabel: 'Name',
            namePlaceholder: 'Enter display name',
            nameColorLabel: 'Name Color',
            backgroundColorLabel: 'Background Color',
            gradientLabel: 'Gradient',
            startLabel: 'Start',
            endLabel: 'End',
            save: 'Save Changes',
            saving: 'Saving…',
            saveSuccess: 'Saved. The change applies the next time the config screen is opened in game.',
            saveFailed: 'Save failed',
            tokenInvalid: 'Token is invalid or expired. Please check and try again.',
            nameRequired: 'Name cannot be empty.',
            colorInvalid: 'Invalid color format. Please use #RRGGBB values.',
            networkError: 'Network error. Please check your connection and try again.',
        },
        footer: 'Hosted on',
    },
}
