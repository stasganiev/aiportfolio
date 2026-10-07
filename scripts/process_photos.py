"""Готовит фото сайта как единую серию.

Исходники лежат в work/photos_original/ (в репозиторий не попадают).
Результат пишется в src/assets/photos/: одинаковые пропорции, общий тон,
размер под вёрстку. Форматы AVIF и WebP делает сборка сайта.

Запуск из корня репозитория: python scripts/process_photos.py
"""

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "work" / "photos_original"
OUT = ROOT / "src" / "assets" / "photos"

# имя результата: (исходник, рамка обрезки (left, top, right, bottom), итоговый размер)
JOBS = {
    "portrait.jpg": ("portrait-studio.jpg", (12, 0, 1079, 1334), (880, 1100)),
    "portrait-face.jpg": ("portrait-studio.jpg", (370, 60, 830, 520), (360, 360)),
    "stage.jpg": ("stage-belgrade-2026.jpg", (17, 0, 721, 880), (704, 880)),
    "avacha.jpg": ("avacha-3.jpg", (0, 0, 1280, 853), (1200, 800)),
    "bachata.jpg": ("bachata-2014.jpg", (0, 40, 1280, 893), (1200, 800)),
    "photo-contest.jpg": ("photo-contest.jpg", (0, 0, 1280, 853), (1200, 800)),
}

WARM = (245, 233, 208)  # тёплый оттенок бумаги
WARM_SHARE = 0.05
SATURATION = 0.92
CONTRAST = 1.04


def grade(image: Image.Image) -> Image.Image:
    """Общий тон серии: чуть меньше насыщенности, лёгкое тепло."""
    image = ImageEnhance.Color(image).enhance(SATURATION)
    image = ImageEnhance.Contrast(image).enhance(CONTRAST)
    return Image.blend(image, Image.new("RGB", image.size, WARM), WARM_SHARE)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (source, box, size) in JOBS.items():
        image = Image.open(SRC / source).convert("RGB").crop(box)
        image = grade(image.resize(size, Image.LANCZOS))
        image.save(OUT / name, quality=86, optimize=True, progressive=True)
        print(f"{name}: {size[0]}x{size[1]}")

    # Заглушка для кадров, которых пока нет: файл Стаса, без обработки.
    placeholder = SRC / "placeholder.jpg"
    (OUT / "placeholder.jpg").write_bytes(placeholder.read_bytes())
    print("placeholder.jpg: скопирован")


if __name__ == "__main__":
    main()
