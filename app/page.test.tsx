import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  describe("Content", () => {
    it("renders the hero heading and tagline", () => {
      render(<Home />);

      expect(
        screen.getByRole("heading", { name: /oh my brew/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/good quality specialty coffee/i),
      ).toBeInTheDocument();
    });

    it("does not render the newsletter subscription form", () => {
      render(<Home />);

      expect(screen.queryByPlaceholderText("your@email.com")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /notify me/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/be the first to know about promos/i)).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("'Order Now' button navigates to /order route when clicked", () => {
      render(<Home />);
      
      // Find the Order Now link
      const orderLink = screen.getByRole("link", { name: /order now/i });
      
      // Verify link exists
      expect(orderLink).toBeInTheDocument();
      
      // Verify link has correct href that browser will navigate to
      expect(orderLink).toHaveAttribute("href", "/order");
      
      // Verify link is functional (not disabled)
      expect(orderLink).not.toHaveAttribute("aria-disabled");
      
      // Simulate click to verify the link is clickable
      fireEvent.click(orderLink);
      
      // After click, verify link still points to correct route
      // (In a real browser, the navigation API would use this href)
      expect(orderLink).toHaveAttribute("href", "/order");
    });
  });
});
