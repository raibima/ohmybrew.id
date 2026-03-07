import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  serverExternalPackages: ["resend"],
};

export default withBotId(withMDX(nextConfig));
