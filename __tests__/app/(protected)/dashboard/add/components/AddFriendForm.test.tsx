import AddFriendForm from "@/app/(protected)/dashboard/add/components/AddFriendForm";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Add Friend Form logic", () => {
  beforeEach(() => {
    render(<AddFriendForm />);
  });

  it("Input should change when user type", () => {
    const inputElement = screen.getByPlaceholderText("you@example.com") as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "123@123.com" } });
    expect(inputElement.value).toBe("123@123.com");
  });

  it("Input validity should be false when the value is not browser email pattern", () => {
    const inputElement = screen.getByPlaceholderText("you@example.com") as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "123@" } });
    expect(inputElement.validity.valid).toBeFalsy();
  });

  it("Error message should be in the dom when the value is not zod email pattern", async () => {
    const inputElement = screen.getByPlaceholderText("you@example.com") as HTMLInputElement;
    const buttonElement = screen.getByRole("button");

    fireEvent.change(inputElement, { target: { value: "123@123" } });
    fireEvent.click(buttonElement);

    const errorMessage = await screen.findByText(/invalid email/i);
    expect(errorMessage).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: "123@123.a" } });
    fireEvent.click(buttonElement);

    const errorMessage2 = await screen.findByText(/invalid email/i);
    expect(errorMessage2).toBeInTheDocument();
  });
});
