import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Badge, Tooltip, Pagination, Spinner, Dialog, Button, toast, Notification } from 'components/ui';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCheckCircle, HiOutlinePlay } from 'react-icons/hi';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { apiGetNotes, apiDeleteNote, apiUpdateNote } from '../../services/note/NotesService';

const { Tr, Th, Td, THead, TBody } = Table;

const statusOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'INICIO', label: 'En Inicio' },
    { value: 'PROGRESO', label: 'En Progreso' },
    { value: 'FINALIZADO', label: 'Finalizado' },
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'INICIO':
            return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-2 py-1 rounded" content="Inicio" />;
        case 'PROGRESO':
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded" content="Progreso" />;
        case 'FINALIZADO':
            return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded" content="Finalizado" />;
        default:
            return <Badge content={status || 'Desconocido'} />;
    }
};

const NotesList = ({ refreshNonce, onEdit }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filtros y paginación
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        search: '',
        status: 'Todos'
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const params = {
                limit: tableData.pageSize,
                offset: (tableData.pageIndex - 1) * tableData.pageSize,
                search: tableData.search || undefined,
                status: tableData.status !== 'Todos' ? tableData.status : undefined,
            };
            const response = await apiGetNotes(params);

            const fetchedNotes = response.data?.notes || response.data?.data?.notes || [];
            const fetchedTotal = response.data?.total || response.data?.data?.total || 0;

            setNotes(fetchedNotes);
            setTableData(prev => ({ ...prev, total: fetchedTotal }));
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when dependencies change
    useEffect(() => {
        fetchNotes();
    }, [tableData.pageIndex, tableData.pageSize, tableData.search, tableData.status, refreshNonce]);

    const handleSearchChange = debounce((e) => {
        setTableData(prev => ({ ...prev, search: e.target.value, pageIndex: 1 }));
    }, 500);

    const handleStatusFilterChange = (option) => {
        setTableData(prev => ({ ...prev, status: option.value, pageIndex: 1 }));
    };

    const handlePaginationChange = (page) => {
        setTableData(prev => ({ ...prev, pageIndex: page }));
    };

    const confirmDelete = (note) => {
        setNoteToDelete(note);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!noteToDelete) return;
        try {
            await apiDeleteNote(noteToDelete.id);
            toast.push(<Notification title="Eliminado" type="success">Nota eliminada correctamente.</Notification>, { placement: 'top-center' });
            setDeleteModalOpen(false);
            setNoteToDelete(null);
            fetchNotes();
        } catch (error) {
            console.error('Error eliminando:', error);
            toast.push(<Notification title="Error" type="danger">No se pudo eliminar la nota.</Notification>);
        }
    };

    const handleQuickStatusChange = async (note, newStatus) => {
        try {
            await apiUpdateNote(note.id, { status: newStatus });
            toast.push(<Notification title="Estado actualizado" type="success">Marcado como {newStatus}</Notification>, { placement: 'bottom-end', duration: 2000 });
            fetchNotes();
        } catch (error) {
            console.error("Error cambiando estado:", error);
            toast.push(<Notification title="Error" type="danger">Error al cambiar estado</Notification>);
        }
    };

    return (
        <div>
            {/* Header Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
                <div className="w-full sm:w-64">
                    <Input
                        prefix={<HiOutlineSearch />}
                        placeholder="Buscar por teléfono o texto..."
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        options={statusOptions}
                        defaultValue={statusOptions[0]}
                        onChange={handleStatusFilterChange}
                        placeholder="Filtrar por estado"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center p-8"><Spinner size={40} /></div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table className="w-full">
                        <THead className="bg-gray-50">
                            <Tr>
                                <Th>ID</Th>
                                <Th>Fecha Pedido</Th>
                                <Th>Fecha Fin</Th>
                                <Th>Teléfono</Th>
                                <Th className="w-1/4">Descripción</Th>
                                <Th>Estado</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {notes.length > 0 ? notes.map(note => (
                                <Tr key={note.id} className="hover:bg-slate-50 transition-colors">
                                    <Td className="font-semibold text-gray-500">#{note.id}</Td>
                                    <Td>{dayjs(note.orderDate || note.order_date).format('DD/MM/YYYY')}</Td>
                                    <Td className="font-medium text-slate-700">{dayjs(note.dueDate || note.due_date).format('DD/MM/YYYY')}</Td>
                                    <Td>{note.phone}</Td>
                                    <Td>
                                        <Tooltip title={note.designDescription || note.design_description}>
                                            <span className="block truncate max-w-[200px] text-sm text-gray-600">
                                                {note.designDescription || note.design_description}
                                            </span>
                                        </Tooltip>
                                    </Td>
                                    <Td>{getStatusBadge(note.status)}</Td>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            {note.status !== 'INICIO' && (
                                                <Tooltip title="Mover a Inicio">
                                                    <button onClick={() => handleQuickStatusChange(note, 'INICIO')} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><HiOutlinePlay size={16} /></button>
                                                </Tooltip>
                                            )}
                                            {note.status !== 'PROGRESO' && (
                                                <Tooltip title="Mover a Progreso">
                                                    <button onClick={() => handleQuickStatusChange(note, 'PROGRESO')} className="text-blue-400 hover:text-blue-600 bg-blue-100 p-1 rounded-full"><HiOutlinePlay size={16} /></button>
                                                </Tooltip>
                                            )}
                                            {note.status !== 'FINALIZADO' && (
                                                <Tooltip title="Marcar Finalizado">
                                                    <button onClick={() => handleQuickStatusChange(note, 'FINALIZADO')} className="text-emerald-400 hover:text-emerald-600 bg-emerald-100 p-1 rounded-full"><HiOutlineCheckCircle size={16} /></button>
                                                </Tooltip>
                                            )}

                                            <div className="w-px h-4 bg-gray-200 mx-1"></div>

                                            <Tooltip title="Editar Nota">
                                                <button onClick={() => onEdit(note)} className="text-indigo-600 hover:text-indigo-800 p-1">
                                                    <HiOutlinePencil size={18} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar Nota">
                                                <button onClick={() => confirmDelete(note)} className="text-red-500 hover:text-red-700 p-1">
                                                    <HiOutlineTrash size={18} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan={7} className="text-center py-8 text-gray-500">
                                        No hay notas registradas. Crea una nueva nota desde el panel superior.
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </div>
            )}

            {/* Pagination Controls */}
            {tableData.total > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={tableData.pageIndex}
                        total={tableData.total}
                        pageSize={tableData.pageSize}
                        onChange={handlePaginationChange}
                    />
                </div>
            )}

            {/* Modal Eliminar */}
            <Dialog isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <h5 className="mb-4">Eliminar Nota</h5>
                <p>¿Estás seguro de que deseas eliminar permanentemente la nota <strong>#{noteToDelete?.id}</strong>? Esta acción no se puede deshacer.</p>
                <div className="text-right mt-6">
                    <Button className="mr-2" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
                    <Button variant="solid" color="red-600" onClick={handleDelete}>Sí, eliminar</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default NotesList;
