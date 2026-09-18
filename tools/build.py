# -*- coding: utf-8 -*-
"""
hackerbs.com 静态站点生成器（一次性工具）

用法：
    python tools/build.py

它读取 tools/meta.json + source/*.md，生成 posts/*.html 以及
index / archive / topics / tags / about / search / 404 页面和搜索索引。

生成出来的 HTML 就是站点的最终形态，可以直接手工编辑；
重新运行本脚本会覆盖 HTML（source/*.md 不会被改动）。
"""

import json
import os
import re
import html
import unicodedata
from datetime import datetime

import markdown
from pygments import highlight
from pygments.lexers import get_lexer_by_name, TextLexer, guess_lexer
from pygments.formatters import HtmlFormatter
from pygments.util import ClassNotFound

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "source")
POSTS = os.path.join(ROOT, "posts")
DATA = os.path.join(ROOT, "data")
META = os.path.join(ROOT, "tools", "meta.json")

LANG_LABEL = {
    "bash": "Bash",
    "sh": "Shell",
    "shell": "Shell",
    "zsh": "Shell",
    "console": "Console",
    "python": "Python",
    "py": "Python",
    "cpp": "C++",
    "c": "C",
    "dockerfile": "Dockerfile",
    "yaml": "YAML",
    "yml": "YAML",
    "json": "JSON",
    "ini": "INI",
    "conf": "Config",
    "nginx": "Nginx",
    "text": "Text",
    "log": "Log",
    "sql": "SQL",
    "xml": "XML",
    "diff": "Diff",
    "makefile": "Makefile",
}

CALLOUTS = {
    "note": ("NOTE", "说明"),
    "tip": ("TIP", "技巧"),
    "info": ("NOTE", "说明"),
    "warning": ("WARNING", "注意"),
    "caution": ("WARNING", "注意"),
    "danger": ("DANGER", "警告"),
    "important": ("WARNING", "重要"),
    "quote": ("NOTE", "引用"),
    "summary": ("NOTE", "小结"),
}


# --------------------------------------------------------------------------
# 基础工具
# --------------------------------------------------------------------------
def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def strip_front_matter(text):
    m = re.match(r"^\ufeff?---\s*\n(.*?)\n---\s*\n?", text, re.S)
    return text[m.end():] if m else text


def esc(s):
    return html.escape(s, quote=False)


def slugify_heading(text, index):
    """为中文标题生成稳定的锚点 id。"""
    base = re.sub(r"<[^>]+>", "", text)
    base = base.strip().lower()
    base = re.sub(r"[\s　]+", "-", base)
    base = re.sub(r"[^\w\u4e00-\u9fff\-]", "", base, flags=re.UNICODE)
    if not base:
        base = "sec"
    return "%s-%d" % (base[:40], index)


def reading_minutes(text):
    chars = len(re.sub(r"\s", "", text))
    return max(1, round(chars / 420))


# --------------------------------------------------------------------------
# Markdown → HTML
# --------------------------------------------------------------------------
def convert_obsidian_assets(text):
    """![[Pasted image xxx.png]] → 图片；[[a/b|c]] → 链接。"""
    def repl_img(m):
        name = m.group(1).strip()
        return "![%s](assets/img/%s)" % (name, name)

    text = re.sub(r"!\[\[([^\]\|]+)\]\]", repl_img, text)

    def repl_link(m):
        target, label = m.group(1), m.group(2)
        slug = target.split("/")[-1].strip()
        return "[%s](posts/%s.html)" % (label or slug, slug)

    text = re.sub(r"\[\[([^\]\|]+)(?:\|([^\]]+))?\]\]", repl_link, text)
    return text


