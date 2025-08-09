import React, { useEffect, useMemo } from 'react'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedUser, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import UserDeleteConfirmation from './UserDeleteConfirmation'
import { UserTableTools } from './UserTableTools'
import UserEditDialog from './UserEditDialog'
import { upperFirst } from 'lodash'

const ActionColumn = ({ row }) => {

    const dispatch = useDispatch()
    const { textTheme } = useThemeClass()

    const onEdit = () => {
        dispatch(setActionForm('edit'))
        dispatch(setDrawerOpen())
        dispatch(setSelectedUser(row))
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedUser(row))
    }

    return (
        <div className="flex justify-end text-lg">
            <span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit}>
                <HiOutlinePencil />
            </span>
            <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const MainColumn = ({ row }) => {
    return (
        <div className="flex items-center">
            {/* {avatar} */}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>
                {row.username}
            </span>
        </div>
    )
}

const UserTable = () => {

    const dispatch = useDispatch()
    const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.userList.data.tableData)
    const loading = useSelector((state) => state.userList.data.loading)
    const data = useSelector((state) => state.userList.data.userList)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPageSize, initialPageSize])

    const tableData = useMemo(() =>
        ({ initialPageIndex, initialPageSize, total }),
        [initialPageIndex, initialPageSize, total])

    const fetchData = () => {
        dispatch(getUsers())
    }

    const columns = useMemo(() => [
        {
            Header: 'Nombre Usuario',
            accessor: 'username',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                return <MainColumn row={row} />
            },
        },
        {
            Header: 'Empleado',
            accessor: 'employee.fullname',
            sortable: true,
        },
        {
            Header: 'Roles',
            accessor: 'roles',
            sortable: false,
            Cell: props => {
                const row = props.row.original
                return (
                    <div>
                        {row.roles?.map((role, key) => (
                            <div key={key}>{upperFirst(role.name)}</div>
                        ))}
                    </div>
                )
            }
        },
        {
            Header: 'Acciones',
            id: 'action',
            accessor: (row) => row,
            Cell: props => <ActionColumn row={props.row.original} />
        }
    ], [])

    return (
        <>
            <DataTableSimple
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={tableData}
                tableTools={<UserTableTools />}
                title="Usuario deL Sistema"
            />
            <UserDeleteConfirmation />
            <UserEditDialog />
        </>
    )
}

export default UserTable