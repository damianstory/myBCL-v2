# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# myBlueprint Career Launch Landing Page

## Project Overview
Single-page, mobile-responsive landing page for the "myBlueprint Career Launch" virtual career fair event (December 2nd). Primary goal: email capture for agenda release notifications. Target audience: school board leads and high school educators.

## Key Reference Documents
- **@prd.md**: Complete Product Requirements Document with business objectives, user stories, and technical requirements
- **@design-specs.md**: Detailed design specifications including exact measurements, colors, typography scales, component specs, and responsive breakpoints

Always reference these documents for detailed specifications, measurements, and requirements.

## Technology Stack
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Backend**: Serverless functions (Vercel)
- **Deployment**: Vercel (serverless platform)
- **Form Integration**: Zoho API for email capture
- **Typography**: Museo Sans (primary), Open Sans (fallback)
- **Images**: WebP with JPG fallbacks, optimized for performance

## Key Commands
- `node test-server.js`: Start local development server with serverless function testing
- `npx vercel dev`: Start Vercel development server (alternative local testing)
- `npx vercel deploy`: Deploy to Vercel staging environment
- `npx vercel deploy --prod`: Deploy to production
- `npm run build`: Build and optimize for production (currently placeholder)
- `npm run test`: Run form validation tests (currently placeholder)
- `npm run validate-html`: HTML validation (currently placeholder) 
- `npm run check-a11y`: Accessibility audit (currently placeholder)

## Architecture Overview

### Serverless Architecture
The application uses a serverless architecture for maximum reliability and zero maintenance:
- **Static Files**: HTML, CSS, JS served via Vercel's global CDN
- **API Endpoint**: `/api/email-capture.js` runs as a serverless function
- **Form Integration**: Zoho Campaigns API integration with OAuth token refresh
- **Auto-scaling**: Scales from 0 to millions of requests automatically
- **Zero Downtime**: No servers to crash or restart

### Application Structure
The application follows a component-based architecture with a main application class (`MyBlueprintCareerLaunch`) that manages:
- Component initialization and lifecycle
- Accessibility features and keyboard navigation
- Performance monitoring and error tracking
- Progressive enhancement patterns

### CSS Architecture
- **Component-based styling**: Each major component has its own CSS file
- **CSS variables**: Centralized brand colors and design tokens in `styles/main.css`
- **Mobile-first responsive**: Progressive enhancement with breakpoints at 768px, 1024px, 1440px
- **Above-the-fold optimization**: Layout designed to fit within 100vh without scrolling

### JavaScript Module Pattern
- **Main App** (`js/main.js`): Application lifecycle, accessibility, performance tracking
- **Component Modules**: Individual modules for form handling, video interactions, bento grid UX
- **Progressive Enhancement**: Critical functionality works without JavaScript; enhancements layer on top

### Layout System
- **Two-column desktop layout**: Content column (left) + Image column (right) using CSS Grid
- **Single-column mobile layout**: Image above content, stacked vertically
- **Content flow**: Logo → Hero content → Bento grid → Email form
- **Space distribution**: Uses `justify-content: space-between` to fill 100vh precisely

## File Structure
```
/
├── index.html                    # Main landing page with inline critical CSS
├── api/
│   └── email-capture.js         # Vercel serverless function for email capture
├── vercel.json                  # Vercel deployment configuration
├── styles/
│   ├── main.css                 # Global styles, CSS variables, responsive rules
│   ├── museo-sans.css           # Custom font loading
│   ├── responsive.css           # Additional responsive styles
│   └── components/              # Component-specific styles
│       ├── hero.css             # Hero section styling
│       ├── bento-grid.css       # Bento grid components
│       ├── email-form.css       # Form styling and states
│       └── image-column.css     # Background image column
├── js/
│   ├── main.js                  # Main application class and initialization
│   ├── validation.js            # Form validation utilities
│   └── components/              # Component JavaScript modules
│       ├── form-handler.js      # Form handler (calls serverless API)
│       ├── video-player.js      # Video placeholder interactions
│       └── bento-interactions.js # Bento grid enhancements
├── images/
│   ├── logo.svg                 # myBlueprint logo
│   └── placeholder-note.md      # Notes about missing hero images
├── fonts/
│   └── museo-sans/              # Custom font files
├── server.js                    # Legacy Express server (kept for reference)
└── .env                         # Environment variables for local development
```

