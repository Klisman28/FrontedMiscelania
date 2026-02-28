import React, { useEffect, useMemo, useState } from 'react'
import { Table, Pagination, Select, Input, Button, Avatar, Dropdown, Tooltip, Tag, Dialog, Notification, toast } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { HiOutlineSearch, HiDotsVertical, HiOutlineUserAdd, HiOutlineEye, HiOutlineBan, HiOutlineCheckCircle, HiExclamation, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../store/dataSlice'
import { setActionForm, setDrawerOpen } from '../store/stateSlice'
import { matchSorter } from 'match-sorter'
import { upperFirst } from 'lodash'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const TENANT_ROLE_OPTIONS = [
    { value: 'owner', label: 'Owner (Dueño)' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier (Caja)' },
    { value: 'member', label: 'Member' },
]

// --- Helper Functions ---
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

// --- Components ---

const FilterInput = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 300)

    return (
        <Input
            className="w-full md:w-80 shadow-sm border-slate-200"
            size="md"
            value={value || ""}
            onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
            }}
            placeholder="Buscar por nombre, usuario o email..."
            prefix={<HiOutlineSearch className="text-xl text-slate-400" />}
            inputClass="rounded-2xl h-11 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
        />
    )
}

const ActionMenu = ({ row, onAssign, onToggleStatus }) => {
    return (
        <div className="flex justify-end">
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <HiDotsVertical className="text-xl" />
                    </button>
                }
            >
                <Dropdown.Item onClick={() => onAssign(row)} className="gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                    <HiOutlineUserAdd className="text-lg" />
                    Asignar a empresa
                </Dropdown.Item>
                <Dropdown.Item className="gap-2 text-slate-600">
                    <HiOutlineEye className="text-lg" />
                    Ver detalle
                </Dropdown.Item>
                {/* Optional Status toggle - uncomment if backend supports it
                <Dropdown.Item divider />
                <Dropdown.Item className="gap-2 text-red-600" onClick={() => onToggleStatus(row)}>
                    <HiOutlineBan className="text-lg" />
                    Suspender usuario
                </Dropdown.Item>
                */}
            </Dropdown>
        </div>
    )
}

const UserCell = ({ row }) => {
    return (
        <div className="flex items-center gap-4 py-1">
            <Avatar size={40} shape="circle" className="bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 shadow-sm">
                {row.username ? row.username.slice(0, 2).toUpperCase() : 'U'}
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm">{row.username}</span>
                <span className="text-slate-500 text-xs mt-0.5 max-w-[150px] truncate" title={row.email || 'Sin email'}>{row.email || 'Sin email'}</span>
            </div>
        </div>
    )
}

const MembershipChips = ({ memberships, companiesMap, userId, onHardDelete }) => {
    if (!memberships || memberships.length === 0) {
        return <span className="text-slate-400 text-sm italic font-medium">Sin empresas</span>
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'suspended': return 'bg-rose-50 text-rose-700 border-rose-200'
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
            default: return 'bg-slate-50 text-slate-600 border-slate-200'
        }
    }

    const displayCount = 2
    const visibleChips = memberships.slice(0, displayCount)
    const hiddenChips = memberships.slice(displayCount)

    return (
        <div className="flex items-center gap-2 flex-wrap max-w-sm">
            {visibleChips.map((c, idx) => {
                const cId = c.companyId || c.company_id
                const cName = c.company_name || c.name || companiesMap[cId] || `Empresa #${cId}`
                const role = c.role || c.pivot?.role || 'User'
                const isSuspended = c.status?.toLowerCase() === 'suspended'

                return (
                    <div key={idx} className={`inline-flex items-center border rounded-lg pl-2.5 pr-1 py-1 text-xs font-semibold shadow-sm overflow-hidden ${getStatusStyle(c.status)}`}>
                        <span className="max-w-[100px] truncate" title={cName}>{cName}</span>
                        <span className="mx-1.5 opacity-50">•</span>
                        <span className={isSuspended ? "mr-1" : "mr-1.5"}>{upperFirst(role)}</span>
                        {isSuspended && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onHardDelete(cId, userId);
                                }}
                                className="ml-1 p-0.5 rounded hover:bg-rose-200 text-rose-600 transition-colors"
                                title="Eliminar de empresa"
                            >
                                <HiOutlineTrash className="text-sm" />
                            </button>
                        )}
                    </div>
                )
            })}

            {hiddenChips.length > 0 && (
                <Tooltip title={
                    <div className="flex flex-col gap-1 p-1">
                        {hiddenChips.map((hc, i) => (
                            <div key={i} className="text-xs">
                                {hc.company_name || hc.name || companiesMap[hc.companyId || hc.company_id]} ({hc.role})
                            </div>
                        ))}
                    </div>
                }>
                    <div className="inline-flex items-center border border-slate-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 shadow-sm cursor-help hover:bg-slate-50 transition-colors">
                        +{hiddenChips.length} más
                    </div>
                </Tooltip>
            )}
        </div>
    )
}

