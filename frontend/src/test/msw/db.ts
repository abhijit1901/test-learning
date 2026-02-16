export type MockUser = {
  id: string;
  email: string;
  name: string;
};

const seed: MockUser[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "ada@example.com",
    name: "Ada Lovelace"
  }
];

let users: MockUser[] = [...seed];
let sequence = 2000;

function clone(list: MockUser[]) {
  return list.map((item) => ({ ...item }));
}

export function resetMockDb() {
  users = clone(seed);
  sequence = 2000;
}

export function getAllUsers() {
  return clone(users);
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id) || null;
}

export function createMockUser(input: { email: string; name: string }) {
  sequence += 1;
  const created: MockUser = {
    id: `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`,
    email: input.email,
    name: input.name
  };
  users = [created, ...users];
  return { ...created };
}

export function updateMockUser(id: string, input: { name: string }) {
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return null;
  }

  const updated = {
    ...users[index],
    name: input.name
  };

  users[index] = updated;
  return { ...updated };
}

export function deleteMockUser(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return false;
  }

  users.splice(index, 1);
  return true;
}
