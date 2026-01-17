import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";
import { subscribeAction } from "@/app/actions/subscribe";

// Mock the server action
jest.mock("@/app/actions/subscribe", () => ({
  subscribeAction: jest.fn(),
}));

// Mock useActionState
const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for useActionState
    mockUseActionState.mockImplementation((action, initialState) => {
      return [initialState, action, false];
    });
  });

  describe("Subscription", () => {
    it("renders the subscription form with correct elements", () => {
      render(<Home />);

      const emailInput = screen.getByPlaceholderText("your@email.com");
      const submitButton = screen.getByRole("button", { name: /notify me/i });

      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("name", "email");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

  it("displays loading state when form is pending", () => {
    // Mock pending state
    mockUseActionState.mockReturnValue([
      { success: false, message: "", error: "" },
      subscribeAction,
      true, // pending = true
    ]);

    render(<Home />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const submitButton = screen.getByRole("button", { name: /notify me/i });

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  it("renders success notification when subscription is successful", () => {
    // Mock success state
    mockUseActionState.mockReturnValue([
      { success: true, message: "Successfully subscribed!", error: "" },
      subscribeAction,
      false,
    ]);

    render(<Home />);

    expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
    expect(screen.getByText(/We'll keep you posted/i)).toBeInTheDocument();

    // Ensure form is no longer visible (replaced by success message)
    expect(screen.queryByPlaceholderText("your@email.com")).not.toBeInTheDocument();
  });

  it("displays error message when subscription fails", () => {
    // Mock error state
    mockUseActionState.mockReturnValue([
      { success: false, message: "", error: "Invalid email" },
      subscribeAction,
      false,
    ]);

    render(<Home />);

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
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
