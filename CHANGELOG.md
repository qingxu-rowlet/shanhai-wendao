# 更新记录 · Changelog

每个版本先发布到**测试版** https://qingxu-rowlet.github.io/shanhai-wendao/beta/ ，审查通过后再更新到正式版 https://qingxu-rowlet.github.io/shanhai-wendao/ 。
每个审查点都有直达链接（见下方清单，或打开 `#review`）。发布前都会跑一遍自检：在链接后加 `#selftest`，游戏会自动玩完第一章并给出 ✓/✗ 报告（使用第 3 个存档位，结束后恢复）。

## v0.9.1（测试版）

### 改动
- **心动事件重做**：小棠、长歌换成大幅半身立绘，有 平常 / 微笑 / 脸红 / 难过 四种表情，会随台词变化。每个场景都加了道具和前景（药篓、荷叶、药庐、石桥河灯、竹林木桩、崖边松树、帐篷篝火……），「雨中药庐」中途会从山路切到药庐里。8 段对话都扩写到原来的两倍左右。
- **不会吃醋**：好感各自独立，可以和每个人都到 8 心。
- **信箱**：洞府门口新增信箱。好感 4 心以上的朋友偶尔会在清晨寄信和小礼物来，好感越高越常寄；有新信时信箱上出现红色「!」，早上的日卡也会提示。行囊 → 信件 也能打开。

### 修复
- 切换场景时两首曲子会重叠一阵：现在是淡出 / 淡入。
- 测完灵根后音乐乱、快几秒（在补播落下的音符）：现在直接从当前接着播。
- 修炼页去掉了残留的「体力上限」。

### 请重点审查
1. 心动事件（立绘、表情、场景）：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-cg-tang-2 · https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-cg-tang-6 （中途换景）· https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-cg-ge-4 · 其余 5 段在 https://qingxu-rowlet.github.io/shanhai-wendao/beta/#review
2. 信箱：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-mail
3. 换场景的音乐：随便走几张地图、打一场战斗、测一次灵根 https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-prologue
4. 自检：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#selftest

## v0.9

### 改动
- **移除种田**：灵田、锄头、水壶、种子、灵泉阵、播种傀儡全部移除；灵草、灵菇、朱果、野山茶改为采集（洞府前和山林里）。第一个主线改为「采一株灵草」。钱掌柜出售朱果。
- **移除体力和疾跑**：步行速度稍微加快（以后用坐骑提速）。
- 旧存档：自动清理种田道具，**退还**买种子 / 灵泉阵 / 傀儡花的灵石。
- **新 HUD**：左上角直接列出最多 3 个任务（主线 + 支线），点一下切换追踪，「寻路」一键前往；道具栏、生命 / 灵力条放大；电脑上 J 键打开全部任务。
- **互动提示**：靠近可以互动的人或物，头顶出现 E（手机上显示「聊 / 采 / 钓 / 点」）；按 E 直接和它互动。
- **手持鱼竿**：选中钓竿时角色拿着鱼竿；钓鱼时能看到鱼线和浮漂落在水面，咬钩时浮漂下沉。钓鱼面板改到屏幕下方，不再挡住画面。
- **配乐**：新写了三首古风曲子——桃源村庄（古筝 + 箫）、战斗（琵琶轮指 + 战鼓）、浪漫（箫 + 古筝分解和弦，心动事件使用）。修复 iPhone 上音乐不响（需要关闭静音开关）。
- **往事回廊**：行囊 → 往事，可以重温 测灵根 / 讨伐穷奇 / 筑基天劫 / 拜师大典 / 青丘狐影。回忆在存档副本里进行，结束后回到现在，不会影响存档。
- 鱼王稍微好钓一点。

### 修复
- iPhone 开着静音开关时听不到音乐：现在第一次点击画面后，静音模式下也能听到配乐。
- 右上角新增「♪ 音乐」开关，点一下就能开始 / 关闭音乐。
- 审查提示条收起后，顶部会留一个小按钮，点它重新展开。
- 战斗胜利后的半秒内还能放技能、白白消耗灵力。
- 在杂货铺买齐回春丹后，「备战穷奇」任务不会立刻完成（要换地图才触发）。
- 任务列表的「寻路」：补上了 J 键；新 HUD 上每个任务都能直接寻路。

### 请重点审查（点链接直接进入那个场景）
**审查总入口（所有节点一页列出）：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#review**

1. 序章节奏：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-prologue
2. 采灵草 → 打坐：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-gather
3. 左上任务列表（手机上是否挡视线、字够不够大）：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-hud
4. 互动提示 E：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-prompt
5. 三首新曲子：村庄 https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-music-village · 战斗 https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-music-battle · 浪漫 https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-music-romance
6. 手持鱼竿钓鱼：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-fish · 鱼王：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-fishking
7. 往事回廊（重温拜师大典选别的门派，结束后确认没变）：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-replay
8. 老存档退还灵石：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#t-oldsave
9. 自检（自动玩完一章，约 2 分钟）：https://qingxu-rowlet.github.io/shanhai-wendao/beta/#selftest

每个节点都用第 3 个存档位的测试角色，不会动你自己的存档；顶部的蓝色提示条写着「请检查什么」，还有「下一个」按钮可以按顺序走完。

## v0.8
- 图鉴三页、金光水面与山海经鱼王、心动事件 CG（每人 4 段）、随时存档与「测灵根前」重测、第一章流程重排（测灵根在序章，拜师在筑基后）、药王谷、顾长歌散修设定、开发者面板。
