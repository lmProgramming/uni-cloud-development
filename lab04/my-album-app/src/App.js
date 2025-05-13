"strict";
import React, { useState, useEffect } from "react";

export default function AlbumList() {
  const apiURL = "http://localhost:3000";

  const [albums, setAlbums] = useState([]);
  const [band, setBand] = useState("");
  const [newAlbum, setNewAlbum] = useState({
    band: "",
    title: "",
    year: "",
    genre: "",
    cover: "",
  });
  const [albumEdited, setAlbumEdited] = useState(null);

  useEffect(() => {
    const storedAlbums = localStorage.getItem("albums");
    if (storedAlbums) {
      setAlbums(JSON.parse(storedAlbums));
    } else {
      fetch("http://localhost:3000/albums")
        .then((response) => response.json())
        .then((data) => {
          setAlbums(data);
          localStorage.setItem("albums", JSON.stringify(data));
        })
        .catch((error) => console.error("Błąd pobierania danych:", error));
    }
  }, []);

  const updateLocalStorage = (updatedAlbums) => {
    setAlbums(updatedAlbums);
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));
  };

  const fetchBandAlbums = () => {
    const bandEncoded = encodeURIComponent(band);
    fetch(`http://localhost:3000/albums/${bandEncoded}`)
      .then((response) => response.json())
      .then((data) => updateLocalStorage(data))
      .catch((error) => console.error("Błąd pobierania danych:", error));
  };

  const addAlbum = () => {
    const formData = new FormData();
    formData.append("band", newAlbum.band);
    formData.append("title", newAlbum.title);
    formData.append("year", newAlbum.year);
    formData.append("genre", newAlbum.genre);
    if (newAlbum.cover) {
      formData.append("cover", newAlbum.cover);
    }

    fetch("http://localhost:3000/albums", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error response from server");
        }
        return response.json();
      })
      .then((data) => updateLocalStorage([...albums, data]))
      .catch((error) => console.error("Błąd dodawania albumu:", error));
  };

  const updateAlbum = (id, newTitle) => {
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedAlbums = albums.map((album) =>
          album.id === id ? { ...album, title: newTitle } : album
        );
        updateLocalStorage(updatedAlbums);
      })
      .catch((error) => console.error("Błąd aktualizacji albumu:", error));
  };

  const deleteAlbum = (id) => {
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedAlbums = albums.filter((album) => album.id !== id);
        updateLocalStorage(updatedAlbums);
      })
      .catch((error) => console.error("Błąd usuwania albumu:", error));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Lista Albumów</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Wpisz nazwę zespołu"
          value={band}
          onChange={(e) => setBand(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchBandAlbums}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Szukaj
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Band"
          value={newAlbum.band}
          onChange={(e) => setNewAlbum({ ...newAlbum, band: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={newAlbum.title}
          onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
          className="border p-2 rounded w-full mb2"
        />
        <input
          type="number"
          placeholder="Year"
          value={newAlbum.year}
          onChange={(e) => setNewAlbum({ ...newAlbum, year: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Genre"
          value={newAlbum.genre}
          onChange={(e) => setNewAlbum({ ...newAlbum, genre: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="file"
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, cover: e.target.files[0] })
          }
          className="border p-2 rounded w-full mb-2"
          accept="image/png, image/jpeg"
        />
        <button
          onClick={addAlbum}
          className="bg-green-500 text-white px-4
py-2 rounded"
        >
          Dodaj Album
        </button>
      </div>
      <ul>
        {albums.map((album) => (
          <li
            key={album.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div className="flex-column">
              <span>
                <strong>
                  {album.id} {album.band}
                </strong>{" "}
                - {album.title} ({album.year})
              </span>
              {album.cover && (
                <img
                  src={`${apiURL}${album.cover}`}
                  alt={`${album.title} cover`}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <button
                  onClick={() => updateAlbum(album.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Usuń
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
