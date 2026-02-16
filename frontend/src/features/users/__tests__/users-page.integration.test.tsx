import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UsersPage } from "@/features/users/users-page";

describe("UsersPage integration", () => {
  it("loads existing users", async () => {
    render(<UsersPage />);

    expect(await screen.findByText("ada@example.com")).toBeInTheDocument();
    expect(screen.getByText("Users (1)")).toBeInTheDocument();
  });

  it("creates a user", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await screen.findByText("ada@example.com");

    await user.type(screen.getByLabelText("email"), "new@example.com");
    await user.type(screen.getByLabelText("name"), "New Person");
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getByText("new@example.com")).toBeInTheDocument();
      expect(screen.getByText("Users (2)")).toBeInTheDocument();
    });
  });

  it("updates and deletes a user", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await screen.findByText("ada@example.com");

    const nameInput = screen.getByLabelText("name-11111111-1111-4111-8111-111111111111");
    await user.clear(nameInput);
    await user.type(nameInput, "Ada Updated");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(nameInput).toHaveValue("Ada Updated");
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.queryByText("ada@example.com")).not.toBeInTheDocument();
      expect(screen.getByText("Users (0)")).toBeInTheDocument();
    });
  });
});
