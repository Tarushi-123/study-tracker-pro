# StudyPro 📚

StudyPro is a full-stack student productivity and academic deadline management application designed to help college students organize assignments, class tests, deadlines, and important academic events in one place.

The application uses persistent backend data so users can create, update, track, and manage their academic activities instead of relying on static or temporary frontend data.

---

## 🚀 Features

### 📋 Task Management

Users can create and manage academic tasks such as:

- Assignments
- Class Tests

Each task contains information such as:

- Title
- Subject
- Description
- Due Date
- Priority
- Status

### 🎯 Priority Management

Tasks can be categorized by priority:

- 🔴 High
- 🟡 Medium
- 🔵 Low

This allows students to quickly identify which tasks require the most attention.

### 📊 Progress Tracking

Each task can have a progress status:

- Not Started
- In Progress
- Completed

Students can track their academic workload and monitor which tasks are still pending.

### 📅 Calendar

StudyPro provides a calendar-based view of academic activities.

The calendar displays:

- Assignments
- Class Tests
- Hackathons
- Workshops
- Seminars
- Competitions
- College Events
- Scholarship Deadlines
- Internship Deadlines
- Project Deadlines
- Registration Deadlines
- Other important events

Tasks and events are visually differentiated using colors and indicators.

### 🔔 Deadline Awareness

StudyPro identifies deadline urgency such as:

- Overdue
- Due Today
- Due Tomorrow
- Upcoming

This helps students prioritize their workload based on approaching deadlines.

### 🏆 Student Events

Users can add non-academic-task events such as:

- Hackathons
- Workshops
- Seminars
- Competitions
- Club Events
- College Events
- Scholarship Deadlines
- Internship Deadlines
- Registration Deadlines

Each event can contain:

- Event title
- Event type
- Date
- Start time
- End time
- Location
- Description
- Event URL
- Reminder
- Notes

### 🔎 Search & Filtering

Users can search and filter tasks and events to quickly find relevant information.

### 👤 Authentication

Users can securely sign up and log in.

User-specific data ensures that users can access and manage their own tasks and events.

### 🔐 Ownership & Permissions

Database-level security is used to ensure that users can only access and modify their own data.

### 📱 Responsive Design

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

### ⚠️ Application States

StudyPro handles common application states gracefully:

- Loading states
- Empty states
- Validation errors
- Network/database errors
- Retry actions

---

# 🛠️ Tech Stack

## Frontend

- React
- JavaScript / TypeScript
- HTML5
- CSS
- Responsive UI components

## Backend

- Node.js
- Express.js

## Database & Authentication

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

## Development Tools

- Git
- GitHub
- Vite / Next.js depending on the configured application architecture

---

# 🏗️ Application Architecture

The application follows a client-server architecture.

```text
                ┌─────────────────────┐
                │       User          │
                │   Web / Mobile      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     React UI        │
                │                     │
                │ Dashboard           │
                │ Tasks               │
                │ Calendar            │
                │ Events              │
                │ Authentication      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Node.js / Express   │
                │      Backend        │
                │                     │
                │ API Routes          │
                │ Validation          │
                │ Business Logic      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      Supabase       │
                │                     │
                │ PostgreSQL Database │
                │ Authentication      │
                │ Row Level Security  │
                └─────────────────────┘