# Alex Ye Lab

[Alex Ye Lab](https://alexyelab.com) 是一个使用 Astro 构建的个人技术网站，用于发布技术文章、记录项目实践并介绍当前关注的学习方向。

项目采用内容优先的静态站点架构。Blog 与 Projects 都由 Astro Content Collections 管理，页面在构建阶段生成，不依赖数据库、CMS 后台或常驻 Astro 服务。当前设计重点是阅读体验、响应式布局、SEO、可访问性和低维护成本。

## 当前功能

### 首页与全站体验

- 首页 Hero、最新文章和精选项目入口
- 首页固定暗色视觉，内页支持亮色/暗色主题并记住用户选择
- 桌面导航、移动菜单和当前页面状态
- Astro ClientRouter 提供轻量页面切换效果
- 自定义 404 页面
- 响应式布局与 `prefers-reduced-motion` 支持
- 移动搜索平滑展开、菜单与小控件的非线性缓动，以及内页主要颜色的主题过渡
- Google Sans Flex、Noto Sans SC 中文子集和 JetBrains Mono 字体组合

### Blog

- Markdown 文章与 Content Collection schema 校验
- 草稿过滤和按发布日期倒序排列
- 基于标题、摘要、分类和标签的本地实时搜索
- 多关键词 AND 匹配，搜索词同步到 `?q=` 并可从 URL 恢复
- 静态文章详情路由 `/blog/[slug]`
- 分类、发布日期、字数和预计阅读时间
- 标签目录 `/tags` 与标签文章页 `/tags/[tag]`
- Shiki 语法高亮、代码语言栏和复制按钮
- 桌面端 h2/h3 文章目录、当前章节跟随和上一篇/下一篇导航
- 详情页返回顶部按钮

### Projects

- Markdown 项目内容与独立的 Content Collection schema
- 草稿过滤、手动排序、精选项目和计划/进行中/已完成状态
- 基于标题、描述、标签和状态的本地实时搜索
- 静态项目详情路由 `/projects/[slug]`
- 可选的网站与源码链接
- Markdown 正文、代码块增强、桌面端目录和返回顶部按钮

### SEO 与发布内容

- 页面级 title、description 和 canonical URL
- Open Graph 与 Twitter Card metadata
- WebSite、WebPage、AboutPage、CollectionPage、BlogPosting 和 CreativeWork JSON-LD
- 自动生成 Sitemap
- `robots.txt`
- Blog RSS：[`/rss.xml`](https://alexyelab.com/rss.xml)
- 404 页面使用 `noindex, nofollow`

## 技术栈

- [Astro 7](https://astro.build/)：页面、静态路由、Content Collections 与客户端页面过渡
- [Tailwind CSS 4](https://tailwindcss.com/)：布局、响应式设计与全局样式系统
- [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography)：Markdown 正文排版
- [Shiki](https://shiki.style/)：Markdown 代码高亮
- TypeScript 6：严格类型检查与内容 schema
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) 与 [`@astrojs/rss`](https://docs.astro.build/en/recipes/rss/)
- [`subset-font`](https://github.com/Munter/subset-font)：构建时生成站点所需的中文字体子集

项目没有引入 React、Vue 或 Svelte。搜索、主题、移动菜单、目录跟随和代码复制等交互使用少量原生 JavaScript 实现。

`astro.config.mjs` 当前未显式设置 `output`，实际构建使用 Astro 当前默认的静态输出行为，产物生成到 `dist/`。

## 项目结构

```text
.
├─ public/
│  ├─ fonts/                     # 站点字体与字体许可
│  ├─ images/                    # 首页视觉资源
│  ├─ favicon.ico
│  ├─ favicon.svg
│  └─ og-default.png             # 默认社交分享图
├─ scripts/
│  └─ build-fonts.mjs            # 扫描源码并生成中文字体子集
├─ src/
│  ├─ assets/
│  │  └─ font-source/            # 中文字体源文件
│  ├─ components/                # 导航、卡片、搜索、TOC 等组件
│  ├─ content/
│  │  ├─ blog/                   # Blog Markdown 内容
│  │  └─ projects/               # Projects Markdown 内容
│  ├─ layouts/
│  │  └─ Layout.astro            # 全站结构、SEO、主题与页面过渡
│  ├─ pages/
│  │  ├─ blog/                   # Blog 列表与详情路由
│  │  ├─ projects/               # Projects 详情路由
│  │  ├─ tags/                   # 标签目录与标签文章路由
│  │  ├─ 404.astro
│  │  ├─ about.astro
│  │  ├─ index.astro
│  │  ├─ projects.astro
│  │  ├─ robots.txt.ts
│  │  └─ rss.xml.ts
│  ├─ styles/
│  │  └─ global.css              # 字体、主题 token 与全局组件样式
│  ├─ utils/                     # 阅读统计与标签 slug 工具
│  └─ content.config.ts          # Blog 与 Projects collection schema
├─ astro.config.mjs
├─ package.json
├─ PROJECT_CONTEXT_PUBLIC.md    # 公开架构、决策与维护上下文
└─ tsconfig.json
```

## 内容管理

Blog 和 Projects 从各自目录读取 `.md` 文件，使用内容 ID 生成详情页 URL。当前示例直接以文件名对应 URL，例如 `src/content/blog/kv-cache.md` 对应 `/blog/kv-cache`。建议直接在对应目录下使用小写英文、数字和短横线命名；已发布文件改名会改变链接。

新增或修改内容时，Astro 会根据 [`src/content.config.ts`](src/content.config.ts) 校验 frontmatter。下面示例中的字段除标注“可选”外均需填写，日期使用 `YYYY-MM-DD` 格式。

Blog frontmatter：

```yaml
---
title: '文章标题'
description: '文章摘要'
pubDate: '2026-09-22'
tags:
  - Astro
category: 'Web'
draft: false
---
```

Projects frontmatter：

```yaml
---
title: '项目名称'
description: '项目简介'
tags:
  - Astro
status: 'in-progress' # planned | in-progress | completed
featured: true
order: 1
repository: 'https://github.com/example/repository' # 可选
website: 'https://example.com' # 可选
draft: false
---
```

### 写作与预览

1. 将文章保存到 `src/content/blog/`，项目介绍保存到 `src/content/projects/`，填写对应的 frontmatter。
2. 正文使用普通 Markdown。页面会根据 `title` 显示主标题，正文建议从 `##` 开始；桌面目录只收集 `##` 和 `###`。
3. 启动开发服务器后，新增或修改内容会被读取并刷新页面，无需手动修改卡片或路由代码。
4. 当前 `draft: true` 的内容在开发和生产环境中都会被过滤，不生成详情页。本地检查排版需临时设为 `false`；未准备发布时，应在提交或构建发布前恢复为 `true`。独立的本地草稿预览尚未实现。
5. 发布前运行 `npm run build`，再检查本地生产预览。正式站点是静态文件，新增 Markdown 仍需重新构建并发布 `dist/` 才会上线。

需要注意：

- `tags` 由作者填写，系统不会根据正文自动生成标签。同一篇文章请避免重复填写同一个标签；标签目录只聚合非草稿 Blog，不聚合 Projects。
- Blog 搜索只匹配标题、摘要、分类和标签，Projects 搜索只匹配标题、描述、标签和状态；当前均不检索正文。
- `pubDate` 用于日期展示与排序，不提供定时发布；未来日期配合 `draft: false` 也会被构建出来。
- 首页只展示最新的一篇非草稿文章，以及按 `order` 排序后第一个非草稿精选项目；`featured: true` 不保证所有精选项目都出现在首页。
- 当前未配置 MDX 或数学公式渲染，也没有最后更新时间字段。公式等能力需按实际写作需要另行补充。
- 中文字体子集在开发服务器启动前和正式构建前生成。持续开发时新增的字形可能先使用系统回退字体；重新运行启动或构建流程会更新子集。
- `draft` 只控制网站展示，不是保密机制。Markdown 一旦提交到公开 GitHub 仓库，正文仍可被读取。

内容量仍较少，因此 Blog 暂未启用分页。

## 本地开发

### 环境要求

- Node.js `>=22.12.0`
- npm（随受支持的 Node.js 版本安装）

迁移后的 Mac 环境已使用 Node.js 26.9.0、npm 11.19.1 完成安装、开发服务器和正式构建验证；2026-10-05 核对时本机版本仍相同。仓库未提供 `.nvmrc`，实际最低要求以 `package.json` 的 `engines` 为准，不假定生产环境与本机版本相同。

### 安装依赖

```sh
npm ci
```

`package-lock.json` 当前记录的依赖下载地址使用 `registry.npmmirror.com`。这是仓库当前的实际状态，是否长期保留仍待确认。

### 启动开发服务器

按照仓库开发约定，使用 Astro 后台模式：

```sh
npm run dev -- --background
```

查看状态、日志或停止后台服务器：

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

### 检查与构建

```sh
npm run check
npm run build
```

`npm run build` 会依次执行：

1. 扫描 `src/` 中使用的中文字符并生成字体子集；
2. 运行 `astro check`；
3. 执行 Astro 静态构建。

生成的 `public/fonts/noto-sans-sc-site.woff2`、Astro 缓存和 `dist/` 均不会提交到 Git。

构建完成后可在本地预览：

```sh
npm run preview
```

停止本地预览：

```sh
npm run astro -- preview stop
```

## 部署

配置的正式站点地址为 [https://alexyelab.com](https://alexyelab.com)。构建环境运行 `npm ci` 和 `npm run build`，托管环境只需提供 `dist/` 中的静态文件，不需要常驻 Astro 服务。

生产发布由仓库外的环境配置负责。仓库当前不包含 GitHub Actions 检查或发布工作流，也不能仅凭本地构建成功确认线上已经更新。

公开内容只记录架构和通用开发流程，不提供服务器账户、实际目录、部署入口、生产拓扑、凭据或具体安全配置。原始完整交接文档仅保留为本地历史参考，公开维护上下文使用 `PROJECT_CONTEXT_PUBLIC.md`；提交前应检查暂存内容，避免将私有记录或环境文件加入仓库。

## 当前边界与后续方向

当前没有数据库、评论系统、管理后台、分析脚本、Blog 分页或前端框架。下一阶段主要关注：

- 扩充真实 Blog 内容；
- 完善项目正文和实际进度；
- 增加仅开发环境可用的草稿预览，再按需要评估更新时间和数学公式支持；
- 补充不依赖生产凭据的自动构建检查与关键交互回归检查；
- 在真实 iPhone/Safari 和正式站点继续检查响应式、主题、字体与页面过渡；
- 内容明显增多后，再评估分页、分类导航或更完整的检索能力。

发布前还需在实际托管环境核验文章深链、404 HTTP 状态码、缓存与压缩，以及内容更新后的中文字体刷新。上述检查不能由本地构建结果代替，本文不声明已完成生产环境验收。

更完整的公开架构、技术决策和维护注意事项见 [`PROJECT_CONTEXT_PUBLIC.md`](PROJECT_CONTEXT_PUBLIC.md)。
