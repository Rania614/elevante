# Elevante (Web Demo)

Web demo of Elevante, my ITI graduation project: a business platform that brings together entrepreneurs, investors, and suppliers. I was the team lead on the project.

This repository contains the web demo only. The initial UI was scaffolded with v0.

## Features

- **Onboarding:** login, registration, role selection, and a three-step profile setup.
- **Role dashboards:** separate page sets for entrepreneurs, investors, and suppliers.
- **Admin views:** control center with user management and system settings.
- **Shared layout:** role-aware sidebar and an account settings page.

## Tech Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui components (Radix UI), lucide-react.

## Technical Challenges & Solutions

### Challenge: One onboarding flow for three roles

**Problem:** Registration, role selection, profile setup, and login all have to end on the right dashboard for the user's role, including the admin.

**Approach:** Because the demo has no backend or session, the whole flow is kept in one client-side state machine.

**Solution:** A `PageType` union lists every screen. The root component holds the current page, role, and profile, routes by role after login and after profile setup, and clears everything on logout.

**Result:** The full flow can be read in one file. The trade-off is that screens have no URL of their own, so a refresh returns to login.

### Challenge: A profile form that changes by role

**Problem:** Each role needs different profile fields, but the steps should feel the same.

**Approach:** Share the wizard and switch only the role-specific step.

**Solution:** Step one collects common fields and step two renders investor, supplier, or entrepreneur fields. Each step is validated before moving on, an error clears when its field is edited, and the profile photo is previewed with `FileReader`.

**Result:** A user cannot advance with required fields missing and sees which fields need attention.

### Challenge: One layout for three dashboards

**Problem:** Three dashboards have different menus and pages, and three separate layouts would repeat the same shell.

**Approach:** Drive the shell from the role and the current page key.

**Solution:** A single sidebar builds its menu from the role and highlights the active page. The layout hands the page key to the matching role component, and settings is shared.

**Result:** Adding a dashboard page takes one menu entry and one case in the role component.

## Known Limitations

- **Sample data:** all dashboard content is sample data written into the components.
- **Simulated authentication:** login accepts two fixed demo accounts after a timed delay, and registration does not create an account.
- **No backend:** the demo makes no API calls.
- **No persistence:** state is held in memory, so refreshing the page returns to login.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Demo logins: `admin@elevante.com` / `admin123` (admin) and `test@example.com` / `password` (investor).
