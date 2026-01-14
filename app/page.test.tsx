import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock fetch globally
global.fetch = jest.fn();

describe("Home Page Subscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
