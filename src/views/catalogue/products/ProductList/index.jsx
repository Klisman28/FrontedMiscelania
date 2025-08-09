import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import ProductTable from './components/ProductTable'

injectReducer('products', reducer)

const ProductList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<ProductTable />
		</AdaptableCard>
	)
}

export default ProductList