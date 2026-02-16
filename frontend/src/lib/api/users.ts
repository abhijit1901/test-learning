import {
  createUserInputSchema,
  type CreateUserInput,
  type UpdateUserInput,
  updateUserInputSchema,
  userSchema,
  usersSchema
} from "@/lib/schemas/user";

const USERS_URL = "/api/users";

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(url: string, init: RequestInit, parse: (data: unknown) => T): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });

  const body = await parseJson(response);

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : "Request failed";
    throw new Error(message);
  }

  return parse(body);
}

export async function listUsers() {
  return request(USERS_URL, { method: "GET", cache: "no-store" }, (data) => usersSchema.parse(data));
}

export async function getUser(id: string) {
  return request(`${USERS_URL}/${id}`, { method: "GET", cache: "no-store" }, (data) =>
    userSchema.parse(data)
  );
}

export async function createUser(input: CreateUserInput) {
  const payload = createUserInputSchema.parse(input);

  return request(
    USERS_URL,
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    (data) => userSchema.parse(data)
  );
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const payload = updateUserInputSchema.parse(input);

  return request(
    `${USERS_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload)
    },
    (data) => userSchema.parse(data)
  );
}

export async function deleteUser(id: string) {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : "Request failed";
    throw new Error(message);
  }
}
