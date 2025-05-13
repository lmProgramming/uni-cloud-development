import React, { useState, useEffect } from 'react';

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [band, setBand] = useState("");
  const [newAlbum, setNewAlbum] = useState({ band: "", title: "", year: "" });
  useEffect(() => {
    const storedAlbums = localStorage.getItem("albums");
    if (storedAlbums) {
      setAlbums(JSON.parse(storedAlbums));
    } else {
      fetch("http://localhost:3000/albums")
        .then(response => response.json())
        .then(data => {
          setAlbums(data);
          localStorage.setItem("albums", JSON.stringify(data));
        })
        .catch(error => console.error("Błąd pobierania danych:", error));
    }
  }, []);
  const updateLocalStorage = (updatedAlbums) => {
    setAlbums(updatedAlbums);
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));
  };
  const fetchBandAlbums = () => {
    fetch(`http://localhost:3000/albums/${band}`)
      .then(response => response.json())
      .then(data => updateLocalStorage(data))
      .catch(error => console.error("Błąd pobierania danych:", error));
  };
  const addAlbum = () => {
    fetch("http://localhost:3000/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAlbum)
    })
      .then(response => response.json())
      .then(data => updateLocalStorage([...albums, data]))
      .catch(error => console.error("Błąd dodawania albumu:", error));
  };
  const updateAlbum = (id, newTitle) => {
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle })
    })
      .then(response => response.json())
      .then(() => {
        const updatedAlbums = albums.map(album => album.id === id ? { ...album, title: newTitle }
          : album);
        updateLocalStorage(updatedAlbums);
      })
      .catch(error => console.error("Błąd aktualizacji albumu:", error));
  };
  const deleteAlbum = (id) => {
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        const updatedAlbums = albums.filter(album => album.id !== id);
        updateLocalStorage(updatedAlbums);
      })
      .catch(error => console.error("Błąd usuwania albumu:", error));
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
        <input type="text" placeholder="Zespół" value={newAlbum.band} onChange={(e) =>
          setNewAlbum({ ...newAlbum, band: e.target.value })} className="border p-2 rounded w-full mb-2"
        />
        <input type="text" placeholder="Tytuł" value={newAlbum.title} onChange={(e) =>
          setNewAlbum({ ...newAlbum, title: e.target.value })} className="border p-2 rounded w-full mb2" />
        <input type="text" placeholder="Rok" value={newAlbum.year} onChange={(e) => setNewAlbum({ ...newAlbum, year: e.target.value })} className="border p-2 rounded w-full mb-2" />
        <button onClick={addAlbum} className="bg-green-500 text-white px-4
py-2 rounded">Dodaj Album</button>
      </div>
      <ul>
        {albums.map(album => (
          <li key={album.id} className="border-b py-2 flex justify-between items-center">
            <span>
              <strong>{album.band}</strong> - {album.title} ({album.year})
            </span>
            <div>
              <button onClick={() => updateAlbum(album.id)} className="bg-yellow-500
textwhite px-2 py-1 rounded mr-2">Edytuj</button>
              <button onClick={() => deleteAlbum(album.id)} className="bg-red-500 textwhite px-
2 py-1 rounded">Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}