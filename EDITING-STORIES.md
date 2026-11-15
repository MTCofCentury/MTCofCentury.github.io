# 如何修改「学校时期的记忆」

## 只改文章正文：编辑 school-memories.html

源文件是 `D:\TianchengWeb\school-memories.html`。用 VS Code 或记事本打开，按 **Ctrl+F** 搜索 `STORY TEXT START`。

这个注释与 `STORY TEXT END` 之间就是全文。一对 `<p>...</p>` 是一个段落，只改其中的英文即可：

```html
<p>I think it was 2016. I was fourteen.</p>
```

新增段落，另起一行写：

```html
<p>Your next memory goes here.</p>
```

文章分为 13 章，每章是一个 `<section class="story-chapter">...</section>`。章节标题使用 `<h2 id="chapter-01">...</h2>`；只改标题文字，保留 `id`，目录链接就仍然有效。如果新增章节，也在页面上方 `reading-contents` 目录中添加对应链接。正文不需要 JavaScript。

保存为 **UTF-8**，再双击根目录的 `school-memories.html`，用浏览器阅读。保存本地文件不会自动改变线上网站。

## 修改标题、摘要与版式

- **文章大标题**：在 `school-memories.html` 搜索 `EDIT TITLE BELOW`，修改下面 `<h1 id="story-title">...</h1>` 的文字。保留 `id`。
- **浏览器标签标题**：修改同一文件开头的 `<title>...</title>`。
- **搜索结果摘要**：修改 `<meta name="description" content="...">` 中的 `content`。
- **首页板块标题、文章链接标题和摘要**：编辑 `index.html`，搜索 `SCHOOL MEMORIES START`。首页只放入口和摘要，全文单独放在文章页。
- **字号、行距、阅读宽度**：编辑 `style.css`，搜索 `Long-form school memories`，调整 `.reading-prose` 等样式。

请保留 HTML 标签，文字里的 `&` 写成 `&amp;`，`<` 写成 `&lt;`，属性双引号里的引号写成 `&quot;`。

## 本次文章说明

本次长文标题为 **The Thirteenth Floor**，正文共 **7,878 个英文单词、13 章**，预计阅读约 40 分钟。它依据你提供的经历，加入环境细描、短句对白、教育与成功叙事的讽刺、自嘲和克制的忧伤。对白、建筑细节、部分动作和讽刺性评论者属于文学重构，可按实际记忆修改。

修改正文后，如果字数变化较大，也修改页面顶部 `reading-byline` 中的字数与阅读时长，以及首页链接旁的 `40 min`。这些数字是静态文字，不会自动重算。

没有推断 Feng 离校后的生活或他父亲的最终结局；没有补写篮球受伤的具体医学诊断或手术原因；一团、二团只作为当年听到的地名，不作历史来源解释。文章开头和文末有英文说明，区分个人记忆与文学重构。

## 更新 GitHub 上的网站

这次主要上传并替换：

1. `school-memories.html` — 7,878 词英文长文与章节目录。
2. `index.html` — 首页文章标题与摘要。
3. `style.css` — 新增目录、章节标题和打印样式，本次需一并更新。

也可以解压 `School-Memories-Update.zip`，取其中的网页文件上传到仓库根目录。不要把 ZIP 本身当网页上传，也不要在外面再包一层文件夹。

以后只改正文，一般只需更新 `school-memories.html`。如果改了标题，也同步更新 `index.html` 的链接文字。

仓库：https://github.com/MTCofCentury/MTCofCentury.github.io

在 GitHub 打开文件，点击铅笔图标，修改后点击 **Commit changes**。等 Pages 部署完成，再刷新网站查看。你也可以把修改后的同名文件重新上传并提交。

## 添加下一篇故事

1. 复制 `school-memories.html`，命名为 `school-memory-02.html`。
2. 在新文件中修改 `<title>`、页面描述、大标题、编号和正文。
3. 在 `index.html` 的学校记忆板块内，复制一段完整的 `<article class="school-story">...</article>`。
4. 将新入口的编号改为 `02`，标题和摘要换成新文章内容，将两处 `href="school-memories.html"` 改为 `href="school-memory-02.html"`。
5. 给新入口的标题设置不同的 id，例如 `story-02-title`，并把外层 article 的 `aria-labelledby` 同步改成 `story-02-title`。
6. 同时上传新文章文件和更新后的首页。

## 避免改错副本

请始终编辑 `D:\TianchengWeb` 根目录里的文件。`Tiancheng-Website` 子文件夹是此前解压的副本，不会自动同步。压缩包也是生成时的快照，修改源文件后不会自动更新包内内容。

## 旧稿备份

本次修改前的短稿已保存在根目录的 `.local-backups` 文件夹，文件名以 `school-memories-before-longform-` 开头。这个文件夹只作本地备份，不包含在上传包中。正文仍以根目录 `school-memories.html` 为唯一编辑来源。

## 发表文史哲随笔

中英文首页都链接到 `essays.html`。编辑这一个文件即可更新栏目。首次发表时，删除“第一篇随笔尚未发表。”所在的整个段落。把下面的文章格式复制到“在此处添加新文章”注释下方，填写标题、发表日期和正文。短想法可以只写一段，长文可以继续添加段落或用 `<h3>` 分节。

```html
<article>
  <h2>文章标题</h2>
  <p class="reading-byline"><time datetime="2026-11-15">2026 年 11 月 15 日</time></p>
  <p>第一段正文。</p>
  <p>第二段正文。</p>
</article>
```

每次将新文章放在上一篇的前面，再将更新后的文件提交到网站仓库。
