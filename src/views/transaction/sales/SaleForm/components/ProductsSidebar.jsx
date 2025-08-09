import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'components/ui'
import { HiOutlineSearch } from 'react-icons/hi'
import SearchProducts from './SearchProducts'
// Asume que tienes una acción o un selector para traer categorías
// import { fetchProductsByCategory } from '../store/formSlice'

const ProductsSidebar = ({ handleAppendProduct }) => {
    // Estado local para “categoría seleccionada” (si la usaras)
    const [selectedCategory, setSelectedCategory] = useState(null)

    // Obtén la lista de categorías desde el store (ejemplo)
    const categories = useSelector(state => state.saleForm.data.categories || [])
    const dispatch = useDispatch()

    const handleCategoryClick = (catId) => {
        setSelectedCategory(catId)
        // Aquí puedes despachar la acción para filtrar productos por categoría
        // dispatch(fetchProductsByCategory(catId))
    }

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Encabezado o título */}
               {/* Activador del buscador de productos */}
               <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-lg font-semibold mb-2">Búsqueda</h4>
                {/* 
                    En lugar de un simple botón, reutilizamos el componente 
                    que ya tenías, el cual abre un diálogo. 
                    El 'handleAppendProduct' se pasa para agregar el producto. 
                */}
                <SearchProducts handleAppendProduct={handleAppendProduct}>
                    <div
                        className="cursor-pointer text-md bg-slate-200 py-2 px-4
                                   rounded-full flex items-center hover:bg-slate-300"
                    >
                        <HiOutlineSearch className="mr-2" />
                        <span>Buscar o agregar producto...</span>
                    </div>
                </SearchProducts>
            </div>

            
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            
            {/* Listado de categorías */}
            <div className="space-y-2 mb-6">
                {categories.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                        No hay categorías
                    </div>
                )}
                {categories.map(category => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'solid' : 'twoTone'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

         
        </div>
    )
}

export default ProductsSidebar
