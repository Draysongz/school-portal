# Phase 3: Academic Management System Architecture

## 1. Academic Entity Relationships
The academic system follows a hierarchical structure to support multi-tenancy and academic sessions:
- **School**: The root tenant.
- **AcademicYear**: (e.g., "2023/2024") Scopes all academic data. A school can have many years, but only one active.
- **Term/Semester**: (e.g., "Fall 2023", "Spring 2024") Sub-divisions of an academic year.
- **Class**: Linked to an AcademicYear. Contains students and manages its own timetable.
- **Subject**: Global to the school but mapped to specific Classes.

## 2. Class Hierarchy Structure
Classes are organized by:
- **Grade Level**: (e.g., Grade 1, JSS1, Year 10).
- **Class/Arm**: The specific grouping (e.g., Grade 1A, Grade 1B).
- **Class Teacher**: A primary teacher assigned to oversee a class.

## 3. Subject Assignment Model
Uses a junction table `ClassSubject` to link:
- **Class** + **Subject** + **Teacher**.
This allows the same subject (e.g., Math) to be taught by different teachers in different classes.

## 4. Timetable Generation Strategy
- **Period Management**: Define school hours and period durations.
- **Conflict Detection**:
  - **Teacher Conflict**: A teacher cannot be in two places at once.
  - **Class Conflict**: A class cannot have two subjects at once.
  - **Room Conflict**: (Optional for V1) A physical space cannot be double-booked.
- **Logic**: Validation runs on every save/update of a timetable entry.

## 5. Attendance Architecture
- **Storage**: Daily records in `Attendance` table.
- **Bulk Marking**: API supports receiving a list of student IDs and statuses for a specific date and class.
- **Event-Driven**: Marking a student "Absent" triggers an internal event (via Inngest) to notify parents.
- **Analytics**: Periodic aggregation of attendance percentages for dashboards.

## 6. Notification Trigger System
- **Pub/Sub**: Uses Pusher for real-time delivery and a `Notification` table for persistence.
- **Triggers**:
  - Attendance: Student absence.
  - Announcements: Class-wide or school-wide alerts.
  - Timetable: Changes to the schedule.

## 7. API Route Structure
- `/api/academic/years`: Manage academic sessions.
- `/api/academic/classes`: CRUD for classes and student enrollment.
- `/api/academic/subjects`: CRUD for subject catalog and class assignments.
- `/api/academic/timetable`: Manage weekly schedules and conflict checks.
- `/api/academic/attendance`: Mark and view attendance records.
- `/api/notifications`: User-specific notification feed.

## 8. Service Layer Design
- `AcademicService`: Handles Years, Terms, and Grade Levels.
- `ClassService`: Manages classes and student placement.
- `TimetableService`: Core logic for schedule generation and validation.
- `AttendanceService`: Marking logic and analytics calculation.

## 9. Validation & Isolation
- **Zod**: Strict schema validation for all academic inputs.
- **Tenant Isolation**: Every query is scoped by `schoolId`. Academic data is further scoped by `academicYearId`.
- **Query Optimization**: Use of Prisma `include` and `select` to avoid N+1 issues; indexing on `schoolId` and `classId`.
