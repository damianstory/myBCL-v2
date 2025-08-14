# myBlueprint Career Launch Landing Page

A professional, mobile-responsive landing page for the myBlueprint Career Launch virtual career fair event on December 2nd.

## Project Overview

Single-page, high-converting landing page designed to capture email signups from school board leads and high school educators. Features a modern two-column layout with bento grid components and seamless Zoho API integration.

## Features

- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Two-Column Layout**: Professional content column with engaging image column
- **Bento Grid**: Interactive components with text content and video preview
- **Email Capture**: Zoho API integration with real-time validation
- **Accessibility**: WCAG AA compliant with full keyboard navigation
- **Performance**: Target <2s load time with optimized assets
- **Brand Compliant**: Exact myBlueprint colors, typography, and guidelines

## Technology Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Form API**: Zoho CRM integration
- **Typography**: Open Sans (primary), system font fallbacks
- **Performance**: WebP images with JPG fallbacks, critical CSS inlining

## Quick Start

1. **Clone/Download** the project files
2. **Start development server**:
   ```bash
   npm run dev
   # or
   python3 -m http.server 8080
   ```
3. **Open browser** to `http://localhost:8080`

## Project Structure

```
/
├── index.html              # Main landing page
├── styles/
│   ├── main.css           # Global styles and variables
│   ├── responsive.css     # Media queries
│   └── components/        # Component-specific styles
│       ├── hero.css       # Hero section
│       ├── bento-grid.css # Bento grid components
│       ├── email-form.css # Form styling
│       └── image-column.css # Image column
├── js/
│   ├── main.js            # Application entry point
│   ├── validation.js      # Form validation logic
│   └── components/        # Component modules
│       ├── form-handler.js    # Zoho API integration
│       ├── video-player.js    # Video interactions
│       └── bento-interactions.js # Bento grid UX
└── images/
    ├── logo.svg          # myBlueprint logo
    ├── bg-hero.webp      # Background image (optimized)
    └── bg-hero.jpg       # Background fallback
```

## Development

### Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Prepare for production deployment
- `npm run test` - Run form validation tests
- `npm run validate-html` - HTML validation
- `npm run check-a11y` - Accessibility audit

### CSS Architecture

- **CSS Variables**: Brand colors and consistent spacing
- **BEM Methodology**: Clean, maintainable class names
- **Component-based**: Modular styles for each section
- **Mobile-first**: Progressive enhancement approach

### JavaScript Modules

- **FormHandler**: Zoho API integration with retry logic
- **FormValidator**: Real-time email validation
- **VideoPlayer**: Bento grid video interactions
- **BentoInteractions**: Enhanced UX with hover effects
- **Main App**: Application lifecycle management

## Configuration

### Zoho API Setup

Update the API endpoint in `js/components/form-handler.js`:

```javascript
this.apiConfig = {
    endpoint: 'YOUR_ZOHO_FORMS_ENDPOINT',
    timeout: 10000,
    maxRetries: 3
};
```

### Analytics Integration

Add tracking code to `js/main.js` and component files:

```javascript
// Google Analytics
if (window.gtag) {
    window.gtag('event', 'email_signup', properties);
}
```

## Brand Guidelines

### Colors
- Primary Blue: `#0092FF`
- Navy: `#22224C`
- Light Blue: `#C6E7FF`
- Off White: `#F6F6FF`
- Neutrals: `#E5E9F1`, `#D9DFEA`, `#AAB7CB`, `#65738B`, `#485163`, `#252A33`

### Typography
- Primary: Open Sans (300, 500, 700, 800 weights)
- Fallback: System font stack

### Logo Usage
- Use provided SVG logo only
- Never distort or alter colors
- Maintain proper clear space

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard access with visible focus
- **Screen Reader Support**: ARIA labels and live regions
- **Color Contrast**: WCAG AA compliant ratios
- **Reduced Motion**: Respects user preferences
- **Skip Links**: Quick navigation for assistive technology

## Performance Optimization

- **Critical CSS**: Inlined in HTML head
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: `font-display: swap` for custom fonts
- **Lazy Loading**: Non-critical assets loaded on demand
- **Minification**: CSS and JS compressed for production

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## Deployment

1. **Test thoroughly** across browsers and devices
2. **Update Zoho API** credentials
3. **Optimize assets** (images, CSS, JS)
4. **Deploy to hosting** (Claude Code platform recommended)
5. **Test form submission** in production
6. **Monitor performance** and conversion rates

## Success Metrics

- **Primary**: Email conversion rate >25%
- **Performance**: Page load time <2s on mobile
- **Accessibility**: WCAG AA compliance
- **Quality**: 90+ PageSpeed score

## Support

For technical issues or questions:
- Review CLAUDE.md for detailed specifications
- Check design-specs.md for exact measurements
- Reference prd.md for business requirements

## License

Private/Proprietary - myBlueprint Internal Use Only