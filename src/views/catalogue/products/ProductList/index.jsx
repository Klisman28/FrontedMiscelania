import React, { useState, useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import ProductTable from './components/ProductTable'
import ProductFormModal from './components/ProductFormModal'
import { apiGetCategories } from 'services/catalogue/CategoryService'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetProductUnits } from 'services/catalogue/ProductService'
import { getProducts } from './store/dataSlice'
import { useDispatch } from 'react-redux'

injectReducer('productList', reducer)

const ProductList = () => {
	const dispatch = useDispatch()

	// Modal State
	const [modalOpen, setModalOpen] = useState(false)
	const [modalMode, setModalMode] = useState('create')
	const [selectedProduct, setSelectedProduct] = useState(null)

	const handleAdd = () => {
		setSelectedProduct(null)
		setModalMode('create')
		setModalOpen(true)
	}

	const handleEdit = (product) => {
		setSelectedProduct(product)
		setModalMode('edit')
		setModalOpen(true)
	}

	const handleSaved = (product) => {
		// Refresh list
		dispatch(getProducts())
	}

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<ProductTable
				onAdd={handleAdd}
				onEdit={handleEdit}
			/>
			<ProductFormModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				mode={modalMode}
				initialValues={selectedProduct}
				onSaved={handleSaved}
			/>
		</AdaptableCard>
	)
}

export default ProductList