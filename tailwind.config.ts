import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111827',
        muted: '#f6f7f9',
        'muted-foreground': '#6b7280',
        border: '#e5e7eb',
        card: '#ffffff',
        primary: '#111827',
        'primary-foreground': '#ffffff',
        accent: '#0f766e',
        'accent-soft': '#ecfdf5',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
      borderRadius: { lg: '0.5rem', xl: '0.75rem' },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
