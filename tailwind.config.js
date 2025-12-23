/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf3f3',
                    100: '#f9d9d9',
                    200: '#f3b3b3',
                    300: '#ed8d8d',
                    400: '#e76666',
                    500: '#8a2d32',
                    600: '#7a272b',
                    700: '#6a2124',
                    800: '#5a1b1d',
                    900: '#4a1516',
                },
                navy: {
                    50: '#e6f0f5',
                    100: '#cce1eb',
                    200: '#99c3d7',
                    300: '#66a5c3',
                    400: '#3387af',
                    500: '#00699b',
                    600: '#005a87',
                    700: '#004b73',
                    800: '#003c5f',
                    900: '#002d4b',
                },
                gold: {
                    50: '#fffbf0',
                    100: '#fff7e0',
                    200: '#ffefc1',
                    300: '#ffe7a2',
                    400: '#ffdf83',
                    500: '#d4af37',
                    600: '#b8941f',
                    700: '#9c7a07',
                    800: '#806000',
                    900: '#644600',
                },
            },
            fontFamily: {
                serif: ['Georgia', 'Times New Roman', 'serif'],
                sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
}
