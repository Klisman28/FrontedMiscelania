import React, { useEffect, useMemo } from 'react'
import { Avatar } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomers } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedCustomer, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import CustomerDeleteConfirmation from './CustomerDeleteConfirmation'
import {CustomerTableTools} from './CustomerTableTools'
import CustomerEditDialog from './CustomerEditDialog'

const ActionColumn = ({row}) => {
	
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedCustomer(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedCustomer(row))
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

const MainColumn = ({row}) => {
	
	// const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{/* {avatar} */}
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.fullname}
			</span>
		</div>
	)
}

const CustomerTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.customerList.data.tableData)
	const loading = useSelector((state) => state.customerList.data.loading)
	const data = useSelector((state) => state.customerList.data.customerList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() => 
		({initialPageIndex, initialPageSize, total}), 
	[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getCustomers())
	}

	const columns = useMemo(() => [
		{
			Header: 'Cliente',
			accessor: 'fullname',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <MainColumn row={row} />
			},
		},
		{
			Header: 'NIT',
			accessor: 'dni',
			sortable: true,
		},
        {
			Header: 'Email',
			accessor: 'email',
			sortable: true,
		},
        {
			Header: 'Teléfono',
			accessor: 'telephone',
			sortable: true,
		},
        {
			Header: 'Dirección',
			accessor: 'address',
			sortable: true,
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
				skeletonAvatarProps={{className: 'rounded-md'}}
				loading={loading}
				pagingData={tableData}
				tableTools={<CustomerTableTools />}
				title="Clientes"
			/>
			<CustomerDeleteConfirmation />
			<CustomerEditDialog />
		</>
	)
}

export default CustomerTable