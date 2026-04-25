# Phase 4: Exam Engine & Question Bank Architecture

## 1. Exam Entity Relationships
- **Question Bank**: A central repository of questions linked to a `Subject` and `School`. Questions can be reused across multiple exams.
- **Exam**: A scheduled event that selects questions from the bank (manually or randomized) or contains its own questions.
- **ExamSection**: Support for grouping questions within an exam.
- **StudentExamAttempt**: Tracks a student's engagement with an exam, including progress, anti-cheat logs, and finalized answers.

## 2. Attempt Lifecycle
1. **Initiation**: Student starts an exam; a `StudentExamAttempt` is created with status `IN_PROGRESS`.
2. **Engagement**: Student answers questions. Progress is synced via **Autosave**.
3. **Monitoring**: Client-side events (tab switch, etc.) are logged as `AntiCheatLog`.
4. **Completion**: Student submits or timer expires (Auto-submit). Status moves to `SUBMITTED`.
5. **Grading**:
   - Objective questions (MCQ, etc.) are auto-graded immediately or via background job.
   - Subjective questions (Essay) are flagged for manual or AI-assisted grading.
6. **Finalization**: Teacher reviews and publishes results. Status moves to `GRADED`.

## 3. Timer & Autosave Architecture
- **Server-Side Truth**: The definitive end time is stored in the database.
- **Live Sync**: Pusher sends periodic heartbeat or timer updates if needed, though client-side timers with server-side validation on submission is the primary strategy for scalability.
- **Autosave**: Client pushes state to a dedicated `/api/exams/attempts/:id/autosave` endpoint every 30-60 seconds or on every answer change. Uses Redis (Upstash) for low-latency temporary storage before persisting to PostgreSQL.

## 4. Anti-Cheat Strategy
- **Client-Side Triggers**: JavaScript `visibilitychange` for tab switches and `blur` events.
- **Copy/Paste Restriction**: CSS and JS listeners to prevent standard clipboard actions.
- **Server-Side Validation**: Checking submission timestamps against the start time and duration to prevent "time travel" exploits.
- **Randomization**: Shuffling both the order of questions and the order of options within MCQ questions.

## 5. Grading Engine Design
- **Objective Grading**: Simple matching of `StudentExamAnswer.answer` with `Question.correctAnswer`.
- **AI-Assisted Grading**: Uses Groq to evaluate essays against a rubric. The AI provides a suggested score and feedback, which the teacher must approve or override.
- **Queueing**: Grading for large exams is processed asynchronously via Inngest to prevent request timeouts.

## 6. API Route Structure
- `/api/exams`: Management (Admin/Teacher).
- `/api/exams/:id/questions`: Question bank management.
- `/api/exams/:id/start`: Initiate attempt (Student).
- `/api/exams/attempts/:id/save`: Autosave progress.
- `/api/exams/attempts/:id/submit`: Final submission.
- `/api/exams/attempts/:id/monitoring`: Log anti-cheat events.
- `/api/exams/results`: Result publishing and analytics.

## 7. Performance & Scalability
- **Concurrency**: High-load periods are handled by prioritizing Redis for autosaves and Inngest for background grading.
- **Database**: Indexes on `studentId`, `examId`, and `schoolId` to ensure fast lookups during active exams.
