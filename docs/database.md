# Database Schema Design

## Core Entities

### Tenant Management
- `School`: Basic info, subdomain, branding, subscription status.
- `SchoolSettings`: AI limits, feature flags, school-specific configs.

### User & Authentication
- `User`: Global user record (email, password hash, role).
- `Profile`: School-specific profile (linked to `User` and `School`).
- `Role`: (SuperAdmin, Admin, Teacher, Student, Parent).

### Academic Entities
- `Student`: Linked to `Profile`, `Class`, and `Parent`s.
- `Teacher`: Linked to `Profile`, manages `Subject`s and `Class`es.
- `Parent`: Linked to `Profile`, manages multiple `Student`s.
- `Class`: Name, capacity, `School` link.
- `Subject`: Name, description, `School` link.
- `ClassSubject`: Junction table for Teacher-Subject-Class assignments.
- `Timetable`: Weekly schedule for classes/subjects.

### Academic Activity
- `Attendance`: Date, status, student link, class link.
- `Assignment`: Title, description, deadline, file links.
- `AssignmentSubmission`: Student link, assignment link, grades, AI feedback.
- `Grade`: Numeric/letter grade, weight, category.

### Exam System
- `Exam`: Title, description, duration, type (Online/Offline).
- `Question`: Content, type (MCQ, Essay), marks, `Exam` link.
- `StudentExamAttempt`: Student link, exam link, start/end time, status.
- `StudentExamAnswer`: Attempt link, question link, student response, marks.

### Communication & Real-time
- `Notification`: Content, recipient, read status, type.
- `Announcement`: Title, content, target (Role/Class), `School` link.
- `Message`: Chat/Community messages.

### Payments
- `Payment`: Amount, status, provider (Stripe/Paystack), student/school link, purpose.

### AI & Analytics
- `AIInteraction`: User link, topic.
- `AIMessage`: Content, role (User/AI), metadata.
- `AIUsageLog`: Tokens, cost, school link.

### Gamification
- `Achievement`: Name, description, badge icon.
- `StudentAchievement`: Student link, achievement link.
- `Leaderboard`: Aggregated metrics for students.

### Audit & Logs
- `AuditLog`: Action, actor, timestamp, tenant ID.
- `CSVUploadLog`: Filename, status, errors, rows processed.
