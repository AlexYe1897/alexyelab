---
title: 'Alex Ye Lab 个人网站'
description: '一个用于沉淀 AI 学习、技术文章与项目实践的个人技术知识和项目展示平台。'
tags:
  - Website
  - Astro
  - DevOps
status: 'in-progress'
featured: true
order: 1
website: 'https://alexyelab.com'
draft: false
---

## 项目概述

Alex Ye Lab 是我的个人技术知识与项目展示平台，用于记录 AI 学习、算法探索、工程实践和个人项目积累。

这个项目并不只是搭建一个博客页面。它包含内容系统、项目展示、阅读体验、SEO、服务器部署和自动更新流程，也记录了这些能力从简单实现逐步演进为可长期维护工程的过程。

项目的代码框架和基础设施是在 ChatGPT 辅助下，通过持续对话、实际操作、验证和排错逐步完成的。对我而言，它既是一个正在使用的网站，也是理解 Web 开发、内容工程和生产部署的实践载体。

## 背景与目标

建立这个网站的初衷，是拥有一个由自己维护的技术主页，不依赖第三方内容平台，并把分散的博客、项目和个人介绍组织在同一个地方。

网站主要服务于四个目标：

- 沉淀 AI、LLM、多模态和算法相关的学习笔记；
- 记录开发、部署与工程实践中的问题和解决过程；
- 展示持续推进的个人项目，而不只展示最终结果；
- 建立一套内容与代码分离、易于扩展和部署的长期维护方式。

## 架构与技术选型

### 为什么选择 Astro

网站以文章和项目内容为核心，大部分页面不需要复杂的客户端状态。Astro 默认采用静态生成，能够在构建阶段把页面输出为 HTML、CSS 和少量必要的 JavaScript，适合由 Nginx 直接托管。

相比从 React SPA 或其他完整应用框架开始，Astro 对 Markdown、文件路由和内容集合提供了更直接的支持。它既能保持当前站点轻量，也保留了以后按需增加客户端交互的空间。

### Tailwind CSS 与 TypeScript

Tailwind CSS 用于组织页面布局、响应式断点和组件状态。当前网站没有建立复杂的视觉系统，而是先通过统一的间距、边框、灰阶文字和卡片样式保持页面一致。

TypeScript 主要用于内容结构、工具函数和组件属性约束。随着博客、项目和动态路由增加，类型检查可以减少字段变更造成的不一致，也更适合后续持续扩展。

## 内容系统的演进

### 从静态数据到 Content Collections

项目早期使用 `projects.js` 保存项目数组。这种方式能够快速完成展示，但随着项目字段和详情页需求增加，数据文件与页面代码之间的耦合开始变得明显，也缺少统一的结构校验。

后来，博客和项目统一迁移到 `src/content/`：

```text
src/content/
├─ blog/
└─ projects/
```

两类内容分别使用 Astro Content Collections 管理。Collection schema 对标题、描述、标签、日期、状态、排序和草稿等字段进行校验，页面再通过 `getCollection()` 查询公开内容并生成静态路由。

这种结构带来的直接变化是：新增文章或项目时，主要工作转移到编写 Markdown 内容，而不再需要修改列表页的数据代码。

### Blog 内容系统

目前博客系统包括：

- Markdown 文章与 frontmatter 校验；
- 按发布日期排序的文章列表；
- 基于标题、摘要、分类和标签的本地实时搜索；
- 标签聚合页；
- H2/H3 文章目录；
- 适合中英文混合内容的字数与阅读时间计算；
- 按发布日期确定的上一篇和下一篇导航；
- 草稿过滤与静态详情路由。

其中，阅读时间会先去除 Markdown 标记和代码块，再分别按中文字符和英文单词估算。桌面端目录固定在正文右侧，移动端隐藏，以减少对正文阅读空间的影响。

### Projects 内容系统

Projects 最初只有项目卡片，后来也迁移为独立的 Content Collection，并增加：

