import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        // AccountsHub brand (logo navy #242c5d = 800); blue aliases it.
        brand: {
          50: '#eef0fa', 100: '#dde1f4', 200: '#bcc3e9', 300: '#929cd9', 400: '#6773c4',
          500: '#4752ad', 600: '#343f93', 700: '#2b3478', 800: '#242c5d', 900: '#1c2349', 950: '#121634',
        },
        purple: { 50: '#eef0fa', 100: '#dde1f4', 200: '#bcc3e9', 300: '#929cd9', 400: '#6773c4', 500: '#4752ad', 600: '#343f93', 700: '#2b3478', 800: '#242c5d', 900: '#1c2349', 950: '#121634' },
        indigo: {
          50: '#eef0fa', 100: '#dde1f4', 200: '#bcc3e9', 300: '#929cd9', 400: '#6773c4',
          500: '#4752ad', 600: '#343f93', 700: '#2b3478', 800: '#242c5d', 900: '#1c2349', 950: '#121634',
        },
        blue: {
          50: '#eef0fa', 100: '#dde1f4', 200: '#bcc3e9', 300: '#929cd9', 400: '#6773c4',
          500: '#4752ad', 600: '#343f93', 700: '#2b3478', 800: '#242c5d', 900: '#1c2349', 950: '#121634',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        flippa: {
          blue: '#0062FF',
          navy: '#001B44',
          lightBlue: '#EBF2FF',
          lightGray: '#F5F7F9',
          gray: '#6E7A8A',
          darkGray: '#3A4251',
          green: '#178573',
          yellow: '#FFC02B'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'pulse-light': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'wave': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'pulse-light': 'pulse-light 2s ease-in-out infinite',
        'wave': 'wave 20s linear infinite'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #121634 0%, #242c5d 55%, #343f93 100%)',
      },
      boxShadow: {
        // neumorphic: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff'
		 neumorphic: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
