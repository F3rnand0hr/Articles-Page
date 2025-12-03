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
                    500: '#e04040',
                    600: '#b33333',
                    700: '#8a2d32',
                    800: '#632024',
                    900: '#3d1416',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
}
