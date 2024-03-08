import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Page", () => {
  it("renders a div with a button in it", () => {
    render(<Page />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("renders a button with a link in it", () => {
    render(<Page />);

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
  });
});