def extract_blocks(text):
    """把围栏代码块与 Obsidian callout 抽出来，换成占位符。"""
    lines = text.split("\n")
    out = []
    blocks = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]

        # 围栏代码块
        m = re.match(r"^\s*```+\s*([\w+#.-]*)\s*$", line)
        if m:
            lang = (m.group(1) or "text").lower()
            i += 1
            buf = []
            while i < n and not re.match(r"^\s*```+\s*$", lines[i]):
                buf.append(lines[i])
                i += 1
            i += 1  # 跳过结束围栏
            blocks.append(("code", (lang, "\n".join(buf))))
            out.append("")
            out.append("@@BLOCK%d@@" % (len(blocks) - 1))
            out.append("")
            continue

        # Obsidian callout
        m = re.match(r"^\s*>\s*\[!(\w+)\]\s*(.*)$", line)
        if m:
            kind = m.group(1).lower()
            title = m.group(2).strip()
            i += 1
            buf = []
            while i < n and (lines[i].startswith(">") or lines[i].strip() == ""):
                if lines[i].strip() == "":
                    # 空行结束 callout（除非下一行仍是 > ）
                    if i + 1 < n and lines[i + 1].startswith(">"):
                        buf.append("")
                        i += 1
                        continue
                    break
                buf.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            blocks.append(("callout", (kind, title, "\n".join(buf).strip())))
            out.append("")
            out.append("@@BLOCK%d@@" % (len(blocks) - 1))
            out.append("")
            continue

        out.append(line)
        i += 1

    return "\n".join(out), blocks


def render_code(lang, code):
    label = LANG_LABEL.get(lang, lang.upper() if lang else "TEXT")
    try:
        lexer = get_lexer_by_name(lang, stripall=False)
    except ClassNotFound:
        try:
            lexer = guess_lexer(code)
        except ClassNotFound:
            lexer = TextLexer()
    body = highlight(code, lexer, HtmlFormatter(nowrap=True))
    return (
        '<div class="code-block">\n'
        '  <div class="code-head">\n'
        '    <span class="lang">%s</span>\n'
        '    <button class="copy" type="button">复制</button>\n'
        "  </div>\n"
        "  <pre><code>%s</code></pre>\n"
        "</div>" % (esc(label), body)
    )


def render_callout(kind, title, body_md):
    css, default_title = CALLOUTS.get(kind, ("NOTE", "说明"))
    inner = markdown.markdown(
        body_md, extensions=["extra", "sane_lists", "nl2br"]
    )
    label = title if title else default_title
    return (
        '<div class="callout callout-%s">\n'
        '  <div class="co-title">%s</div>\n'
        "  %s\n"
        "</div>" % (css.lower(), esc(label), inner)
    )


def md_to_html(text):
    text = convert_obsidian_assets(text)
    text, blocks = extract_blocks(text)

    body = markdown.markdown(
        text,
        extensions=["extra", "sane_lists", "tables", "attr_list", "footnotes"],
    )

    for idx, (kind, payload) in enumerate(blocks):
        if kind == "code":
            html_block = render_code(payload[0], payload[1])
        else:
            html_block = render_callout(payload[0], payload[1], payload[2])
        body = re.sub(
            r"<p>@@BLOCK%d@@</p>" % idx,
            lambda m: html_block,
            body,
        )

    return body


def add_heading_ids(body):
    """给 h2/h3/h4 加 id，并返回目录条目。"""
    toc = []
    counter = [0]

    def repl(m):
        level = int(m.group(1))
        inner = m.group(2)
        plain = re.sub(r"<[^>]+>", "", inner)
        plain = html.unescape(plain).strip()
        counter[0] += 1
        hid = slugify_heading(plain, counter[0])
        toc.append({"level": level, "id": hid, "text": plain})
        return '<h%d id="%s">%s</h%d>' % (level, hid, inner, level)

    body = re.sub(r"<h([234])>(.*?)</h\1>", repl, body, flags=re.S)
    return body, toc


def plain_text(body):
    t = re.sub(r"<[^>]+>", " ", body)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


