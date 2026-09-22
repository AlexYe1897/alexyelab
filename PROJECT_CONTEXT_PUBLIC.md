# AlexYeLab 项目上下文（公开版）

> 仓库基线：2026-09-22，`main` 分支，提交 `af8a632`。  
> Mac 验证环境：Node 26.9.0 / npm 11.19.1。Windows 旧验证环境 Node 22.14.0 / npm 10.9.2 仅作历史参考。  
> 本文是适合公开 GitHub 仓库的项目上下文，有意不记录主机、账户、路径、部署入口和安全配置等运维细节。

## 0. 阅读规则与信息优先级

本文使用三种状态：

- **当前有效**：已经落在仓库中，或由项目所有者确认正在使用。
- **历史废弃**：讨论或使用过，但当前不应恢复。
- **计划中**：尚未实现，不能当作现有能力。

发生冲突时按以下顺序判断：

1. 当前仓库代码与构建结果；
2. 线上站点的实际行为；
3. 本文；
4. `README.md`、内容文章和旧记录。

`README.md` 已明显落后于实现：其中“项目无详情页、SEO 尚不完整、没有暗色主题或动画”等描述均已失效。

## 1. 项目定位与目标

AlexYeLab 是 Alex Ye 的个人技术网站，主要用于：

- 发布 AI、LLM、多模态、算法和工程实践文章；
- 展示个人项目及项目实施记录；
- 作为长期可维护、轻量且有个人辨识度的技术主页。

网站不是 SaaS 或后台系统。当前采用完全静态输出，优先考虑阅读体验、性能、SEO、移动端适配和低维护成本。当前内容量较少：1 篇 Blog、3 个 Projects。

## 2. 当前技术栈

**当前有效：**

- Astro 7（当前构建实际为 static；`astro.config.mjs` 未显式配置 `output`，使用当前默认静态输出行为；锁定安装版本 7.2.1）
- TypeScript 6，Astro strict 配置
- Tailwind CSS 4，通过 `@tailwindcss/vite`
- Astro Content Collections（Blog 与 Projects）
- Astro ClientRouter，用于站内短淡入淡出过渡
- Shiki（Astro 内置 Markdown 代码高亮）
- `@astrojs/sitemap`、`@astrojs/rss`
- `subset-font`，构建时生成中文字体子集
- Prettier + `prettier-plugin-astro`
- Node.js 要求 `>=22.12.0`

没有 React/Vue/Svelte、数据库、CMS 后台或运行时 Astro 服务。生产站点只需提供构建后的静态文件。

## 3. 主要目录与核心文件

```text
src/
├─ assets/font-source/       # 中文可变字体源文件，供构建子集
├─ components/               # 导航、首页、卡片、TOC、搜索、代码块增强等
├─ content/
│  ├─ blog/                  # Markdown 博客
│  └─ projects/              # Markdown 项目内容
├─ content.config.ts          # 两个 Content Collection 的 schema
├─ layouts/Layout.astro      # 全站 head、SEO、主题初始化、导航、页脚、页面过渡
├─ pages/                    # Astro 路由
├─ styles/global.css         # 设计 token、字体、主题、全局组件样式
└─ utils/                    # 阅读时长/字数与 tag slug 规则

public/
├─ fonts/                    # 拉丁字体、代码字体及许可文件
├─ images/home-earth.webp    # 首页地球视觉素材
└─ og-default.png            # 默认社交分享图

scripts/build-fonts.mjs      # 扫描 src 中文字符并生成字体子集
astro.config.mjs             # site、sitemap、Tailwind、Shiki
package.json                 # 脚本、Node 版本和依赖
AGENTS.md / CLAUDE.md        # 本地开发及 Astro 文档约定
```

关键组件职责：