## Brand Guidelines (CRITICAL)
- **Colors**: Use ONLY myBlueprint brand colors from CSS variables
  - Primary Blue: #0092FF
  - Navy: #22224C  
  - Light Blue: #C6E7FF
  - Off White: #F6F6FF
  - Neutrals: #E5E9F1, #D9DFEA, #AAB7CB, #65738B, #485163, #252A33
- **Typography**: Museo Sans (900/700/500/300 weights), Open Sans fallback
- **Logo**: Use proper myBlueprint logo, never distort or alter colors
- **Contrast**: Maintain WCAG AA compliance (minimum 4.5:1 ratio)

## Layout & Spacing Requirements
- **Above-the-fold constraint**: All content must fit within 100vh without scrolling
- **Content column spacing**: Uses reduced padding (30-40px) and tight gaps (16-20px)
- **Component spacing**: Bento grid margin of 8px, reduced form padding
- **Responsive adjustments**: Consistent spacing reductions across all breakpoints

## Form Integration Specs
- Single email input field with validation
- Integrate with Zoho API (credentials will be provided)
- Client-side validation: email format, required field
- Server-side validation and error handling
- Success state with confirmation message
- Loading states during submission
- NEVER use localStorage or sessionStorage (not supported in Claude.ai environment)

## Bento Grid Requirements
- Two stacked boxes in content column between hero text and form
- Top box: Text content with heading and description
- Bottom box: Video container with play button overlay
- Fully responsive design across all breakpoints
- Interactive hover effects and accessibility features

## Responsive Breakpoints
```css
Mobile: 320px - 767px
Tablet: 768px - 1023px  
Desktop: 1024px+
Large: 1440px+
```

## Accessibility Implementation
- Semantic HTML structure with proper headings hierarchy
- Form labels properly associated with inputs
- Keyboard navigation support (tab order: logo → email → submit)
- Skip links for keyboard users
- Focus management with focus-visible polyfill
- Screen reader announcements via live regions
- High contrast and reduced motion detection

## Performance Requirements
- Target <2s load time on mobile
- Critical CSS inlined in HTML head
- Font loading with `font-display: swap`
- Lazy loading for non-critical assets
- Performance monitoring via PerformanceObserver API

## Development Notes
- Test form submission thoroughly before deployment
- Verify brand compliance against provided style guide
- Above-the-fold layout must not require scrolling on standard desktop resolutions
- Use `python3 -m http.server` on different ports if default conflicts
- All JavaScript components use progressive enhancement patterns
- Error tracking and performance metrics built into main application

## Deployment Instructions

### Environment Variables (Required for Production)
Set these in Vercel dashboard under Project Settings → Environment Variables:
- `ZOHO_CAMPAIGNS_CLIENT_ID`: Your Zoho OAuth client ID
- `ZOHO_CAMPAIGNS_CLIENT_SECRET`: Your Zoho OAuth client secret  
- `ZOHO_CAMPAIGNS_REFRESH_TOKEN`: Your Zoho OAuth refresh token
- `ZOHO_CAMPAIGNS_LIST_KEY`: Your Zoho Campaigns list key

### Deploy to Production
1. **Connect Repository**: Link your Git repo to Vercel
2. **Set Environment Variables**: Add Zoho credentials in Vercel dashboard
3. **Deploy**: Push to main branch for automatic deployment
4. **Custom Domain**: Add your domain in Vercel project settings (optional)

### Manual Deployment
```bash
# Deploy to staging
npx vercel deploy

# Deploy to production
npx vercel deploy --prod
```

## Important Constraints
- NO external CSS/JS frameworks (Bootstrap, Tailwind, jQuery, etc.)
- NO localStorage/sessionStorage usage
- NO complex animations that impact performance
- MUST maintain exact brand colors and typography
- MUST be fully functional without JavaScript as fallback
- MUST work on all modern browsers and mobile devices
- Layout MUST fit within 100vh without scrolling (above-the-fold requirement)

## Success Metrics
- Primary: Email conversion rate >25%
- Secondary: Page load time <2s on mobile
- Accessibility: WCAG AA compliant
- Performance: 90+ PageSpeed score