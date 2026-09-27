# Adaptive Display & Device Optimization

The site uses capability-based responsive design across all public pages.

## What is detected

- Phone / tablet / desktop form factor (using viewport/screen short-side plus touch/pointer capabilities)
- Compact / medium / wide layout width
- Touch, hybrid, or mouse/trackpad input
- Portrait or landscape orientation
- Hover capability
- Dynamic VisualViewport changes (mobile browser chrome and on-screen keyboard)
- Safe-area insets for notches/home indicators
- Reduced-motion preference
- Increased-contrast preference

The implementation intentionally avoids relying on browser user-agent strings. Layout still uses CSS responsive breakpoints as a fallback, so the site remains usable if JavaScript is unavailable.

## Phone behaviour

- Single-column reading and booking layout
- Minimum 48–52 px primary touch targets
- 16 px form controls to avoid unwanted iOS form zoom
- Safe-area-aware fixed booking action
- Simplified navigation
- Smaller calendar density and responsive typography
- No horizontal scrolling at 320 CSS px
- Landscape phone remains classified as a phone, while its layout can expand to use the wider viewport

## Tablet behaviour

- Portrait layouts stack content with generous touch spacing
- Landscape layouts use wider conversion layouts where space permits
- Touch targets are increased
- Navigation and typography are sized between phone and desktop modes

## Desktop/laptop behaviour

- Wider editorial grids and service layouts
- Mouse/trackpad hover enhancements only when hover is actually supported
- Booking stays prominent beside hero content where space permits

## Accessibility

- Reduced-motion support
- High-contrast/forced-colour support
- Keyboard focus indicators
- Responsive text sizing without disabling browser zoom
