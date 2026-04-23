# Module-Specific Architectures

## 1. Exam Engine Architecture
- **State Management**: React state for timer and active questions; local storage sync for persistence.
- **Auto-grading**: Server-side validation for MCQ questions.
- **AI Grading**: Optional essay grading using Groq with specific rubrics.
- **Anti-cheating**:
    - Visibility API to track tab switching.
    - Server-side timestamp validation (Start vs End time).
    - Randomized question ordering.

## 2. AI Module Architecture
- **Service Layer**: `AIService` abstraction with `GroqProvider`, `OpenAIProvider` implementations.
- **Moderation**: Interceptor that checks prompts against a safety list or external moderation API before calling the AI provider.
- **Streaming**: Implementation using `ai` package (Vercel AI SDK) for real-time text generation.
- **Context Management**: Passing last 5-10 messages for conversation continuity.

## 3. CSV Bulk Upload Architecture
- **Flow**:
    1. Admin uploads CSV.
    2. Frontend parses with `PapaParse` for preview and client-side validation.
    3. JSON payload sent to `/api/users/bulk`.
    4. Backend uses `Inngest` for async processing to avoid timeouts.
    5. Validation against Prisma schema (email duplicates, role existence).
    6. Row-level results sent back via Pusher or stored in `CSVUploadLog`.

## 4. Payment Abstraction Architecture
- **Provider Interface**: `PaymentProvider` with `initializeTransaction`, `verifyTransaction`, `handleWebhook`.
- **Implementations**: `StripeProvider`, `PaystackProvider`.
- **Flow**:
    1. Frontend requests checkout.
    2. Backend initializes with provider and returns checkout URL.
    3. Webhook listener updates `Payment` status in DB based on event.

## 5. Gamification & Fun Section
- **Events**: Student actions (completing exam, 100% attendance) trigger Inngest events.
- **Logic**: Events check against `Achievement` criteria.
- **Leaderboard**: materialized view or cached Redis key updated periodically for performance.
