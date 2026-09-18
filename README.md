# hackerbs.com

> hacker brainstorm — 探索知识的宇宙

一个**零构建**的纯静态技术博客。没有 Node、没有打包器、没有模板引擎：
每一个页面都是一个可以直接打开、直接编辑的 HTML 文件。

## 目录结构

```
.
├── index.html            首页
├── topics.html           按领域划分的知识专题
├── archive.html          时间归档
├── tags.html             标签索引
├── search.html           本地搜索（读取 data/search-index.json）
├── about.html            关于与联系
├── 404.html
├── posts/                43 篇文章，一篇一个 HTML
├── assets/
│   ├── css/main.css      全部样式（深色/浅色双主题）
│   ├── js/main.js        全部交互（主题切换、目录高亮、复制代码、搜索）
│   └── img/
├── data/search-index.json
├── source/               文章的 Markdown 存档
└── tools/
    ├── meta.json         全站元数据：标题、分类、标签、日期、摘要
    └── build.py          Markdown → HTML 生成器
```

## 日常写作流程

### 1. 只改一篇文章

直接编辑 `posts/xxx.html` 里的 `<div class="prose">` 内容即可，改完提交、推送即上线。
**不需要跑任何构建命令。**

### 2. 新增一篇文章

1. 在 `source/` 下写 `my-new-post.md`（正文 Markdown，不要 front matter，正文最高用 `##`）
2. 在 `tools/meta.json` 的 `posts` 数组里加一条：
   ```json
   {
     "slug": "my-new-post",
     "title": "文章标题",
     "category": "os",
     "date": "2026-09-19",
     "tags": ["Debian", "Linux"],
     "summary": "一两句话说明这篇文章解决什么问题。"
   }
   ```
   `category` 可选值：`os` / `hardware` / `storage` / `operations` / `network` /
   `virtualization` / `container` / `security` / `engineering` / `embedded` /
   `fundamentals` / `essays`
3. 跑一次生成器（只会重建 HTML，不会动 `source/`）：
   ```bash
   python tools/build.py
   ```
4. 之后照样可以直接手改生成的 `posts/my-new-post.html`

## Markdown 支持范围

生成器 `tools/build.py` 支持：

- 围栏代码块（带语言标注，Pygments 高亮 + 一键复制）
- Obsidian callout：`> [!NOTE]` / `[!TIP]` / `[!WARNING]` / `[!DANGER]`
- 表格、脚注、任务列表（`extra` 扩展）
- Obsidian 图片 `![[xxx.png]]` 与双链 `[[slug|标题]]`

## 部署

仓库推到 GitHub 后由 GitHub Pages 直接托管根目录，`CNAME` 已绑定 `hackerbs.com`。
旧博客仍在 <https://blog.hackerbs.com>。

## 依赖

只有生成文章页时需要（日常编辑 HTML 不需要）：

```bash
pip install markdown pygments
```
