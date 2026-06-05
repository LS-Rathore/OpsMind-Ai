/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                "deep-midnight": "#0c0c0b",
                "faded-steel": "#1f2228",
                "frost-white": "#ffffff",
                "muted-ash": "#7d8187",
                "whisper-gray": "#474747",
                "electric-blue": "#2563eb",
            },
        },
    },
    plugins: [],
}