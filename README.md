# ACIA – Autonomous Competitive Intelligence Agent

ACIA is a multi-domain AI-powered competitive intelligence platform that monitors competitors, scrapes market updates, summarizes changes, detects pricing and product movements, scores threats, predicts competitor next moves, and generates strategic intelligence for businesses.

The system supports multiple domains such as AI/GenAI, Mobile Phones, Electric Vehicles, SaaS Products, E-commerce, and FinTech.

---

## 🚀 Project Overview

Businesses often need to track competitor updates such as product launches, pricing changes, feature releases, partnerships, market expansion, and strategic announcements. Manually checking competitor websites, blogs, pricing pages, and news sources is time-consuming.

ACIA solves this by automatically collecting competitor updates, analyzing them using AI logic, and presenting useful intelligence through APIs and dashboard-ready data.

---

## ✨ Key Features

- Multi-domain competitor tracking
- Competitor database management
- Domain-specific intelligence
- Blog/news scraping
- Full article content extraction
- PostgreSQL storage
- AI/local summarization
- Category classification
- Threat scoring
- Competitor alerts
- Pricing change detection
- FAISS vector search for similar past updates
- Competitor next-move prediction
- Market trend summaries
- Feature comparison
- AI-generated intelligence reports
- Weekly scheduler support
- Human feedback system

---

## 🧠 Supported Domains

| Domain | Examples |
|---|---|
| AI / GenAI | OpenAI, Anthropic, Perplexity, Mistral AI, Cohere |
| Mobile Phones | Apple, Samsung, OnePlus, Xiaomi, Google Pixel |
| Electric Vehicles | Tesla, BYD, Rivian, Hyundai EV, Tata EV |
| SaaS Products | Notion, Slack, Linear, Atlassian, HubSpot |
| E-commerce | Amazon, Flipkart, Shopify, Meesho |
| FinTech | Razorpay, Stripe, Paytm, PhonePe, PayPal |

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- BeautifulSoup
- Requests
- APScheduler
- FAISS
- Sentence Transformers
- Python

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Framer Motion
- Lucide React

---

## 🏗️ Architecture

text
Competitor Websites / Blogs / News Pages
        ↓
Scraper Service
        ↓
PostgreSQL Database
        ↓
AI Summarization + Category Detection
        ↓
Threat Scoring + Pricing Detection
        ↓
Vector Search + Similar Updates
        ↓
Prediction + Strategic Response
        ↓
Reports / Alerts / Dashboard
