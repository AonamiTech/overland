
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0E32E8',
					foreground: '#FFFFFF'
				},
				// Aonami blue reskin of Tailwind's red ramp — every existing
				// `*-red-*` utility now renders on brand.
				red: {
					50: '#EEF2FF',
					100: '#DBE3FF',
					200: '#B9C6FF',
					300: '#8FA7FF',
					400: '#5A78F0',
					500: '#0E32E8',
					600: '#043EDB',
					700: '#0330A8',
					800: '#04278A',
					900: '#021C5F',
				},
				// Aonami design tokens (for new work)
				'aonami-blue': '#0E32E8',
				'aonami-indigo': '#043EDB',
				'aonami-lightblue': '#8FA7FF',
				'aonami-lavender': '#8A9BEF',
				ink: '#090A0F',
				'soft-black': '#111217',
				cloud: '#F4F4F6',
				pill: '#E8E8EA',
				line: '#C9CBD2',
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
				'truck-red': '#0E32E8',
				'truck-black': '#090A0F',
				'truck-gray': '#F4F4F6'
			},
			fontFamily: {
				// Remapped to the Aonami three-face system. Existing
				// `font-sf-pro` -> Khand (display), `font-poppins` -> Manrope (body).
				'sf-pro': ['Khand', 'Manrope', 'system-ui', 'sans-serif'],
				'poppins': ['Manrope', 'system-ui', 'sans-serif'],
				'display': ['Khand', 'Manrope', 'sans-serif'],
				'manrope': ['Manrope', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'tire-roll': {
					'0%': { transform: 'translateX(-100%) rotate(0deg)' },
					'100%': { transform: 'translateX(100vw) rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.8s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'tire-roll': 'tire-roll 8s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
