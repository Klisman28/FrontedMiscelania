import React from 'react'
import { Button } from 'components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const SaleTableTools = () => {

	return (
		<div className="flex flex-col md:flex-row gap-3">
			<Link
				className="block lg:inline-block"
				to="/data/product-list.csv"
				target="_blank"
				download
			>
				<Button
					block
					className="h-11"
					icon={<HiDownload />}
				>
					Exportar
				</Button>
			</Link>
			<Link
				to="/transacciones/nueva-venta"
				className="block lg:inline-block" >
				<Button
					block
					variant="solid"
					className="h-11"
					icon={<HiPlusCircle />}
				>
					Nueva Venta
				</Button>
			</Link>

		</div>
	)
}

export { SaleTableTools }