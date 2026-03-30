# 💸 SpendWise

> A real-time personal finance tracker built for students and professionals who want zero friction between them and their money.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## Overview

SpendWise is a full-stack financial management app engineered around a **live-first** philosophy. Every transaction, budget update, and savings milestone syncs in real time — no stale data, no accidental overspending because your dashboard was a few seconds behind.

Built with React, Tailwind CSS, and Supabase, the stack is lean but production-ready, with a modular architecture designed to grow.

---

## Features

| Feature | Description |
|---|---|
| ⚡ Real-Time Sync | Budget changes and transactions reflect in under 100ms using cloud-native sockets |
| 📊 Analytics Dashboard | Interactive charts (Chart.js + Recharts) to visualize spending velocity and trends |
| 🔐 Row-Level Security | JWT-based auth with middleware ensuring users can only access their own data |
| 🤖 AI Spending Insights | Proactive AI nudges that act as a financial co-pilot for smarter decisions |

---

## Tech Stack
```
Frontend    → React.js (component-based UI, state management)
Styling     → Tailwind CSS (utility-first, custom SpendWise green palette)
Backend     → Supabase + PostgreSQL (real-time DB, cloud functions, auth)
Charts      → Chart.js + Recharts
Auth        → JWT (JSON Web Tokens)
```

---

## How It Works
```
User Action
    ↓
Optimistic UI Update  ← instant feel, no waiting
    ↓
Supabase API Call
    ↓
PostgreSQL Persistence
    ↓
Edge Function → updates financial health score + AI feedback
```

---

## Roadmap

- [ ] Multi-currency support
- [ ] Bank API integration
- [ ] Mobile app (React Native)
- [ ] Recurring expense detection

---

## Team

**Team 7**

| Name | Roll Number |
|---|---|
| C Pravin Sai | 2420030777 |
| G Likith | 2420030056 |
| J Hemanth | 2420039805 |
| K Karthik | 2420030343 |

**Faculty Guide**: Dr. B. Dwarakanath, Assistant Professor

---

## License

This project is for academic purposes under KL University.
