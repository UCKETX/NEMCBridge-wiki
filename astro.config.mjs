import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'NEMCBridge Wiki',
      description: 'NEMCBridge 中文运维与使用文档（以公开正式版 v1.5.5 为基准）',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      customCss: ['./src/styles/custom.css'],
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
            { label: '文档首页', slug: '' },
            { label: '快速开始', slug: 'quick-start' },
            { label: '安装、更新与备份', slug: 'install-update-backup' },
          ],
        },
        {
          label: '核心配置',
          items: [
            { label: '网易账号和开房', slug: 'accounts-and-rooms' },
            { label: '国际服与转服网关', slug: 'backends-and-gateway' },
            { label: '资源包与兼容性', slug: 'resource-packs-and-compatibility' },
          ],
        },
        {
          label: '排错与版本',
          items: [
            { label: '常见故障与日志', slug: 'troubleshooting-and-logs' },
            { label: '版本与下载', slug: 'releases-and-downloads' },
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
