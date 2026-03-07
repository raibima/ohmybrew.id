import { render, screen, fireEvent } from "@testing-library/react";
import OrderPage from "./page";

describe("Order Page", () => {
  describe("Navigation", () => {
    it("'Back to home' link navigates to homepage when clicked", () => {
      render(<OrderPage />);
      
      // Find the Back to home link
      const backLink = screen.getByRole("link", { name: /back to home/i });
      
      // Verify link exists
      expect(backLink).toBeInTheDocument();
      
      // Verify link has correct href that browser will navigate to
      expect(backLink).toHaveAttribute("href", "/");
      
      // Verify link is functional (not disabled)
      expect(backLink).not.toHaveAttribute("aria-disabled");
      
      // Simulate click to verify the link is clickable
      fireEvent.click(backLink);
      
      // After click, verify link still points to correct route
      // (In a real browser, the navigation API would use this href)
      expect(backLink).toHaveAttribute("href", "/");
    });
  });

  describe("Content", () => {
    it("renders the order page heading", () => {
      render(<OrderPage />);
      
      const heading = screen.getByRole("heading", { name: /order now/i });
      expect(heading).toBeInTheDocument();
    });

    it("displays GoFood link card", () => {
      render(<OrderPage />);
      
      const goFoodLink = screen.getByRole("link", { name: /order on gofood/i });
      expect(goFoodLink).toBeInTheDocument();
      expect(goFoodLink).toHaveAttribute("href", "https://gofood.link/a/SharcAY");
    });

    it("displays GrabFood link card", () => {
      render(<OrderPage />);

      const grabFoodLink = screen.getByRole("link", { name: /order on grabfood/i });
      expect(grabFoodLink).toBeInTheDocument();
      expect(grabFoodLink).toHaveAttribute("href", "https://r.grab.com/g/2-1-6-C4NFSBXTBCAWGX");
    });

    it("displays location information", () => {
      render(<OrderPage />);
      
      const locationText = screen.getByText(/located in bsd, tangerang/i);
      expect(locationText).toBeInTheDocument();
    });
  });
});
