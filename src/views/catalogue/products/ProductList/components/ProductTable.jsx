import React, { useEffect, useMemo } from 'react'
import { Avatar, Badge, Tooltip } from 'components/ui'
import ProductDataTable from './ProductDataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedProduct } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import { ProductTableTools } from './ProductTableTools'
import { useNavigate } from 'react-router-dom'

const inventoryStatusColor = {
	0: { label: 'En Stock', dotClass: 'bg-emerald-500', textClass: 'text-emerald-600 bg-emerald-100' },
	1: { label: 'Limitado', dotClass: 'bg-amber-500', textClass: 'text-amber-600 bg-amber-100' },
	2: { label: 'Agotado', dotClass: 'bg-red-500', textClass: 'text-red-600 bg-red-100' },
}

const ActionColumn = ({ row, onEdit }) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { textTheme } = useThemeClass()

	const onEditClick = () => {
		onEdit(row)
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedProduct(row))
	}

	return (
		<div className="flex justify-end items-center gap-2">
			<Tooltip title="Editar">
				<button
					className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-gray-600 transition-colors"
					onClick={onEditClick}
				>
					<HiOutlinePencil className="text-lg" />
				</button>
			</Tooltip>
			<Tooltip title="Eliminar">
				<button
					className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
					onClick={onDelete}
				>
					<HiOutlineTrash className="text-lg" />
				</button>
			</Tooltip>
		</div>
	)
}

const CategoryColumn = ({ row }) => {

	const avatar = row.imageUrl ?
		<Avatar src={row.imageUrl} className="rounded-lg h-10 w-10 shadown-sm border border-gray-100" /> :
		<Avatar icon={<FiPackage />} className="rounded-lg h-10 w-10 bg-gray-100 text-gray-400" />

	return (
		<div className="flex items-center gap-3">
			<div className="flex-shrink-0 w-10 h-10">
				{avatar}
			</div>
			<div className="flex flex-col">
				<span className="font-semibold text-gray-900 line-clamp-1" title={row.name}>
					{row.name}
				</span>
				<span className="text-xs text-gray-400 font-medium">{row.sku}</span>
			</div>
		</div>
	)
}


const getStockBadge = (stock, stockMin) => {
	if (stock === 0) {
		return {
			label: `0`,
			className: 'bg-red-100 text-red-600'
		}
	}
	if (stock < stockMin) {
		return {
			label: ` (${stock}/${stockMin})`,
			className: 'bg-amber-100 text-amber-600'
		}
	}
	return {
		label: ` (${stock}/${stockMin})`,
		className: 'bg-emerald-100 text-emerald-600'
	}
}


const ProductTable = ({ onEdit, onAdd }) => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.productList.data.tableData)
	const loading = useSelector((state) => state.productList.data.loading)
	const data = useSelector((state) => state.productList.data.productList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getProducts())
	}

	const columns = useMemo(() => [

		{
			Header: 'Producto',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'SKU',
			accessor: 'sku',
			// Hiding duplicate SKU since it's now in the product column, or keeping as secondary info
			// User requested "Mantener EXACTAMENTE las mismas columnas", so I keep it but maybe styled subtle
			Cell: props => <span className="text-gray-600 font-medium tabular-nums">{props.value}</span>
		},
		{
			Header: 'Descripción',
			accessor: 'description',
			Cell: props => {
				const { description } = props.row.original
				return (
					<div className="text-xs text-gray-500 max-w-xs truncate" title={description}>{description}</div>
				)
			}
		},
		{
			Header: 'Marca',
			accessor: 'brand.name',
			Cell: props => <span className="text-gray-700 font-medium">{props.value}</span>
		},
		{
			Header: 'Subcategoría',
			accessor: 'subcategory.name',
			Cell: props => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
				{props.value}
			</span>
		},
		{
			Header: 'Costo',
			accessor: 'cost',
			alignRight: true, // For custom header
			Cell: props => {
				const { cost } = props.row.original
				return (
					<div className='flex items-center justify-end font-medium text-gray-700 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(cost).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Ganancia',
			accessor: 'utility',
			alignRight: true,
			Cell: props => {
				const { utility } = props.row.original
				return (
					<div className='flex items-center justify-end font-medium text-gray-700 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(utility).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Precio',
			accessor: 'price',
			alignRight: true,
			Cell: props => {
				const { price } = props.row.original
				return (
					<div className='flex items-center justify-end font-bold text-gray-900 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(price).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Stock',
			accessor: 'stock',
			alignRight: true, // Numbers aligned right usually better
			Cell: (props) => {
				const { stock, stockMin } = props.row.original
				const stockBadge = getStockBadge(stock, stockMin)
				return (
					<div className="flex justify-end">
						<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${stockBadge.className}`}>
							{stockBadge.label}
						</span>
					</div>
				)
			},
		},

		{
			Header: 'Status',
			accessor: 'status',
			sortable: true,
			Cell: (props) => {
				const { stock, stockMin } = props.row.original
				let computedStatus = 0
				if (stock === 0) computedStatus = 2
				else if (stock < stockMin) computedStatus = 1

				const { label, dotClass, textClass } = inventoryStatusColor[computedStatus]

				return (
					<div className="flex items-center">
						<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${textClass.replace('text-', 'bg-opacity-20 ')}`}>
							<span className={`h-1.5 w-1.5 rounded-full ${dotClass}`}></span>
							<span className={textClass.split(' ')[0]}>{label}</span>
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Vencimiento',
			accessor: 'expirationDate',
			Cell: (props) => {
				const { expirationDate, hasExpiration } = props.row.original
				if (!hasExpiration) return <span className="text-gray-300 text-center block">-</span>

				const dateValue = new Date(expirationDate)
				const today = new Date()
				today.setHours(0, 0, 0, 0)
				const isExpired = dateValue < today

				const baseClasses = 'px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap'
				const expiredClasses = 'text-red-700 bg-red-50 ring-1 ring-red-600/20'
				const validClasses = 'text-gray-600 bg-gray-50'

				return (
					<span className={`${baseClasses} ${isExpired ? expiredClasses : validClasses}`}>
						{expirationDate}
					</span>
				)
			}
		},
		{
			Header: 'Acciones',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <ActionColumn row={props.row.original} onEdit={onEdit} />
		}
	], [onEdit])

	return (
		<div className="h-full">
			<ProductDataTable
				columns={columns}
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={tableData}
				tableTools={<ProductTableTools onAdd={onAdd} />}
				title="Productos"
			/>
			<ProductDeleteConfirmation />
		</div>
	)
}

export default ProductTable