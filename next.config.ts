import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  serverExternalPackages: ['resend'],
};

export default withBotId(nextConfig);
