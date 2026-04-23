# API & Routing Architecture

## REST API Structure (`/api/v1`)

### Auth
- `POST /auth/login`: Authenticate and receive JWT.
- `POST /auth/refresh`: Refresh expired access tokens.
- `POST /auth/logout`: Invalidate session.

### Tenant (Super Admin Only)
- `GET /schools`: List schools.
- `POST /schools`: Create a new school.
- `GET /schools/:id`: Get school details/analytics.

### Management (Admin)
- `GET /users`: List users in school.
- `POST /users/bulk`: Bulk upload via CSV.
- `GET /classes`: Class management.
- `GET /finances`: School-level payment tracking.

### Academic (Teacher/Student)
- `GET /exams`: List/Manage exams.
- `POST /exams/:id/attempt`: Start exam (Student).
- `PATCH /exams/attempts/:id/grade`: Grade exam (Teacher/AI).
- `GET /attendance`: View/Mark attendance.

### AI Assistant
- `POST /ai/chat`: Streamed AI response.
- `GET /ai/history`: Conversation history.

### Real-time / Notifications
- `GET /notifications`: User notifications.
- `POST /notifications/read`: Mark as read.

## Middleware Logic
1. **Subdomain Resolution**: extract `subdomain` from `Host` header.
2. **Tenant Verification**: Check if school exists and is active.
3. **Auth Check**: Verify JWT in cookies/headers.
4. **RBAC**: Ensure user role has permission for the requested route.
5. **Tenant Scoping**: Inject `schoolId` into request for use in DB queries.