- `Navbar.astro`：桌面/移动导航、当前页状态、移动菜单、非首页主题切换。
- `Hero.astro`、`HomeBackground.astro`：首页标题、入口、星空和地球。
- `BlogCard.astro`、`ProjectCard.astro`：列表与首页预览卡片。
- `ExpandableSearch.astro`：图标展开式实时搜索，查询词同步到 `?q=`。
- `TableOfContents.astro`：桌面端 h2/h3 目录、编号、当前章节跟随和内部滚动。
- `CodeBlockEnhancer.astro`：代码语言栏与复制按钮。
- `BackToTop.astro`：详情页返回顶部按钮。
- `DisplayTitleText.astro`：标题中中英文/数字的字重呈现。
- `About.astro`：About 各内容段、桌面侧边导航和分段背景色逻辑。

## 4. 当前功能状态

### Blog

**当前有效：**

- `/blog` 按发布日期倒序展示非草稿文章。
- 卡片展示分类、日期、字数、摘要和标签，整张卡片可点击。
- 搜索覆盖标题、摘要、分类和标签；多个词采用 AND 匹配；查询写入 URL 并可恢复。
- `/blog/[slug]` 提供文章元信息、阅读字数/时间、标签、Markdown 正文、代码增强、TOC、上一篇/下一篇和返回顶部。
- 当前未启用分页，内容少时保持单页列表。

### Projects

**当前有效：**

- `/projects` 从 Projects Collection 读取非草稿项目，按 `order` 排序。
- 搜索覆盖标题、描述、标签和中英文状态文本；查询写入 URL。
- 响应式卡片为 1/2/3 列，列表卡片整张可点击。
- `/projects/[slug]` 包含状态、标签、可选网站/仓库链接、Markdown 正文、代码增强、TOC 和返回顶部。
- 首页只取第一个 `featured: true` 且非草稿的项目。

### Tags

**当前有效：**

- Tags 目前只聚合 Blog，不聚合 Projects。
- `/tags` 显示全部标签及文章数，`/tags/[tag]` 显示对应文章。
- `src/utils/tags.ts` 执行 NFKC、空白归一化和小写化；对特殊字符生成稳定映射，并用短哈希避免重复 slug。
- Tag 页面在主导航中归属于“博客”状态。

### 阅读辅助、SEO 与可访问性

**当前有效：**

- TOC 只收集 h2/h3，自动编号，仅在大屏显示，长目录可内部滚动并跟随当前章节。
- 代码块保留具体语言名称，提供复制按钮。
- 详情页在滚动超过约 600px 后显示返回顶部。
- 正式站点为 `https://alexyelab.com`。
- Layout 统一输出 title、description、canonical、Open Graph、Twitter Card 和 JSON-LD。
- 自动生成 sitemap、`robots.txt` 和 Blog RSS（`/rss.xml`）。
- 404 使用 `noindex, nofollow`。
- 已有 skip link、`focus-visible`、语义化 main、`aria-current`、移动菜单 inert/aria 状态及 `prefers-reduced-motion` 兼容。

## 5. 当前视觉设计与交互方向

**当前有效：**

- 总体语言：极简但不空洞、柔和现代、轻科技感、适量图标、自然过渡。
- 主强调色为深绿/蓝绿，暗色中使用较亮的薄荷绿。
- 字体组合为 Google Sans Flex、构建生成的 Noto Sans SC 中文子集和 JetBrains Mono。
- 首页固定暗色，其他页面支持亮/暗主题，选择保存在 `alexyelab-theme`。
- 首页使用深色太空视觉、确定性分布星点和地球素材；减少动态效果开启时停止动画。
- About 的章节导航激活逻辑与背景色逻辑保持分离。
- 页面切换为短暂淡入淡出，不使用长遮罩或明显退场动画。

设计调整应先在真实页面和手机宽度查看，再小步调整颜色、间距、字重和动效。

## 6. 本地开发与 Mac 环境

环境准备：

```bash
nvm install 22
nvm use 22
npm ci
npm run build
```

注意：

