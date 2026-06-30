import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        midnight: 'rgb(var(--color-midnight) / <alpha-value>)',
        champagne: 'rgb(var(--color-champagne) / <alpha-value>)',
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)',
        teal: 'rgb(var(--color-teal) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius-sm)',
        xl: 'var(--radius-md)',
        '2xl': 'var(--radius-lg)',
        '3xl': 'var(--radius-xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        luxury: 'var(--shadow-luxury)',
        gold: 'var(--shadow-gold)',
      },
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
      transitionTimingFunction: {
        luxury: 'var(--ease-luxury)',
      },
    },
  },
  plugins: [],
};
export default config;