# --------------------------------------------------------------------------
# 页面框架
# --------------------------------------------------------------------------
HEADER = """<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="{base}index.html">
      <span class="brand-mark">hb</span>
      <span>hackerbs<span class="brand-domain">.com</span></span>
    </a>

    <nav class="nav" id="site-nav">
      <a href="{base}index.html"{nav_index}>首页</a>
      <a href="{base}topics.html"{nav_topics}>专题</a>
      <a href="{base}archive.html"{nav_archive}>归档</a>
      <a href="{base}tags.html"{nav_tags}>标签</a>
      <a href="{base}search.html"{nav_search}>搜索</a>
      <a href="{base}about.html"{nav_about}>关于</a>
    </nav>

    <div class="header-tools">
      <button class="icon-btn" id="theme-toggle" type="button" aria-label="切换主题">
        <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
      <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="菜单">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>
<div class="reading-progress" id="reading-progress"></div>
"""

FOOTER = """<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-about">
        <h4>About</h4>
        <p>hackerbs = hacker brainstorm。记录数据中心、Linux、虚拟化与工程实践，把零散经验连成一张可复用的知识网络。</p>
      </div>
      <div>
        <h4>导航</h4>
        <ul>
          <li><a href="{base}index.html">首页</a></li>
          <li><a href="{base}topics.html">专题</a></li>
          <li><a href="{base}archive.html">归档</a></li>
          <li><a href="{base}tags.html">标签</a></li>
        </ul>
      </div>
      <div>
        <h4>分类</h4>
        <ul>
          <li><a href="{base}topics.html#os">操作系统</a></li>
          <li><a href="{base}topics.html#hardware">服务器硬件</a></li>
          <li><a href="{base}topics.html#storage">存储与可靠性</a></li>
          <li><a href="{base}topics.html#virtualization">虚拟化</a></li>
        </ul>
      </div>
      <div>
        <h4>链接</h4>
        <ul>
          <li><a href="https://github.com/1949hacker">GitHub</a></li>
          <li><a href="https://blog.hackerbs.com">旧博客</a></li>
          <li><a href="{base}about.html">联系我</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2022–2026 hackerbs.com · 探索知识的宇宙</span>
      <span>本站为纯静态站点，无追踪、无广告</span>
    </div>
  </div>
</footer>
<button class="to-top" id="to-top" type="button" aria-label="回到顶部">
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
"""


def page(title, description, body_html, nav="", extra_head="", wide=False, base=""):
    keys = ["index", "topics", "archive", "tags", "search", "about"]
    navmap = {k: "" for k in keys}
    if nav in navmap:
        navmap[nav] = ' class="is-active"'
    fmt = {"base": base}
    fmt.update({("nav_" + k): v for k, v in navmap.items()})
    header = HEADER.format(**fmt)
    footer = FOOTER.format(**fmt)
    container = "wrap" if wide else "wrap-narrow"
    return """<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%s</title>
  <meta name="description" content="%s">
  <meta name="author" content="hackerbs">
  <meta property="og:title" content="%s">
  <meta property="og:description" content="%s">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="%sassets/css/main.css">
  <link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%%3E%%3Crect width='32' height='32' rx='8' fill='%%2322d3ee'%%3E%%3C/rect%%3E%%3Ctext x='16' y='22' font-size='16' font-family='monospace' font-weight='bold' text-anchor='middle' fill='%%23061318'%%3Ehb%%3C/text%%3E%%3C/svg%%3E">
  %s
</head>
<body>
%s
<main>
  <div class="%s">
%s
  </div>
</main>
%s
<script src="%sassets/js/main.js"></script>
</body>
</html>
""" % (
        esc(title),
        esc(description),
        esc(title),
        esc(description),
        base,
        extra_head,
        header,
        container,
        body_html,
        footer,
        base,
    )


