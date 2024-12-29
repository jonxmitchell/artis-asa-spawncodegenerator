const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,jsx,mdx}",
		"./src/components/**/*.{js,jsx,mdx}",
		"./src/app/**/*.{js,jsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [nextui()],
};