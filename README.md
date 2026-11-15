# Tiancheng Ma · A Small Personal Universe

马天成的个人网站。英语为主，庄子部分中文，另有少量德语。前台使用 HTML/CSS/JavaScript，无需构建，适合 GitHub Pages；私人投票记录使用独立的 Cloudflare Worker + D1 后台。

## 预览

直接打开 `index.html`，或者在此目录运行 `python -m http.server 4173`，访问 http://localhost:4173 。Google Fonts 需要联网；无法加载时使用系统字体。黑洞是 CSS 艺术表现，不是物理模拟。

## 发布到 GitHub Pages

网站仓库：https://github.com/MTCofCentury/MTCofCentury.github.io 。仓库已创建。本次学校记忆长文尚未上传；GitHub 连接确认只有读取权限（push: false）。

1. 在 GitHub 创建公开仓库。个人主页推荐命名为 `MTCofCentury.github.io`（若使用其他账号，请替换用户名）。已有同名仓库则先检查其内容，不要覆盖现有网站。
2. 将 `index.html`、`school-memories.html`、`style.css`、`script.js`、`vote.js`、`vote-config.js`、`PHOTO-GUIDE.html`、`.nojekyll` 和整个 `assets` 文件夹放到仓库根目录，提交到 `main` 分支。不要只上传一个包含这些文件的外层文件夹。
3. 打开仓库 **Settings → Pages → Build and deployment**，将 Source 设为 **Deploy from a branch**，选择 **main** 和 **/(root)**，点击 Save。
4. 等待部署成功。上述个人主页仓库的地址是 `https://MTCofCentury.github.io/`。若仓库叫 `tiancheng`，对应地址是 `https://MTCofCentury.github.io/tiancheng/`。这些是配置后的预期地址，尚未验证上线。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 换照片

把你的照片导出为 JPEG，命名为 `portrait.jpg`，放入 `assets` 文件夹并提交。建议 800 × 1000 像素、2 MB 以内。网站会自动读取它。不要仅把 PNG/HEIC 的扩展名改成 jpg。详细操作见 `PHOTO-GUIDE.html`。

投票现支持自愿填写姓名或昵称，仅站主在私人后台查看。必须按 `VOTING-SETUP.md` 配置后台后才会开放提交；未配置时按钮禁用。

## 内容修改

- 个人简介、庄子随笔、座右铭：`index.html`
- 颜色、版式、响应式布局：`style.css`
- 照片预览和互动：`script.js`
- 头像：`assets/portrait.jpg`

中文座右铭润色稿：“我对美好事物的热爱如此深沉，仿佛越过事件视界，自此再无归途。”网页采用英文文学表达。

庄子部分使用《齐物论》《人间世》《秋水》《知北游》的原文引句，配三幅水墨插图及本页英文译文；“天地与我并生”作为纯文字开篇，篇名链接可查原文。图片点击可放大，中文文字版可展开阅读。没有添加未提供的大学、专业或学历。星尘说明区分了恒星形成的碳、氧和源于大爆炸的氢，并在页面中链接 NASA 科普出处。



## 私人投票记录

开通后台、查看名单和删除记录的步骤见 [VOTING-SETUP.md](VOTING-SETUP.md)。不要将真实投票记录、数据库导出文件或账号密钥上传到公开仓库。

## 学校时期的记忆

故事入口在 `index.html` 的 `SCHOOL MEMORIES START` 区域，全文在 `school-memories.html`。编辑、添加故事和更新网站的步骤见 [EDITING-STORIES.md](EDITING-STORIES.md)。

学校记忆全文现放在 `school-memories.html`；首页 `index.html` 只放文章入口与摘要。修改步骤以 `EDITING-STORIES.md` 为准。

学校记忆长文为 **The Thirteenth Floor**，正文 **7,878 个英文单词，13 章**，约 40 分钟阅读。更新包为 `School-Memories-Update.zip`；请以根目录文件为后续编辑来源。
