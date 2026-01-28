# TaskFlow - Full Stack Task Management System

A modern, responsive task management application built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Designed for performance, security, and scalability.

🔗 **Live Demo:** https://inreal-task-assignment.vercel.app/

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend:** Supabase (PostgreSQL), Server Actions
- **Auth:** Supabase Auth (Email/Password)
- **Security:** Row Level Security (RLS) policies on PostgreSQL
- **Deployment:** Vercel

---

## 🚀 Setup & Installation

1.  **Clone the repository**

    ```bash
    git clone <your-repo-link>
    cd task-manager
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 🧠 Design & Thinking Process

### 1. Why did you choose Supabase over Firebase?

I went with **Supabase** because it runs on PostgreSQL. For a Task Management app, the data is naturally structured (Users have Tasks), and I prefer the strictness of a Relational Database (SQL) over a document store like Firebase (NoSQL) to avoid data inconsistencies later on.

Also, Supabase's **Row Level Security (RLS)** is a huge time-saver. It let me handle "who can see what" directly in the database layer rather than writing complex permission logic in the API code.

### 2. What factors would make you choose the other option (Firebase) in a real production system?

I would pick Firebase if the project was heavily focused on real-time collaboration (like a live chat or Google Docs-style editing), since Firestore’s listeners are incredibly easy to set up for that.

It would also be my choice if the data structure was unpredictable or constantly changing (like a logging system or raw user activity feeds), where a NoSQL document store handles unstructured JSON better than SQL.

### 3. If this app suddenly gets 10,000 active users, what are the first 3 bottlenecks and how would you address them?

1.  **Database Connections:**
    - _Issue:_ Next.js Server Actions run on serverless functions. A traffic spike could spawn thousands of functions, each trying to open a new connection to Postgres, which would max out the connection limit quickly.
    - _Fix:_ I would enable **Supavisor** (Supabase's built-in connection pooler) to manage these connections efficiently.

2.  **Slow Dashboard Loading:**
    - _Issue:_ Right now, I'm fetching tasks with a simple `SELECT *`. With 10k users generating history, this query would get slower and eat up memory.
    - _Fix:_ I would implement **cursor-based pagination** (infinite scroll) to only fetch 20 items at a time, and add a database index on the `user_id` and `created_at` columns.

3.  **Cold Starts:**
    - _Issue:_ Users might see a 1-2 second delay on the first load if the serverless function is "cold."
    - _Fix:_ I’d move the main data-fetching logic to **Edge Functions** (which start instantly) or implement aggressive caching (Redis) for read-heavy endpoints.

### 4. One design decision you made that is not ideal, but accepted due to time constraints.

**Skipping Optimistic UI Updates.**
Currently, when you click "Add Task" or "Delete," the UI waits for the server to reply before updating the screen. On a slow network, this feels a bit sluggish.

Ideally, I would use React's `useOptimistic` hook to update the UI instantly (assuming success) and roll it back only if the server fails. I prioritized reliable server-side error handling over this UX polish given the 48-hour timeline.

### 5. System Modifications

- **If Supabase is removed:**
  I would switch to a standard **Node.js/Express** backend with a managed **PostgreSQL** instance (like AWS RDS). I’d probably use **Prisma ORM** to handle the database interactions since it gives me similar type-safety to what I have now, and swap Supabase Auth for **NextAuth.js**.

- **If Role-Based Access (RBAC) is introduced:**
  I wouldn't overcomplicate it. I’d create a `roles` table (or add a `role` column to the user profile) containing values like `'admin'` or `'user'`. Then, I’d just update the Postgres RLS policies to check this column (e.g., `IF user.role = 'admin' THEN ALLOW ALL`) so the security rules scale automatically without changing the frontend code.

- **If Activity/Audit logs are required:**
  I would handle this at the database level using a **Postgres Trigger**. Whenever a row in `tasks` is inserted, updated, or deleted, the trigger would automatically write a copy of the change (who, what, when) into a separate `audit_logs` table. This guarantees we capture _every_ change, even if it was done manually via SQL, without cluttering the application logic.

### 6. Technical Choice: Server Actions vs. Manual REST Endpoints

The assignment requirements mentioned using REST APIs. While the Supabase client communicates via REST under the hood, I chose to implement the data layer using **Next.js Server Actions** rather than creating manual API Route Handlers (`app/api/tasks`).

**Reasoning:**

- **Modern Standard:** Server Actions are the recommended pattern for Next.js 14 App Router, allowing us to treat backend logic as callable functions.
- **Type Safety:** This approach preserves strict TypeScript types from the database all the way to the UI, which is often lost when serializing data through a manual `fetch` call.
- **Performance:** It reduces network latency by eliminating the extra HTTP round-trip (Client → Internal API → Database) and communicating directly from the Server Component to the Database.
