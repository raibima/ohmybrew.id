import { render, screen, fireEvent } from "@testing-library/react";
import { LinkCard } from "./link-card";

describe("LinkCard", () => {
  describe("Navigation", () => {
    it("renders the Link component with the correct href", () => {
      render(
        <LinkCard
          href="/test-route"
          title="Test Link"
          subtitle="Test subtitle"
        />
      );

      // Find the link by its accessible role and text
      const link = screen.getByRole("link", { name: /test link/i });

      // Verify link exists
      expect(link).toBeInTheDocument();

      // Verify link has correct href
      expect(link).toHaveAttribute("href", "/test-route");

      // Verify link is functional (not disabled)
      expect(link).not.toHaveAttribute("aria-disabled");

      // Verify subtitle is rendered
      expect(screen.getByText("Test subtitle")).toBeInTheDocument();
    });

    it("renders with icon when provided", () => {
      const TestIcon = () => <svg data-testid="test-icon" />;

      render(
        <LinkCard
          href="/test-route"
          title="Test Link"
          icon={<TestIcon />}
        />
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders as external link when external prop is true", () => {
      render(
        <LinkCard
          href="https://example.com"
          title="External Link"
          external={true}
        />
      );

      const link = screen.getByRole("link", { name: /external link/i });

      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Disabled State", () => {
    it("renders as div instead of link when disabled", () => {
      render(
        <LinkCard
          href="/test-route"
          title="Disabled Link"
          disabled={true}
        />
      );

      // Should not render as a link
      const link = screen.queryByRole("link", { name: /disabled link/i });
      expect(link).not.toBeInTheDocument();

      // Should render the title text
      expect(screen.getByText("Disabled Link")).toBeInTheDocument();
    });

    it("applies grey styling when disabled", () => {
      const { container } = render(
        <LinkCard
          href="/test-route"
          title="Disabled Link"
          disabled={true}
        />
      );

      // Get the parent div
      const disabledCard = container.firstChild as HTMLElement;

      // Check for disabled styling classes
      expect(disabledCard).toHaveClass("opacity-50");
      expect(disabledCard).toHaveClass("cursor-not-allowed");
    });

    it("does not navigate when clicked in disabled state", () => {
      const { container } = render(
        <LinkCard
          href="/test-route"
          title="Disabled Link"
          disabled={true}
        />
      );

      const disabledCard = container.firstChild as HTMLElement;

      // Verify it's a div, not a link
      expect(disabledCard.tagName).toBe("DIV");

      // Click should not throw or cause navigation
      fireEvent.click(disabledCard);

      // Verify it remains a div (no state change)
      expect(disabledCard.tagName).toBe("DIV");
    });

    it("does not show hover effects when disabled", () => {
      const { container } = render(
        <LinkCard
          href="/test-route"
          title="Disabled Link"
          disabled={true}
        />
      );

      const disabledCard = container.firstChild as HTMLElement;

      // Verify it doesn't have hover classes
      expect(disabledCard.className).not.toContain("hover:shadow-lg");
      expect(disabledCard.className).not.toContain("hover:-translate-y-0.5");
    });
  });

  describe("Variants", () => {
    it("renders default variant correctly", () => {
      const { container } = render(
        <LinkCard
          href="/test-route"
          title="Default Link"
        />
      );

      const card = container.firstChild as HTMLElement;

      // Default variant has transparent border with hover:border-border
      expect(card.className).toContain("border-transparent");
    });

    it("renders outlined variant correctly", () => {
      const { container } = render(
        <LinkCard
          href="/test-route"
          title="Outlined Link"
          variant="outlined"
        />
      );

      const card = container.firstChild as HTMLElement;

      // Outlined variant has visible border
      expect(card.className).toContain("border-border");
    });
  });
});
