# 💰 Personal Finance Visualizer

A full-stack web application to help users track transactions, set monthly budgets, and visualize their spending trends. Built using **Next.js**, **MongoDB**, **Recharts**, **OAuth**, **JWT** and **shadcn/ui**.

[![Tech](https://img.shields.io/badge/Next.js-14-blue?logo=nextdotjs)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-orange)](https://recharts.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

🔗 **Live Demo**:(https://personal-finance-visualizer-kohl.vercel.app/)

---

## 🚀 Features

- 📥 Add, view, and delete transactions  
- 📊 Pie chart for category-wise monthly spending  
- 📈 Bar chart for monthly expenses over time  
- 📌 Set and manage monthly budgets  
- ✅ Track spending vs budget via progress bars  
- 📅 Filter transactions by month and year  
- 🌙 Full dark-mode toggle (system-aware)  
- 🔐 OAuth login (Google) 
- 🕸️ GraphQL API 

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui  
- **Backend**: Next.js API Routes, **GraphQL** (Apollo Server + resolvers), MongoDB Atlas, Mongoose  
- **Charts**: Recharts  
- **Validations**: zod  
- **UI/UX**: Tailwind + shadcn/ui with **Dark-mode support**  
- **Auth**: OAuth (Google) + JWT sessions

---

## 🌐 Pages

| Route           | Description                          |
|----------------|--------------------------------------|
| `/`            | Dashboard (summary, charts, budget)  |
| `/transactions`| Add & manage transactions            |
| `/budgets`     | Create & update monthly budgets      |
| `/dashboard`   | Optional advanced charts             |

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/MEETparmar230/personal-finance-visualizer.git
   cd personal-finance-visualizer

2. **Install dependencies**
   pnpm install
   # or
   npm install

3. **Set up environment variables**
   ```bash
   # .env.local
   MONGO_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=any_random_string
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_ID=your_google_oauth_client_id
   GOOGLE_SECRET=your_google_oauth_client_secret
   ```

4. **Run the development server**
   pnpm run dev

5. Open http://localhost:3000 in your browser.

---

## 📦 Future Enhancements

- 📄 Export reports to PDF  
- 💸 Income tracking & multi-account support  
- 📈 AI-based expense prediction  
- 🔔 Real-time spend alerts (web-push)

---