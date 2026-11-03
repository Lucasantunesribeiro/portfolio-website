"""
Monta um mockup na cena de mesa usada no portfólio (iMac + iPhone + caneca, 1024x636).

Uso (Python 3 com numpy e opencv-python-headless):
    pip install numpy opencv-python-headless
    node scripts/capture-demos.mjs parallel            # gera demos/parallel-store-{desktop,mobile}.png
    python3 scripts/compose_mockup.py demos/parallel-store-desktop.png \
        demos/parallel-store-mobile.png public/assets/parallel_store_mockup.webp

Como funciona: os mockups jpg já publicados compartilham a mesma cena e só mudam
o que aparece nas telas. O desvio padrão pixel a pixel entre eles dá a máscara de
cada tela (monitor e celular); cantos arredondados, moldura e dynamic island ficam
fora da máscara e são preservados. O print de desktop (1440x900) é encaixado no
quadrilátero do monitor com perspectiva; o de celular (390x844) cobre a tela do
iPhone pela largura, abaixo de uma barra de status com a cor do topo da página.
"""
import os
import sys

import cv2
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ASSETS = os.path.join(ROOT, 'public', 'assets')
# Mockups originais da cena (todos 1024x636). O primeiro serve de fundo.
SCENE = [
    'linkguardiao_mockup.jpg', 'armazem_sao_joaquim_mockup.jpg', 'article_summarizer_mockup.jpg',
    'collabdocs_mockup.jpg', 'nfe_estoque_mockup.jpg', 'sistema_pedidos_distribuido_mockup.jpg',
    'smartfinance_mockup.jpg', 'tenant_core_mockup.jpg',
]
# Cantos da tela do monitor (sup. esq., sup. dir., inf. dir., inf. esq.), medidos na máscara.
MONITOR_QUAD = [[323, 70], [707.5, 95], [707.5, 356.5], [325.5, 381.5]]


def screen_masks(ims):
    std = ims.std(axis=0).max(axis=2)
    m = (std > 35).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    _, lab, stats, _ = cv2.connectedComponentsWithStats(m, connectivity=4)
    order = np.argsort(-stats[1:, 4]) + 1
    a, b = (lab == order[0]), (lab == order[1])
    # o celular é a componente mais estreita
    return (a, b) if stats[order[0], 2] > stats[order[1], 2] else (b, a)


def soft(mask):
    m = cv2.dilate(mask.astype(np.uint8), np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    return np.clip(cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.7), 0, 1)[..., None]


def main(desktop, mobile, out):
    ims = np.stack([cv2.imread(os.path.join(ASSETS, f)).astype(np.float32) for f in SCENE])
    base = ims[0]
    h, w = base.shape[:2]
    mon, ph = screen_masks(ims)

    # Monitor: reduz com INTER_AREA para perto do tamanho final e aplica a perspectiva.
    d = cv2.imread(desktop, cv2.IMREAD_COLOR)
    f = min(1.0, 600 / d.shape[1])
    d = cv2.resize(d, (int(d.shape[1] * f), int(d.shape[0] * f)), interpolation=cv2.INTER_AREA)
    src = np.float32([[0, 0], [d.shape[1], 0], [d.shape[1], d.shape[0]], [0, d.shape[0]]])
    mx = cv2.getPerspectiveTransform(src, np.float32(MONITOR_QUAD))
    wd = cv2.warpPerspective(d.astype(np.float32), mx, (w, h), borderMode=cv2.BORDER_REPLICATE)

    # Celular: cobre pela largura, com barra de status (~47 de 844 pt) na cor do topo.
    ys, xs = np.nonzero(ph)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
    pad = 2
    tw, need = x1 - x0 + 1 + 2 * pad, y1 - y0 + 1 + 2 * pad
    m = cv2.imread(mobile, cv2.IMREAD_COLOR)
    m = cv2.resize(m, (tw, int(round(m.shape[0] * tw / m.shape[1]))), interpolation=cv2.INTER_AREA).astype(np.float32)
    bar = int(round((y1 - y0 + 1) * 47 / 844))
    m = np.vstack([np.repeat(m[:1], bar, axis=0), m])
    if m.shape[0] < need:
        m = cv2.copyMakeBorder(m, 0, need - m.shape[0], 0, 0, cv2.BORDER_REPLICATE)
    wm = np.zeros_like(base)
    wm[y0 - pad:y0 - pad + need, x0 - pad:x0 - pad + tw] = m[:need]

    # Tela "fotografada": leve perda de contraste e nitidez, como nos mockups existentes.
    wd = cv2.GaussianBlur(wd, (0, 0), 0.35) * 0.95 + 6
    wm = cv2.GaussianBlur(wm, (0, 0), 0.35) * 0.95 + 6
    am, ap = soft(mon), soft(ph)
    img = base * (1 - am) + wd * am
    img = img * (1 - ap) + wm * ap
    # Reflexo diagonal discreto da janela no monitor.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    glare = np.clip(1 - np.abs((xx - 0.55 * yy) - 560) / 120, 0, 1) ** 2 * 10
    img = np.clip(img + glare[..., None] * am, 0, 255).astype(np.uint8)

    ext = os.path.splitext(out)[1].lower()
    params = {'.webp': [cv2.IMWRITE_WEBP_QUALITY, 86], '.jpg': [cv2.IMWRITE_JPEG_QUALITY, 90]}.get(ext, [])
    cv2.imwrite(out, img, params)
    print(f'OK -> {out} ({w}x{h})')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:4])
