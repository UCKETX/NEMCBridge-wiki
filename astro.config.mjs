import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.SITE_BASE || '/',
  integrations: [
    starlight({
      title: 'NEMCBridge 文档',
      description: 'NEMCBridge 中文运维与使用文档（正式版 v1.6.1）',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      customCss: ['./src/styles/custom.css'],
      favicon: '/site/assets/favicon.svg',
      components: {
        SiteTitle: './src/components/StarlightSiteTitle.astro',
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      pagination: true,
      lastUpdated: false,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/UCKETX/NEMCBridge',
        },
      ],
      sidebar: [
        {
          label: '起步',
          items: [
            { label: '快速开始', slug: 'wiki/quick-start' },
            { label: '安装、更新与备份', slug: 'wiki/install-update-backup' },
          ],
        },
        {
          label: '核心配置',
          items: [
            { label: '网易账号和开房', slug: 'wiki/accounts-and-rooms' },
            { label: '国际服与转服网关', slug: 'wiki/backends-and-gateway' },
            { label: '通知推送与 QQ 群公告', slug: 'wiki/notifications' },
            { label: '资源包与兼容性', slug: 'wiki/resource-packs-and-compatibility' },
          ],
        },
        {
          label: '排错与版本',
          items: [
            { label: '常见故障与日志', slug: 'wiki/troubleshooting-and-logs' },
            { label: '版本与下载', slug: 'wiki/releases-and-downloads' },
          ],
        },
        {
          label: '公开外部链接',
          items: [
            {
              label: 'GitHub Releases',
              link: 'https://github.com/UCKETX/NEMCBridge/releases',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
            {
              label: '问题反馈（Issues）',
              link: 'https://github.com/UCKETX/NEMCBridge/issues',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
            {
              label: '旧版 GitHub Wiki',
              link: 'https://github.com/UCKETX/NEMCBridge/wiki',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
          ],
        },
      ],
    }),
  ],
});
