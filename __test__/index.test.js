import supertest from "supertest";
import app from "../index.js";

describe("Given a route", () => {
  describe("Given the ping route", () => {
    it("Should respond with a 200 status code from the ping route", async () => {
      const response = await supertest(app).get("/api/ping");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Given the post route", () => {
    it("should respond with a 400 status code if tag not present", async () => {
      const response = await supertest(app).get("/api/post");
      expect(response.statusCode).toBe(400);
    });
  });
});
