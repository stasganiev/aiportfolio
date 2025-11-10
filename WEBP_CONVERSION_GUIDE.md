# WebP Conversion Guide

## What is WebP?

WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web. It typically reduces file sizes by 25-35% compared to JPEG/PNG.

## Images to Convert

### Priority 1 (High Impact):
- `img/itsme2-cl.png` - Profile photo (1.3 MB)
- `img/cover.jpg` - Hero background
- `img/itsme.jpg`, `img/itsme2.jpg` - Alternative photos
- `img/temp.jpg` - Placeholder

### Priority 2 (Medium Impact):
- Project images: `img/pr-*.png`, `img/project-*.jpg`

### Priority 3 (Low Impact):
- Logo files (already small)

## Conversion Methods

### Method 1: Online Tools (Easiest)
1. [Squoosh.app](https://squoosh.app/) - Google's tool with visual comparison
2. [CloudConvert](https://cloudconvert.com/webp-converter)
3. [Online-Convert](https://image.online-convert.com/convert-to-webp)

**Steps:**
1. Upload image
2. Select WebP format
3. Adjust quality (recommended: 80-85)
4. Download converted file

### Method 2: Command Line Tools

#### Using cwebp (Official Google Tool)

**Install:**
```bash
# Windows (via Chocolatey)
choco install webp

# Or download from: https://developers.google.com/speed/webp/download
```

**Convert single file:**
```bash
cwebp -q 85 img/itsme2-cl.png -o img/itsme2-cl.webp
```

**Convert all images in directory:**
```powershell
# PowerShell
Get-ChildItem img\*.jpg,img\*.png | ForEach-Object {
    $outFile = $_.FullName -replace '\.(jpg|png)$', '.webp'
    cwebp -q 85 $_.FullName -o $outFile
    Write-Host "Converted: $($_.Name) -> $([System.IO.Path]::GetFileName($outFile))"
}
```

**Quality recommendations:**
- Photos: `-q 80-85` (good balance)
- Graphics/logos: `-q 90-95` (preserve sharpness)
- Thumbnails: `-q 70-75` (smaller files)

### Method 3: Photoshop/GIMP
1. Open image
2. Export As > WebP
3. Adjust quality slider
4. Save

## HTML Implementation

### Current (PNG only):
```html
<img src="./img/itsme2-cl.png" alt="Stas Ganiev">
```

### Updated (WebP with fallback):
```html
<picture>
    <source type="image/webp" srcset="./img/itsme2-cl.webp">
    <img src="./img/itsme2-cl.png" alt="Stas Ganiev">
</picture>
```

### With responsive sizes:
```html
<picture>
    <source 
        type="image/webp" 
        srcset="./img/itsme2-cl-mobile.webp 480w,
                ./img/itsme2-cl-tablet.webp 768w,
                ./img/itsme2-cl-desktop.webp 1200w"
        sizes="(max-width: 480px) 480px, 
               (max-width: 768px) 768px, 
               1200px">
    <source 
        srcset="./img/itsme2-cl-mobile.png 480w,
                ./img/itsme2-cl-tablet.png 768w,
                ./img/itsme2-cl-desktop.png 1200w"
        sizes="(max-width: 480px) 480px, 
               (max-width: 768px) 768px, 
               1200px">
    <img src="./img/itsme2-cl.png" alt="Stas Ganiev">
</picture>
```

## CSS Background Images

### Current:
```css
.hero {
    background-image: url('../img/cover.jpg');
}
```

### Updated (with fallback):
```css
.hero {
    background-image: url('../img/cover.jpg'); /* Fallback */
}

.webp .hero {
    background-image: url('../img/cover.webp');
}
```

### Add WebP detection script:
```javascript
// Add to main.js
(function() {
    var webP = new Image();
    webP.onload = webP.onerror = function() {
        if (webP.height === 2) {
            document.documentElement.classList.add('webp');
        }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
})();
```

## Verification

After conversion, verify:
1. ✅ File size reduced (target: 25-35% smaller)
2. ✅ Visual quality acceptable
3. ✅ Fallback images still present
4. ✅ Browser compatibility (all modern browsers support WebP)

## Browser Support

**Supported:**
- Chrome 23+ ✅
- Firefox 65+ ✅
- Edge 18+ ✅
- Safari 14+ ✅
- Opera 12.1+ ✅

**Not Supported:**
- Internet Explorer ❌
- Old Safari versions ❌

That's why we use `<picture>` tag with fallback!

## Expected Results

### Before:
```
img/itsme2-cl.png: 1,344 KB
img/cover.jpg: 850 KB
Total: ~2.2 MB
```

### After:
```
img/itsme2-cl.webp: 920 KB (-31%)
img/cover.webp: 580 KB (-32%)
Total: ~1.5 MB

Saved: 700 KB
```

## Automation Script

Save as `convert-to-webp.ps1`:
```powershell
# Convert all images to WebP
$quality = 85
$images = Get-ChildItem -Path "img" -Include "*.jpg","*.png" -Recurse

foreach ($image in $images) {
    $webpPath = $image.FullName -replace '\.(jpg|png)$', '.webp'
    
    if (-not (Test-Path $webpPath)) {
        Write-Host "Converting: $($image.Name)"
        & cwebp -q $quality $image.FullName -o $webpPath
    } else {
        Write-Host "Skipping (exists): $($image.Name)"
    }
}

Write-Host "`nConversion complete!"
```

Run: `.\convert-to-webp.ps1`

## Next Steps

1. Convert all images to WebP
2. Update HTML `<img>` tags to use `<picture>` tags
3. Add WebP detection for CSS backgrounds
4. Test in multiple browsers
5. Measure performance improvements
