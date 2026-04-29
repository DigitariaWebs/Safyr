# Public (Marketing)

> Routes: `/`, `/contact`, `/solutions/hr`
> Source: `web/src/app/(public)/`

## Overview

Marketing-facing pages for prospective clients. Presents Safyr's value proposition, solution modules, and contact information. All copy in French.

## Pages

### Homepage (`/`)
Landing page with hero section, solution overview (4 groups: RH & Paie, Opérations, Finance, Outils), statistics (200+ entreprises, 15k+ agents, 99.9% uptime), testimonials, FAQ, and CTA.

### Contact (`/contact`)
Contact form and company information (hello@safyr.com).

### Solutions HR (`/solutions/hr`)
Detailed presentation of the HR module capabilities.

## Workflows

### 1. Visitor Discovery
1. Lands on homepage
2. Browses solution groups via dropdown navigation
3. Reads testimonials and FAQ
4. Clicks CTA → redirected to `/register`

### 2. Contact Inquiry
1. Navigates to `/contact`
2. Fills contact form (name, email, message)
3. Submits → confirmation displayed

## Data Types

No domain types — uses `siteConfig` from `config/site.ts` for all copy, labels, nav items, statistics, testimonials, and FAQ content.

## Related

- [[features/web/Auth|Auth]] — Registration and login flows
