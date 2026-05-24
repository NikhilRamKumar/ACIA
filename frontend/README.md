# ACIA Frontend - Autonomous Competitive Intelligence Agent

A stunning, dark-themed React + Vite frontend for the ACIA competitive intelligence dashboard. Built with cutting-edge technologies for a premium SaaS experience.

## 🚀 Features

- **Beautiful Dark Theme**: Premium dark UI inspired by GitHub, Discord, Netflix, and Spotify
- **Real-time Dashboard**: Monitor competitive intelligence with live data
- **Competitor Tracking**: Search and filter competitors by industry
- **Threat Analysis**: Color-coded threat level indicators (Low/Medium/High)
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Design**: Perfectly optimized for all devices
- **Glassmorphism UI**: Modern gradient cards and effects
- **Neon Accents**: Electric blue, cyan, purple, and green highlights

## 📋 Tech Stack

- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Lucide React** - Beautiful icons

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation with logo
│   │   ├── StatCard.jsx          # Statistics display cards
│   │   ├── UpdateCard.jsx        # Competitor update cards
│   │   ├── CompetitorCard.jsx    # Competitor profile cards
│   │   ├── ActionButton.jsx      # CTA buttons with effects
│   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   └── Toast.jsx             # Notifications
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main intelligence dashboard
│   │   ├── Competitors.jsx       # Competitor listing & search
│   │   └── Updates.jsx           # Updates with filters
│   ├── services/
│   │   └── api.js               # Axios API calls
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## 🔧 Setup & Installation

### Step 1: Navigate to Frontend Directory

```bash
cd ACIA/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React & React DOM
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- Tailwind CSS
- Vite & build tools

### Step 3: Verify Configuration Files

The following files are already configured:

✅ `vite.config.js` - Vite configuration
✅ `tailwind.config.js` - Tailwind CSS theme
✅ `postcss.config.js` - PostCSS plugins
✅ `.gitignore` - Git ignore rules

### Step 4: Backend CORS Configuration

Your backend has been updated with CORS middleware. Verify in `backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Running the Application

### Option 1: Development Mode (Recommended)

Run the frontend development server:

```bash
npm run dev
```

**Output:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Visit: **http://localhost:5173** in your browser

### Option 2: Production Build

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## 🔗 Backend Connection

The frontend connects to your FastAPI backend at:

**Backend API Base URL:** `http://127.0.0.1:8000`

### API Endpoints Used

| Method | Endpoint | Function |
|--------|----------|----------|
| GET | `/competitors/` | Fetch all competitors |
| GET | `/updates/` | Fetch all updates |
| POST | `/scraper/all` | Scrape all competitors |
| POST | `/ai/updates/summarize-all` | Summarize updates |
| POST | `/ai/updates/analyze-all` | Analyze all updates |

### API Service File

All API calls are in `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getCompetitors = async () => { ... }
export const getUpdates = async () => { ... }
export const scrapeAllCompetitors = async () => { ... }
export const summarizeAllUpdates = async () => { ... }
export const analyzeAllUpdates = async () => { ... }
```

**To change the API URL**, edit line 3 in `src/services/api.js`:

```javascript
const API_BASE_URL = 'your-api-url-here';
```

## 📱 Running Both Frontend & Backend

### Terminal 1: Backend (Port 8000)

```bash
cd ACIA/backend
uvicorn app.main:app --reload
```

**Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2: Frontend (Port 5173)

```bash
cd ACIA/frontend
npm run dev
```

**Output:**
```
➜  Local:   http://localhost:5173/
```

### Access the Application

- **Frontend Dashboard:** http://localhost:5173
- **Backend API:** http://127.0.0.1:8000
- **API Docs:** http://127.0.0.1:8000/docs

## 🎨 Dashboard Features

### Dashboard Page (`/`)

- **Statistics Cards**: Total competitors, updates, high threats, analyzed updates
- **Intelligence Operations**: 
  - 🗄️ Scrape All - Fetch competitor data
  - 🧠 Summarize All - Generate AI summaries
  - 📈 Analyze All - Calculate threat scores
