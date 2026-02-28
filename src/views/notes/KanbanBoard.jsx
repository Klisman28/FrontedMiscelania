import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';

const COLUMNS = [
    { id: 'INICIO', title: 'TO DO', colorClass: 'bg-slate-500' },
    { id: 'PROGRESO', title: 'IN PROGRESS', colorClass: 'bg-blue-500' },
    { id: 'FINALIZADO', title: 'DONE', colorClass: 'bg-emerald-500' }
];

const KanbanBoard = ({ notes = [], onStatusChange, onEditClick, loading }) => {

    // HTML5 Drag and Drop Handlers
    const [activeDragId, setActiveDragId] = useState(null);

    const handleDragStart = (e, noteId) => {
        e.dataTransfer.setData('noteId', noteId);
        setActiveDragId(noteId);
        // Pequeño timeout para efecto estético al mover
        setTimeout(() => {
            e.target.classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
        setActiveDragId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        // Opción: añadir clase al hover
    };

    const handleDrop = (e, statusId) => {
        e.preventDefault();
        const noteId = e.dataTransfer.getData('noteId');
        if (noteId) {
            // Find note and check if status changed to avoid redundant API call
            const note = notes.find(n => n.id === parseInt(noteId));
            if (note && note.status !== statusId) {
                onStatusChange(note, statusId);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-[calc(100vh-14rem)] gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map(col => {
                const columnNotes = notes.filter(n => n.status === col.id);
                return (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        notes={columnNotes}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onEditClick={onEditClick}
                        activeDragId={activeDragId}
                    />
                );
            })}
        </div>
    );
};

export default KanbanBoard;
