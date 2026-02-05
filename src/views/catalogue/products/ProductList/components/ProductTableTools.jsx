import React from 'react'
import { Button } from 'components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const ProductTableTools = () => {

	return (
		<div className="flex flex-row items-center gap-3">
			<Link
				className="block lg:inline-block"
				to="/data/product-list.csv"
				target="_blank"
				download
			>
				<Button
					block
					size="md"
					className="flex items-center gap-2 h-10 rounded-xl"
					icon={<HiDownload className="text-lg" />}
				>
					Exportar
				</Button>
			</Link>
			<Link
				to="nuevo"
				className="block lg:inline-block" >
				<Button
					block
					variant="solid"
					size="md"
					className="flex items-center gap-2 h-10 rounded-xl"
					icon={<HiPlusCircle className="text-lg" />}
				>
					Nuevo Producto
				</Button>
			</Link>

		</div>
	)
}

export { ProductTableTools }