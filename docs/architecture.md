# System Architecture: School E-Portal SaaS

## Overview
A multi-tenant, production-ready school management platform built with Next.js, PostgreSQL, Prisma, and Tailwind CSS.

## High-Level Architecture
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT with Next.js Middleware (Role-Based Access Control)
- **Deployment**: Vercel
- **Storage**: AWS S3-compatible / Cloudinary
- **Real-time**: Pusher / Ably
- **Background Jobs**: Inngest / QStash
- **AI**: Groq (Provider-agnostic service layer)

## Multi-Tenancy Strategy
- **Isolation Level**: Single database with `schoolId` discriminator.
- **Tenant Resolution**: Subdomain-based (e.g., `school1.portal.com`).
- **Middleware**: Resolves `schoolId` from the subdomain and injects it into the request context/headers.
- **Data Scoping**: All database queries are filtered by `schoolId`.

## User Roles & Permissions
1. **Super Admin**: Global platform management, subscriptions, school creation.
2. **Admin**: School-specific management (teachers, students, classes, payments).
3. **Teacher**: Academic management (attendance, grades, assignments, exams).
4. **Student**: Learning portal (exams, assignments, grades, AI tutor).
5. **Parent**: Monitoring (child performance, attendance, announcements).

## Deployment & Infrastructure
- **CI/CD**: GitHub Actions to Vercel.
- **Environment**: Staging and Production environments.
- **Monitoring**: LogSnag or Axiom for logging; Sentry for error tracking.
- **Security**:
    - Rate limiting via Upstash.
    - CSRF protection.
    - Secure HttpOnly cookies for JWT refresh tokens.
    - Data encryption at rest and in transit.

## Branding & Theming
- Runtime CSS variable injection based on school settings fetched during tenant resolution.
- Dynamic primary, secondary, and accent colors.
