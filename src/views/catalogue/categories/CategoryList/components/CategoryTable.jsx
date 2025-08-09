import React, { useEffect, useMemo } from 'react'
import { Avatar } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedCategory, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import CategoryDeleteConfirmation from './CategoryDeleteConfirmation'
import {CategoryTableTools} from './CategoryTableTools'
import CategoryEditDialog from './CategoryEditDialog'

const ActionColumn = ({row}) => {
	
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedCategory(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedCategory(row))
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
	
	const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{avatar}
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.name}
			</span>
		</div>
	)
}

const CategoryTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.categories.data.tableData)
	const loading = useSelector((state) => state.categories.data.loading)
	const data = useSelector((state) => state.categories.data.categoryList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() => 
		({initialPageIndex, initialPageSize, total}), 
	[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getCategories())
	}

	const columns = useMemo(() => [
		{
			Header: 'Nombre Categoría',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'Código',
			accessor: 'code',
			sortable: true,
		},
		{
			Header: 'Slug',
			accessor: 'slug',
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
				tableTools={<CategoryTableTools />}
				title="Categorías"
			/>
			<CategoryDeleteConfirmation />
			<CategoryEditDialog />
		</>
	)
}

export default CategoryTable