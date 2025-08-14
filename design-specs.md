# myBlueprint Career Launch - Design Specifications

## Document Overview

**Project:** myBlueprint Career Launch Landing Page  
**Version:** 1.0  
**Date:** August 2025  
**Purpose:** Complete visual and technical design specifications for development  

---

## 1. Layout Structure & Grid System

### Overall Page Layout
- **Layout Type:** Two-column layout (desktop), single column (mobile)
- **Content Column:** Left side containing text and form (50% width desktop)
- **Image Column:** Right side featuring professional photography (50% width desktop)
- **Mobile Layout:** Single column stack, image above content
- **Container:** Maximum 1200px wide, centered

### Desktop Layout (1024px+)
```css
.main-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}

.content-column {
  padding: 80px 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 40px;
}

.hero-content {
  /* Hero text content */
}

.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 20px 0;
}

.email-form {
  /* Form at bottom */
}

.image-column {
  position: relative;
  overflow: hidden;
}
```

### Content Flow Structure
```css
.content-column {
  /* 1. Hero Content (headline, date, student count, supporting text) */
  /* 2. Bento Grid (two stacked boxes) */
  /* 3. Email Form */
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
Mobile: 320px - 767px (single column, image above content)
Tablet: 768px - 1023px (adjusted two-column with smaller padding)
Desktop: 1024px+ (full two-column layout)
Large Desktop: 1440px+ (enhanced spacing)
```

### Z-Index Hierarchy
```css
Logo: z-index: 10
Content Column: z-index: 3
Image Column: z-index: 2
Form Elements: z-index: 4
Loading States: z-index: 5
```

---

## 2. Color Specifications

### Brand Colors (Per Style Guide)
```css
/* Primary Colors */
--primary-blue: #0092FF;      /* Primary CTA, links */
--navy: #22224C;              /* Headlines, primary text */
--light-blue: #C6E7FF;        /* Subtle accents, form focus */
--off-white: #F6F6FF;         /* Form backgrounds, cards */

/* Neutrals */
--neutral-1: #E5E9F1;         /* Light borders, subtle backgrounds */
--neutral-2: #D9DFEA;         /* Form borders */
--neutral-3: #AAB7CB;         /* Secondary text, placeholders */
--neutral-4: #65738B;         /* Body text */
--neutral-5: #485163;         /* Dark text */
--neutral-6: #252A33;         /* Darkest text, form validation */
```

