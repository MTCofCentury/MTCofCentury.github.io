# Tiancheng Ma · A Small Personal Universe

马天成的个人网站。英语为主，庄子部分中文，另有少量德语。纯 HTML/CSS/JavaScript，无需安装依赖或构建，适合 GitHub Pages。

## 预览

直接打开 `index.html`，或者在此目录运行 `python -m http.server 4173`，访问 http://localhost:4173 。Google Fonts 需要联网；无法加载时使用系统字体。黑洞是 CSS 艺术表现，不是物理模拟。

## 发布到 GitHub Pages

网站仓库：https://github.com/MTCofCentury/MTCofCentury.github.io 。仓库已创建；当前 GitHub 工具连接只有读取权限（push: false），网站尚未上传或发布。

1. 在 GitHub 创建公开仓库。个人主页推荐命名为 `MTCofCentury.github.io`（若使用其他账号，请替换用户名）。已有同名仓库则先检查其内容，不要覆盖现有网站。
2. 将 `index.html`、`style.css`、`script.js`、`PHOTO-GUIDE.html`、`.nojekyll` 和整个 `assets` 文件夹放到仓库根目录，提交到 `main` 分支。不要只上传一个包含这些文件的外层文件夹。
3. 打开仓库 **Settings → Pages → Build and deployment**，将 Source 设为 **Deploy from a branch**，选择 **main** 和 **/(root)**，点击 Save。
4. 等待部署成功。上述个人主页仓库的地址是 `https://MTCofCentury.github.io/`。若仓库叫 `tiancheng`，对应地址是 `https://MTCofCentury.github.io/tiancheng/`。这些是配置后的预期地址，尚未验证上线。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 换照片

把你的照片导出为 JPEG，命名为 `portrait.jpg`，放入 `assets` 文件夹并提交。建议 800 × 1000 像素、2 MB 以内。网站会自动读取它。不要仅把 PNG/HEIC 的扩展名改成 jpg。详细操作见 `PHOTO-GUIDE.html`。

“Try a portrait” 仅用于当前标签页预览，刷新后消失，不会上传照片。Vote 按钮仅作幽默互动，不记录或统计投票。

## 内容修改

- 个人简介、庄子随笔、座右铭：`index.html`
- 颜色、版式、响应式布局：`style.css`
- 照片预览和互动：`script.js`
- 头像：`assets/portrait.jpg`

中文座右铭润色稿：“我对美好事物的热爱如此深沉，仿佛越过事件视界，自此再无归途。”网页采用英文文学表达。

庄子部分是原创个人化读后感，未冒充古籍引文；没有添加未提供的大学、专业或学历。星尘说明区分了恒星形成的碳、氧和源于大爆炸的氢，并在页面中链接 NASA 科普出处。


