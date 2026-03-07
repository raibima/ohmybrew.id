import { render, screen } from "@testing-library/react";
import OrderPage from "./page";

describe("Order Page", () => {
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
