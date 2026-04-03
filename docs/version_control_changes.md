# Version Control Change Document: NSCC Student Wellness App

This document tracks major layout transitions and feature set updates during the Phase 1 & 2 development.

## 1. Project Evolution Summary

| Phase | Branch | Key Changes |
|-------|--------|-------------|
| **Initial** | `main` (old) | Basic React/Vite scaffolding with Supabase connection. |
| **Branding** | `main` | Integration of NSCC Student Wellness logo, color palette (NSCC Blue, Sage, Terra), and PWA support. |
| **Simplified** | `features/simplified` | Removal of Chat functionality; redirection of Food Security to Substance Use and Supports. |

## 2. Layout Transitions

### A. Dashboard Architecture
- **Before**: Generic list-based view.
- **After**: B2B Dashboard style with high-level metrics ("Overall Index") and a grid-based "Core Pillars" display.
- **Rationale**: Students need immediate, scannable feedback. The grid layout allows for future expansion of pillars.

### B. Navigation System
- **Feature Layer**: Implemented a "Mobile-First" tab bar for easy access to "Today", "Journal Check-In", and "Support".
- **Refinement**: "Wellness Chat" was removed to reduce noise and focus on proactive self-tracking and official resources.

## 3. Feature Set Updates

### Progressive Web App (PWA)
- **Implementation**: Used `vite-plugin-pwa` for manifest and service worker.
- **Impact**: Enables "Install" on home screen and basic offline availability.

### Secure Journaling
- **Layer**: Integrated client-side AES-256-GCM encryption for journal entries before database insertion.
- **Impact**: Ensures student privacy even at the database/administrator layer.

- **Link**: [NSCC Substance Abuse Support (SharePoint)](https://nscc.sharepoint.com/sites/Student_Wellness_Hub/SitePages/Substance-Abuse.aspx)

### Research & Info Overlays
- **Update**: Integrated informational "i" icons across the Dashboard and Wellness Tracker.
- **Functionality**: Overlays provide quantitative metric definitions, research-based rationale (academic impact), and institutional sources (NSCC Student Wellness Hub, Advising & Counselling).
- **Impact**: Provides "just-in-time" education to students on *why* these pillars are measured and what the research suggests about their impact on student success.
