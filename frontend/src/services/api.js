import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Competitors API
export const getCompetitors = async (domain) => {
  try {
    const url = domain ? `/competitors/?domain=${domain}` : '/competitors/';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching competitors:', error);
    throw error;
  }
};

// Updates API
export const getUpdates = async (domain) => {
  try {
    const url = domain ? `/updates/?domain=${domain}` : '/updates/';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching updates:', error);
    throw error;
  }
};

// Scraper API - Scrape all competitors
export const scrapeAllCompetitors = async () => {
  try {
    const response = await axiosInstance.post('/scraper/all');
    return response.data;
  } catch (error) {
    console.error('Error scraping competitors:', error);
    throw error;
  }
};

// Scraper API - Scrape competitors for a specific domain
export const scrapeDomainCompetitors = async (domain) => {
  try {
    const response = await axiosInstance.post(`/scraper/domain/${domain}`);
    return response.data;
  } catch (error) {
    console.error(`Error scraping domain ${domain}:`, error);
    throw error;
  }
};

// AI API - Summarize all updates
export const summarizeAllUpdates = async () => {
  try {
    const response = await axiosInstance.post('/ai/updates/summarize-all');
    return response.data;
  } catch (error) {
    console.error('Error summarizing updates:', error);
    throw error;
  }
};

// AI API - Analyze all updates
export const analyzeAllUpdates = async () => {
  try {
    const response = await axiosInstance.post('/ai/updates/analyze-all');
    return response.data;
  } catch (error) {
    console.error('Error analyzing updates:', error);
    throw error;
  }
};

// AI API - Predict all updates
export const predictAllUpdates = async () => {
  try {
    const response = await axiosInstance.post('/ai/updates/predict-all');
    return response.data;
  } catch (error) {
    console.error('Error predicting updates:', error);
    throw error;
  }
};

// Feedback API - Submit feedback for updates
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post('/feedback/', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Alerts API - Generate alerts for all updates
export const generateAlerts = async () => {
  try {
    const response = await axiosInstance.post('/alerts/generate');
    return response.data;
  } catch (error) {
    console.error('Error generating alerts:', error);
    throw error;
  }
};

// Alerts API - Get all alerts
export const getAlerts = async (domain) => {
  try {
    const url = domain ? `/alerts/?domain=${domain}` : '/alerts/';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

// Alerts API - Get unread alerts
export const getUnreadAlerts = async (domain) => {
  try {
    const url = domain ? `/alerts/unread?domain=${domain}` : '/alerts/unread';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread alerts:', error);
    throw error;
  }
};

// Alerts API - Mark alert as read
export const markAlertAsRead = async (alertId) => {
  try {
    const response = await axiosInstance.put(`/alerts/${alertId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }
};

// Pricing API - Detect pricing changes for all updates
export const detectPricingChanges = async () => {
  try {
    const response = await axiosInstance.post('/pricing/detect-all');
    return response.data;
  } catch (error) {
    console.error('Error detecting pricing changes:', error);
    throw error;
  }
};

// Pricing API - Detect pricing change for one update
export const detectPricingChangeForUpdate = async (updateId) => {
  try {
    const response = await axiosInstance.post(`/pricing/detect/${updateId}`);
    return response.data;
  } catch (error) {
    console.error('Error detecting pricing change for update:', error);
    throw error;
  }
};

// Comparison API - Get feature comparison
export const getFeatureComparison = async (domain) => {
  try {
    const url = domain ? `/comparison/features?domain=${domain}` : '/comparison/features';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature comparison:', error);
    throw error;
  }
};

// Trends API - Get market trend summary
export const getMarketTrendSummary = async (domain, days = 30) => {
  try {
    const params = new URLSearchParams();
    if (domain) params.append('domain', domain);
    if (days) params.append('days', days);
    
    const url = `/trends/summary?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching market trend summary:', error);
    throw error;
  }
};

// Reports API - Generate competitive intelligence report
export const generateReport = async (domain, days = 30) => {
  try {
    const params = new URLSearchParams();
    if (domain) params.append('domain', domain);
    if (days) params.append('days', days);
    
    const url = `/reports/generate?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export default axiosInstance;
