import React, { useEffect, useMemo } from 'react'
import { Avatar, Badge } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getPurchases } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedPurchas, setShowDialogOpen } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import PurchasDeleteConfirmation from './PurchasDeleteConfirmation'
import { PurchasTableTools } from './PurchasTableTools'
import PurchasShowDialog from './PurchasShowDialog'
import { NumericFormat } from 'react-number-format'

const ActionColumn = ({ row }) => {

	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setSelectedPurchas(row))
		dispatch(setShowDialogOpen(true))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedPurchas(row))
	}

	return (
		<div className="flex justify-end text-lg">
			<span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit}>
				<HiOutlineEye />
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
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.dateIssue}
			</span>
		</div>
	)
}

const CurrencyColumn = ({ value }) => {

	return (
		<NumericFormat
			displayType="text"
			value={(Math.round(value * 100) / 100).toFixed(2)}
			prefix={'S/'}
			thousandSeparator={true}
		/>
	)
}

const PurchasTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.purchasList.data.tableData)
	const loading = useSelector((state) => state.purchasList.data.loading)
	const data = useSelector((state) => state.purchasList.data.purchasList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getPurchases())
	}

	const columns = useMemo(() => [
		{
			Header: 'Fecha',
			accessor: 'dataIssue',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <MainColumn row={row} />
			},
		},
		{
			Header: 'Total',
			accessor: 'total',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<CurrencyColumn value={row.total} />
				)
			}
		},
		{
			Header: 'SAT',
			accessor: 'igv',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<CurrencyColumn value={row.igv} />
				)
			}
		},
		{
			Header: 'Proveedor',
			accessor: 'supplier.name',
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
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={tableData}
				tableTools={<PurchasTableTools />}
				title="Compras"
			/>
			<PurchasDeleteConfirmation />
			<PurchasShowDialog />
		</>
	)
}

export default PurchasTable