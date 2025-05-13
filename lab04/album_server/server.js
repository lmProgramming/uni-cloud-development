const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

genres = [
    { id: 1, name: "Heavy Metal" },
    { id: 2, name: "Light Metal" }
]

albums = [{
    id: 1,
    band: "Metallica",
    title: "Master of Puppets",
    year: 1986,
    genre: 1
},
{
    id: 2,
    band: "Metallica",
    title: "Ride the Lightning",
    year: 1984,
    genre: 1
},
{
    id: 3,
    band: "AC/DC",
    title: "Back in Black",
    year: 1980,
    genre: 1
},
{
    id: 4,
    band: "AC/DC",
    title: "Highway to Hell",
    year: 1979,
    genre: 1
},
{
    id: 5,
    band: "Iron Maiden",
    title: "The Number of the Beast",
    year: 1982,
    genre: 1
},
{
    id: 6,
    band: "Iron Maiden",
    title: "Powerslave",
    year: 1984,
    genre: 1
}
];

function getNextId() {
    return (albums.slice(0).sort(function (a, b) { return b.id - a.id })[0].id) + 1;
}

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false,
}));

app.get('/albums', (req, res) => {
    res.json(albums)
});

app.get('/', (req, res) => {
    res.redirect('/albums')
});

app.get('/albums/:band', (req, res) => {
    const band = decodeURIComponent(req.params.band.toLowerCase());
    const filteredAlbums = albums.filter(album => album.band.toLowerCase() === band);
    filteredAlbums.map(album => ({ ...album, genre: { "id": album.genre, "name": albums.find(a => a.id === album.genre) } }))
    res.json(filteredAlbums);
});

app.post('/albums', (req, res) => {
    const {
        band,
        title,
        year,
        genre,
        cover
    } = req.body;
    if (!band || !title || !year || !genre) {
        const missingFields = [];
        if (!band) missingFields.push("band");
        if (!title) missingFields.push("title");
        if (!year) missingFields.push("year");
        if (!genre) missingFields.push("genre");
        const message = `Missing: ${missingFields.join(" ")}`;
        console.log(message)
        return res.status(400).json({
            message: message
        });
    }
    const id = getNextId();
    const newAlbum = {
        id: getNextId(),
        band,
        title,
        year,
        genre,
        cover
    };
    albums.push(newAlbum);
    res.status(201).json(newAlbum);
});

app.put('/albums/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {
        band,
        title,
        year,
        genre,
        cover
    } = req.body;
    const album = albums.find(album => album.id === id);
    if (!album) {
        return res.status(404).json({
            message: "Album nie znaleziony."
        });
    }
    if (band) album.band = band
    if (title) album.title = title;
    if (genre) album.genre = genre;
    if (year) album.year = year;
    if (cover) album.cover = cover;
    res.json(album);
});

app.delete('/albums/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = albums.findIndex(album => album.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Album nie znaleziony."
        });
    }
    albums.splice(index, 1);
    res.json({
        message: "Album usunięty."
    });
});

app.listen(port,
    () => {
        console.log(`Serwer REST API działa na http://localhost:${port}`);
    });

module.exports = app;