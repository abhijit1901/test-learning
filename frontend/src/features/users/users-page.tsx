"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { createUser, deleteUser, listUsers, updateUser } from "@/lib/api/users";
import { createUserInputSchema, type User } from "@/lib/schemas/user";

type DraftMap = Record<string, string>;

function prettyError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [draftNames, setDraftNames] = useState<DraftMap>({});

  const totalUsers = useMemo(() => users.length, [users.length]);

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const result = await listUsers();
      setUsers(result);
      setDraftNames(
        result.reduce<DraftMap>((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setBusy(true);
      setError("");

      const payload = createUserInputSchema.parse({ email, name });
      const created = await createUser(payload);

      setUsers((prev) => [created, ...prev]);
      setDraftNames((prev) => ({ ...prev, [created.id]: created.name }));
      setEmail("");
      setName("");
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onUpdate(id: string) {
    try {
      setBusy(true);
      setError("");
      const updated = await updateUser(id, { name: draftNames[id] || "" });

      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    try {
      setBusy(true);
      setError("");
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setDraftNames((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <section className="card" style={{ padding: 18, marginBottom: 16 }}>
        <p className="mono" style={{ margin: 0, opacity: 0.85 }}>
          NEXT.JS FRONTEND CONSOLE
        </p>
        <h1 style={{ margin: "8px 0 10px" }}>User Management Dashboard</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Clean frontend architecture with integration-style tests and API proxying.
        </p>
      </section>

      <section className="card" style={{ padding: 18, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Create User</h2>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 10 }}>
          <input
            aria-label="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            aria-label="name"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="btn-primary" type="submit" disabled={busy}>
            Add
          </button>
        </form>
      </section>

      <section className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Users ({totalUsers})</h2>
          <button className="btn-ghost" onClick={() => void loadUsers()} disabled={loading || busy}>
            Refresh
          </button>
        </div>

        {loading ? <p>Loading users...</p> : null}

        {!loading && users.length === 0 ? <p>No users yet. Add your first user.</p> : null}

        {!loading && users.length > 0
          ? users.map((user) => (
              <article
                key={user.id}
                className="card"
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderColor: "var(--panel-strong)",
                  background: "rgba(10, 20, 45, 0.35)"
                }}
              >
                <p style={{ margin: 0, fontWeight: 700 }}>{user.email}</p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr auto auto",
                    gap: 8,
                    marginTop: 8,
                    alignItems: "center"
                  }}
                >
                  <input
                    aria-label={`name-${user.id}`}
                    value={draftNames[user.id] || ""}
                    onChange={(event) =>
                      setDraftNames((prev) => ({
                        ...prev,
                        [user.id]: event.target.value
                      }))
                    }
                  />
                  <button className="btn-ghost" disabled={busy} onClick={() => void onUpdate(user.id)}>
                    Save
                  </button>
                  <button className="btn-danger" disabled={busy} onClick={() => void onDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          : null}

        {error ? (
          <p role="alert" style={{ color: "#ff9f9f", fontWeight: 700 }}>
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
}