- `/projects` 项目列表；
- `/projects/[slug]` 静态详情页；
- 项目状态、技术标签和精选排序；
- Markdown 项目说明；
- 可选的网站与源码入口。

项目详情页沿用博客的排版和目录能力，但不显示文章字数、阅读时间或文章导航，避免混淆两类内容的用途。

### 个人主页

About 页面用于说明当前身份、关注方向、正在学习和构建的内容，并通过一条可继续追加的时间线记录阶段变化。它让网站从单纯的内容列表逐步接近一个完整的个人技术主页。

## 生产环境部署

### 服务器与静态文件

网站部署在腾讯云轻量应用服务器上，服务器系统为 Ubuntu。Astro 构建后的静态文件由 Nginx 直接提供，不运行常驻的 Astro 开发服务器或预览服务器。

主要目录如下：

```text
/home/ubuntu/apps/alexyelab   # Git 仓库
/home/ubuntu/apps/alexyelab/dist
/var/www/alexyelab           # Nginx 实际托管目录
```

Nginx 的站点 `root` 指向 `/var/www/alexyelab`。日常部署只替换静态文件，不需要重新加载 Nginx；只有修改 Nginx 配置时，才执行配置检查和 reload。

### HTTPS

域名 `alexyelab.com` 通过 Nginx 对外提供服务，HTTPS 证书由 Certbot 和 Let's Encrypt 管理。Nginx 负责 HTTPS 入口、静态文件访问，以及 Webhook 请求的反向代理。

## 部署方案的演进

### 第一版：手动部署

第一版生产流程需要手动完成：

```text
本地修改
  ↓
上传或更新服务器代码
  ↓
安装依赖并构建
  ↓
替换线上静态文件
```

这种方式能够完成部署，但每次发布都需要重复操作，容易遗漏步骤，也不适合持续发布文章和项目内容。

### 第二版：GitHub Actions + SSH

第二版使用 GitHub Actions。代码推送到 GitHub 后，由 GitHub-hosted Runner 通过 SSH 登录腾讯云服务器，执行拉取、安装依赖、构建和文件复制。

这套方案曾经正常完成自动部署，也暴露了两个实际问题。

第一个问题是非交互式 SSH 环境没有自动加载 NVM。手动登录时服务器使用 Node.js 22，但 Actions 的远程 Shell 一度使用 Node.js 18，导致 Astro 构建失败。部署命令显式加载 NVM 并执行 `nvm use 22` 后，版本问题得到解决。

第二个问题来自 GitHub-hosted Runner 的动态公网出口地址。每次部署都会从不同地址发起 SSH 登录，腾讯云主机安全持续将这些连接识别为异常或高危登录。日志检查确认这些登录使用的是专门配置的 GitHub Actions SSH Key，并不是未经授权的访问，但持续告警仍然增加了安全判断和维护成本。

因此，GitHub Actions + SSH 并不是因为无法工作而被放弃，而是部署入口和服务器安全策略并不适合当前个人网站。

### 第三版：GitHub Webhook

当前方案改为由服务器主动完成部署：

```text
本地开发
  ↓ git push
GitHub main
  ↓ HTTPS Webhook
Nginx /webhook
  ↓ reverse proxy
本地 Node.js Webhook Service
  ↓
deploy.sh
  ↓
拉取 main、构建并更新静态文件
```

GitHub 不再通过 SSH 登录服务器。原有 Actions workflow 和对应的服务器部署 Key 被移除，部署入口变成一个经过签名验证的 HTTPS Webhook，请求链路更清晰，也避免了动态 Runner IP 带来的 SSH 告警。

## Webhook 自动部署实现

### 请求链路

GitHub 仓库的 Webhook 配置为仅发送 push 事件，请求地址为：

```text
https://alexyelab.com/webhook
```

Nginx 将该路径反向代理到只在本机链路中使用的 Node.js 服务。Webhook Service 使用 Express 接收请求，并通过 Node.js `crypto` 模块验证 GitHub 的 `X-Hub-Signature-256`。

