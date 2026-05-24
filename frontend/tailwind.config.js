/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f1419',
        'dark-card': '#1a1f2e',
        'dark-border': '#2a3f5f',
        'neon-blue': '#00d4ff',
        'neon-cyan': '#00f0ff',
        'neon-purple': '#b300ff',
        'neon-violet': '#8b5cf6',
        'neon-green': '#39ff14',
        'threat-low': '#10b981',
        'threat-medium': '#f59e0b',
        'threat-high': '#ef4444',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(179, 0, 255, 0.5)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
