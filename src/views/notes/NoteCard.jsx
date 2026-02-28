import React from 'react';
import classNames from 'classnames';
import { HiOutlineCalendar, HiOutlinePhone, HiOutlineDotsHorizontal } from 'react-icons/hi';
import dayjs from 'dayjs';

const NoteCard = ({
    note,
    columnColor,
    onDragStart,
    onDragEnd,
    onEditClick,
    isActiveDrag
}) => {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onEditClick}
            className={classNames(
                'group relative bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-grab active:cursor-grabbing',
                isActiveDrag ? 'opacity-50 ring-2 ring-indigo-500 scale-95' : 'opacity-100'
            )}
        >
            {/* Top Bar: ID and Menu */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={classNames('w-1.5 h-1.5 rounded-full shadow-sm', columnColor)} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {`#${note.id}`}
                    </span>
                </div>

                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors p-1" onClick={(e) => { e.stopPropagation(); onEditClick(); }}>
                    <HiOutlineDotsHorizontal size={18} />
                </button>
            </div>

            {/* Content: Description */}
            <div className="mb-4">
                <h5 className="text-sm font-bold text-slate-800 dark:text-gray-100 mb-1 line-clamp-1">
                    {note.clientName || note.client_name || 'Cliente sin nombre'}
                </h5>
                <p className="text-xs font-medium text-slate-600 dark:text-gray-300 leading-snug line-clamp-3 overflow-hidden">
                    {note.designDescription || note.design_description}
                </p>
            </div>

            {/* Badges optional tags area here if needed */}

            {/* Footer: Meta Info */}
            <div className="border-t border-slate-100 dark:border-gray-700 pt-3 mt-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 font-medium">
                    <HiOutlinePhone className="shrink-0" size={14} />
                    <span className="truncate">{note.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 font-medium">
                    <HiOutlineCalendar className="shrink-0 text-slate-400" size={14} />
                    <span className="truncate">
                        Fin: <span className="text-slate-600 dark:text-gray-300 font-semibold">{dayjs(note.dueDate || note.due_date).format('DD MMM')}</span>
                    </span>
                </div>
            </div>

            {/* Hover shadow overlay subtle left bar indicating scrum state color */}
            <div className={classNames('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity', columnColor)} />
        </div>
    );
};

export default NoteCard;
