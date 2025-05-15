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
  const [albumEditedID, setAlbumEditedID] = useState(0);
  const [albumEdited, setAlbumEdited] = useState({
    band: "",
    title: "",
    year: "",
    genre: "",
    cover: "",
  });

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
        .catch((error) => console.error("Error during fetch:", error));
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
      .catch((error) => console.error("Error during fetch:", error));
  };

  const handleEditAlbumClick = (albumID) => {
    if (albumEditedID === albumID) {
      setAlbumEditedID(-1);
      return;
    }
    setAlbumEditedID(albumID);
    setAlbumEdited(albums.find((a) => a.id === albumID));
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
          throw new Error(
            "Error response from server on POST:",
            response.status,
            response.statusText
          );
        }
        return response.json();
      })
      .then((data) => updateLocalStorage([...albums, data]))
      .catch((error) => console.error("Error on form save:", error));
  };

  const putEditedAlbum = () => {
    const id = albumEditedID;
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(albumEdited),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedAlbums = albums.map((album) => {
          var temp = Object.assign({}, album);
          if (album.id === id) {
            temp.band = albumEdited.band;
            temp.title = albumEdited.title;
            temp.year = albumEdited.year;
            temp.genre = albumEdited.genre;
          }
          return temp;
        });
        updateLocalStorage(updatedAlbums);
      })
      .catch((error) => console.error("Error on album PUT:", error));
  };

  const deleteAlbum = (id) => {
    fetch(`http://localhost:3000/albums/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedAlbums = albums.filter((album) => album.id !== id);
        updateLocalStorage(updatedAlbums);
      })
      .catch((error) => console.error("Error on album DELETE:", error));
  };

  return (
    <>
      {" "}
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-4">Album WORLD</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter band name to search"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={fetchBandAlbums}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Band..."
            value={newAlbum.band}
            onChange={(e) => setNewAlbum({ ...newAlbum, band: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Title..."
            value={newAlbum.title}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, title: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Year..."
            value={newAlbum.year}
            onChange={(e) => setNewAlbum({ ...newAlbum, year: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Genre..."
            value={newAlbum.genre}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, genre: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            placeholder="Cover..."
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
            Add Album
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className="border-b py-2 flex flex-col justify-between items-center"
          >
            <span className="pb-8 align-top">
              <strong>
                {album.id} {album.band}
              </strong>{" "}
              - {album.title} ({album.year})
            </span>
            {album.cover && (
              <img
                src={`${apiURL}${album.cover}`}
                alt={`${album.title} cover`}
                className="w-32 h-32 object-cover rounded pb-8"
              />
            )}
            <div>
              <button
                onClick={() => handleEditAlbumClick(album.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteAlbum(album.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
              {albumEditedID && albumEditedID === album.id && (
                <div className="mt-2 mb-4">
                  <input
                    type="text"
                    placeholder="Band..."
                    value={albumEdited.band}
                    onChange={(e) =>
                      setAlbumEdited({ ...albumEdited, band: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Title..."
                    value={albumEdited.title}
                    onChange={(e) =>
                      setAlbumEdited({ ...albumEdited, title: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Year..."
                    value={albumEdited.year}
                    onChange={(e) =>
                      setAlbumEdited({ ...albumEdited, year: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Genre..."
                    value={albumEdited.genre}
                    onChange={(e) =>
                      setAlbumEdited({ ...albumEdited, genre: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <button
                    onClick={putEditedAlbum}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>{" "}
    </>
  );
}
