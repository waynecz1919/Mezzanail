# Mezzanail 首页视觉审计（重构前）

审计日期：2026-07-27
范围：`/` 首页、共享 Header/Footer、首页设计 Token 与首页交互事件
基线截图：`docs/screenshots/homepage-before-production-1536x1024.png`

## 1. 当前首页 Section 顺序

1. Anniversary announcement bar
2. Header（两层桌面导航）
3. Current Campaign Banner
4. Services icon grid
5. Purpose / Vision / Promise
6. 重复 Anniversary campaign section
7. Nail work gallery
8. Our Story
9. Membership app download
10. Google Reviews CTA
11. Contact panel
12. Footer

## 2. 当前颜色

- 主背景：`#F8F3E9`
- 次级背景：`#F1E9DC`
- 深色文字：`#312E39`
- 金色强调：`#B38B4D`
- 深棕品牌区：`#3D2A20`
- 现状问题：金色与深棕承担过多品牌表达；酒红没有形成稳定主色，活动海报的粉色与正文系统割裂。

## 3. 当前字体

- 正文：Manrope
- 英文展示字体：Bodoni Moda / Georgia fallback
- 中文：依赖通用 sans fallback
- 现状问题：中文与英文展示字体规则不够明确；首页 section 标题跨度过大，层级更接近广告落地页而非精品画廊。

## 4. 当前按钮类型

- 金色实心 `.btn-gold`
- 深色实心 `.btn-dark`
- 透明描边 `.btn-ghost`
- Header 独立矩形 Book Now
- 现状问题：圆角、颜色与用途不统一；相邻 section 出现多个同级 CTA，首要转化不够清楚。

## 5. 当前重复内容

- 顶部 announcement、Campaign Banner 与中段 Anniversary section 重复活动日期、周年信息与行动按钮。
- Booking、Contact、浮动 WhatsApp 与底部移动导航重复预约入口。
- Purpose / Vision / Promise 与 Our Story 同时承担品牌价值说明。
- Membership app download 在首页与 Rewards/会员入口重复解释。

## 6. 当前移动端问题

- Campaign 缺少独立竖版素材；完整桌面海报缩放后文字阅读压力较大。
- Services 使用同构纵向条目，视觉节奏不足。
- Gallery 在移动端改为单列长页面，不能提示横向探索。
- 固定底部导航、浮动 WhatsApp 与页面 CTA 同时存在，容易争夺注意力。
- Header 高度与多层级信息使首屏可用空间缩小。

## 7. 当前可复用组件

- `components/marketing/CampaignBanner.tsx`：已包含 `<picture>`、优先加载与 `campaign_banner_click`。
- `components/official-site.tsx`：Header、Footer、语言切换、共享页面框架。
- `components/providers.tsx`：英语、中文、马来语切换。
- `components/hyperframe/motion.tsx`：轻量 reveal 动效，可继续用于非首页页面。
- `lib/site.ts`：预约、WhatsApp、Google Maps、社交平台、地址和营业时间的单一资料源。
- `public/gallery/*`：现有美甲作品图可作为首页画廊与服务视觉。
- Deferred Google Analytics、LocalBusiness JSON-LD、现有 metadata 与 booking link 均应保留。

## 8. 本次重构范围

- 建立奶油暖白、酒红、裸粉与香槟金 Design Tokens，并保留旧 token 别名供其他页面兼容。
- 将桌面导航精简为 Home、Services、Membership、Offers、Our Story、Contact、Book Now；Jobs 保留在 Footer。
- 保留单一可配置 Campaign Banner，删除首页重复周年 section。
- 新建并配置化 Signature Services、Selected Nail Work、Why Mezzanail、Google Reviews、Membership Banner、Studio Location & Booking。
- 首页最终顺序：Navigation → Campaign → Services → Nail Work → Why → Reviews → Membership → Studio → Footer。
- 保留原 Services 资料与价格、Promotion 规则、Rewards 功能、Job 流程、预约链接、Analytics、API 与数据库。

## 审计限制

- 截图可确认可见层级、间距与首屏信息密度，不能单独证明完整键盘操作、读屏器行为或 WCAG 合规。
- 当前 Campaign 只有桌面源图；本次不裁切海报文字或奖品。独立 4:5 手机素材需要品牌方提供可编辑源图后再补。
- Google 评分与评价采用公开列表快照；实时总评价数量不硬编码，以避免首页长期显示过期数据。
