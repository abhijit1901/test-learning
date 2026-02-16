const value = process.env.BACKEND_API_URL;

if (!value) {
  console.warn("BACKEND_API_URL not set, falling back to http://localhost:3000");
}

export const backendApiUrl = value || "http://localhost:3000";
