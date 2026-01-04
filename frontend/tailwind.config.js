/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // SNORQ Brand - Lime Green
                primary: {
                    50: '#f4fae8',
                    100: '#e6f4c7',
                    200: '#d4ed92',
                    300: '#b9e04e',
                    400: '#a3d63d',
                    500: '#8cc63f',
                    600: '#7ab82e',
                    700: '#5e9122',
                    800: '#4a721b',
                    900: '#3d5e19',
                },
                // Platform colors
                tiktok: {
                    DEFAULT: '#000000',
                    accent: '#fe2c55',
                },
                whatsapp: {
                    DEFAULT: '#25d366',
                    dark: '#128c7e',
                },
                facebook: {
                    DEFAULT: '#1877f2',
                    dark: '#0866ff',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
