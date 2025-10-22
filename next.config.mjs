/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns : [
         {
            protocol: "https",
            hostname: "randomuser.me",
         },
      ],
   },
// next js has something limit when it comes to file sizes
   experimental: {
      serverActions: {
         bodySizeLimit: "5mb",
      }
   }
};



export default nextConfig;
