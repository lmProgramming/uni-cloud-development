const request = require("supertest");
const express = require("express");
const app = require("./server");

describe("Albums API", () => {
  it("GET /albums - should return all albums", async () => {
    const response = await request(app).get("/albums");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("POST /albums - should create a new album", async () => {
    const newAlbum = {
      band: "Pink Floyd",
      title: "The Wall",
      year: 1979,
      genre: 1,
      cover: "https://example.com/the-wall.jpg",
    };
    const response = await request(app).post("/albums").send(newAlbum);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newAlbum);
  });

  it("PUT /albums/:id - should update an existing album", async () => {
    const updatedAlbum = {
      band: "Pink Floyd",
      title: "Wish You Were Here",
      year: 1975,
    };
    const response = await request(app).put("/albums/1").send(updatedAlbum);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedAlbum);
  });

  it("DELETE /albums/:id - should delete an album", async () => {
    const response = await request(app).delete("/albums/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Album usunięty.");
  });

  it("GET /albums/:band - should return albums by band", async () => {
    const response = await request(app).get("/albums/Metallica");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].band).toBe("Metallica");
  });
});
