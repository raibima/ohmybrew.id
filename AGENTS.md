<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

- **Always check**:
  - `business.md` for product/operations context.
  - `design.md` for brand, design tokens, and UI rules.
- Always test your changes by running `bun run build`.
- Run `bun run test` to run tests. Do not use `bun test` as it has different semantics.
- Make it secure.
