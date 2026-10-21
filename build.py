# Build 山海问道 into one HTML file: shanhai.html (claude.ai artifact body) and index.html (standalone / GitHub Pages).
import os
here = os.path.dirname(os.path.abspath(__file__))
src = lambda f: open(os.path.join(here, 'src', f), encoding='utf-8').read()
js = '\n'.join(src(f) for f in ('data.js', 'player.js', 'engine.js', 'art.js', 'ui.js', 'social.js', 'music.js', 'boss.js', 'dodge.js', 'sect.js', 'mini.js', 'qiyu.js', 'life.js', 'romance.js', 'mail.js', 'bounty.js', 'inkbg.js', 'pixcg.js', 'chibi.js', 'med.js', 'dungeon.js', 'guide.js', 'beasts2.js', 'nav.js', 'saves.js', 'replay.js', 'dev.js', 'selftest.js', 'review.js'))
page = src('page.html').replace('__JS__', js)
open(os.path.join(here, 'shanhai.html'), 'w', encoding='utf-8').write(page)
HEAD = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
        '<meta name="theme-color" content="#1b2a1c"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="山海问道">'
        '<link rel="apple-touch-icon" href="icon.png"><link rel="icon" href="icon.png">'
        '</head><body>')
# GitHub Pages lets browsers keep a page for 10 minutes. Each build gets an id; on startup the page fetches the
# newest copy, and if its id differs it reloads itself with ?v=<id> so friends always get the latest version.
import hashlib
BUILD = hashlib.md5(page.encode('utf-8')).hexdigest()[:10]
FRESH = ('<meta name="build" data-build="%s"><script>(function(){var B="%s";try{fetch(location.pathname+"?fresh="+Date.now(),{cache:"no-store"})'
         '.then(function(r){return r.text()}).then(function(t){var m=t.match(/data-build="([0-9a-f]+)"/);if(!m||m[1]===B)return;var u=new URL(location.href);'
         'if(u.searchParams.get("v")===m[1])return;u.searchParams.set("v",m[1]);location.replace(u.href)}).catch(function(){})}catch(e){}})();</script>') % (BUILD, BUILD)
HEAD = HEAD.replace('</head>', FRESH + '</head>')
# Releases: `python build.py` writes the beta (beta/index.html) for review; `python build.py release` also updates the live game.
import sys
os.makedirs(os.path.join(here, 'beta'), exist_ok=True)
open(os.path.join(here, 'beta', 'index.html'), 'w', encoding='utf-8').write(HEAD.replace('href="icon.png"', 'href="../icon.png"').replace('<title>', '<title>') + page.replace('<title>山海问道</title>', '<title>山海问道 · 测试版</title>', 1).replace("'shanhai-wendao.slot'+i", "'shanhai-wendao-beta.slot'+i").replace("'shanhai-dev'","'shanhai-beta-dev'") + '</body></html>')
if 'release' in sys.argv:
    open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(HEAD + page + '</body></html>')
    print('released to index.html')
print('built', len(page), 'bytes')
