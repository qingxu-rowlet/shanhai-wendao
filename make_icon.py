# Build icon.png (180x180) for the iPhone home screen: the nine-tailed fox on a moonlit ink-wash sky. No Pillow needed.
import re, zlib, struct, os
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'src', 'boss.js'), encoding='utf-8').read()
half = re.findall(r"'([.\w]{16})'", src[src.index('huli_big:['):src.index('taotie_big:[')])
art = [r + r[::-1] for r in half]
PAL = {'w': '#fffaf0', 'z': '#e8e0d0', 'p': '#f2a0b0', 'v': '#8b5bc5', 'k': '#2a1e1a', 'l': '#9fd3ef', 'r': '#c8413b', 'y': '#e8b84a'}
rgb = lambda h: [int(h[i:i+2], 16) for i in (1, 3, 5)]
S = 180
img = [[None]*S for _ in range(S)]
for y in range(S):  # sky gradient + moon
    t = y / S; top, bot = rgb('#141b3c'), rgb('#5a4a86')
    for x in range(S):
        c = [int(top[i]*(1-t)+bot[i]*t) for i in range(3)]
        d = ((x-138)**2 + (y-38)**2) ** .5
        if d < 18: c = rgb('#f6f0d6')
        elif d < 40: k = (40-d)/22*.35; c = [int(c[i]*(1-k)+246*k) for i in range(3)]
        img[y][x] = c
for x in range(S):  # ink hills
    import math
    for y in range(S):
        if y > 140 - 14*math.sin(x/30) - 6*math.sin(x/11): img[y][x] = [int(v*.55) for v in img[y][x]]
H, W = len(art), 32; cell = 4; ox, oy = (S - W*cell)//2, S - H*cell - 14
def filled(x, y): return 0 <= y < H and 0 <= x < W and art[y][x] != '.'
for y in range(-1, H+1):
    for x in range(-1, W+1):
        col = None
        if filled(x, y): col = rgb(PAL.get(art[y][x], '#ff00ff'))
        elif any(filled(x+dx, y+dy) for dx, dy in ((1,0),(-1,0),(0,1),(0,-1))): col = rgb('#2a1e1a')
        if col:
            for yy in range(cell):
                for xx in range(cell):
                    py, px = oy+y*cell+yy, ox+x*cell+xx
                    if 0 <= py < S and 0 <= px < S: img[py][px] = col
raw = b''.join(b'\0' + bytes(v for p in row for v in p) for row in img)
chunk = lambda t, d: struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
open(os.path.join(here, 'icon.png'), 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', S, S, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))
print('icon.png written')
