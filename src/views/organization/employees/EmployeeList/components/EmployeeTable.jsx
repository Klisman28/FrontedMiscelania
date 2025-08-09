import React, { useEffect, useMemo } from 'react'
import { Avatar } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployees } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedEmployee, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import EmployeeDeleteConfirmation from './EmployeeDeleteConfirmation'
import {EmployeeTableTools} from './EmployeeTableTools'
import EmployeeEditDialog from './EmployeeEditDialog'

const ActionColumn = ({row}) => {
	
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedEmployee(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedEmployee(row))
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

const CategoryColumn = ({row}) => {
	
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

const EmployeeTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.employeeList.data.tableData)
	const loading = useSelector((state) => state.employeeList.data.loading)
	const data = useSelector((state) => state.employeeList.data.employeeList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() => 
		({initialPageIndex, initialPageSize, total}), 
	[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getEmployees())
	}

	const columns = useMemo(() => [
		{
			Header: 'Empleado',
			accessor: 'fullname',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'DNI',
			accessor: 'dni',
			sortable: true,
		},
		{
			Header: 'Cumpleaños',
			accessor: 'birthdate',
			sortable: true,
		},
        {
			Header: 'Sexo',
			accessor: 'gender',
			sortable: true,
		},
        {
			Header: 'Emial',
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
				tableTools={<EmployeeTableTools />}
				title="Empleados"
			/>
			<EmployeeDeleteConfirmation />
			<EmployeeEditDialog />
		</>
	)
}

export default EmployeeTable