import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock fetch globally
global.fetch = jest.fn();

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Subscription", () => {
    it("calls the subscription endpoint with the correct email when form is submitted", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Home />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const submitButton = screen.getByRole("button", { name: /notify me/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });
  });

  it("displays loading state while API call is pending", async () => {
    // Create a promise that we can resolve later to simulate pending state
    let resolveFetch: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    render(<Home />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const submitButton = screen.getByRole("button", { name: /notify me/i });

    fireEvent.change(emailInput, { target: { value: "loading@example.com" } });
    fireEvent.click(submitButton);

    // Check for loading state immediately after click
    const loadingButton = screen.getByRole("button", { name: "..." });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
    expect(emailInput).toBeDisabled();

    // Clean up by resolving the promise
    resolveFetch!({
      ok: true,
      json: async () => ({ success: true }),
    });

    await waitFor(() => {
        expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });

  it("renders success notification when api call is successful", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Home />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const submitButton = screen.getByRole("button", { name: /notify me/i });

    fireEvent.change(emailInput, { target: { value: "success@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
      expect(screen.getByText(/We'll keep you posted/i)).toBeInTheDocument();
    });

    // Ensure form is no longer visible (replaced by success message)
    expect(screen.queryByPlaceholderText("your@email.com")).not.toBeInTheDocument();
  });

  it("displays error message when api call fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email" }),
    });

    render(<Home />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const submitButton = screen.getByRole("button", { name: /notify me/i });

    fireEvent.change(emailInput, { target: { value: "fail@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
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