签名验证使用共享 Secret 和 HMAC-SHA256。只有验证通过后，服务才会通过 `child_process` 调用 `/home/ubuntu/deploy.sh`。

当前 GitHub 侧只发送 push 事件，部署脚本固定拉取 `origin main`。Node 服务是否额外检查事件 Header 和 `refs/heads/main` 尚未作为当前实现的一部分，因此没有把它描述为已完成的安全能力。

### PM2 的职责

PM2 只负责守护 Node.js Webhook Service，包括进程运行、异常恢复和 stdout/stderr 日志查看。Astro 网站本身是静态文件，不由 PM2 运行。

部署和排错过程中，可以通过下面的方式查看 Webhook 与部署输出：

```sh
pm2 logs webhook
```

### 部署脚本

当前部署脚本的核心流程为：

```sh
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

cd ~/apps/alexyelab

git pull origin main
npm ci
npm run build

sudo rm -rf /var/www/alexyelab/*
sudo cp -r dist/* /var/www/alexyelab/
```

`set -e` 确保依赖安装或构建失败时脚本立即停止，不会执行后面的线上目录清理，因此普通构建失败不会删除当前线上版本。

当前“清空目录后复制”的步骤不是原子部署。如果复制阶段发生异常，理论上仍可能出现短暂的不完整状态。后续可以使用 release 目录与符号链接，或更合适的同步策略进一步改善部署可靠性。

## SEO 与基础优化

网站目前已经实现：

- 页面级 title 和 description；
- Canonical URL；
- Open Graph 与基础 Twitter Card；
- Astro 官方 `@astrojs/sitemap`；
- 动态生成的 `robots.txt`；
- 静态页面与 Content Collection 动态路由自动加入 Sitemap。

这些能力集中在公共 Layout 和 Astro 配置中，不需要每个页面重复维护。博客文章和项目详情页会使用各自 Content Collection 中的标题与描述生成 metadata。

## 工程问题与取舍

### Node.js 环境一致性

本地和服务器统一使用 Node.js 22。服务器通过 NVM 管理版本，部署脚本主动加载 NVM，避免交互式 Shell 与自动部署 Shell 使用不同 Node.js 版本。

### Nginx 目录分离

Git 仓库和 Web Root 使用不同目录：仓库负责安装依赖与构建，`/var/www/alexyelab` 只保存对外提供的静态文件。这使源代码、依赖和生产静态资源的职责更加明确。

### 自动部署入口

GitHub Actions + SSH 在技术上可行，但动态 Runner IP 与云服务器安全告警产生冲突。Webhook 方案让服务器接收经过验证的事件后主动拉取代码，减少了外部 SSH 登录，也更符合当前项目规模。

### 当前仍可改进的地方

- 将 Webhook Secret 从服务代码配置迁移到环境变量或 PM2 环境配置；
- 在 Node 服务中显式校验 GitHub 事件类型和目标分支；
- 将静态文件发布升级为原子切换，降低复制过程异常的影响；
- 确认并完善 PM2 的系统启动恢复配置；
- 继续补充部署日志、失败通知和回滚能力。

## 技术栈

| 范围 | 技术 |
| --- | --- |
| 网站与样式 | Astro、TypeScript、Tailwind CSS |
| 内容 | Markdown、Astro Content Collections |
| 服务器 | Ubuntu、Nginx、Node.js、PM2 |
| 部署 | Git、GitHub Webhook、Express、Shell Script |
| HTTPS | Certbot、Let's Encrypt |
| SEO | Sitemap、robots.txt、Canonical URL、Open Graph |

## 当前状态与后续计划

Alex Ye Lab 已经建立博客、项目、About、SEO 和自动部署的基本闭环，目前仍处于持续维护状态。

后续重点不是一次性加入大量功能，而是继续补充 AI 与算法学习内容、记录更多真实项目实践，并逐步改善内容组织、视觉体验和部署可靠性。
