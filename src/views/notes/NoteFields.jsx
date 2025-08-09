import React, { useState, useEffect } from 'react';
import {
    apiGetNotes,
    apiCreateNote,
    apiUpdateNote,
    apiDeleteNote
} from '../../services/note/NotesService.js';

// Subcomponente para cada nota
const NoteItem = ({ note, onUpdate, onDelete, onToggle }) => {
    const [text, setText] = useState(note.text);

    useEffect(() => {
        setText(note.text);
    }, [note.text]);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (text.trim() !== note.text) {
                onUpdate(note.id, text.trim());
            }
        }
    };

    return (
        <div
            key={note.id}
            className="bg-transparent dark:bg-white p-3 rounded shadow flex flex-col gap-2 w-full max-w-sm">
            <textarea
                className="w-full h-24 bg-transparent resize-none font-sans text-sm text-gray-800 focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between">
                <button
                    className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-900"
                    onClick={() => onDelete(note.id)}
                >
                    Delete
                </button>
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => onToggle(note.id)}
                >
                    {note.completed ? 'Completado' : 'Pendiente'}
                </button>
            </div>
        </div>
    );
};

const NoteFields = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await apiGetNotes();
            console.log('Respuesta de la API:', response.data);
            const notesArray = response.data.data.notes || [];
            setNotes(notesArray);
        } catch (error) {
            console.error('Error al obtener notas:', error);
        }
    };

    const addNote = async () => {
        try {
            const newData = { text: 'New note' };
            const response = await apiCreateNote(newData);
            
            // Verifica la estructura real de la respuesta
            const newNote = response.data.data || response.data; 
            
            // Usa actualización funcional para garantizar la última versión del estado
            setNotes(prevNotes => [...prevNotes, newNote]);
        } catch (error) {
            console.error('Error al crear nota:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await apiDeleteNote(id);
            setNotes(notes.filter((note) => note.id !== id));
        } catch (error) {
            console.error('Error al eliminar nota:', error);
        }
    };

    const handleEdit = async (id, newText) => {
        // Actualización optimista: actualiza la UI inmediatamente
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === id ? { ...note, text: newText } : note
          )
        );
      
        try {
          await apiUpdateNote(id, { text: newText });
        } catch (error) {
          console.error('Error al actualizar nota:', error);
          fetchNotes();
        }
    };

    // Función para alternar el estado 'completed' de la nota
    const toggleNoteCompleted = async (id) => {
        // Se utiliza comparación laxa para evitar problemas de tipo (string vs number)
        const noteToToggle = notes.find((note) => note.id == id);
        if (!noteToToggle) {
            console.error(`No se encontró nota con id: ${id}`);
            return;
        }
      
        const newState = !noteToToggle.completed;
      
        // Actualización optimista en la UI
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteToToggle.id ? { ...note, completed: newState } : note
          )
        );
      
        try {
            await apiUpdateNote(noteToToggle.id, { completed: newState ? 1 : 0 });
        } catch (error) {
          console.error('Error al actualizar estado de la nota:', error);
          fetchNotes();
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onUpdate={handleEdit}
                    onDelete={deleteNote}
                    onToggle={toggleNoteCompleted}
                />
            ))}
            <button
                className="bg-gray-500 text-white px-1 py-1 rounded text-sm hover:bg-gray-600"
                onClick={addNote}
            >
                + Add Note
            </button>
        </div>
    );
};

export default NoteFields;
