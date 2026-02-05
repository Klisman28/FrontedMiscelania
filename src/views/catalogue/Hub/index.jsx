import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Tabs, Avatar } from 'components/ui'
import { AdaptableCard } from 'components/shared'
import { HiDownload, HiPlusCircle, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'
import { injectReducer } from 'store/index'

// Import Reducers
import categoryReducer from '../categories/CategoryList/store'
import subcategoryReducer from '../subcategories/SubcategoryList/store'
import brandReducer from '../brands/BrandList/store'

// Import Refactored Tables (Components to be modified next)
import CategoryTable from '../categories/CategoryList/components/CategoryTable'
import SubcategoryTable from '../subcategories/SubcategoryList/components/SubcategoryTable'
import BrandTable from '../brands/BrandList/components/BrandTable'

// Import Actions (To be triggered by Hub)
import { setActionForm as setCategoryAction, setDrawerOpen as setCategoryDrawer } from '../categories/CategoryList/store/stateSlice'
import { setActionForm as setSubAction, setDrawerOpen as setSubDrawer, setSelectedCategory as updateSubcategoryFilter } from '../subcategories/SubcategoryList/store/stateSlice'
import { setActionForm as setBrandAction, setDrawerOpen as setBrandDrawer } from '../brands/BrandList/store/stateSlice'
import { useDispatch } from 'react-redux'

// Inject Reducers
injectReducer('categories', categoryReducer)
injectReducer('subcategories', subcategoryReducer)
injectReducer('brands', brandReducer)

const { TabNav, TabList, TabContent } = Tabs

const CatalogoHub = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Determine internal tab based on path
    const pathSegment = location.pathname.split('/').pop()
    const [currentTab, setCurrentTab] = useState('categorias')

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        if (pathSegment === 'categorias') setCurrentTab('categorias')
        else if (pathSegment === 'subcategorias') setCurrentTab('subcategorias')
        else if (pathSegment === 'marcas') setCurrentTab('marcas')
        setSearchTerm('') // Clear search on tab change
    }, [pathSegment])

    const handleTabChange = (val) => {
        setCurrentTab(val)
        navigate(`/catalogo/${val}`)
    }

    const handleNewClick = () => {
        if (currentTab === 'categorias') {
            dispatch(setCategoryAction('create'))
            dispatch(setCategoryDrawer())
        } else if (currentTab === 'subcategorias') {
            dispatch(setSubAction('create'))
            dispatch(setSubDrawer())
            // Logic to pre-select category if one is selected? 
            // The logic implies the form needs to know. 
            // For now, we just open the drawer.
        } else if (currentTab === 'marcas') {
            dispatch(setBrandAction('create'))
            dispatch(setBrandDrawer())
        }
    }

    const handleCategorySelect = (row) => {
        setSelectedCategory(row)
        // If we want to filter subcategories, we might need to dispatch to subcategories store or pass filter prop
        // We will pass `selectedCategory` prop to SubcategoryTable
    }

    const isSplitView = currentTab === 'categorias' || currentTab === 'subcategorias'

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* HUB HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 rounded-xl hidden md:block">
                        <HiOutlineFilter className="text-2xl text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Catálogo</h3>
                        <p className="text-slate-500 text-sm mt-0.5">Gestión centralizada de productos</p>
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-auto w-full">
                    <Tabs value={currentTab} onChange={handleTabChange} variant="pill">
                        <TabList className="bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-full grid grid-cols-3">
                            <TabNav value="categorias" className="text-center justify-center">Categorías</TabNav>
                            <TabNav value="subcategorias" className="text-center justify-center">Subcategorías</TabNav>
                            <TabNav value="marcas" className="text-center justify-center">Marcas</TabNav>
                        </TabList>
                    </Tabs>
                </div>

                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <Input
                        className="w-full md:w-64"
                        size="sm"
                        placeholder={`Buscar ${currentTab}...`}
                        prefix={<HiOutlineSearch className="text-lg text-slate-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        inputClass="rounded-xl h-10 bg-white"
                    />
                    <Button
                        size="sm"
                        className="rounded-xl h-10 px-4 font-medium bg-white"
                        icon={<HiDownload className="text-lg" />}
                    >
                        Exportar
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        className="rounded-xl h-10 px-6 font-semibold shadow-md shadow-indigo-500/20"
                        icon={<HiPlusCircle className="text-lg" />}
                        onClick={handleNewClick}
                    >
                        {currentTab === 'marcas' ? 'Nueva Marca' : (currentTab === 'subcategorias' ? 'Nueva Subcategoría' : 'Nueva Categoría')}
                    </Button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className={`flex-1 transition-all duration-300 ${isSplitView ? 'h-[calc(100vh-14rem)]' : ''}`}>
                {isSplitView ? (
                    <div className="grid grid-cols-12 gap-6 h-full">
                        {/* LEFT COLUMN: CATEGORIES (Master) */}
                        <div className="col-span-12 lg:col-span-4 h-full flex flex-col">
                            <div className={`bg-white border text-center transition-all ${currentTab === 'categorias' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'} rounded-2xl shadow-sm overflow-hidden h-full flex flex-col`}>
                                <div className="py-3 px-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Listado de Categorías</span>
                                    <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-[10px] font-bold">MASTER</span>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <CategoryTable
                                        globalFilter={searchTerm}
                                        onSelect={handleCategorySelect}
                                        selectedId={selectedCategory?.id}
                                        compact
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUBCATEGORIES (Detail) */}
                        <div className="col-span-12 lg:col-span-8 h-full flex flex-col">
                            <div className={`bg-white border text-center transition-all ${currentTab === 'subcategorias' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'} rounded-2xl shadow-sm overflow-hidden h-full flex flex-col`}>
                                <div className="py-3 px-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {selectedCategory ? `Subcategorías de: ${selectedCategory.name}` : 'Todas las Subcategorías'}
                                    </span>
                                    {selectedCategory && (
                                        <Button size="xs" variant="plain" className="text-red-500 hover:text-red-600" onClick={() => setSelectedCategory(null)}>
                                            Limpiar Filtro
                                        </Button>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <SubcategoryTable
                                        globalFilter={searchTerm}
                                        categoryIdFilter={selectedCategory?.id}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // FULL WIDTH: BRANDS
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                        <BrandTable globalFilter={searchTerm} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CatalogoHub
