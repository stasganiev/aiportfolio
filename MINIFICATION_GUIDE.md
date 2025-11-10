# Minification Guide

## CSS Minification

For production deployment, minify CSS files using online tools or build tools:

### Option 1: Online Tools
- [CSS Minifier](https://cssminifier.com/)
- [Toptal CSS Minifier](https://www.toptal.com/developers/cssminifier)

### Option 2: NPM Packages
```bash
# Install cssnano
npm install -g cssnano-cli

# Minify all CSS files
cssnano css/style.css css/style.min.css
cssnano css/timeline.css css/timeline.min.css
cssnano css/articles.css css/articles.min.css
cssnano css/achievements.css css/achievements.min.css
cssnano css/funfacts.css css/funfacts.min.css
```

### Option 3: Using postcss-cli
```bash
npm install -g postcss-cli cssnano

# Minify files
postcss css/*.css --use cssnano --dir css --ext .min.css
```

## JavaScript Minification

### Option 1: Online Tools
- [JavaScript Minifier](https://javascript-minifier.com/)
- [Toptal JS Minifier](https://www.toptal.com/developers/javascript-minifier)

### Option 2: Terser (Recommended)
```bash
npm install -g terser

# Minify JS files
terser js/main.js -o js/main.min.js -c -m
terser js/animations.js -o js/animations.min.js -c -m
terser js/contact.js -o js/contact.min.js -c -m
terser js/timeline.js -o js/timeline.min.js -c -m
terser js/articles.js -o js/articles.min.js -c -m
terser js/achievements.js -o js/achievements.min.js -c -m
terser js/funfacts.js -o js/funfacts.min.js -c -m
```

## Batch Processing

### Windows PowerShell
```powershell
# CSS
Get-ChildItem css\*.css | ForEach-Object {
    if ($_.Name -notlike "*.min.css") {
        $outFile = $_.FullName -replace '\.css$', '.min.css'
        Write-Host "Minifying $($_.Name)..."
        # Use online tool or npm package here
    }
}

# JS
Get-ChildItem js\*.js | ForEach-Object {
    if ($_.Name -notlike "*.min.js") {
        $outFile = $_.FullName -replace '\.js$', '.min.js'
        Write-Host "Minifying $($_.Name)..."
        # Use online tool or npm package here
    }
}
```

## Update HTML to Use Minified Files

After minification, update `index.html`:

```html
<!-- Development -->
<link href="./css/style.css" rel="stylesheet">

<!-- Production -->
<link href="./css/style.min.css" rel="stylesheet">
```

## Expected Savings

Typical minification results:
- CSS: 20-30% size reduction
- JavaScript: 30-50% size reduction

## Automation

For continuous deployment, add to your build pipeline:
```json
{
  "scripts": {
    "minify:css": "postcss css/*.css --use cssnano --dir css --ext .min.css",
    "minify:js": "terser js/*.js --compress --mangle --output-dir js --name-cache js/.name-cache",
    "minify": "npm run minify:css && npm run minify:js"
  }
}
```