const UserTable = () => {
    const dispatch = useDispatch()
    const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.userList.data.tableData)
    const data = useSelector((state) => state.userList.data.userList)
    const [isLimitReached, setIsLimitReached] = useState(false)

    // SaaS Specific: Companies mapping and Assign Modal
    const [companiesList, setCompaniesList] = useState([])
    const [companiesMap, setCompaniesMap] = useState({})
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [userToAssign, setUserToAssign] = useState(null)
    const [assignForm, setAssignForm] = useState({ companyId: '', role: 'member' })
    const [assignLoading, setAssignLoading] = useState(false)
    const [membershipsFallback, setMembershipsFallback] = useState({})

    const authority = useSelector((state) => state.auth.user.authority) || []
    const isSuperAdmin = authority.includes('SUPERADMIN')

    const rolesList = useMemo(() => {
        return isSuperAdmin
            ? TENANT_ROLE_OPTIONS
            : TENANT_ROLE_OPTIONS.filter(r => r.value !== 'owner')
    }, [isSuperAdmin])

    useEffect(() => {
        dispatch(getUsers())
        import('services/saasCompanies.service').then(({ getSaasCompanies, getCompanyMembers }) => {
            getSaasCompanies({ limit: 1000 }).then(async res => {
                const companies = res.items || res
                setCompaniesList(companies)
                const map = {}
                companies.forEach(c => { map[c.id] = c.name })
                setCompaniesMap(map)

                // Fallback robusto para membresías si el endpoint de usuarios no las embebe
                try {
                    const membersPromises = companies.map(c =>
                        getCompanyMembers(c.id).then(mRes => {
                            const members = mRes.data?.data || mRes.data?.body || mRes.data || []
                            return { companyId: c.id, companyName: c.name, members }
                        }).catch(() => null)
                    )

                    const results = await Promise.all(membersPromises)
                    const membershipsByUser = {}

                    results.forEach(result => {
                        if (!result) return
                        result.members.forEach(m => {
                            const userId = m.userId ?? m.user_id ?? m.user?.id ?? m.id
                            if (!membershipsByUser[userId]) membershipsByUser[userId] = []
                            membershipsByUser[userId].push({
                                companyId: result.companyId,
                                company_name: result.companyName,
                                role: m.role || m.pivot?.role || 'user',
                                status: m.status || 'unknown'
                            })
                        })
                    })
                    setMembershipsFallback(membershipsByUser)
                } catch (e) {
                    console.error("Error cargando memberships fallback", e)
                }
            })
        })
    }, [dispatch])

    const handleOpenAssign = (row) => {
        setUserToAssign(row)
        setAssignForm({ companyId: '', role: rolesList[0]?.value || 'member' })
        setAssignModalOpen(true)
    }

    const submitAssign = async () => {
        if (!assignForm.companyId) return
        setAssignLoading(true)
        try {
            const { assignCompanyMember } = await import('services/saasCompanies.service')
            await assignCompanyMember(assignForm.companyId, { userId: userToAssign.id, role: assignForm.role })
            import('components/ui').then(({ toast, Notification }) => {
                toast.push(<Notification title="Éxito" type="success">Usuario asignado a empresa</Notification>)
            })
            setAssignModalOpen(false)
            dispatch(getUsers())
        } catch (error) {
            const status = error.response?.status
            const msg = error.response?.data?.message || 'Error al asignar'
            import('components/ui').then(({ toast, Notification }) => {
                if (status === 409) {
                    toast.push(<Notification title="Límite Alcanzado" type="danger">Sin cupos disponibles (seats)</Notification>)
                } else if (status === 403) {
                    toast.push(<Notification title="No Autorizado" type="danger">No autorizado</Notification>)
                } else {
                    toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
                }
            })
        } finally {
            setAssignLoading(false)
        }
    }

    const handleHardDeleteFromChip = async (companyId, userId) => {
        if (!window.confirm('Esto eliminará la membresía definitivamente. ¿Continuar?')) return
        try {
            const { hardDeleteMember } = await import('services/saasCompanies.service')
            await hardDeleteMember(companyId, userId)
            toast.push(<Notification title="Eliminado" type="success">Membresía eliminada definitivamente</Notification>)
            dispatch(getUsers())
            // Recargar fallbacks para refrescarlos (opcional)
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al eliminar miembro'
            toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
        }
    }

    const filterTypes = useMemo(() => ({
        fuzzyText: fuzzyTextFilterFn,
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true
            })
        },
    }), [])

    const columns = useMemo(() => [
        {
            Header: 'Usuario',
            accessor: 'username',
            sortable: true,
            Cell: props => <UserCell row={props.row.original} />,
        },
        {
            Header: 'Membresías (Empresas)',
            accessor: 'companies',
            sortable: false,
            Cell: props => {
                const row = props.row.original
                let memberships = row.companies || row.companyUsers || row.company_users || row.memberships || row.members || []
                if (memberships.length === 0 && membershipsFallback[row.id]) {
                    memberships = membershipsFallback[row.id]
                }
                return <MembershipChips memberships={memberships} companiesMap={companiesMap} userId={row.id} onHardDelete={handleHardDeleteFromChip} />
            }
        },
        {
            Header: 'Roles Globales',
            accessor: 'roles',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                const roles = row.roles || row.globalRoles || []

                return (
                    <div className="flex gap-2 flex-wrap">
                        {roles.length > 0 ? roles.map((role, key) => {
                            const rootRole = role.name || role;
                            const isSuper = rootRole?.toLowerCase() === 'superadmin';
                            return (
                                <span
                                    key={key}
                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm border ${isSuper
                                        ? 'bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 border-rose-200'
                                        : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {rootRole}
                                </span>
                            )
                        }) : (
                            <span className="text-slate-400 text-sm font-medium">-</span>
                        )}
                    </div>
                )
            }
        },
        {
            Header: '',
            id: 'action',
            accessor: (row) => row,
            Cell: props => <ActionMenu row={props.row.original} onAssign={handleOpenAssign} />
        }
    ], [companiesMap])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        rows
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: initialPageIndex, pageSize: initialPageSize },
            manualPagination: false,
            filterTypes,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    const onPaginationChange = page => {
        gotoPage(page - 1)
    }

    const onSelectChange = value => {
        setPageSize(Number(value))
    }

    const onAdd = () => {
        dispatch(setActionForm('create'))
        dispatch(setDrawerOpen())
    }

    const pageSizeOption = [5, 10, 25, 50].map(
        number => ({ value: number, label: `${number} / Pág.` })
    )

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Usuarios Globales</h2>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">Supervisión integral de {rows.length} usuarios a través de todos los tenants del sistema</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="solid" className="shadow-sm shadow-indigo-600/20" icon={<HiOutlineUserAdd />} onClick={onAdd}>
                        Invitar Usuario
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
                    <FilterInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

                    {/* Placeholder for future specific filters */}
                    <div className="flex gap-2">
                        <Select size="md" placeholder="Todas las empresas" className="w-48 shadow-sm" options={[{ label: 'Todas las empresas', value: 'all' }, ...companiesList.map(c => ({ label: c.name, value: c.id }))]} />
                        <Select size="md" placeholder="Estado" className="w-36 shadow-sm" options={[{ label: 'Todos', value: 'all' }, { label: 'Activos', value: 'active' }, { label: 'Supendidos', value: 'suspended' }]} />
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto min-h-[400px]">
                    <Table {...getTableProps()} className="w-full text-left border-collapse">
                        <THead>
                            {headerGroups.map(headerGroup => (
                                <Tr {...headerGroup.getHeaderGroupProps()} className="bg-slate-50 border-b border-slate-200">
                                    {headerGroup.headers.map(column => (
                                        <Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs font-bold text-slate-500 uppercase tracking-wider py-4 px-6 select-none bg-slate-50">
                                            <div className="flex items-center gap-2">
                                                {column.render('Header')}
                                                {column.sortable && (
                                                    <span className="text-slate-400">
                                                        {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>
                        <TBody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row)
                                return (
                                    <Tr {...row.getRowProps()} className="hover:bg-slate-50/60 transition-colors h-16 border-b border-slate-100 last:border-0 group">
                                        {row.cells.map(cell => {
                                            return <Td {...cell.getCellProps()} className="px-6 py-3 whitespace-nowrap">{cell.render('Cell')}</Td>
                                        })}
                                    </Tr>
                                )
                            })}
                            {page.length === 0 && (
                                <Tr>
                                    <Td className="text-center py-16" colSpan={columns.length}>
                                        <div className='flex flex-col items-center justify-center space-y-4 text-slate-400'>
                                            <div className="p-4 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                                <HiExclamation className='w-8 h-8 text-slate-400' />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-600 text-base">No se encontraron usuarios</p>
                                                <p className="text-sm mt-1">Prueba ajustando los filtros de búsqueda</p>
                                            </div>
                                        </div>
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </div>

                {/* Footer Pagination */}
                <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="text-slate-500 text-sm font-medium mb-4 md:mb-0">
                        Mostrando {(pageIndex * pageSize) + 1} a {Math.min((pageIndex + 1) * pageSize, rows.length)} de {rows.length} usuarios
                    </div>
                    <div className="flex items-center gap-4">
                        <Select
                            size="sm"
                            menuPlacement="top"
                            isSearchable={false}
                            value={pageSizeOption.filter(option => option.value === pageSize)}
                            options={pageSizeOption}
                            onChange={option => onSelectChange(option.value)}
                            className="min-w-[120px] shadow-sm font-medium"
                        />
                        <Pagination
                            pageSize={pageSize}
                            currentPage={pageIndex + 1}
                            total={rows.length}
                            onChange={onPaginationChange}
                        />
                    </div>
                </div>
            </div>

            {/* Modals from before */}

            <Dialog isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} width={500}>
                <h5 className="mb-4">Asignar a Empresa</h5>
                <p className="text-gray-500 mb-6">Selecciona una empresa y un rol para {userToAssign?.username}</p>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-1 block">Empresa</label>
                        <Select
                            options={companiesList.map(c => ({ value: c.id, label: c.name }))}
                            value={companiesList.map(c => ({ value: c.id, label: c.name })).find(o => o.value === assignForm.companyId) || null}
                            onChange={(opt) => setAssignForm(p => ({ ...p, companyId: opt ? opt.value : '' }))}
                            placeholder="Selecciona una empresa..."
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold mb-1 block">Rol en el Tenant</label>
                        <Select
                            options={rolesList}
                            value={rolesList.find(r => r.value === assignForm.role) || [{ value: assignForm.role, label: upperFirst(assignForm.role) }]}
                            onChange={(opt) => setAssignForm(p => ({ ...p, role: opt.value }))}
                        />
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button variant="plain" onClick={() => setAssignModalOpen(false)}>Cancelar</Button>
                        <Button variant="solid" loading={assignLoading} disabled={!assignForm.companyId} onClick={submitAssign}>
                            Asignar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default UserTable