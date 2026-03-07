import { render, screen } from "@testing-library/react";
import BlogIndexPage from "./page";
import { getAllBlogPosts } from "@/lib/blog";

jest.mock("@/lib/blog", () => ({
  formatBlogDate: jest.fn(() => "7 March 2026"),
  getAllBlogPosts: jest.fn(),
}));

describe("Blog Index Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders blog posts from the MDX content list", async () => {
    (getAllBlogPosts as jest.Mock).mockResolvedValue([
      {
        slug: "welcome-to-oh-my-brew",
        title: "Why Oh My Brew exists",
        description: "Coffee notes and updates.",
        excerpt: "A short intro to the brand.",
        publishedAt: "2026-03-07",
      },
    ]);

    render(await BlogIndexPage());

    expect(screen.getByRole("heading", { name: /blog/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /why oh my brew exists/i }),
    ).toHaveAttribute("href", "/blog/welcome-to-oh-my-brew");
    expect(screen.getByText(/a short intro to the brand/i)).toBeInTheDocument();
  });
});
