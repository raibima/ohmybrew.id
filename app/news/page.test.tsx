import { render, screen } from "@testing-library/react";
import NewsIndexPage from "./page";
import { getAllNewsPosts } from "@/lib/news";

jest.mock("@/lib/news", () => ({
  formatNewsDate: jest.fn(() => "7 March 2026"),
  getAllNewsPosts: jest.fn(),
}));

describe("News Index Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders news posts from the MDX content list", async () => {
    (getAllNewsPosts as jest.Mock).mockResolvedValue([
      {
        slug: "welcome-to-oh-my-brew",
        title: "Why Oh My Brew exists",
        description: "Coffee notes and updates.",
        excerpt: "A short intro to the brand.",
        publishedAt: "2026-03-07",
      },
    ]);

    render(await NewsIndexPage());

    expect(screen.getByRole("heading", { name: /news/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /why oh my brew exists/i }),
    ).toHaveAttribute("href", "/news/welcome-to-oh-my-brew");
    expect(screen.getByText(/a short intro to the brand/i)).toBeInTheDocument();
  });
});