# --------------------------------------------------------------------------
# 生成
# --------------------------------------------------------------------------
def main():
    meta = json.loads(read(META))
    site = meta["site"]
    cats = {c["id"]: c for c in meta["categories"]}
    posts = meta["posts"]

    # 1. 读取并渲染每篇文章
    rendered = []
    for p in posts:
        src_path = os.path.join(SRC, p["slug"] + ".md")
        if not os.path.exists(src_path):
            print("!! 缺少源文件：%s" % src_path)
            continue
        raw = strip_front_matter(read(src_path))
        body, toc = add_heading_ids(md_to_html(raw))
        text = plain_text(body)
        p = dict(p)
        p["body"] = body
        p["toc"] = toc
        p["minutes"] = reading_minutes(text)
        p["words"] = len(text)
        p["url"] = "posts/%s.html" % p["slug"]
        rendered.append(p)

    # 2. 排序（归档用：时间倒序）
    by_date = sorted(rendered, key=lambda x: x["date"], reverse=True)

    # 3. 文章页
    for idx, p in enumerate(by_date):
        cat = cats.get(p["category"], {"name": p["category"], "desc": ""})
        toc_html = ""
        if len(p["toc"]) >= 3:
            items = []
            for t in p["toc"]:
                if t["level"] > 3:
                    continue
                cls = "toc-h%d" % t["level"]
                items.append(
                    '    <a class="%s" href="#%s">%s</a>'
                    % (cls, t["id"], esc(t["text"]))
                )
            if items:
                toc_html = (
                    '  <aside class="toc" id="toc">\n'
                    '    <div class="toc-title">目录</div>\n'
                    + "\n".join(items)
                    + "\n  </aside>"
                )

        # 上下篇（同分类优先）
        same = [x for x in by_date if x["category"] == p["category"]]
        seq = same if len(same) > 1 else by_date
        pos = seq.index(p)
        prev_p = seq[pos - 1] if pos > 0 else None
        next_p = seq[pos + 1] if pos < len(seq) - 1 else None

        nav_html = '<nav class="post-nav">'
        if prev_p:
            nav_html += (
                '  <a class="prev" href="%s"><span class="dir">上一篇</span>'
                '<span class="t">%s</span></a>' % (prev_p["slug"] + ".html", esc(prev_p["title"]))
            )
        else:
            nav_html += '  <span></span>'
        if next_p:
            nav_html += (
                '  <a class="next" href="%s"><span class="dir">下一篇</span>'
                '<span class="t">%s</span></a>' % (next_p["slug"] + ".html", esc(next_p["title"]))
            )
        nav_html += "</nav>"

        tags_html = "\n".join(
            '  <a class="tag" href="../tags.html#%s">#%s</a>'
            % (esc(t), esc(t))
            for t in p.get("tags", [])
        )

        article = """  <nav class="crumbs">
    <a href="../index.html">首页</a><span class="sep">/</span><a href="../topics.html#%s">%s</a>
  </nav>

  <article>
    <header class="article-head">
      <h1>%s</h1>
      <div class="meta-line">
        <span>%s</span><span class="dot"></span>
        <span>约 %d 分钟</span><span class="dot"></span>
        <span>%d 字</span>
      </div>
      <div class="summary-card">
        <strong>摘要</strong>%s
      </div>
    </header>

    <div class="prose">
%s
    </div>

    <div class="tag-row">
%s
    </div>

%s
  </article>""" % (
            p["category"],
            esc(cat["name"]),
            esc(p["title"]),
            p["date"],
            p["minutes"],
            p["words"],
            esc(p["summary"]),
            p["body"],
            tags_html,
            nav_html,
        )

        if toc_html:
            layout = '<div class="article-layout">\n<div>\n%s\n</div>\n%s\n</div>' % (
                article,
                toc_html,
            )
        else:
            layout = article

        title = "%s · hackerbs.com" % p["title"]
        write(
            os.path.join(POSTS, p["slug"] + ".html"),
            page(title, p["summary"], layout, nav="", base="../"),
        )

    # 4. 首页
    recent = by_date[:8]
    recent_html = "\n".join(
        '      <a class="post-row" href="%s">\n'
        '        <span class="date">%s</span>\n'
        '        <span class="title">%s<span class="desc">%s</span></span>\n'
        '        <span class="cat">%s</span>\n'
        "      </a>"
        % (
            p["url"],
            p["date"],
            esc(p["title"]),
            esc(p["summary"]),
            esc(cats.get(p["category"], {"name": ""})["name"]),
        )
        for p in recent
    )

    domain_html = ""
    for c in meta["categories"]:
        count = len([x for x in by_date if x["category"] == c["id"]])
        domain_html += (
            '      <a class="domain-card" href="topics.html#%s">\n'
            '        <span class="idx">%02d</span>\n'
            "        <h3>%s</h3>\n"
            "        <p>%s</p>\n"
            '        <span class="count">%d 篇</span>\n'
            "      </a>\n"
            % (c["id"], meta["categories"].index(c) + 1, esc(c["name"]), esc(c["desc"]), count)
        )

    essay_html = "\n".join(
        '      <a class="post-row" href="%s">\n'
        '        <span class="date">%s</span>\n'
        '        <span class="title">%s<span class="desc">%s</span></span>\n'
        '        <span class="cat">随笔</span>\n'
        "      </a>"
        % (p["url"], p["date"], esc(p["title"]), esc(p["summary"]))
        for p in by_date
        if p["category"] == "essays"
    )

    home = """    <section class="hero">
      <div class="hero-inner">
        <div>
          <p class="eyebrow">hacker brainstorm</p>
          <h1>把零散经验<span class="grad">连接成一张知识网</span></h1>
          <p class="hero-lede">这里记录数据中心、服务器硬件、存储、网络、Linux、虚拟化与工程实践。
            不是按时间堆砌的文章列表，而是一张可以顺着关系往前走的知识地图。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="topics.html">按专题浏览</a>
            <a class="btn btn-ghost" href="archive.html">查看全部归档</a>
          </div>
        </div>
        <div class="universe" aria-hidden="true">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-2"></div>
          <div class="orbit orbit-3"></div>
          <div class="core">CORE</div>
        </div>
      </div>
    </section>

    <section class="stat-strip">
      <div class="stat"><b>%d</b><span>篇文章</span></div>
      <div class="stat"><b>%d</b><span>个专题</span></div>
      <div class="stat"><b>%s</b><span>最早一篇</span></div>
      <div class="stat"><b>%s</b><span>最近更新</span></div>
    </section>

    <div class="section-head">
      <h2>知识专题</h2>
      <a class="more" href="topics.html">全部专题 →</a>
    </div>
    <section class="domain-grid">
%s    </section>

    <div class="section-head">
      <h2>最近更新</h2>
      <a class="more" href="archive.html">归档 →</a>
    </div>
    <section class="post-list">
%s
    </section>

    <div class="section-head">
      <h2>随笔与思想</h2>
      <a class="more" href="topics.html#essays">全部随笔 →</a>
    </div>
    <section class="post-list">
%s
    </section>""" % (
        len(by_date),
        len(meta["categories"]),
        min(p["date"] for p in by_date)[:4],
        max(p["date"] for p in by_date),
        domain_html,
        recent_html,
        essay_html,
    )

    write(
        os.path.join(ROOT, "index.html"),
        page(
            "hackerbs.com · 探索知识的宇宙",
            site["tagline"],
            home,
            nav="index",
            wide=True,
        ),
    )

    # 5. 归档页
    buckets = {}
    for p in by_date:
        buckets.setdefault(p["date"][:4], []).append(p)
    archive_html = ""
    for year in sorted(buckets, reverse=True):
        archive_html += '    <h2 class="archive-year">%s</h2>\n    <section class="post-list">\n' % year
        for p in buckets[year]:
            archive_html += (
                '      <a class="post-row" href="%s">\n'
                '        <span class="date">%s</span>\n'
                '        <span class="title">%s<span class="desc">%s</span></span>\n'
                '        <span class="cat">%s</span>\n'
                "      </a>\n"
                % (
                    p["url"],
                    p["date"][5:],
                    esc(p["title"]),
                    esc(p["summary"]),
                    esc(cats.get(p["category"], {"name": ""})["name"]),
                )
            )
        archive_html += "    </section>\n"

    archive = """    <div class="page-head">
      <p class="eyebrow">Archive</p>
      <h1>归档</h1>
      <p>共 %d 篇，按发布时间倒序排列。</p>
    </div>
%s""" % (
        len(by_date),
        archive_html,
    )
    write(
        os.path.join(ROOT, "archive.html"),
        page("归档 · hackerbs.com", "全部文章归档", archive, nav="archive", wide=True),
    )

    # 6. 专题页
    topics_html = ""
    for c in meta["categories"]:
        items = [p for p in by_date if p["category"] == c["id"]]
        if not items:
            continue
        rows = "\n".join(
            '      <a class="post-row" href="%s">\n'
            '        <span class="date">%s</span>\n'
            '        <span class="title">%s<span class="desc">%s</span></span>\n'
            '        <span class="cat">%s</span>\n'
            "      </a>"
            % (p["url"], p["date"], esc(p["title"]), esc(p["summary"]), esc(c["name"]))
            for p in items
        )
        topics_html += (
            '    <h2 class="archive-year" id="%s">%s · %d 篇</h2>\n'
            '    <p class="topic-desc">%s</p>\n'
            '    <section class="post-list">\n%s\n    </section>\n'
            % (c["id"], esc(c["name"]), len(items), esc(c["desc"]), rows)
        )

    topics = """    <div class="page-head">
      <p class="eyebrow">Topics</p>
      <h1>知识专题</h1>
      <p>按领域划分的全部内容。每个专题都是一个可以单独往下钻的入口。</p>
    </div>
%s""" % topics_html
    write(
        os.path.join(ROOT, "topics.html"),
        page("专题 · hackerbs.com", "按领域划分的知识专题", topics, nav="topics", wide=True),
    )

    # 7. 标签页
    tag_map = {}
    for p in by_date:
        for t in p.get("tags", []):
            tag_map.setdefault(t, []).append(p)
    cloud = "\n".join(
        '      <a class="tag" href="#%s">#%s<b>%d</b></a>' % (esc(t), esc(t), len(ps))
        for t, ps in sorted(tag_map.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    )
    tag_sections = ""
    for t, ps in sorted(tag_map.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        rows = "\n".join(
            '      <a class="post-row" href="%s">\n'
            '        <span class="date">%s</span>\n'
            '        <span class="title">%s<span class="desc">%s</span></span>\n'
            '        <span class="cat">%s</span>\n'
            "      </a>"
            % (
                p["url"],
                p["date"],
                esc(p["title"]),
                esc(p["summary"]),
                esc(cats.get(p["category"], {"name": ""})["name"]),
            )
            for p in sorted(ps, key=lambda x: x["date"], reverse=True)
        )
        tag_sections += (
            '    <h2 class="archive-year" id="%s">%s · %d 篇</h2>\n'
            '    <section class="post-list" style="margin-bottom:28px">\n%s\n    </section>\n'
            % (esc(t), esc(t), len(ps), rows)
        )

    tags_page = """    <div class="page-head">
      <p class="eyebrow">Tags</p>
      <h1>标签</h1>
      <p>共 %d 个标签，点开查看该标签下的全部文章。</p>
    </div>
    <div class="tag-cloud">
%s
    </div>
%s""" % (
        len(tag_map),
        cloud,
        tag_sections,
    )
    write(
        os.path.join(ROOT, "tags.html"),
        page("标签 · hackerbs.com", "全部标签", tags_page, nav="tags", wide=True),
    )

    # 8. 搜索页
    search_page = """    <div class="page-head">
      <p class="eyebrow">Search</p>
      <h1>搜索</h1>
      <p>在本地索引里检索标题、摘要、分类与标签。</p>
    </div>

    <div class="search-box">
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      </span>
      <input id="search-input" type="search" placeholder="例如：Proxmox、smartctl、LVM…" autocomplete="off">
    </div>

    <div class="result-list" id="search-results">
      <p class="empty">输入关键词开始搜索。</p>
    </div>"""
    write(
        os.path.join(ROOT, "search.html"),
        page("搜索 · hackerbs.com", "站内搜索", search_page, nav="search", wide=True),
    )

    # 9. 关于页
    about = """    <div class="page-head">
      <p class="eyebrow">About</p>
      <h1>关于与联系</h1>
      <p>hackerbs 是 hacker brainstorm 的缩写。</p>
    </div>

    <div class="prose">
      <h2 id="about-site">关于本站</h2>
      <p>这里是我的技术笔记与思考仓库，主题集中在数据中心、服务器硬件、存储可靠性、
        网络、Linux、虚拟化与工程自动化。文章大多来自真实排障与部署现场，
        写下来的目的很朴素：下次再遇到时能少走一遍弯路。</p>
      <p>本站是纯静态站点：没有构建步骤、没有后端、没有追踪脚本，
        每一个页面都是一个可以直接编辑的 HTML 文件。</p>

      <h2 id="about-value">关于价值</h2>
      <blockquote>
        <p>人生价值的体现从来就不是个体利益，人生的价值是集体利益。<br>
          人生的价值取决于你能为全人类带来什么。<br>
          而知识，就是全人类的瑰宝。</p>
      </blockquote>

      <h2 id="about-contact">联系方式</h2>
      <ul>
        <li>GitHub：<a href="https://github.com/1949hacker">github.com/1949hacker</a></li>
        <li>旧博客：<a href="https://blog.hackerbs.com">blog.hackerbs.com</a></li>
        <li>反馈表单：<a href="https://forms.gle/jge5a8Zn72AxVVBj8">Google Form</a></li>
      </ul>
      <p>数据中心与基础设施工程、系统架构实践、技术成长路径相关的问题都欢迎交流。</p>

      <h2 id="about-support">支持本站</h2>
      <p>内容长期免费开放。如果觉得有帮助，可以自愿支持服务器与域名成本，
        这不会影响任何内容的立场与质量。</p>
      <p>
        <img src="assets/img/support-qr-1.png" alt="收款码 1" loading="lazy">
        <img src="assets/img/support-qr-2.png" alt="收款码 2" loading="lazy">
        <img src="assets/img/support-qr-3.png" alt="收款码 3" loading="lazy">
      </p>
      <p>USDT TRC20：TEpxok72yidM8LLCZhh8s2BgR4QT8mNHB9</p>
    </div>"""
    write(
        os.path.join(ROOT, "about.html"),
        page("关于 · hackerbs.com", "关于本站与联系方式", about, nav="about"),
    )

    # 10. 404
    notfound = """    <div class="page-head">
      <p class="eyebrow">404</p>
      <h1>页面不存在</h1>
      <p>这个地址下没有内容，可能是链接过期了。</p>
    </div>
    <div class="hero-actions">
      <a class="btn btn-primary" href="index.html">回到首页</a>
      <a class="btn btn-ghost" href="archive.html">浏览归档</a>
    </div>"""
    write(
        os.path.join(ROOT, "404.html"),
        page("404 · hackerbs.com", "页面不存在", notfound),
    )

    # 11. 搜索索引
    index = [
        {
            "title": p["title"],
            "url": p["url"],
            "date": p["date"],
            "category": cats.get(p["category"], {"name": p["category"]})["name"],
            "tags": p.get("tags", []),
            "summary": p["summary"],
        }
        for p in by_date
    ]
    write(
        os.path.join(DATA, "search-index.json"),
        json.dumps(index, ensure_ascii=False, indent=1),
    )

    print("生成完成：%d 篇文章" % len(by_date))
    for p in by_date:
        print("  - %-28s %s  %4d字  %2d分钟" % (p["slug"], p["date"], p["words"], p["minutes"]))


if __name__ == "__main__":
    main()
