// tailwind.config.js
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}', // Include this if you're using the App Router
        // IMPORTANT: Add the path to your Markdown files here!
        './public/content/**/*.md', // Adjust this path to match your actual structure
        // If your MD files are elsewhere, e.g., in a `src` directory:
        // './src/content/**/*.md',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};