# find the bug

> AI-powered code error analyzer. Paste your error, understand what happened.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square)

## What it does

'Find the bug' is a code helper that lets you paste any error message or stack trace and get a clear, direct explanation of what went wrong and how to fix it — powered by Groq's LLaMA 3.3 70B model.

Every analysis is saved to your account so you can revisit past debugging sessions anytime.

## Features

- AI-powered error diagnosis with cause, fix, and corrected code example
- Optional code snippet context for more accurate analysis
- Full authentication with email/password via Supabase Auth
- Password recovery flow with custom email templates
- Analysis history per user, stored with Row Level Security
- Minimal dark UI with split-panel layout

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Groq API — LLaMA 3.3 70B |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL + RLS) |
| Deploy | Vercel |

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/RafaVPDev/code-helper.git
cd code-helper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- Get your Groq API key at [console.groq.com](https://console.groq.com)
- Get your Supabase credentials at [supabase.com](https://supabase.com)

### 4. Set up the database

Run the following SQL in your Supabase SQL Editor:

```sql
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  error_message text not null,
  code_snippet text,
  response text not null,
  created_at timestamp with time zone default now()
);

alter table analyses enable row level security;

create policy "users can only see their own analyses"
  on analyses for select
  using (auth.uid() = user_id);

create policy "users can only insert their own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
  app/
    api/analyze/      # Groq API route
    login/            # Auth page (login, register, forgot password)
    reset-password/   # Password reset page
    page.tsx          # Main application
  components/
    ErrorInput.tsx    # Error and code input fields
    ResponseCard.tsx  # AI response display with markdown rendering
  middleware.ts       # Route protection
  utils/
    supabase/
      client.ts       # Browser Supabase client
      server.ts       # Server Supabase client
```

## License

MIT
