import { useEffect, useState } from 'react';
import { getAllNotes } from '../lib/noteService';
import React from 'react';

export default function ArchivePage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const all = await getAllNotes();
      const archived = all.filter(note => note.archived); 
      setNotes(archived);
    };
    fetch();
  }, []);

  return (
    <div className="container mt-5">
      <h2>📦 Arsip Catatan</h2>
      <ul className="list-group mt-4">
        {notes.map(note => (
          <li key={note.id} className="list-group-item">
            <h5>{note.title}</h5>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
