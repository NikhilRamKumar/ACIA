# ACIA – Autonomous Competitive Intelligence Agent

ACIA is a multi-domain AI-powered competitive intelligence platform that helps businesses monitor competitors, track market updates, analyze strategic signals, generate threat scores, predict competitor moves, and create intelligence reports.

The platform supports multiple business domains such as AI/GenAI, Mobile Phones, SaaS Products, Electric Vehicles, E-commerce, and FinTech.

---

## Live Demo

Frontend: https://acia-frontend.vercel.app  
Backend API: https://acia-backend.onrender.com  
Swagger Docs: https://acia-backend.onrender.com/docs

---

## Project Overview

Companies need to constantly monitor competitor activities such as product launches, pricing changes, feature releases, partnerships, market expansion, and strategic announcements.

Doing this manually is time-consuming and difficult.

ACIA solves this by collecting competitor updates, storing them, analyzing them, and presenting useful intelligence through a modern dashboard.

---

## Key Features

- Multi-domain competitive intelligence
- Competitor management
- Domain-specific dashboards
- Blog/news/RSS/sitemap-based update collection
- PostgreSQL data storage
- AI/local summarization
- Category classification
- Threat/risk scoring
- Pricing change detection
- Competitor alerts
- Market trend summaries
- Feature comparison
- AI-generated intelligence reports
- Prediction of competitor next moves
- Recommended strategic response
- Full update analysis modal
- Dark themed modern frontend
- Deployed frontend and backend

---

## Supported Domains

| Domain | Example Competitors |
|---|---|
| AI / GenAI | OpenAI, Anthropic, Perplexity, Mistral AI, Cohere |
| Mobile Phones | Apple, Samsung, Google Pixel, OnePlus, Xiaomi |
| Electric Vehicles | Tesla, BYD, Rivian, Hyundai EV, Tata EV |
| SaaS Products | Notion, Slack, Linear, Atlassian, HubSpot |
| E-commerce | Amazon, Flipkart, Meesho, Shopify, eBay |
| FinTech | Razorpay, Stripe, Paytm, PhonePe, PayPal |

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion
- Lucide React
- Vercel

### Backend

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- BeautifulSoup
- Requests
- Feedparser
- APScheduler
- OpenAI API / local fallback logic
- Render

### Database

- Supabase PostgreSQL


## System Architecture
User
 ↓
React + Vite Frontend
 ↓
FastAPI Backend
 ↓
PostgreSQL Database
 ↓
Scraper / RSS / Sitemap Collector
 ↓
AI Summarization + Category Detection
 ↓
Threat Scoring + Prediction
 ↓
Reports / Alerts / Dashboard
