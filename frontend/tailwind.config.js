/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit', 
  content: [
    "./index.html", // 包含根 HTML 文件
    "./src/**/*.{js,jsx,ts,tsx}", // 包含所有 React 文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

