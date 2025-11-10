#!/usr/bin/env python3
"""
Simple CSS/JS Minifier for Portfolio Site
Removes comments, whitespace, and unnecessary characters
"""

import re
import os
from pathlib import Path

def minify_css(content):
    """Minify CSS content"""
    # Remove comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Remove whitespace
    content = re.sub(r'\s+', ' ', content)
    # Remove spaces around special characters
    content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', content)
    # Remove trailing semicolons
    content = re.sub(r';}', '}', content)
    return content.strip()

def minify_js(content):
    """Minify JavaScript content (basic)"""
    # Remove single-line comments (but keep URLs)
    content = re.sub(r'(?<!:)//.*$', '', content, flags=re.MULTILINE)
    # Remove multi-line comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Remove excessive whitespace
    content = re.sub(r'\s+', ' ', content)
    # Remove spaces around operators
    content = re.sub(r'\s*([{}:;,=<>!+\-*/%&|()[\]])\s*', r'\1', content)
    return content.strip()

def process_files(source_dir, output_dir, file_extension, minify_func):
    """Process all files with given extension"""
    source_path = Path(source_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    processed = []
    for file in source_path.glob(f'*.{file_extension}'):
        # Skip already minified files
        if '.min.' in file.name:
            continue
            
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        minified = minify_func(content)
        
        # Create output filename
        output_file = output_path / f"{file.stem}.min.{file_extension}"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        original_size = len(content)
        minified_size = len(minified)
        reduction = ((original_size - minified_size) / original_size * 100)
        
        processed.append({
            'file': file.name,
            'original': original_size,
            'minified': minified_size,
            'reduction': reduction
        })
        
        print(f"✓ {file.name} → {output_file.name}")
        print(f"  Size: {original_size:,} → {minified_size:,} bytes ({reduction:.1f}% reduction)")
    
    return processed

if __name__ == '__main__':
    print("🚀 Minifying CSS and JS files...\n")
    
    # Minify CSS
    print("📦 CSS Files:")
    css_results = process_files('css', 'css', 'css', minify_css)
    
    print("\n📦 JavaScript Files:")
    js_results = process_files('js', 'js', 'js', minify_js)
    
    print("\n" + "="*50)
    print("✅ Minification Complete!")
    print(f"   CSS files: {len(css_results)}")
    print(f"   JS files: {len(js_results)}")
    
    if css_results:
        total_css_reduction = sum(r['original'] - r['minified'] for r in css_results)
        print(f"   Total CSS saved: {total_css_reduction:,} bytes")
    
    if js_results:
        total_js_reduction = sum(r['original'] - r['minified'] for r in js_results)
        print(f"   Total JS saved: {total_js_reduction:,} bytes")
