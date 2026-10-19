# 山海问道 · Shan Hai Wen Dao

一款像素风的中式修仙小游戏：采集灵材、打坐修炼、炼丹、拜师入宗，和《山海经》里的妖兽交手。
A cozy pixel-art Chinese cultivation RPG inspired by Stardew Valley and 鬼谷八荒.

**立即游玩 / Play:** https://qingxu-rowlet.github.io/shanhai-wendao/

iPhone：用 Safari 打开链接，点「分享 → 添加到主屏幕」，就能像 App 一样全屏玩。

## 第一章 · 青丘狐影
- 序章测灵根（天灵根 / 双灵根 / 三灵根 / 伪灵根，可读「测灵根前」存档重测）
- 采集、打坐、炼丹（火候小游戏）、钓鱼（金光水面与山海经鱼王）、往事回廊（重温关键剧情）
- 讨伐穷奇 → 筑基（心魔 + 天劫）→ 拜师大典：青云剑宗 · 药王谷 · 万兽谷 · 天机阁
- 青丘狐影：九尾狐，降妖还是结缘？饕餮苏醒……
- 苏小棠与顾长歌的心动事件、支线任务、奇遇、图鉴收集

## 操作
- 手机：点哪里走到哪里，点人物或物体就能互动；点左上角任务的「寻路」自动前往
- 电脑：WASD 移动，E / 空格互动（靠近时头顶有提示），鼠标滚轮或 1–6 选道具，Esc 行囊，M 地图，J 任务
- 随时可以在「行囊 → 存档」存档、读档（战斗和小游戏中除外）

## 开发
`index.html` 就是完整的游戏。源码在 `src/`：
- `python build.py` 生成测试版 `beta/index.html`（测试版链接：https://qingxu-rowlet.github.io/shanhai-wendao/beta/ ）
- `python build.py release` 同时更新正式版 `index.html`
- 链接后加 `#selftest`：自动玩完第一章并给出 ✓/✗ 自检报告
- 链接后加 `#review`：所有审查节点一页列出；`#t-节点名`（如 `#t-qiongqi`）直接进入那个场景
- 每个版本的改动和审查清单见 [CHANGELOG.md](CHANGELOG.md)
在链接后加 `#dev`（或在标题画面连点「山海问道」5 次）可以打开开发者面板。

## 参与贡献
欢迎任何形式的贡献：修 bug、像素画、剧情、音乐、翻译、建议……请先看 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 版权与许可
© 2026 qingxu-rowlet。本游戏的代码、美术、音乐、剧情与角色均以 **[CC BY-NC-SA 4.0](LICENSE)** 发布：
- ✅ 可以学习、修改、分享，但必须**署名原作者**并附上本仓库链接
- 🚫 **禁止任何商业用途**（售卖、收费、上架付费平台、加广告等），商用请先联系作者授权
- 🔁 改编作品必须以**相同许可证**公开

《山海经》《左传》等古籍引文属于公有领域，不受本版权限制。
