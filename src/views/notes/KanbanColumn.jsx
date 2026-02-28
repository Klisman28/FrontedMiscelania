import React, { useState } from 'react';
import NoteCard from './NoteCard';
import { Button } from 'components/ui';
import { HiOutlinePlus } from 'react-icons/hi';
import classNames from 'classnames';

const KanbanColumn = ({
    column,
    notes,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onEditClick,
    activeDragId
}) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOverLocal = (e) => {
        setIsDragOver(true);
        onDragOver(e);
    };

    const handleDragLeaveLocal = (e) => {
        // Prevent flashing if moving over children
        setIsDragOver(false);
    };

    const handleDropLocal = (e) => {
        setIsDragOver(false);
        onDrop(e, column.id);
    };

    return (
        <div
            className="flex flex-col flex-1 min-w-[320px] max-w-[360px] bg-slate-50/80 dark:bg-gray-800/60 rounded-2xl border border-slate-200 dark:border-gray-700 h-full overflow-hidden shrink-0"
            onDragOver={handleDragOverLocal}
            onDragLeave={handleDragLeaveLocal}
            onDrop={handleDropLocal}
        >
            {/* Header Sticky */}
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${column.colorClass} shadow-sm ring-2 ring-white dark:ring-gray-800`} />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100 uppercase tracking-wider">
                        {column.title}
                    </h4>
                    <span className="flex items-center justify-center bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-xs font-bold rounded-full w-6 h-6 ml-1">
                        {notes.length}
                    </span>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => onEditClick(null, column.id)}
                        className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors dark:hover:bg-gray-700"
                        title="Añadir tarjeta a esta columna"
                    >
                        <HiOutlinePlus size={18} />
                    </button>
                </div>
            </div>

            {/* Scrollable Area */}
            <div className={classNames(
                "flex-1 p-3 overflow-y-auto min-h-[200px] transition-colors duration-200 ease-in-out",
                isDragOver ? "bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-indigo-300 ring-inset rounded-b-2xl" : ""
            )}>
                {notes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        columnColor={column.colorClass}
                        onDragStart={(e) => onDragStart(e, note.id)}
                        onDragEnd={onDragEnd}
                        onEditClick={() => onEditClick(note)}
                        isActiveDrag={activeDragId === note.id}
                    />
                ))}

                {/* Empty State visual para la columna */}
                {notes.length === 0 && !isDragOver && (
                    <div className="h-full flex flex-col items-center justify-center px-4 py-8 text-center text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-xl my-2">
                        <div className="mb-2 opacity-50"><HiOutlinePlus size={24} /></div>
                        <p className="text-sm font-medium">No hay elementos disponibles</p>
                        <p className="text-xs mt-1">Añade un elemento a este estado temporalmente arrastrando cartas aquí.</p>
                        <Button
                            variant="plain"
                            size="sm"
                            className="mt-4 text-xs font-bold"
                            onClick={() => onEditClick(null, column.id)}
                        >
                            + Añadir
                        </Button>
                    </div>
                )}

                {/* Drop placeholder phantom box */}
                {isDragOver && (
                    <div className="h-24 bg-indigo-100/50 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-xl my-2 animate-pulse" />
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