- **Recent Updates**: Display latest competitor activities
- **Real-time Refresh**: Auto-update after operations

### Competitors Page (`/competitors`)

- **Competitor Cards**: Name, industry, description
- **Links**: Website, Blog, GitHub, Documentation
- **Search**: Filter by name, industry, or description
- **Industry Filter**: Quick filter by industry
- **Glassmorphism Design**: Modern card effects

### Updates Page (`/updates`)

- **Update Cards**: Title, summary, category, threat score
- **Threat Indicators**: Color-coded (Low/Medium/High)
- **Search & Filter**:
  - Search by title/summary
  - Filter by category
  - Filter by threat level
- **Color Coding**:
  - 🟢 Low: 1-3 (Green)
  - 🟡 Medium: 4-6 (Yellow)
  - 🔴 High: 7-10 (Red)

## 🎯 Usage Guide

### Viewing Dashboard

1. Open http://localhost:5173
2. See real-time statistics
3. Click "Scrape All" to fetch competitor updates
4. Click "Analyze All" to calculate threat scores
5. Check recent updates below

### Managing Competitors

1. Go to **Competitors** page
2. Search competitors by name/industry
3. Filter by industry using buttons
4. Click website links to visit competitor sites
5. Access GitHub, blogs, and documentation

### Monitoring Updates

1. Go to **Updates** page
2. View all competitor updates sorted by threat
3. Search for specific updates
4. Filter by category or threat level
5. Check external links for detailed information

### Interpreting Threat Scores

- **1-3 (Low)**: Minor changes, low priority
- **4-6 (Medium)**: Important updates, monitor closely
- **7-10 (High)**: Critical threats, immediate attention

## 🛠️ Development

### Modifying Components

Components are in `src/components/`:

```javascript
// Example: Modify Navbar colors
// src/components/Navbar.jsx
<span className="text-neon-blue hover:text-neon-cyan">ACIA</span>
```

### Tailwind Custom Colors

Edit `tailwind.config.js` to change theme:

```javascript
theme: {
  extend: {
    colors: {
      'dark-bg': '#0f1419',
      'neon-blue': '#00d4ff',
      // ... customize as needed
    },
  },
}
```

### Adding New Pages

1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`:

```javascript
<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation in `Navbar.jsx`

### API Error Handling

The API service includes error handling and logging:

```javascript
// Automatic error logging in src/services/api.js
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder.

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
```

### Environment Variables

Create `.env.local` for environment-specific config:

```env
VITE_API_BASE_URL=https://your-backend-api.com
```

Then update `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
```

## 📦 Git Commands

### Initialize Git Repository

```bash
cd ACIA
git init
```

### Add All Files

```bash
git add .
```

### Create Initial Commit

```bash
git commit -m "Initial commit: ACIA frontend and backend"
```

### Add Remote Repository

```bash
git remote add origin https://github.com/your-username/ACIA.git
```

### Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## 🔍 Troubleshooting

### Frontend Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Errors

✅ **Solution**: CORS middleware is already added to backend
- Ensure backend is running on `http://127.0.0.1:8000`
- Check `src/services/api.js` has correct API_BASE_URL
- Verify backend CORS allows `http://localhost:5173`

### API Calls Not Working

1. Check backend is running: `uvicorn app.main:app --reload`
2. Verify API endpoint in browser: `http://127.0.0.1:8000/competitors/`
3. Check browser console for error messages
4. Ensure data exists in database

### Build Errors

```bash
# Clear cache
npm cache clean --force
npm install
npm run build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Axios Documentation](https://axios-http.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 📄 License

This project is part of ACIA - Autonomous Competitive Intelligence Agent.

## 🤝 Contributing

To contribute improvements:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify backend API is responding
4. Check network tab in browser DevTools

---

**Happy Building! 🚀**

Your ACIA dashboard is ready to showcase competitive intelligence like never before.
