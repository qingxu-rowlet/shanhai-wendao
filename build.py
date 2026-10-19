# Build 山海问道 into one HTML file: shanhai.html (claude.ai artifact body) and index.html (standalone / GitHub Pages).
import os
here = os.path.dirname(os.path.abspath(__file__))
src = lambda f: open(os.path.join(here, 'src', f), encoding='utf-8').read()
js = '\n'.join(src(f) for f in ('data.js', 'player.js', 'engine.js', 'ui.js', 'social.js', 'music.js', 'boss.js', 'sect.js', 'mini.js', 'life.js', 'romance.js', 'mail.js', 'med.js', 'nav.js', 'saves.js', 'replay.js', 'dev.js', 'selftest.js', 'review.js'))
page = src('page.html').replace('__JS__', js)
open(os.path.join(here, 'shanhai.html'), 'w', encoding='utf-8').write(page)
HEAD = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
        '<meta name="theme-color" content="#1b2a1c"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="山海问道">'
        '<link rel="apple-touch-icon" href="icon.png"><link rel="icon" href="icon.png">'
        '</head><body>')
# Releases: `python build.py` writes the beta (beta/index.html) for review; `python build.py release` also updates the live game.
import sys
os.makedirs(os.path.join(here, 'beta'), exist_ok=True)
open(os.path.join(here, 'beta', 'index.html'), 'w', encoding='utf-8').write(HEAD.replace('href="icon.png"', 'href="../icon.png"').replace('<title>', '<title>') + page.replace('<title>山海问道</title>', '<title>山海问道 · 测试版</title>', 1).replace("'shanhai-wendao.slot'+i", "'shanhai-wendao-beta.slot'+i").replace("'shanhai-dev'","'shanhai-beta-dev'") + '</body></html>')
if 'release' in sys.argv:
    open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(HEAD + page + '</body></html>')
    print('released to index.html')
print('built', len(page), 'bytes')
