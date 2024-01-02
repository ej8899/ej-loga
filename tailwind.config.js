/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}", "node_modules/preline/dist/*.js", 'node_modules/flowbite-react/lib/esm/**/*.js'],
  
  theme: {
    extend: {},
  },
  plugins: [
    import("preline/plugin"), 
    import("flowbite/plugin"),
    import('flowbite/plugin')({
      charts: true,
    }),
  ],

  darkMode: 'class',
}