- 仓库当前没有 `.nvmrc`，以 `package.json` 的 `engines.node >=22.12.0` 为准。
- `package-lock.json` 中当前依赖下载地址使用 `registry.npmmirror.com`；是否长期保留待确认。
- `npm run build` 会依次执行中文字体子集构建、`astro check` 和静态构建。
- `public/fonts/noto-sans-sc-site.woff2` 是生成物且被 `.gitignore` 忽略。
- `scripts/build-fonts.mjs` 使用 Node 路径 API，可跨 Windows/macOS。
- 2026-09-22 Mac 验证结果：字体子集 578 个字符、约 154 KiB；Astro 检查 0 error / 0 warning / 0 hint，全部静态路由构建成功。

按仓库 `AGENTS.md` 的要求，开发服务器使用后台模式：

```bash
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

如更改页面、组件、路由、内容集合或 Tailwind，应先查看 `AGENTS.md` 列出的 Astro 官方指南。

## 7. Git 与发布边界

**当前有效：**

- 主分支为 `main`。
- 常规流程：本地小步修改 → `npm run build` → 检查 `git diff` / `git status` → 提交 → 推送。
- 当前仓库没有 `.github/workflows`，不依赖仓库内的 GitHub Actions 发布流程。
- 正式构建产物为 `dist/` 中的静态文件，由仓库外部的发布环境提供给用户。
- 生产环境的主机、账户、路径、入口、网络拓扑、凭据和安全配置不应记录在公开仓库中。
- 不提交 `.env`、日志、`dist`、`.astro`、`node_modules` 和生成的中文字体。

## 8. 重要技术决策

**当前有效：**

1. **静态站点而不是运行时 SSR**：内容型个人网站无需常驻 Astro 服务。
2. **Projects 也使用 Content Collections**：Blog 与 Projects 共用 Markdown 内容模型、详情页、TOC 和 SEO。
3. **首页固定暗色，内页支持双主题**：首页暗色锁定不是主题切换故障。
4. **中文字体构建时子集化**：在保留字体观感的同时控制下载体积。
5. **少量原生客户端脚本**：搜索、主题、TOC、代码复制和动画无需引入大型前端框架。
6. **Tag slug 自定义规范化**：避免大小写、Unicode、特殊字符和重复 slug 导致路由冲突。
7. **TOC 桌面显示、移动隐藏**：移动屏幕优先正文空间。
8. **不提前分页**：现有内容量较少，文章数量明显增长后再评估。

## 9. 历史废弃方案：不要恢复

- 早期纯白/纯黑、强横线、强边框的视觉方案。
- 首页多色流体渐变、呼吸式大面积渐变和波纹背景。
- 首页 `PERSONAL AI LAB` 小标题。
- 将 About 章节高亮、滚动导航和背景色完全绑定的实现。
- TOC 占满页面高度。
- Projects 列表卡片统一显示“查看项目”。
- 独立 `projects.js` 静态项目数据。
- 将 Bash/Shell/Zsh 都显示为笼统“命令行”。
- 为少量内容保留无用分页/历史组件。
- 直接相信旧 `README.md` 的功能状态。

## 10. 已知项目注意事项

- **README 过期**：应以当前代码和构建结果为准。
- **字体首屏轻微切换**：子集和系统字体回退已降低影响，不要为消除轻微切换而放弃当前字体观感。
- **首页移动端结构较固定**：继续增加首页内容前，应重做流式布局而不是叠加绝对定位。
- **About 滚动逻辑曾反复调整**：修改观察器或阈值时，需分别测试点击、慢滚、快速滚到底和短视口。
- **页面过渡白闪**：改动 ClientRouter 或主题初始化时需重新检查。
- **内容文章可能落后于当前实现**：文章不应作为开发或发布配置的唯一依据。

## 11. 当前 TODO

**计划中，但未承诺全部实施：**

- 扩充真实 Blog 内容；目前只有 `kv-cache.md`。
- 完善其余两个项目的正文和真实进度，避免示例感。
- 在 Mac、iPhone/Safari 和正式站点重新进行响应式、字体、主题、页面过渡和横向溢出检查。
- 根据当前实际架构更新已过时的项目文章，但不将敏感运维细节写入公开内容。
- 内容明显增多后再评估 Blog 分页、分类导航或更完整的内容检索。
- 后续按真实效果小步调整颜色、字重、间距和动效。
- 可选：增加 `.nvmrc`，便于统一 Node 版本。

当前没有计划引入数据库、评论系统、管理后台、分析脚本、重型动画库或前端框架，除非项目所有者明确提出。

## 12. 后续开发优先级

1. **真实设备质量检查**：重点是首页移动布局、中文字体、页面过渡、TOC、主题首屏和 Safari。
2. **内容完善**：补充文章和项目详情，随后再决定是否需要分页/分类。
3. **文档一致性**：更新过期 README 和内容文章，保持公开文档与当前实现一致。
4. **视觉细调**：只做基于截图和真实页面反馈的小步调整。

## 13. 开发协作偏好

- 默认使用中文沟通，先说清“会改变什么效果”，再落代码。
- 大调整先给方案，小步实施；每完成一段查看实际效果，不一次重做全站。
- 当前代码和用户刚确认的视觉优先，不因追求“最佳实践”擅自改变已满意部分。
- 修改要全局一致，但只触及任务范围；保留用户未要求改动的文件和内容。
- 优先图标和紧凑交互，但移动端必须清楚、可点且不拥挤。
- 动效要可感知但不抢注意力，必须兼容 `prefers-reduced-motion`。
- 字体观感很重要，不要随意更换当前字体组合。
- 不编造项目成果、经历或线上数据；内容应克制、真实。
- 尽量复用现有组件、token 和工具函数，避免为同一逻辑建立第二套实现。
- 非必要不增加依赖；涉及 Astro 能力时优先查官方文档。
- 每次代码修改后至少运行 `npm run build`，报告错误、警告和验证范围。
- 不提交、不回显密码、Token、Secret、私钥、服务器凭据或真实 `.env`。

## 14. 公开仓库验证清单

### Git 与运行环境

```bash
git status --short
git branch --show-current
git log -1 --oneline
node -v
npm -v
npm ci
npm run build
git status --short
```

预期：分支为 `main`，Node 至少 22.12，构建 0 错误/0 警告，构建后不出现新的已跟踪文件改动。

### 必查文件

- `package.json`、`package-lock.json`：Node 要求、实际依赖、脚本和锁文件下载地址。
- `astro.config.mjs`、`tsconfig.json`：正式域名、集成、当前默认静态输出行为和严格类型。
- `src/layouts/Layout.astro`：SEO、主题初始化、ClientRouter、全局结构。
- `src/styles/global.css`：设计 token、亮暗主题和字体策略。
- `src/content.config.ts`：Blog/Projects schema。
- `src/pages/blog/[slug].astro`、`src/pages/projects/[slug].astro`：详情页能力。
- `src/components/TableOfContents.astro`：编号、激活、内部滚动和高度。
- `src/components/HomeBackground.astro`、`Hero.astro`、`src/pages/index.astro`：首页布局与动效。
- `src/components/Navbar.astro`、`About.astro`：导航、主题、About 滚动逻辑。
- `src/utils/tags.ts`、`reading.ts`：slug 与阅读统计。
- `scripts/build-fonts.mjs`：字体子集生成。
- `README.md`：确认其功能描述是否仍然过期。

### 本地页面验证

至少检查：`/`、`/about`、`/blog`、博客详情页、`/projects`、项目详情页、`/tags`、`/rss.xml`、`/robots.txt` 和不存在的路径。分别测试桌面/手机宽度、亮暗主题、搜索 URL、移动菜单、TOC、代码复制、返回顶部和减少动态效果。

