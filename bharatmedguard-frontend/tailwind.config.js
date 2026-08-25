/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bmg: {
          navy: '#071A33',        // Deep Navy (Background base)
          midnight: '#0B2347',    // Midnight Blue (Card / Surface base)
          card: '#0D2B56',        // Elevated Card Surface
          surface: '#103366',     // Higher elevation / hover surface
          royal: '#1261A0',       // Royal Healthcare Blue
          cyan: '#22D3EE',        // Electric Cyan (Accent & Cyber glow)
          medical: '#2F80ED',     // Medical Blue
          soft: '#DCEEFF',        // Soft Blue (Subtle text / borders)
          muted: '#8DA4C4',       // Muted text
          border: '#1A3F70',      // Structural border
          borderBright: '#245A9E',// Highlight border
          // Indian Identity Accents
          saffron: '#FF9933',     // Indian Saffron
          green: '#138808',       // Indian Green
          white: '#FFFFFF',       // Indian White
        },
        risk: {
          low: '#22C55E',         // Low Risk (Green)
          medium: '#F59E0B',      // Medium Risk (Amber)
          high: '#F97316',        // High Risk (Orange)
          critical: '#EF4444',    // Critical Risk (Danger Red)
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(34, 211, 238, 0.25)',
        'blue-glow': '0 0 25px -5px rgba(18, 97, 160, 0.35)',
        'red-glow': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'amber-glow': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'green-glow': '0 0 25px -5px rgba(34, 197, 94, 0.35)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'cyber-grid': 'radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.08) 1px, transparent 0)',
        'tricolor-gradient': 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
        'shield-radial': 'radial-gradient(circle at 50% 30%, rgba(18, 97, 160, 0.3) 0%, rgba(7, 26, 51, 0.95) 70%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-right': 'flowRight 2s linear infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
      },
      keyframes: {
        flowRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0.2' },
        },
        scanLine: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '95%' },
        }
      }
    },
  },
  plugins: [],
}
