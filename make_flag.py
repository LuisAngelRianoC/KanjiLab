"""
Genera public/icono.jpg: la bandera de Mexico rasterizada con la misma
geometria que public/flag-mx.svg, sin bordes ni marco.

Uso: python make_flag.py
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1400, 1000          # lienzo final (proporcion 7:4, como el SVG)
S = W / 700                # factor de escala del SVG (700x500) al lienzo
CX, CY = W / 2, H / 2      # centro del escudo en el lienzo final

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "icono.jpg")

GREEN = (0, 104, 71)
WHITE = (255, 255, 255)
RED = (206, 17, 38)
EAGLE_TOP = (185, 138, 78)
EAGLE_BOT = (110, 74, 34)
CACTUS_TOP = (62, 142, 78)
CACTUS_BOT = (31, 92, 49)
SERP_TOP = (87, 168, 104)
SERP_BOT = (44, 107, 58)
LEAF = (44, 107, 58)
ACORN = (138, 106, 47)
BEAK = (200, 164, 92)
ROCK_D = (122, 106, 86)
ROCK_L = (154, 138, 112)
RIBBON = (200, 16, 46)
RIBBON_HI = (226, 58, 78)
GOLD = (245, 215, 110)

img = Image.new("RGB", (W, H), WHITE)
d = ImageDraw.Draw(img)


def sc(pts):
    """Escala un punto del sistema del SVG (origen en el centro del escudo)."""
    return [(CX + x * S, CY + y * S) for x, y in pts]


def bezier(p0, p1, p2, p3, n=48):
    """Aplana una curva cubica de Bezier en una polilinea."""
    out = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
        out.append((x, y))
    return out


def path(segments):
    """Construye una polilinea a partir de segmentos cubicos."""
    pts = []
    for seg in segments:
        pts.extend(bezier(*seg))
    return pts


def fill_path(pts, color, outline=None, width=0):
    d.polygon(sc(pts), fill=color, outline=outline)
    if outline and width:
        d.line(sc(pts) + sc(pts)[:1], fill=outline, width=width, joint="curve")


def stroke_path(pts, color, width):
    d.line(sc(pts), fill=color, width=max(1, int(width * S)), joint="curve")


def rot_ellipse(cx, cy, rx, ry, angle, color):
    """Elipse rotada (Pillow no la rota de forma nativa)."""
    pad = int(max(rx, ry) * 2) + 4
    layer = Image.new("RGBA", (pad * 2, pad * 2), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse([pad - rx * S, pad - ry * S, pad + rx * S, pad + ry * S], fill=color)
    layer = layer.rotate(angle, resample=Image.BICUBIC)
    img.paste(layer, (int(CX + cx * S - pad), int(CY + cy * S - pad)), layer)


def circle(cx, cy, r, color):
    d.ellipse(
        [CX + (cx - r) * S, CY + (cy - r) * S, CX + (cx + r) * S, CY + (cy + r) * S],
        fill=color,
    )


# ── Bandas verticales ────────────────────────────────────────────────────────
band = W / 3
d.rectangle([0, 0, band, H], fill=GREEN)
d.rectangle([band, 0, 2 * band, H], fill=WHITE)
d.rectangle([2 * band, 0, W, H], fill=RED)

# ── Corona de laurel y roble ────────────────────────────────────────────────
for sign in (-1, 1):
    stem = path(
        [
            ((sign * 62, 100), (sign * 116, 58), (sign * 120, -22), (sign * 64, -92)),
        ]
    )
    stroke_path(stem, LEAF, 5)

    leaves = [
        (72, 86, 17, 8, -46),
        (92, 58, 17, 8, -30),
        (104, 26, 17, 8, -16),
        (107, -8, 17, 8, -4),
        (100, -42, 16, 8, 12),
        (84, -72, 15, 7, 28),
    ]
    for lx, ly, rx, ry, ang in leaves:
        rot_ellipse(sign * lx, ly, rx, ry, ang, LEAF)

    for ax, ay in ((86, 72), (108, 38), (112, 0)):
        circle(sign * ax, ay, 5.5, ACORN)

# ── Nopal (cactus) y roca ───────────────────────────────────────────────────
rot_ellipse(-40, 46, 24, 19, -18, CACTUS_TOP)
rot_ellipse(40, 42, 24, 19, 18, CACTUS_TOP)
fill_path([(-26, 96), (-26, 62), (-18, 46), (-6, 44), (6, 42), (16, 54), (16, 80), (16, 96)], CACTUS_TOP)

d.ellipse(
    [CX - 44 * S, CY + 88 * S, CX + 44 * S, CY + 108 * S], fill=ROCK_D
)
d.ellipse(
    [CX - 36 * S, CY + 88 * S, CX + 36 * S, CY + 102 * S], fill=ROCK_L
)

# ── Aguila ──────────────────────────────────────────────────────────────────
fill_path([(-18, 22), (-26, 68), (-11, 60), (-4, 72), (4, 60), (14, 68), (18, 22)], EAGLE_BOT)

for sign in (-1, 1):
    wing = path(
        [
            ((sign * 5, -8), (sign * 28, -36), (sign * 60, -50), (sign * 94, -44)),
            ((sign * 94, -44), (sign * 66, -28), (sign * 52, -8), (sign * 46, 12)),
            ((sign * 46, 12), (sign * 32, 0), (sign * 17, -2), (sign * 5, -8)),
        ]
    )
    fill_path(wing, EAGLE_TOP)

    for feathers in (
        [(13, -10), (32, -22), (56, -30), (80, -32)],
        [(19, 0), (36, -8), (54, -14), (70, -16)],
        [(25, 10), (38, 6), (52, 2), (64, -2)],
    ):
        pts = path([(tuple(sign * v for v in p) for p in feathers)])
        stroke_path(pts, (94, 61, 26), 2)

d.ellipse([CX - 19 * S, CY - 30 * S, CX + 19 * S, CY + 30 * S], fill=EAGLE_TOP)
circle(-1, -32, 14, EAGLE_TOP)
fill_path([(-10, -35), (-24, -40), (-27, -29), (-12, -27)], BEAK)
circle(5, -36, 3.2, (36, 23, 8))

fill_path([(-16, 26), (-32, 44), (-23, 46), (-12, 32)], BEAK)
fill_path([(16, 26), (32, 44), (23, 46), (12, 32)], BEAK)

# ── Serpiente en el pico ────────────────────────────────────────────────────
serpent = path(
    [
        ((-16, -38), (-34, -48), (-40, -30), (-28, -23)),
        ((-28, -23), (-17, -16), (-8, -28), (-19, -21)),
        ((-19, -21), (-32, -13), (-25, 2), (-12, -3)),
    ]
)
stroke_path(serpent, SERP_TOP, 8)
circle(-12, -3, 5.5, SERP_BOT)

# ── Liston ──────────────────────────────────────────────────────────────────
scroll = path(
    [
        ((-78, 106), (-42, 120), (42, 120), (78, 106)),
        ((78, 106), (78, 124), (42, 138), (-42, 138)),
        ((-42, 138), (-42, 124), (-78, 106), (-78, 106)),
    ]
)
fill_path(scroll, RIBBON)
highlight = path(
    [
        ((-78, 106), (-42, 120), (42, 120), (78, 106)),
        ((78, 106), (78, 113), (42, 127), (-42, 127)),
        ((-42, 127), (-42, 113), (-78, 106), (-78, 106)),
    ]
)
fill_path(highlight, RIBBON_HI)

try:
    font = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", int(11 * S))
except OSError:
    font = ImageFont.load_default()

text = "PATRIA ES LIBERTAD"
tb = d.textbbox((0, 0), text, font=font)
d.text(
    (CX - (tb[2] - tb[0]) / 2 - tb[0], CY + 126 * S - tb[3]),
    text,
    font=font,
    fill=GOLD,
)

img.save(OUT, "JPEG", quality=92, optimize=True, progressive=True)
print("escrito", OUT, os.path.getsize(OUT), "bytes", img.size)
