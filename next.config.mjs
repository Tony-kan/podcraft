/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true
	  },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lovely-flamingo-139.convex.cloud",
			},
			{
				protocol:'https',
				hostname:"amicable-bobcat-621.convex.cloud",
			}
			,{
				protocol:"https",
				hostname:'img.clerk.com',
				
			}
		],
	},
};

export default nextConfig;
