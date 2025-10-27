import React, { useEffect, useState } from "react";
import { apiService } from "../../Services/OnboardApicall";
import Navbar from "../../Components/Navbar";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const userRole = localStorage.getItem("user_type") || "user";
  const accessToken = localStorage.getItem("access_token");

  const endpoints = {
    list: userRole === "admin" ? "api/admin/notes/" : "api/notes/",
    delete: (id) =>
      userRole === "admin" ? `api/admin/notes/${id}/` : `api/notes/${id}/`,
    post: "api/notes/",
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      await apiService({
        endpoint: endpoints.list,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        onSuccess: (res) => setNotes(res),
        onError: (err) => {
          alert("Failed to fetch notes!");
          console.error(err);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await apiService({
        endpoint: endpoints.delete(noteId),
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        onSuccess: () => {
          setNotes((prev) => prev.filter((note) => note.id !== noteId));
        },
        onError: (err) => console.error(err),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      await apiService({
        endpoint: endpoints.post,
        method: "POST",
        payload: newNote,
        headers: { Authorization: `Bearer ${accessToken}` },
        onSuccess: (res) => {
          setNotes((prev) => [res, ...prev]);
          setNewNote({ title: "", content: "" });
        },
        onError: (err) => console.error(err),
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading notes...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen  flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-5xl bg-green-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {userRole === "admin" ? "All Notes" : "My Notes"}
          </h2>

          {userRole === "user" && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="w-full p-3 mb-3 rounded-lg border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Content"
                  rows="4"
                  className="w-full p-3 mb-4 rounded-lg border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
                <button
                  onClick={handleAddNote}
                  className="w-full md:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Add Note
                </button>
              </div>
              <div className="hidden md:flex flex-col justify-center items-center w-1/3">
                <DescriptionIcon sx={{ fontSize: 150, color: "#16A34A" }} />{" "}
                {/* green + big */}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No notes found.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-green-100"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-green-700">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="hover:scale-110 transition"
                  >
                    <DeleteIcon sx={{ color: "#DC2626", fontSize: 24 }} />
                  </button>
                </div>

                <p className="text-gray-700 mt-3">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotesPage;
