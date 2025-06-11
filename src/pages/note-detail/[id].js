// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../lib/firebase"; // pastikan path sesuai project-mu
// import { getAllFolders } from "../../lib/folderService";
// import Link from "next/link";
// import Swal from "sweetalert2";

// export default function NoteDetail() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [note, setNote] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);

//   // Form fields
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [folderId, setFolderId] = useState("");

//   // Folder dropdown
//   const [folders, setFolders] = useState([]);
//   const [username, setUsername] = useState(null);

//   // Fetch note
//   useEffect(() => {
//     if (!id) return;
//     const fetchNote = async () => {
//       const docRef = doc(db, "notes", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const noteData = { id: docSnap.id, ...docSnap.data() };
//         setNote(noteData);
//         setTitle(noteData.title);
//         setContent(noteData.content);
//         setFolderId(noteData.folderId || "");
//       } else {
//         setNote(null);
//       }
//       setLoading(false);
//     };
//     fetchNote();
//   }, [id]);

//   // Fetch username & folders
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const uname = localStorage.getItem("username");
//       setUsername(uname);
//       if (uname) {
//         getAllFolders(uname).then(setFolders);
//       }
//     }
//   }, []);

//   // Handle update
//   const handleSave = async () => {
//     if (!title.trim() || !content.trim()) {
//       Swal.fire("Judul dan isi tidak boleh kosong!", "", "warning");
//       return;
//     }
//     try {
//       const noteRef = doc(db, "notes", id);
//       await updateDoc(noteRef, {
//         title,
//         content,
//         folderId: folderId || null,
//       });
//       setNote({ ...note, title, content, folderId });
//       setEditMode(false);
//       Swal.fire("Catatan berhasil diupdate!", "", "success");
//     } catch (err) {
//       Swal.fire("Gagal mengupdate catatan", err.message, "error");
//     }
//   };

//   if (loading) return <div>Memuat catatan...</div>;
//   if (!note) return (
//     <div className="container mt-5">
//       <p className="text-danger">Catatan tidak ditemukan.</p>
//       <Link href="/home" className="btn btn-primary">Kembali ke Beranda</Link>
//     </div>
//   );

//   return (
//     <div className="container mt-5" style={{ maxWidth: 700 }}>
//       <Link href="/home" className="btn btn-secondary mb-3">← Kembali</Link>
//       {!editMode ? (
//         <>
//           <h2>{note.title}</h2>
//           <hr />
//           <p>{note.content}</p>
//           <div className="mb-2">
//             <b>Folder:</b> {
//               note.folderId
//                 ? folders.find(f => f.id === note.folderId)?.name || note.folderId
//                 : <span className="text-muted">Tanpa Folder</span>
//             }
//           </div>
//           <button className="btn btn-warning" onClick={() => setEditMode(true)}>Edit</button>
//         </>
//       ) : (
//         <div>
//           <input
//             className="form-control mb-2"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             placeholder="Judul catatan"
//           />
//           <textarea
//             className="form-control mb-2"
//             value={content}
//             onChange={e => setContent(e.target.value)}
//             placeholder="Isi catatan"
//             rows={7}
//           />
//           <div className="mb-2">
//             <label className="mb-1"><b>Pindahkan ke Folder</b></label>
//             <select
//               className="form-select"
//               value={folderId}
//               onChange={e => setFolderId(e.target.value)}
//             >
//               <option value="">Tanpa Folder</option>
//               {folders.map(f => (
//                 <option key={f.id} value={f.id}>{f.name}</option>
//               ))}
//             </select>
//           </div>
//           <button className="btn btn-success me-2" onClick={handleSave}>Simpan</button>
//           <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Batal</button>
//         </div>
//       )}
//     </div>
//   );
// }
