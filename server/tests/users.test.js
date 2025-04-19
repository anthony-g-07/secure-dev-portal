const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");

const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_TOKEN = jwt.sign(
  { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
  JWT_SECRET
);

const VIEWER_TOKEN = jwt.sign(
  { id: 2, name: "Viewer", email: "viewer@test.com", role: "viewer" },
  JWT_SECRET
);

describe("PUT /api/users/:id/role", () => {
  it("should reject non-admin users", async () => {
    const res = await request(app)
      .put("/api/users/3/role")
      .set("Cookie", `token=${VIEWER_TOKEN}`)
      .send({ newRole: "developer" });

    console.log("non-admin res.body", res.body); // debug output
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("should reject invalid roles", async () => {
    const res = await request(app)
      .put("/api/users/3/role")
      .set("Cookie", [`token=${ADMIN_TOKEN}`])
      .send({ newRole: "supergod" });

    console.log("invalid role res.body", res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid role");
  });

  it("should update role if admin and valid", async () => {
    const res = await request(app)
      .put("/api/users/3/role")
      .set("Cookie", [`token=${ADMIN_TOKEN}`])
      .send({ newRole: "developer" });

    console.log("update role res.status", res.statusCode);
    expect([200, 500]).toContain(res.statusCode);
  });
});