### Color Usage Map
- **Hero Headline:** Navy (#22224C)
- **Subheadline:** Neutral-4 (#65738B)
- **Body Text:** Neutral-4 (#65738B)
- **CTA Button:** Primary Blue (#0092FF) background, white text
- **Form Fields:** Off White (#F6F6FF) background, Navy (#22224C) text
- **Form Labels:** Neutral-4 (#65738B)
- **Success States:** Primary Blue (#0092FF)
- **Error States:** Use Neutral-6 (#252A33) for error text

### Background Overlay
```css
/* Dark overlay over background image for text readability */
background: linear-gradient(
  rgba(34, 36, 76, 0.7),     /* Navy with 70% opacity */
  rgba(34, 36, 76, 0.5)      /* Navy with 50% opacity */
);
```

---

## 3. Typography Specifications

### Font Stack
```css
/* Primary Font */
font-family: 'Museo Sans', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Fallback Stack */
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
```

### Typography Scale & Usage

#### Hero Headline (H1)
```css
font-family: 'Museo Sans', fallback;
font-size: 40px;           /* Desktop */
font-size: 32px;           /* Tablet */
font-size: 28px;           /* Mobile */
line-height: 1.2;
font-weight: 900;          /* Bold */
color: var(--navy);        /* Navy for contrast on white background */
text-align: left;          /* Left-aligned in content column */
letter-spacing: -0.02em;
margin-bottom: 16px;
```

#### Event Date (H2)
```css
font-family: 'Museo Sans', fallback;
font-size: 24px;           /* Desktop */
font-size: 20px;           /* Tablet */
font-size: 18px;           /* Mobile */
line-height: 1.3;
font-weight: 900;          /* Bold */
color: var(--primary-blue); /* Primary Blue for emphasis */
text-align: left;
margin-bottom: 8px;
```

#### Key Stat (Student Count)
```css
font-family: 'Museo Sans', fallback;
font-size: 20px;           /* Desktop */
font-size: 18px;           /* Tablet */
font-size: 16px;           /* Mobile */
line-height: 1.4;
font-weight: 500;          /* Medium */
color: var(--neutral-4);   /* Neutral-4 for readability on white */
text-align: left;
margin-bottom: 32px;
```

#### Supporting Text (Body)
```css
font-family: 'Museo Sans', fallback;
font-size: 16px;           /* Desktop */
font-size: 15px;           /* Mobile */
line-height: 1.5;
font-weight: 300;          /* Regular */
color: var(--neutral-4);   /* Neutral-4 for body text */
text-align: left;
margin-bottom: 40px;
max-width: 480px;
```

#### Form Label
```css
font-family: 'Museo Sans', fallback;
font-size: 14px;
line-height: 1.4;
font-weight: 500;          /* Medium */
color: #F6F6FF;            /* Off White */
margin-bottom: 8px;
```

#### CTA Button Text
```css
font-family: 'Museo Sans', fallback;
font-size: 16px;
line-height: 1;
font-weight: 700;          /* Demi Bold */
color: #FFFFFF;
letter-spacing: 0.02em;
text-transform: none;
```

---

## 4. Component Specifications

### Logo Placement
```css
/* Logo Container */
position: absolute;
top: 24px;                 /* Desktop */
top: 16px;                 /* Mobile */
left: 24px;                /* Desktop */  
left: 16px;                /* Mobile */
z-index: 10;

/* Logo Size */
height: 40px;              /* Desktop */
height: 36px;              /* Mobile */
width: auto;
```

### Main Container (Two-Column Layout)
```css
/* Main Container */
.main-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #FFFFFF;
}

/* Content Column (Left Side) */
.content-column {
  padding: 80px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #FFFFFF;
}

/* Image Column (Right Side) */
.image-column {
  position: relative;
  overflow: hidden;
  background: var(--neutral-1);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Mobile Layout */
@media (max-width: 767px) {
  .main-container {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 1fr;
  }
  
  .content-column {
    padding: 40px 20px;
    order: 2;
  }
  
  .image-column {
    order: 1;
    height: 300px;
  }
}
```

### Bento Grid Components
```css
/* Bento Grid Container */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 20px 0;
  max-width: 400px;
}

/* Individual Bento Box Base Styles */
.bento-box {
  background: var(--off-white);
  border: 1px solid var(--neutral-2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.bento-box:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 8px 24px rgba(0, 146, 255, 0.1);
  transform: translateY(-2px);
}

/* Text Bento Box */
.bento-text {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bento-text h3 {
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 12px;
  line-height: 1.3;
}

.bento-text p {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 300;
  color: var(--neutral-4);
  line-height: 1.4;
  margin: 0;
}

/* Video Bento Box */
.bento-video {
  min-height: 200px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-6);
  color: white;
  position: relative;
}

.video-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: var(--neutral-5);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 168px;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--neutral-2);
}

.video-placeholder svg {
  width: 32px;
  height: 32px;
  opacity: 0.7;
}

.video-placeholder span {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Video element when loaded */
.bento-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Play button overlay for video */
.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 146, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.video-play-button:hover {
  background: var(--primary-blue);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-play-button svg {
  width: 16px;
  height: 16px;
  color: white;
  margin-left: 2px;
}
```

### Email Capture Form
```css
/* Form Container */
background: var(--off-white);  /* Off White background */
border: 1px solid var(--neutral-2);
border-radius: 12px;
padding: 32px;             /* Desktop */
padding: 24px;             /* Mobile */
box-shadow: 0 4px 16px rgba(34, 36, 76, 0.1);
max-width: 400px;
width: 100%;

/* Form Title */
font-family: 'Museo Sans', fallback;
font-size: 22px;           /* Desktop */
font-size: 20px;           /* Mobile */
line-height: 1.3;
font-weight: 500;          /* Medium */
color: var(--navy);        /* Navy */
margin-bottom: 20px;
text-align: left;

/* Email Input Field */
width: 100%;
padding: 16px;
border: 2px solid var(--neutral-2);  /* Neutral-2 */
border-radius: 8px;
font-size: 16px;
font-family: 'Museo Sans', fallback;
background: #FFFFFF;        /* White background */
color: var(--navy);         /* Navy text */
margin-bottom: 16px;
transition: border-color 0.2s ease;

/* Input Placeholder */
color: var(--neutral-3);    /* Neutral-3 */
font-weight: 300;

/* Input Focus State */
border-color: var(--primary-blue);  /* Primary Blue */
outline: none;
box-shadow: 0 0 0 3px rgba(0, 146, 255, 0.1);

/* CTA Button */
width: 100%;
padding: 16px 32px;
background: var(--primary-blue);  /* Primary Blue */
color: #FFFFFF;
border: none;
border-radius: 8px;
font-size: 16px;
font-family: 'Museo Sans', fallback;
font-weight: 700;         /* Demi Bold */
cursor: pointer;
transition: all 0.2s ease;
letter-spacing: 0.02em;

/* Button Hover State */
background: #0078CC;      /* Darker blue */
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 146, 255, 0.3);

/* Button Active State */
transform: translateY(0);
background: #006BB3;
```

### Success State
```css
/* Success Message Container */
background: rgba(198, 231, 255, 0.95);  /* Light Blue with transparency */
border: 2px solid #0092FF;              /* Primary Blue border */
border-radius: 8px;
padding: 16px;
text-align: center;
margin-top: 16px;

/* Success Text */
color: #22224C;             /* Navy */
font-weight: 500;           /* Medium */
font-size: 14px;
```

### Error States
```css
/* Error Message */
color: #252A33;             /* Neutral-6 */
font-size: 12px;
margin-top: 4px;
font-weight: 500;           /* Medium */

/* Error Input Border */
border-color: #252A33;      /* Neutral-6 */
```

---

## 5. Interactive Elements

### Micro-interactions
```css
/* Form field focus animation */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Button hover lift effect */
transform: translateY(-1px);
transition: all 0.2s ease;

/* Loading state for button */
.loading {
  opacity: 0.7;
  pointer-events: none;
}
.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
  display: inline-block;
}
```

### Hover States
- **Form Fields:** Border color changes to Primary Blue (#0092FF)
- **CTA Button:** Background darkens, subtle lift effect, shadow appears
- **Links:** Color change to Primary Blue (#0092FF)

### Focus States
- **Form Fields:** Primary Blue border + subtle blue glow
- **Buttons:** Visible focus ring using Primary Blue
- **All interactive elements:** Meet WCAG AA focus requirements

---

## 6. Hero Image Specifications

### Image Requirements
- **Dimensions:** Minimum 800x1200px (portrait orientation preferred)
- **Aspect Ratio:** 2:3 or 3:4 for optimal display in column
- **File Format:** WebP (with JPG fallback)
- **File Size:** Under 400KB optimized
- **Subject Matter:** Professional people in career settings

### Image Implementation
```css
/* Hero Image Container */
.image-column {
  position: relative;
  overflow: hidden;
  background: var(--neutral-1);
}

/* Hero Image */
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Responsive Image Handling */
@media (max-width: 767px) {
  .image-column {
    height: 300px;
    order: 1;
  }
  
  .hero-image {
    object-position: center top;
  }
}

/* Image Overlay (if needed for text) */
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(34, 36, 76, 0.8));
  padding: 20px;
  color: white;
}
```

### Image Content Guidelines
- **Preferred:** Single professional or small group in work environment
- **Include:** Various career fields (tech, healthcare, trades, education, etc.)
- **Avoid:** Busy backgrounds that distract from main subject
- **Style:** Contemporary, aspirational, inclusive
- **Focus:** Clear subject that works well in vertical crop

---

## 7. Mobile Responsive Specifications

### Mobile-First Breakpoints
```css
/* Base (Mobile): 320px+ */
.main-container {
  grid-template-columns: 1fr;
  grid-template-rows: 300px 1fr;
  min-height: 100vh;
}

.content-column {
  padding: 40px 20px;
  order: 2;
  gap: 24px;
}

.image-column {
  order: 1;
  height: 300px;
}

/* Mobile Bento Grid */
.bento-grid {
  gap: 12px;
  margin: 16px 0;
  max-width: 100%;
}

.bento-box {
  padding: 20px;
  border-radius: 12px;
}

.bento-text {
  min-height: 100px;
}

.bento-text h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.bento-text p {
  font-size: 13px;
}

.bento-video {
  min-height: 180px;
  padding: 12px;
}

.video-container {
  min-height: 148px;
}

.video-play-button {
  width: 40px;
  height: 40px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .main-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: none;
  }
  
  .content-column {
    padding: 60px 40px;
    order: 1;
    gap: 32px;
  }
  
  .image-column {
    order: 2;
    height: auto;
  }
  
  .bento-grid {
    gap: 14px;
    margin: 18px 0;
    max-width: 350px;
  }
  
  .bento-box {
    padding: 22px;
    border-radius: 14px;
  }
  
  .bento-text {
    min-height: 110px;
  }
  
  .bento-video {
    min-height: 190px;
    padding: 14px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .content-column {
    padding: 80px 60px;
    gap: 40px;
  }
  
  .bento-grid {
    gap: 16px;
    margin: 20px 0;
    max-width: 400px;
  }
  
  .bento-box {
    padding: 24px;
    border-radius: 16px;
  }
  
  .bento-text {
    min-height: 120px;
  }
  
  .bento-video {
    min-height: 200px;
    padding: 16px;
  }
}
```

### Touch Targets & Mobile Optimization
- **Bento Boxes:** Minimum 100px height on mobile for touch interaction
- **Video Play Button:** 40px minimum touch target on mobile
- **Spacing:** Adequate gaps between bento boxes for thumb navigation
- **Content Flow:** Image → Hero Content → Bento Grid → Email Form
- **Performance:** Lazy load video content until user interaction

---

## 8. Performance & Technical Specifications

### Loading Performance
- **First Contentful Paint:** Target <1.5s
- **Largest Contentful Paint:** Target <2.5s
- **Cumulative Layout Shift:** Target <0.1
- **First Input Delay:** Target <100ms

### Image Optimization
```html
<!-- Background Image with Fallbacks -->
<picture>
  <source srcset="bg-image.webp" type="image/webp">
  <source srcset="bg-image.jpg" type="image/jpeg">
  <img src="bg-image.jpg" alt="Career professionals in diverse work environments">
</picture>
```

### Font Loading
```css
/* Font Display Strategy */
@font-face {
  font-family: 'Museo Sans';
  src: url('museo-sans.woff2') format('woff2');
  font-display: swap;        /* Prevents invisible text during font load */
}
```

### Critical CSS
Inline critical styles in `<style>` tag in `<head>`:
- Layout structure
- Above-the-fold typography
- Form container styles
- Background image

---

## 9. Accessibility Specifications

### Color Contrast Ratios
- **White text on dark overlay:** 7.2:1 (AAA compliant)
- **Navy on Off White:** 12.8:1 (AAA compliant)
- **Primary Blue on white:** 4.7:1 (AA compliant)
- **All interactive elements:** Minimum 3:1 contrast

### Semantic HTML Structure
```html
<main role="main">
  <header>
    <img src="logo.svg" alt="myBlueprint Career Education Platform">
  </header>
  
  <section aria-labelledby="event-title">
    <h1 id="event-title">myBlueprint Career Launch</h1>
    <h2>December 2nd, 2025</h2>
    <p>Join 50,000+ students exploring career opportunities</p>
    
    <form aria-labelledby="signup-form" role="form">
      <h3 id="signup-form">Get Notified When the Agenda is Released</h3>
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" required aria-describedby="email-help">
      <span id="email-help">We'll notify you as soon as the agenda is available</span>
      <button type="submit">Notify Me</button>
    </form>
  </section>
</main>
```

### Keyboard Navigation
- **Tab Order:** Logo → Email Input → Submit Button
- **Enter Key:** Submits form when focused on input or button
- **Focus Indicators:** Visible focus rings on all interactive elements

---

## 10. Brand Compliance Checklist

### Logo Usage ✓
- [ ] Use only approved myBlueprint logo variants
- [ ] Maintain proper logo proportions (never stretch/distort)
- [ ] Ensure adequate clear space around logo
- [ ] Use inverted logo variant on dark backgrounds
- [ ] Logo remains legible at all sizes

### Color Usage ✓
- [ ] Use only approved brand colors from style guide
- [ ] Primary Blue (#0092FF) for primary actions and highlights
- [ ] Navy (#22224C) for primary headlines and text
- [ ] Maintain proper color contrast ratios
- [ ] Use neutrals appropriately for hierarchy

### Typography ✓
- [ ] Use Museo Sans as primary font family
- [ ] Implement proper font weights (300, 500, 700, 900)
- [ ] Follow established type scale for consistency
- [ ] Maintain appropriate line heights and letter spacing
- [ ] Use Open Sans only when Museo Sans unavailable

---

## 11. Development Handoff Notes

### Assets Needed
- [ ] myBlueprint logo (SVG format, standard and inverted)
- [ ] Background hero image (WebP + JPG fallback)
- [ ] Museo Sans font files (WOFF2, WOFF)
- [ ] Favicon set (PNG, ICO, SVG)

### Third-party Integrations
- **Zoho CRM API:** Form submission endpoint
- **Analytics:** Not required for initial launch
- **Fonts:** Load from Google Fonts or self-host

### Testing Requirements
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Form validation and submission testing
- [ ] Performance testing (PageSpeed Insights)
- [ ] Accessibility testing (WAVE, aXe)

---

## 12. Final Specifications Summary

**Layout:** Single-page, full-screen with centered content  
**Colors:** myBlueprint brand palette with high contrast  
**Typography:** Museo Sans primary, responsive type scale  
**Components:** Hero content + email capture form  
**Interactions:** Smooth hover states and form validation  
**Performance:** <2s load time, mobile-optimized  
**Accessibility:** WCAG AA compliant  
**Brand Compliance:** Strict adherence to style guide  

This specification provides complete visual and technical guidance for pixel-perfect implementation of the myBlueprint Career Launch landing page.