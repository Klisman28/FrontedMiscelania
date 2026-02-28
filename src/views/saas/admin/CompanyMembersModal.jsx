import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Dialog, Table, Button, Spinner, Notification, toast, Tag, Select, Progress, Tooltip, Avatar } from 'components/ui'
import { HiOutlineTrash, HiOutlinePencil, HiCheck, HiX, HiOutlineUserGroup, HiOutlineUserAdd, HiOutlineBan, HiOutlineRefresh } from 'react-icons/hi'
import {
    getCompanyMembers,
    assignCompanyMember,
    updateCompanyMember,
    removeCompanyMember,
    hardDeleteMember
} from 'services/saasCompanies.service'
import { searchSaasUsers } from 'services/saasUsers.service'
import AsyncSelect from 'react-select/async'
import { useSelector } from 'react-redux'
import { upperFirst } from 'lodash'

const { Tr, Th, Td, THead, TBody } = Table

const TENANT_ROLE_OPTIONS = [
    { value: 'owner', label: 'Owner (Dueño)' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier (Caja)' },
    { value: 'member', label: 'Member' },
]

const StatusBadge = ({ status }) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return <Tag className="bg-emerald-100 text-emerald-700 border-0 rounded-md font-semibold">Activo</Tag>
        case 'suspended':
            return <Tag className="bg-rose-100 text-rose-700 border-0 rounded-md font-semibold">Suspendido</Tag>
        case 'pending':
            return <Tag className="bg-amber-100 text-amber-700 border-0 rounded-md font-semibold">Pendiente</Tag>
        default:
            return <Tag className="bg-slate-100 text-slate-600 border-0 rounded-md font-semibold">{upperFirst(status)}</Tag>
    }
}

