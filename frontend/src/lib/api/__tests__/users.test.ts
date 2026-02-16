import { rest } from "msw";

import { createUser, deleteUser, listUsers, updateUser } from "@/lib/api/users";
import { server } from "@/test/msw/server";

describe("users api client", () => {
  it("lists users", async () => {
    const users = await listUsers();

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("ada@example.com");
  });

  it("creates user", async () => {
    const created = await createUser({
      email: "grace@example.com",
      name: "Grace Hopper"
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe("Grace Hopper");
  });

  it("updates and deletes user", async () => {
    const created = await createUser({
      email: "linus@example.com",
      name: "Linus"
    });

    const updated = await updateUser(created.id, { name: "Linus Torvalds" });
    expect(updated.name).toBe("Linus Torvalds");

    await expect(deleteUser(created.id)).resolves.toBeUndefined();
  });

  it("throws backend error message", async () => {
    server.use(
      rest.post("*/api/users", (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: "Invalid input" }));
      })
    );

    await expect(
      createUser({
        email: "bad@example.com",
        name: "Ok"
      })
    ).rejects.toThrow("Invalid input");
  });
});
