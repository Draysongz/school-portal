# Phase 5: AI Learning Assistant & Moderation Architecture

## 1. AI System Architecture
The AI layer is built on a "Service Provider" pattern:
- **AIService**: The main entry point that coordinates moderation, logging, and provider calls.
- **AIProvider Interface**: Defines `generateResponse` and `streamResponse` methods.
- **GroqProvider**: Initial implementation using Groq's high-speed API.
- **ModerationInterceptor**: A middleware layer that checks every interaction.

## 2. Conversation & Context Strategy
- **Persistent Memory**: Conversations are stored as `AIConversation` (threads) and `AIMessage` (individual turns).
- **Context Injection**: For each prompt, the service injects:
  - **Student Profile**: Grade level, learning style.
  - **Academic Context**: Current subjects and recent exam performance.
  - **Recent History**: Last 5-10 messages for continuity.

## 3. Moderation Pipeline
1. **Input Sanitization**: Basic cleanup of user prompt.
2. **Pre-Moderation**: AI-based or keyword-based check for toxicity/safety before calling the LLM.
3. **Response Generation**: LLM generates a response within a "Student-Safe" system prompt.
4. **Post-Moderation**: Quick scan of the output for any leaked PII or unsafe instructions.
5. **Logging**: All steps, including blocked attempts, are logged in `AIUsageLog`.

## 4. Streaming Architecture
- **Serverless Streaming**: Utilizes the `ai` package (Vercel AI SDK) to pipe streams from the AI provider to the client while keeping the connection open.
- **Tenant Validation**: Subdomain/Session verification happens *before* the stream is initiated.

## 5. Quiz & Recommendation Engine
- **Quiz Generation**: Background job (Inngest) that takes a subject/topic and asks the AI to return a JSON structure of questions.
- **Recommendations**: Logic that analyzes `StudentExamAttempt` scores and identifies "Weak Topics" to prompt the AI for revision plans.

## 6. Usage Quotas & Limits
- **Tracking**: `AIUsageLog` tracks token counts and timestamps.
- **Enforcement**: Middleware checks the current school's `aiLimit` and the student's daily quota before allowing a request.

## 7. API Route Structure
- `POST /api/ai/chat`: Main streaming endpoint for tutoring.
- `GET /api/ai/history`: Fetch past conversations.
- `POST /api/ai/quiz/generate`: Trigger background quiz creation.
- `GET /api/ai/recommendations`: Fetch personalized study tips.
