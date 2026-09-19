import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				overlay: "hsl(var(--overlay))",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				indigo: "hsl(var(--indigo))",
			},
			fontFamily: {
				sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
				display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			backgroundImage: {
				"gradient-primary":
					"linear-gradient(135deg, hsl(var(--primary)), hsl(var(--indigo)))",
				"gradient-subtle":
					"linear-gradient(180deg, hsl(var(--card)), hsl(var(--background)))",
			},
			boxShadow: {
				"glow-primary": "0 0 32px hsl(var(--primary) / 0.35)",
				"glow-primary-lg": "0 8px 40px -8px hsl(var(--primary) / 0.5)",
				"glow-rose": "0 0 24px hsl(var(--destructive) / 0.35)",
				"glow-emerald": "0 0 24px hsl(var(--success) / 0.3)",
				"glow-amber": "0 0 24px hsl(var(--warning) / 0.3)",
				soft: "0 4px 24px -6px hsl(var(--foreground) / 0.15)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"fade-in-up": {
					from: { opacity: "0", transform: "translateY(8px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"pulse-glow": {
					"0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--destructive) / 0.5)" },
					"50%": { boxShadow: "0 0 18px 3px hsl(var(--destructive) / 0.4)" },
				},
				"gradient-x": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
				ticker: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(-50%)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-8px)" },
				},
				blink: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-in-up": "fade-in-up 0.3s ease-out",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"gradient-x": "gradient-x 4s ease-in-out infinite",
				ticker: "ticker 32s linear infinite",
				float: "float 5s ease-in-out infinite",
				blink: "blink 1s step-end infinite",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
