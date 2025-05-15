const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
  },
});

const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

genres = [
  { id: 1, name: "Heavy Metal" },
  { id: 2, name: "Light Metal" },
];

albums = [
  {
    id: 1,
    band: "Metallica",
    title: "Master of Puppets",
    year: 1986,
    genre: 1,
    cover: "/uploads/master_of_puppets.jpg",
  },
  {
    id: 2,
    band: "Metallica",
    title: "Ride the Lightning",
    year: 1984,
    genre: 1,
    cover: "/uploads/Ride_the_Lightning.jpg",
  },
  {
    id: 3,
    band: "AC/DC",
    title: "Back in Black",
    year: 1980,
    genre: 1,
    cover: "/uploads/Back_in_Black.png",
  },
  {
    id: 4,
    band: "AC/DC",
    title: "Highway to Hell",
    year: 1979,
    genre: 1,
    cover: "/uploads/Highway_to_Hell.jpg",
  },
  {
    id: 5,
    band: "Iron Maiden",
    title: "The Number of the Beast",
    year: 1982,
    genre: 1,
    cover: "/uploads/The_Number_of_the_Beast.jpg",
  },
  {
    id: 6,
    band: "Iron Maiden",
    title: "Powerslave",
    year: 1984,
    genre: 1,
    cover: "/uploads/Powerslave.jpg",
  },
];

function getNextId() {
  return (
    albums.slice(0).sort(function (a, b) {
      return b.id - a.id;
    })[0].id + 1
  );
}

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);

app.get("/albums", (req, res) => {
  res.json(albums);
});

app.get("/", (req, res) => {
  res.redirect("/albums");
});

app.get("/albums/:band", (req, res) => {
  const band = decodeURIComponent(req.params.band.toLowerCase());
  const filteredAlbums = albums.filter(
    (album) => album.band.toLowerCase() === band
  );
  filteredAlbums.map((album) => ({
    ...album,
    genre: { id: album.genre, name: albums.find((a) => a.id === album.genre) },
  }));
  res.json(filteredAlbums);
});

app.get("/genres", (req, res) => {
  res.json(genres);
});

app.post("/albums", upload.single("cover"), (req, res) => {
  const { band, title, year, genre } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  if (!band || !title || !year || !genre) {
    const missingFields = [];
    if (!band) missingFields.push("band");
    if (!title) missingFields.push("title");
    if (!year) missingFields.push("year");
    if (!genre) missingFields.push("genre");
    const message = `Missing: ${missingFields.join(" ")}`;
    console.log(message);
    return res.status(400).json({
      message: message,
    });
  }

  const id = getNextId();
  const newAlbum = {
    id,
    band,
    title,
    year,
    genre,
    cover,
  };
  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

app.put("/albums/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { band, title, year, genre } = req.body;
  const album = albums.find((album) => album.id === id);
  console.log(band, title, year, genre);
  if (!album) {
    console.log(`No album found of id: ${id}.`);
    return res.status(404).json({
      message: `No album found of id: ${id}.`,
    });
  }
  if (band) album.band = band;
  if (title) album.title = title;
  if (genre) album.genre = genre;
  if (year) album.year = year;
  res.json(album);
});

app.delete("/albums/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = albums.findIndex((album) => album.id === id);
  if (index === -1) {
    return res.status(404).json({
      message: "Album nie znaleziony.",
    });
  }
  albums.splice(index, 1);
  res.json({
    message: "Album usunięty.",
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(port, () => {
  console.log(`Serwer REST API działa na http://localhost:${port}`);
});

module.exports = app;
