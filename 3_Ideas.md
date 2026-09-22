# 3_Ideas.md - UI/UX Architecture & Design System Blueprints

This document details the visual design roadmaps, component blueprints, and styling systems implemented or planned for the executive portfolio.

---

## 1. Unified Segmented Tab Design System

The application employs Apple-grade segmented tabs (`SegmentedTabs.tsx`, `OffKeyboard.tsx`):
- **Glassmorphic Capsule Container**:
  `bg-zinc-100/90 dark:bg-white/[0.06] p-1.5 rounded-2xl border backdrop-blur-xl`
- **Fluid Layout Indicator**:
  Powered by `motion/react` with animated layout transitions (`layoutId="activeTabIndicator"`), creating smooth sliding pill animations between tab selections.
- **Micro-Badge Chips**:
  Tab indicators feature micro-counters (e.g., `Blueprints [4]`, `Patents & Papers [18]`) providing instant visual orientation.

---

## 2. Floating Navbar & Section Indicator (`Navbar.tsx`)

- **Sliding Highlight Capsule**:
  Tracks scroll position using IntersectionObserver and smoothly moves the highlight capsule (`layoutId="navActive"`).
- **Monospace Section Numerals**:
  Sections are labeled with subtle monospace numbers (`01` through `09`) alongside quick keyboard navigation listeners (`Keys 1-9`).
- **Clearance State Indicator**:
  Displays verified administrator or authorized clearance status with glowing micro-indicators.

---

## 3. Case Studies & Publications Ribbon (`Projects.tsx` & `TechnicalBlog.tsx`)

- **Horizontal Gradient Fade Masks**:
  CSS mask-image gradients creating smooth edge fades for horizontal card ribbons.
- **Categorical Domain Badging**:
  Distinct icons and palettes for Zero Trust, Cloud Security, Threat Modeling, and Post-Quantum Cryptography.
- **Micro-Elevations**:
  Smooth CSS translation and atmospheric box-shadows on hover.

---

## 4. Career Journey Two-Tier Stepper (`CareerJourney.tsx`)

- **Tier 1 (Company Level)**:
  Broad tenure blocks (*Goldman Sachs 14 Yrs* | *CA Broadcom 2 Yrs* | *Amrita 4 Yrs*).
- **Tier 2 (Role Progression)**:
  Detailed role timeline displaying promotions, milestones, scope of budget, and technical achievements with connected milestone progress rails.