const MembersModalHeader = ({ company, activeMembersCount }) => {
    const seats = company?.seats || 0
    const percent = seats > 0 ? Math.min((activeMembersCount / seats) * 100, 100) : 0
    const isLimit = activeMembersCount >= seats && seats > 0

    return (
        <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
                <h5 className="font-bold text-xl text-slate-900 tracking-tight">Miembros de la Empresa</h5>
                <p className="text-slate-500 font-medium mt-1">{company?.name || 'Administración de accesos'}</p>
            </div>

            <div className={`p-4 rounded-xl border ${isLimit ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2 items-center">
                        <HiOutlineUserGroup className={isLimit ? 'text-rose-500 text-lg' : 'text-slate-500 text-lg'} />
                        <span className={`text-sm font-semibold ${isLimit ? 'text-rose-700' : 'text-slate-700'}`}>
                            Asientos usados
                        </span>
                    </div>
                    <span className={`text-sm font-bold ${isLimit ? 'text-rose-700' : 'text-slate-900'}`}>
                        {activeMembersCount} / {seats}
                    </span>
                </div>
                <Progress
                    percent={percent}
                    color={isLimit ? 'bg-rose-500' : 'bg-indigo-500'}
                    size="sm"
                    customInfo={<span />}
                />
            </div>
        </div>
    )
}

const MembersToolbar = ({ loadUsers, selectedUser, setSelectedUser, roleOptions, selectedRole, setSelectedRole, onAdd, actionLoading, isLimit }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 items-center mb-4 bg-slate-50 p-2 text-sm rounded-xl border border-slate-200">
            <div className="flex-1 w-full">
                <Select
                    componentAs={AsyncSelect}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadUsers}
                    placeholder="Buscar usuario por nombre/email..."
                    value={selectedUser}
                    onChange={setSelectedUser}
                    className="w-full shadow-sm"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
            </div>
            <div className="w-full md:w-48">
                <Select
                    options={roleOptions}
                    value={roleOptions.find(r => r.value === selectedRole)}
                    onChange={(val) => setSelectedRole(val?.value)}
                    className="shadow-sm"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
            </div>
            <Button
                variant="solid"
                disabled={!selectedUser || isLimit}
                loading={actionLoading}
                onClick={onAdd}
                icon={<HiOutlineUserAdd />}
                className="w-full md:w-auto shadow-sm"
            >
                Agregar
            </Button>
        </div>
    )
}

const RoleSelectCell = ({ roleOptions, editingRole, setEditingRole }) => {
    return (
        <Select
            size="sm"
            options={roleOptions}
            value={roleOptions.find(r => r.value === editingRole)}
            onChange={v => setEditingRole(v.value)}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
    )
}

const MembersTable = ({
    members, loading, editingUserId, editingRole,
    roleOptions, setEditingRole, handleUpdateMember,
    setEditingUserId, startEditing, handleRemoveMember, handleHardDelete
}) => {

    if (loading) {
        return (
            <div className="flex flex-col gap-4 py-8 items-center justify-center">
                <Spinner size={40} />
                <span className="text-slate-500 font-medium mt-2">Cargando miembros...</span>
            </div>
        )
    }

    if (!members || members.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl mb-4">
                <div className="bg-white p-3 rounded-full inline-block border border-slate-100 shadow-sm mb-3">
                    <HiOutlineUserGroup className="text-3xl text-slate-400" />
                </div>
                <h6 className="text-slate-700 font-semibold">Sin miembros asignados</h6>
                <p className="text-slate-500 text-sm mt-1">Busca un usuario global y asígnale un rol para agregarlo al tenant.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto border border-slate-200 rounded-xl rounded-b-none mb-4 max-h-[400px]">
            <Table className="w-full !border-0 text-left">
                <THead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <Tr>
                        <Th className="font-bold text-slate-500 bg-slate-50 border-b border-slate-200">Usuario</Th>
                        <Th className="font-bold text-slate-500 bg-slate-50 border-b border-slate-200">Rol Tenant</Th>
                        <Th className="font-bold text-slate-500 bg-slate-50 border-b border-slate-200">Estado</Th>
                        <Th className="font-bold text-slate-500 bg-slate-50 border-b border-slate-200 text-right">Acciones</Th>
                    </Tr>
                </THead>
                <TBody>
                    {members.map((member, index) => {
                        const mId = member.userId;
                        const isEditing = editingUserId === mId;
                        const username = member.username;

                        return (
                            <Tr key={member.membershipId || mId || index} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-0 group h-14">
                                <Td className="font-medium text-slate-900 border-0">
                                    <div className="flex items-center gap-3">
                                        <Avatar size="sm" shape="circle" className="bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 hidden sm:flex">
                                            {username ? username.slice(0, 2).toUpperCase() : 'U'}
                                        </Avatar>
                                        <span>{username}</span>
                                    </div>
                                </Td>
                                <Td className="border-0">
                                    {isEditing ? (
                                        <div className="w-36">
                                            <RoleSelectCell
                                                roleOptions={roleOptions}
                                                editingRole={editingRole}
                                                setEditingRole={setEditingRole}
                                            />
                                        </div>
                                    ) : (
                                        <span className="font-semibold text-slate-700">{upperFirst(member.role)}</span>
                                    )}
                                </Td>
                                <Td className="border-0">
                                    <StatusBadge status={member.status} />
                                </Td>
                                <Td className="border-0 text-right">
                                    <div className="flex gap-2 justify-end text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                        {isEditing ? (
                                            <>
                                                <Tooltip title="Guardar cambios">
                                                    <button className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg border border-transparent hover:border-emerald-200 transition-colors bg-white shadow-sm" onClick={() => handleUpdateMember(mId, { role: editingRole })}>
                                                        <HiCheck />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Cancelar">
                                                    <button className="text-slate-500 hover:bg-slate-50 p-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors bg-white shadow-sm" onClick={() => setEditingUserId(null)}>
                                                        <HiX />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <Tooltip title="Editar rol">
                                                <button className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors" onClick={() => startEditing(member)}>
                                                    <HiOutlinePencil />
                                                </button>
                                            </Tooltip>
                                        )}

                                        {member.status === 'active' ? (
                                            <Tooltip title="Suspender acceso">
                                                <button className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-lg transition-colors" onClick={() => handleRemoveMember(mId)}>
                                                    <HiOutlineBan />
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <>
                                                <Tooltip title="Activar acceso">
                                                    <button className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors" onClick={() => handleUpdateMember(mId, { status: 'active' })}>
                                                        <HiOutlineRefresh />
                                                    </button>
                                                </Tooltip>

                                                <Tooltip title="Eliminar definitivamente">
                                                    <button className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors" onClick={() => handleHardDelete(mId)}>
                                                        <HiOutlineTrash />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </div>
    )
}


const CompanyMembersModal = ({ isOpen, onClose, company }) => {
    const authority = useSelector((state) => state.auth.user.authority) || []
    const isSuperAdmin = authority.includes('SUPERADMIN')

    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form state
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedRole, setSelectedRole] = useState('member')

    // Inline edit state
    const [editingUserId, setEditingUserId] = useState(null)
    const [editingRole, setEditingRole] = useState('')

    const roleOptions = useMemo(() => {
        return isSuperAdmin
            ? TENANT_ROLE_OPTIONS
            : TENANT_ROLE_OPTIONS.filter(r => r.value !== 'owner')
    }, [isSuperAdmin])

    const fetchMembers = useCallback(async () => {
        if (!company?.id) return
        setLoading(true)
        try {
            const resp = await getCompanyMembers(company.id)
            const rawData = resp.data?.data || resp.data?.body || resp.data || []
            const normalizedData = rawData.map(m => ({
                membershipId: m.id,
                userId: m.userId ?? m.user_id ?? m.user?.id ?? m.id,
                username: m.user?.username ?? m.username ?? 'Desconocido',
                role: m.role || m.pivot?.role || 'user',
                status: m.status || m.pivot?.status || 'unknown'
            }))
            setMembers(normalizedData)
        } catch (error) {
            console.error('Error fetching members', error)
            toast.push(<Notification title="Error" type="danger">Error al cargar miembros</Notification>)
        } finally {
            setLoading(false)
        }
    }, [company?.id])

    useEffect(() => {
        if (isOpen) {
            fetchMembers()
            setSelectedUser(null)
            setSelectedRole('member')
            setEditingUserId(null)
        } else {
            setMembers([])
        }
    }, [isOpen, fetchMembers])

    const loadUsers = async (inputValue) => {
        if (inputValue && inputValue.length < 2) return []
        try {
            const params = { limit: 10, search: inputValue }
            const resp = await searchSaasUsers(params)
            const payload = resp.data?.data || resp.data?.body || resp.data
            const users = payload.users || (Array.isArray(payload) ? payload : [])

            return users.map(u => ({
                value: u.id,
                label: `${u.username} (${u.email || 'Sin email'})`
            }))
        } catch (e) {
            return []
        }
    }

    const handleAddMember = async () => {
        if (!selectedUser) return
        setActionLoading(true)
        try {
            await assignCompanyMember(company.id, {
                userId: selectedUser.value,
                role: selectedRole
            })
            toast.push(<Notification title="Éxito" type="success">Miembro agregado</Notification>)
            setSelectedUser(null)
            fetchMembers()
        } catch (error) {
            const status = error.response?.status
            const msg = error.response?.data?.message || 'Error al agregar miembro'
            if (status === 409) {
                toast.push(<Notification title="Límite Alcanzado" type="danger">Sin cupos (seats) disponibles</Notification>)
            } else {
                toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
            }
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateMember = async (userId, payload) => {
        try {
            await updateCompanyMember(company.id, userId, payload)
            toast.push(<Notification title="Actualizado" type="success">Miembro actualizado</Notification>)
            fetchMembers()
            setEditingUserId(null)
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar miembro'
            toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
        }
    }

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('¿Seguro de suspender a este usuario de la empresa?')) return
        try {
            await removeCompanyMember(company.id, userId)
            toast.push(<Notification title="Suspendido" type="success">Usuario suspendido</Notification>)
            fetchMembers()
        } catch (error) {
            const status = error.response?.status
            const msg = error.response?.data?.message || 'Error al suspender miembro'
            if (status === 404) {
                toast.push(<Notification title="No Encontrado" type="warning">El miembro ya no figura en la empresa</Notification>)
                fetchMembers() // Refresh list just in case
            } else {
                toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
            }
        }
    }

    const handleHardDelete = async (userId) => {
        if (!window.confirm('Esto eliminará la membresía definitivamente. ¿Continuar?')) return
        try {
            await hardDeleteMember(company.id, userId)
            toast.push(<Notification title="Eliminado" type="success">Membresía eliminada definitivamente</Notification>)
            fetchMembers()
        } catch (error) {
            const status = error.response?.status
            const msg = error.response?.data?.message || 'Error al eliminar miembro'
            if (status === 409) {
                toast.push(<Notification title="Advertencia" type="warning">Primero suspende antes de eliminar</Notification>)
            } else {
                toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
            }
        }
    }

    const startEditing = (member) => {
        setEditingUserId(member.userId)
        setEditingRole(member.role || 'member')
    }

    const activeMembersCount = members.filter(m => m.status !== 'suspended').length
    const isLimit = activeMembersCount >= (company?.seats || 0) && (company?.seats || 0) > 0

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={850}
            className="rounded-2xl shadow-xl overflow-visible"
        >
            <MembersModalHeader
                company={company}
                activeMembersCount={activeMembersCount}
            />

            <MembersToolbar
                loadUsers={loadUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                roleOptions={roleOptions}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                onAdd={handleAddMember}
                actionLoading={actionLoading}
                isLimit={isLimit}
            />

            <MembersTable
                members={members}
                loading={loading}
                editingUserId={editingUserId}
                editingRole={editingRole}
                roleOptions={roleOptions}
                setEditingRole={setEditingRole}
                handleUpdateMember={handleUpdateMember}
                setEditingUserId={setEditingUserId}
                startEditing={startEditing}
                handleRemoveMember={handleRemoveMember}
                handleHardDelete={handleHardDelete}
            />

            <div className="flex justify-end pt-3 mt-4 border-t border-slate-100">
                <Button onClick={onClose} variant="plain" className="font-semibold">Cerrar</Button>
            </div>
        </Dialog>
    )
}

export default CompanyMembersModal
