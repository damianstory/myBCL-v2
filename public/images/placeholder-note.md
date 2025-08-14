# Image Assets Required

## Background Images Needed

### Hero Background Image
- **Filename**: `bg-hero.webp` (primary), `bg-hero.jpg` (fallback)
- **Dimensions**: Minimum 1200x800px (landscape orientation)
- **Content**: Professional diverse group in career/work settings
- **Style**: Modern, aspirational, inclusive
- **Optimization**: Under 400KB for WebP, under 600KB for JPG
- **Usage**: Right column background in two-column layout

### Logo Assets
- **Current**: SVG placeholder created
- **Needed**: Official myBlueprint logo in SVG format
- **Specifications**: Vectorized, scalable, brand-compliant colors

### Favicon
- **Needed**: favicon.ico, favicon.png, favicon.svg
- **Sizes**: 16x16, 32x32, 48x48, 180x180 (Apple touch icon)

## Image Optimization Checklist

- [ ] Convert images to WebP format for modern browsers
- [ ] Maintain JPG/PNG fallbacks for compatibility
- [ ] Compress images to target file sizes
- [ ] Test across different screen densities
- [ ] Validate alt text for accessibility
- [ ] Ensure proper aspect ratios for responsive display

## Implementation

Once images are available:

1. Replace `images/logo.svg` with official myBlueprint logo
2. Add `images/bg-hero.webp` and `images/bg-hero.jpg`
3. Add favicon files to root directory
4. Update `index.html` with proper image paths
5. Test image loading and responsiveness
6. Validate accessibility with proper alt text

The current implementation includes proper `<picture>` elements and responsive image handling, ready for production images.