import { rest } from "msw";

import {
  createMockUser,
  deleteMockUser,
  getAllUsers,
  getUserById,
  updateMockUser
} from "@/test/msw/db";

export const handlers = [
  rest.get("*/api/users", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getAllUsers()));
  }),

  rest.post("*/api/users", async (req, res, ctx) => {
    const body = (await req.json()) as { email?: string; name?: string };

    if (!body?.email || !body?.name) {
      return res(ctx.status(400), ctx.json({ message: "Invalid input" }));
    }

    return res(
      ctx.status(201),
      ctx.json(createMockUser({ email: body.email, name: body.name }))
    );
  }),

  rest.get("*/api/users/:id", (req, res, ctx) => {
    const user = getUserById(String(req.params.id));
    if (!user) {
      return res(ctx.status(404), ctx.json({ message: "User not found" }));
    }

    return res(ctx.status(200), ctx.json(user));
  }),

  rest.put("*/api/users/:id", async (req, res, ctx) => {
    const body = (await req.json()) as { name?: string };

    if (!body?.name) {
      return res(ctx.status(400), ctx.json({ message: "Invalid input" }));
    }

    const updated = updateMockUser(String(req.params.id), { name: body.name });
    if (!updated) {
      return res(ctx.status(404), ctx.json({ message: "User not found" }));
    }

    return res(ctx.status(200), ctx.json(updated));
  }),

  rest.delete("*/api/users/:id", (req, res, ctx) => {
    const ok = deleteMockUser(String(req.params.id));
    if (!ok) {
      return res(ctx.status(404), ctx.json({ message: "User not found" }));
    }

    return res(ctx.status(204));
  })
];
