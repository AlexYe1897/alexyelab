# Alex Ye Lab

Alex Ye Lab 是一个使用 Astro 构建的个人技术博客与主页，用于整理技术文章、项目实践和个人介绍。

网站目前以清晰、轻量的内容展示为主：博客与项目使用 Astro Content Collections 管理，页面由可复用的 Astro 组件组成，并通过 Tailwind CSS 实现基础响应式布局。项目仍处于持续完善阶段，当前重点是补齐内容组织和浏览功能，视觉主题与动画会在后续逐步调整。

## 设计逻辑

项目采用静态内容优先的设计：文章、项目和标签页面都在构建阶段生成，不依赖后端数据库或客户端框架。

- `Layout` 统一提供页面结构、导航、页脚和 metadata。
- `src/pages` 使用 Astro 文件路由组织首页、博客、项目和关于页面。
- 博客文章与项目分别存放在独立的 Content Collection 中，通过 schema 校验字段结构。
- 首页只负责组合 Hero、最新文章和精选项目等内容区块。
- Blog 与 Projects 列表页复用各自的 Card 组件，避免维护多套展示结构。
- 博客详情页从 Markdown 自动生成正文、标题锚点和桌面端目录。
- 搜索功能在浏览器本地过滤构建好的文章数据，不需要额外的搜索服务。

## 技术栈

- [Astro](https://astro.build/)：页面、静态路由与 Content Collections
- [Tailwind CSS](https://tailwindcss.com/)：页面布局和组件样式
- [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography)：Markdown 正文排版
- [Shiki](https://shiki.style/)：Markdown 代码块语法高亮
- TypeScript：内容 schema 和部分组件类型

项目没有引入 React、Vue 等前端框架，当前交互仅使用少量原生 JavaScript。

## 已有功能

- 首页 Hero、最新文章和精选项目展示
- Blog Content Collection 与 Markdown 文章管理
- 草稿文章在首页和列表页中的过滤
- Blog 列表按日期倒序排列
- 基于标题、摘要、分类和标签的实时本地搜索
- 搜索关键词通过 `?q=` 保留在 URL 中
- `/blog/[slug]` 静态文章详情页
- 文章字符数和预计阅读时间
- Markdown 代码高亮与 Typography 排版
- 桌面端右侧 sticky 文章目录，只收录 H2/H3
- `/tags/[tag]` 标签文章列表
- Projects Content Collection、项目排序和首页精选控制
- 页面级 title 和 description metadata
- 基础响应式布局与中文界面

当前尚未包含项目详情页、Blog 分页、完整 SEO/社交分享 metadata、暗色主题或复杂动画。

## 目录结构

```text
.
├─ public/                    # Favicon 等直接发布的静态资源
├─ src/
│  ├─ components/            # 导航、页脚、卡片、预览区块和文章目录
│  ├─ content/
│  │  ├─ blog/               # Markdown 博客文章
│  │  └─ projects/           # Markdown 项目数据
│  ├─ layouts/
│  │  └─ Layout.astro        # 全站公共布局与 metadata
│  ├─ pages/
│  │  ├─ index.astro         # 首页 /
│  │  ├─ about.astro         # 关于 /about
│  │  ├─ projects.astro      # 项目列表 /projects
│  │  ├─ blog/
│  │  │  ├─ index.astro      # 博客列表 /blog
│  │  │  └─ [slug].astro     # 文章详情 /blog/:slug
│  │  └─ tags/
│  │     └─ [tag].astro      # 标签文章列表 /tags/:tag
│  ├─ styles/
│  │  └─ global.css          # Tailwind 与 Typography 全局入口
│  ├─ utils/
│  │  └─ tags.ts             # 标签 URL 标准化
│  └─ content.config.ts      # Blog 与 Projects collection schema
├─ astro.config.mjs          # Astro、Tailwind 和 Markdown 配置
├─ package.json
└─ tsconfig.json
```

## 内容结构

博客文章的 frontmatter 主要包含标题、摘要、日期、标签、分类和草稿状态。项目数据包含标题、简介、技术标签、状态、精选标记、排序值及草稿状态，并预留可选的仓库和网站地址。

新增内容时，Astro 会在同步或构建阶段按照 `src/content.config.ts` 中的 schema 进行校验。

## 本地运行

环境要求：Node.js 22.12.0 或更高版本。

安装依赖：

```sh
npm install
```

以后台模式启动开发服务器：

```sh
npm run astro -- dev --background
```

管理后台开发服务器：

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

构建静态站点：

```sh
npm run build
```

在本地预览构建结果：

```sh
npm run preview
```

构建产物会生成在 `dist/` 目录中。
