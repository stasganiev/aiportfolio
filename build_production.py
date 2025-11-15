#!/usr/bin/env python3
"""
Production Build Script for Portfolio Website
Minifies CSS and JavaScript files for deployment
"""

import os
import re
import sys
from pathlib import Path

def minify_css(css_content):
    """Basic CSS minification"""
    # Remove comments
    css_content = re.sub(r'/\*[\s\S]*?\*/', '', css_content)
    # Remove whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    # Remove spaces around punctuation
    css_content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css_content)
    # Remove last semicolon in blocks
    css_content = re.sub(r';}', '}', css_content)
    return css_content.strip()

def minify_js(js_content):
    """Basic JavaScript minification"""
    # Remove single-line comments (but not URLs)
    js_content = re.sub(r'(?<!:)//.*$', '', js_content, flags=re.MULTILINE)
    # Remove multi-line comments
    js_content = re.sub(r'/\*[\s\S]*?\*/', '', js_content)
    # Remove extra whitespace
    js_content = re.sub(r'\s+', ' ', js_content)
    # Remove whitespace around operators and punctuation
    js_content = re.sub(r'\s*([{}();,:])\s*', r'\1', js_content)
    return js_content.strip()

def build_production():
    """Build production version of the website"""
    
    print("🚀 Starting production build...\n")
    
    # Create dist directory
    dist_dir = Path('dist')
    dist_dir.mkdir(exist_ok=True)
    
    css_dir = Path('css')
    js_dir = Path('js')
    
    dist_css_dir = dist_dir / 'css'
    dist_js_dir = dist_dir / 'js'
    
    dist_css_dir.mkdir(exist_ok=True)
    dist_js_dir.mkdir(exist_ok=True)
    
    # Process CSS files
    print("📦 Minifying CSS files...")
    css_files = list(css_dir.glob('*.css'))
    total_css_original = 0
    total_css_minified = 0
    
    for css_file in css_files:
        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()
            original_size = len(content)
            total_css_original += original_size
            
        minified = minify_css(content)
        minified_size = len(minified)
        total_css_minified += minified_size
        
        output_file = dist_css_dir / css_file.name
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        reduction = ((original_size - minified_size) / original_size) * 100
        print(f"  ✓ {css_file.name}: {original_size:,} → {minified_size:,} bytes ({reduction:.1f}% smaller)")
    
    # Process JavaScript files
    print("\n📦 Minifying JavaScript files...")
    js_files = list(js_dir.glob('*.js'))
    total_js_original = 0
    total_js_minified = 0
    
    for js_file in js_files:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
            original_size = len(content)
            total_js_original += original_size
            
        minified = minify_js(content)
        minified_size = len(minified)
        total_js_minified += minified_size
        
        output_file = dist_js_dir / js_file.name
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        reduction = ((original_size - minified_size) / original_size) * 100
        print(f"  ✓ {js_file.name}: {original_size:,} → {minified_size:,} bytes ({reduction:.1f}% smaller)")
    
    # Copy HTML file
    print("\n📄 Copying HTML file...")
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Update paths to use dist folders
    html_content = html_content.replace('href="./css/', 'href="./dist/css/')
    html_content = html_content.replace('src="./js/', 'src="./dist/js/')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("  ✓ index.html updated with production paths")
    
    # Copy 404.html if exists
    if Path('404.html').exists():
        print("\n📄 Processing 404.html...")
        with open('404.html', 'r', encoding='utf-8') as f:
            content = f.read()
        with open('404.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("  ✓ 404.html ready")
    
    # Summary
    print("\n" + "="*60)
    print("✅ Production build complete!\n")
    print(f"CSS:  {total_css_original:,} → {total_css_minified:,} bytes "
          f"({((total_css_original - total_css_minified) / total_css_original * 100):.1f}% reduction)")
    print(f"JS:   {total_js_original:,} → {total_js_minified:,} bytes "
          f"({((total_js_original - total_js_minified) / total_js_original * 100):.1f}% reduction)")
    print(f"\nTotal saved: {(total_css_original + total_js_original - total_css_minified - total_js_minified):,} bytes")
    print("="*60)
    print("\n🚀 Ready for deployment to GitHub Pages!")
    print("   Run: git add . && git commit -m 'Production build' && git push")

if __name__ == '__main__':
    try:
        build_production()
    except Exception as e:
        print(f"\n❌ Error during build: {e}", file=sys.stderr)
        sys.exit(1)
