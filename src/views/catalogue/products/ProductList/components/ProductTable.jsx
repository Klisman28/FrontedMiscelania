import React, { useEffect, useMemo } from 'react'
import { Avatar, Badge } from 'components/ui'
import { DataTableSimple } from 'components/shared'
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
	0: { label: 'En Stock', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
	1: { label: 'Limitado', dotClass: 'bg-amber-500', textClass: 'text-amber-500' },
	2: { label: 'Agotado', dotClass: 'bg-red-500', textClass: 'text-red-500' },
}

const ActionColumn = ({ row }) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		navigate(`${row.id}/edit`)
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedProduct(row))
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

const CategoryColumn = ({ row }) => {

	const avatar = row.imageUrl ? <Avatar src={row.imageUrl} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{avatar}
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.name}
			</span>
		</div>
	)
}


// 1. Crea esta función auxiliar
const getStockBadge = (stock, stockMin) => {
	// Si no hay unidades
	if (stock === 0) {
		return {
			label: `0`,
			className: 'bg-red-100 text-red-600' // Ajusta tus clases de color
		}
	}
	// Si el stock está por debajo de stockMin
	if (stock < stockMin) {
		return {
			label: ` (${stock}/${stockMin})`,
			className: 'bg-amber-100 text-amber-600'
		}
	}
	// Caso contrario: suficiente stock
	return {
		label: ` (${stock}/${stockMin})`,
		className: 'bg-emerald-100 text-emerald-600'
	}
}


const ProductTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.products.data.tableData)
	const loading = useSelector((state) => state.products.data.loading)
	const data = useSelector((state) => state.products.data.productList)



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
		},
		{
			Header: 'Descripción',
			accessor: 'description', // Columna de descripción agregada
			Cell: props => {
				const { description } = props.row.original
				return (
					<div className="text-xs text-gray-600">{description}</div>
				)
			}
		},
		{
			Header: 'Marca',
			accessor: 'brand.name',
		},
		{
			Header: 'Subcategoría',
			accessor: 'subcategory.name',
		},
		{
			Header: 'Costo',
			accessor: 'cost',
			Cell: props => {
				const { cost } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> Q </span> {cost}
					</div>
				)
			}
		},
		{
			Header: 'Ganancia',
			accessor: 'utility',
			Cell: props => {
				const { utility } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> Q </span> {utility}
					</div>
				)
			}
		},
		{
			Header: 'Precio',
			accessor: 'price',
			Cell: props => {
				const { price } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> Q  </span> {price}
					</div>
				)
			}
		},
		{
			Header: 'Stock',
			accessor: 'stock',
			Cell: (props) => {
				const { stock, stockMin } = props.row.original
				// 2. Llamas a la función y obtienes la etiqueta y clases
				const stockBadge = getStockBadge(stock, stockMin)

				// 3. Renderizas tu Badge con la etiqueta y color
				return (
					<div
						className={`rounded-md font-semibold flex items-center justify-center ${stockBadge.className}`}
					>
						{stockBadge.label}
					</div>
				)
			},
		},

		{
			Header: 'Status',
			accessor: 'status', // O puedes dejarlo vacío, no hay problema
			sortable: true,
			Cell: (props) => {
				const { stock, stockMin } = props.row.original

				// Calcula el status según stock actual vs stock mínimo
				let computedStatus = 0
				if (stock === 0) {
					computedStatus = 2 // Agotado
				} else if (stock < stockMin) {
					computedStatus = 1 // Limitado
				} else {
					computedStatus = 0 // En Stock
				}

				// Usa computedStatus en inventoryStatusColor
				const { label, dotClass, textClass } = inventoryStatusColor[computedStatus]

				return (
					<div className="flex items-center gap-2">
						<Badge className={dotClass} />
						<span className={`capitalize font-semibold ${textClass}`}>
							{label}
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Fecha Vencimiento',
			accessor: 'expirationDate',
			Cell: (props) => {
				const { expirationDate, hasExpiration } = props.row.original

				// Si el producto no requiere fecha de vencimiento
				if (!hasExpiration) {
					return ''
				}

				// Convertir la fecha a objeto Date
				const dateValue = new Date(expirationDate)
				// Fecha actual (solo día, mes, año):
				const today = new Date()
				today.setHours(0, 0, 0, 0)

				// Revisar si está vencido
				const isExpired = dateValue < today

				// Clases Tailwind para darle estilo
				const baseClasses = 'px-2 py-1 rounded-md font-semibold'
				const expiredClasses = 'text-red-600 bg-red-100'
				const validClasses = 'text-green-600 bg-green-100'

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
				tableTools={<ProductTableTools />}
				title="Productos"
				className="table"
			/>
			<ProductDeleteConfirmation />
		</>
	)
}

export default ProductTable