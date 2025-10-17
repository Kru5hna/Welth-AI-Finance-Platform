# 💰 Welth - AI-Powered Finance Platform

<div align="center">

<img width="1470" alt="Screenshot 2024-12-10 at 9 45 45 AM" src="https://raw.githubusercontent.com/Kru5hna/Welth-AI-Finance-Platform/master/public/github.png">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Arcjet](https://img.shields.io/badge/Arcjet-101725?style=for-the-badge&logo=arcjet&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-00BFFF?style=for-the-badge&logo=google&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-000000?style=for-the-badge&logo=inngest&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)

**💰 AI-powered finance platform with smart transaction categorization, receipt scanning 📸, and personalized monthly insights 📊 to master your budget. Built with Next.js 15. ✨**
</div>

---

## 📋 Overview

Welth is a comprehensive AI-powered finance platform designed to simplify personal finance management. Built with modern web technologies, it combines smart categorization, predictive analytics, and automated reporting to help users make informed financial decisions.

---

## ✨ Key Features

- 🤖 **AI-Powered Categorization** — Automatically classifies transactions with 95%+ accuracy
- 📸 **Smart Receipt Scanning** — Extract transaction details from receipts using Gemini API OCR
- 🔄 **Recurring Transaction Detection** — Identifies and tracks subscription patterns
- 💡 **Intelligent Budget Management** — Set limits with real-time email alerts at 75%, 90%, and 100%
- 📊 **Interactive Analytics Dashboard** — Visualize spending patterns with dynamic charts (pie, bar, line)
- 📧 **AI Monthly Reports** — Receive personalized financial insights via email
- 📱 **Fully Responsive Design** — Seamless experience across all devices
- 🔒 **Secure Authentication** — Protected with Clerk authentication
- ⚡ **Real-time Updates** — Instant synchronization across sessions

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn UI, Recharts  
**Backend:** Supabase (PostgreSQL), Prisma ORM  
**Auth & Security:** Clerk Authentication, Arcjet (Rate limiting & DDoS protection)  
**AI/Automation:** Gemini API (OCR), Inngest (Background jobs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase, Clerk, and Inngest accounts

### Installation
```bash
# Clone the repository
git clone https://github.com/Kru5hna/Welth-AI-Finance-Platform.git
cd welth

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# Database
DATABASE_URL="your-supabase-url"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
CLERK_SECRET_KEY="your-clerk-secret"

# Inngest
INNGEST_EVENT_KEY="your-inngest-key"

# Arcjet
ARCJET_KEY="your-arcjet-key"
```

### Run the Application
```bash
# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 Core Functionality

### Income & Expense Tracking
- Manual transaction entry with intuitive forms
- Bulk import from CSV/Excel
- Real-time balance calculations
- Transaction history with filtering

### Smart Categorization
- AI automatically categorizes transactions
- Custom category creation
- Manual override options
- Learning from user corrections

### Receipt Scanning
- Upload receipt images
- Gemini API extracts merchant, amount, date, and items
- Auto-creates transaction entries
- Supports multiple image formats

### Budget Management
- Set category-wise spending limits
- Visual progress indicators
- Email alerts at 75%, 90%, and 100% thresholds
- Monthly budget reset automation

### Analytics & Insights
- Interactive spending charts (pie, bar, line graphs)
- Category-wise breakdowns
- Month-over-month comparisons
- Income vs. expense trends

### AI Monthly Reports
- Automated email reports every month
- Personalized spending insights
- Budget performance analysis
- Actionable recommendations

---



## 👤 Author

**Your Name**  
GitHub: [@Kru5hna](https://github.com/Kru5hna) 

---


<div align="center">

⭐ **Star this repo if you find it helpful!**

Made with ❤️ and ☕

</div>
