# Phase 2: User Management & CSV Bulk Upload Architecture

## 1. User Management Foundation
- **Unified User Service**: A central `UserService` handles common tasks like password hashing, email validation, and profile creation.
- **Role-Specific Extension**: Separate services for Students, Teachers, and Parents to handle their unique relationships (e.g., student-class, teacher-subjects, parent-student linkage).
- **Security**: Strict enforcement of `schoolId` in all queries to prevent cross-tenant data leakage.

## 2. CSV Bulk Upload System
- **Flow**:
  1. **Upload**: Admin selects a role and uploads a CSV.
  2. **Client-side Parsing**: (Optional but helpful) Initial validation and preview using `PapaParse`.
  3. **API Submission**: CSV data sent to `/api/users/bulk-upload`.
  4. **Validation**: Row-by-row validation using Zod. Check for duplicates within the CSV and against the database.
  5. **Background Processing**: Heavy insertion logic offloaded to **Inngest**.
  6. **Feedback Loop**: Progress and results (success/errors) stored in `CSVUploadLog` and optionally pushed to the UI via Pusher.

## 3. Data Relationships
- **Student-Parent**: Junction table allows one parent to have multiple children and vice versa.
- **Teacher-Class-Subject**: Flexible assignments allowing teachers to handle multiple subjects across different classes.

## 4. UI Components
- **DataTable**: A reusable component based on `@tanstack/react-table` for displaying and managing lists of users.
- **Import Wizard**: A step-by-step UI for uploading, previewing, and confirming bulk imports.
- **Form Components**: Role-specific forms for manual CRUD operations.
