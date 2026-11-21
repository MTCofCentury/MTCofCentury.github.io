# 太阳系首页

中英文首页共用 `solar.css`、`solar.js` 和 `guestbook.js`；开场黑洞及原来的全站样式未修改。

映射：about → 太阳，zhuangzi → 水星，stardust → 金星，school-memories → 地球，essays → 火星，future → 木星，saturn / uranus / neptune 为三个空白板块。文史哲拆出后共有六个内容板块，故剩余三个空白。

默认 `window.onSelectSection(sectionId)` 平滑滚动到对应板块。可预先定义同名函数替换导航；另会派发 `sectionselect` 自定义事件，`event.detail.sectionId` 提供选中的板块 ID。键盘 Tab 聚焦天体暂停公转，Enter / Space 选择。小于 768px 使用垂直轨道列表，减少动态效果偏好下关闭公转和平滑过渡。

## 接通留言

留言为私密投递给站主，不公开昵称和正文。没有使用 localStorage 冒充网络保存。

1. 按 `VOTING-SETUP.md` 配好已有 Cloudflare Worker / D1 和允许的前端来源。
2. 在 D1 控制台执行 `backend/messages.sql`，新增留言表，不更改投票表。
3. 部署更新后的 `backend/worker.mjs`。
4. 在 `vote-config.js` 填入 Worker 的 HTTPS origin。留言与投票共用该地址，留言提交到 `/messages`。
5. 在 D1 控制台通过 `SELECT nickname, message, created_at FROM messages ORDER BY id DESC;` 查看。删除某条记录使用其 id，勿将留言导出到公开仓库。

接口限制 JSON 请求大小、昵称和留言长度、要求同意保存，并通过提交令牌避免网络重试重复写入。生产环境如出现垃圾留言，可在 Cloudflare 加入限流或人机验证。当前本地工程没有后台地址或部署凭证，因此没有部署或写入线上数据库。

运行 `node backend/worker.test.mjs` 和 `node backend/messages.test.mjs` 验证接口。使用 `python -m http.server 4173` 可预览两个首页。

## 星体摄影背景

八大行星使用 `assets/planets/` 中的 WebP 背景，完整生成提示词保存在 `assets/planets/PROMPTS.md`。素材通过内置 image_gen 生成，八张合计约 528 KiB。`solar.js` 为每个行星内容板块创建独立场景容器；背景使用 sticky 定位，长内容滚动时保持比例，不纵向拉伸。`solar.css` 控制手机裁切和局部文字底层。木星和海王星通过 CSS 水平翻转，将亮部放在右侧，给左侧标题留出空间。太阳保留现有程序化表面，黑洞不变。
