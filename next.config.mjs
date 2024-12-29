/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	// Disable server-side rendering for Tauri
	images: { unoptimized: true },
};

export default nextConfig;
