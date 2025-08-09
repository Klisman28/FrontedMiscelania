import React, { useEffect, useMemo } from 'react'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getEnterprises } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedEnterprise, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import EnterpriseDeleteConfirmation from './EnterpriseDeleteConfirmation'
import {EnterpriseTableTools} from './EnterpriseTableTools'
import EnterpriseEditDialog from './EnterpriseEditDialog'

const ActionColumn = ({row}) => {
	
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedEnterprise(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedEnterprise(row))
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
				{row.name}
			</span>
		</div>
	)
}

const EnterpriseTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.enterpriseList.data.tableData)
	const loading = useSelector((state) => state.enterpriseList.data.loading)
	const data = useSelector((state) => state.enterpriseList.data.enterpriseList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() => 
		({initialPageIndex, initialPageSize, total}), 
	[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getEnterprises())
	}

	const columns = useMemo(() => [
		{
			Header: 'Empresa',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'NIT',
			accessor: 'ruc',
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
				tableTools={<EnterpriseTableTools />}
				title="Empresas"
			/>
			<EnterpriseDeleteConfirmation />
			<EnterpriseEditDialog />
		</>
	)
}

export default EnterpriseTable