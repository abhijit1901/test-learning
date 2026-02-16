import { createUserInputSchema, updateUserInputSchema, userSchema } from "@/lib/schemas/user";

describe("user schemas", () => {
  it("validates a user payload", () => {
    expect(
      userSchema.parse({
        id: "11111111-1111-4111-8111-111111111111",
        email: "ada@example.com",
        name: "Ada"
      }).name
    ).toBe("Ada");
  });

  it("rejects invalid create payload", () => {
    expect(() =>
      createUserInputSchema.parse({
        email: "nope",
        name: "A"
      })
    ).toThrow();
  });

  it("rejects short update name", () => {
    expect(() =>
      updateUserInputSchema.parse({
        name: "A"
      })
    ).toThrow();
  });
});
