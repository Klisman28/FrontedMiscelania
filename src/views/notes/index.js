import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Notification, toast, Dialog } from 'components/ui';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import debounce from 'lodash/debounce';
import KanbanBoard from './KanbanBoard';
import NoteForm from './NoteForm';
import { apiGetNotes, apiUpdateNote, apiDeleteNote } from '../../services/note/NotesService';

const statusOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'INICIO', label: 'TO DO (Inicio)' },
    { value: 'PROGRESO', label: 'IN PROGRESS (Progreso)' },
    { value: 'FINALIZADO', label: 'DONE (Finalizado)' },
];

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    // Dialog / Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [initialStateFromAddBtn, setInitialStateFromAddBtn] = useState('INICIO');

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                search: searchQuery || undefined,
                status: statusFilter !== 'Todos' ? statusFilter : undefined,
                limit: 1000, // For kanban, fetch more 
            };
            const response = await apiGetNotes(params);
            const fetchedNotes = response.data?.notes || response.data?.data?.notes || [];
            setNotes(fetchedNotes);
        } catch (error) {
            console.error('Error fetching Kanban notes:', error);
            toast.push(<Notification title="Error" type="danger">No se pudieron cargar las notas</Notification>);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSearchChange = debounce((e) => {
        setSearchQuery(e.target.value);
    }, 500);

    const handleStatusFilterChange = (option) => {
        setStatusFilter(option.value);
    };

    const handleCreateClick = () => {
        setSelectedNote(null);
        setInitialStateFromAddBtn('INICIO');
        setIsFormOpen(true);
    };

    const handleEditClick = (note, defaultStatus = 'INICIO') => {
        if (note) {
            setSelectedNote(note);
            setInitialStateFromAddBtn(note.status || 'INICIO');
        } else {
            setSelectedNote(null);
            setInitialStateFromAddBtn(defaultStatus);
        }
        setIsFormOpen(true);
    };

    const handleStatusChange = async (note, newStatus) => {
        if (note.status === newStatus) return; // No change

        // Optimistic UI update
        setNotes(prev => prev.map(n => n.id === note.id ? { ...n, status: newStatus } : n));

        try {
            await apiUpdateNote(note.id, { status: newStatus });
            toast.push(<Notification title="Éxito" type="success">Nota # {note.id} movida correctamente</Notification>, { placement: 'bottom-end', duration: 1500 });
        } catch (error) {
            // Revert
            fetchNotes();
            toast.push(<Notification title="Error" type="danger">No se pudo mover la nota</Notification>);
        }
    };

    const handleSuccessRegistration = () => {
        toast.push(
            <Notification title="¡Éxito!" type="success" duration={3000}>
                Nota guardada exitosamente.
            </Notification>,
            { placement: 'top-center' }
        );
        setIsFormOpen(false);
        fetchNotes();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la nota #${id}?`)) return;
        try {
            await apiDeleteNote(id);
            toast.push(<Notification title="Eliminado" type="success">Nota eliminada permanentemente.</Notification>, { placement: 'top-center' });
            setIsFormOpen(false);
            fetchNotes();
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">No se pudo eliminar la nota.</Notification>);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header + Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Tablero de Pedidos</h3>
                    <p className="text-gray-500 text-sm">Gestiona el flujo Scrum (To Do, In Progress, Done)</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-60">
                        <Input
                            prefix={<HiOutlineSearch />}
                            placeholder="Buscar teléfono o texto..."
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <Select
                            options={statusOptions}
                            defaultValue={statusOptions[0]}
                            onChange={handleStatusFilterChange}
                            placeholder="Estado"
                        />
                    </div>

                    <Button
                        variant="solid"
                        icon={<HiOutlinePlus />}
                        onClick={handleCreateClick}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md font-semibold"
                    >
                        Nueva Nota
                    </Button>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="flex-1 min-h-0 bg-transparent flex flex-col overflow-hidden pb-4">
                <KanbanBoard
                    notes={notes}
                    onStatusChange={handleStatusChange}
                    onEditClick={handleEditClick}
                    loading={loading}
                />
            </div>

            {/* Form Drawer / Dialog */}
            <Dialog
                isOpen={isFormOpen}
                width={700}
                onClose={() => setIsFormOpen(false)}
                onRequestClose={() => setIsFormOpen(false)}
            >
                <div className="flex flex-col h-full mt-4">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-slate-800 dark:text-gray-100 uppercase tracking-wider">
                            {selectedNote ? `Editar Nota #${selectedNote.id}` : 'Crear Nueva Nota'}
                        </h4>

                        {selectedNote && (
                            <Button size="sm" variant="solid" color="red-600" onClick={() => handleDelete(selectedNote.id)}>
                                Eliminar permanentemente
                            </Button>
                        )}
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                        {/* We reuse the Formik form, passing the default status if it is a new note and triggered from a specific column */}
                        <NoteForm
                            initialData={selectedNote || { status: initialStateFromAddBtn }}
                            onSuccess={handleSuccessRegistration}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default NotesPage;
