# Phase 6: Payments & Billing Architecture

## 1. Payment Abstraction Layer
To support multiple providers (Stripe, Paystack), we use a standard interface:
- **`PaymentProvider`**: Interface defining `initializePayment`, `verifyPayment`, `createRefund`, and `validateWebhook`.
- **`PaymentFactory`**: Resolves the correct provider based on the school's configuration or global platform settings.

## 2. Subscription & Fee Models
- **Platform Subscription**: Schools pay to use the SaaS. Managed via `Subscription` linked to a `Plan`.
- **Student Fees**: Managed via `StudentFee` (e.g., Tuition, Library Fee). Supports installments and partial payments.
- **Transactions**: Every financial movement creates an immutable `Transaction` record.

## 3. Webhook Processing Strategy
- **Security**: Strict signature verification for every incoming webhook.
- **Idempotency**: Every webhook event is logged. Before processing, we check if the event ID has already been handled to prevent double-charging or duplicate credits.
- **Asynchronicity**: Webhooks are received, acknowledged immediately, and processed in the background via **Inngest**.

## 4. Invoice Architecture
- **Automatic Generation**: Invoices are generated when a fee is assigned or a subscription renews.
- **Status Workflow**: `DRAFT` -> `OPEN` -> `PAID` / `VOID` / `UNCOLLECTIBLE`.
- **Receipts**: Once paid, a standard JSON-to-PDF pipeline (using a library like `jspdf` or server-side rendering) provides downloadable receipts.

## 5. Refund Lifecycle
- **Request**: Admin initiates a refund via the dashboard.
- **Execution**: The `PaymentService` calls the respective provider's API.
- **Reconciliation**: Upon provider confirmation, the `Transaction` status is updated to `REFUNDED` and the student balance is adjusted.

## 6. Financial Audit & Analytics
- **Audit Log**: Every change to a financial record (status change, amount adjustment) is logged with the actor's ID and timestamp.
- **Aggregation**: Periodic background jobs calculate MRR (Monthly Recurring Revenue) and outstanding school balances for the Super Admin and School Admin dashboards.

## 7. API Route Structure
- `/api/billing/subscriptions`: SaaS plan management.
- `/api/billing/fees`: Student fee management.
- `/api/billing/checkout`: Initialize payment sessions.
- `/api/billing/webhooks/[provider]`: Provider-specific webhook endpoints.
- `/api/billing/invoices`: List and download invoices.
