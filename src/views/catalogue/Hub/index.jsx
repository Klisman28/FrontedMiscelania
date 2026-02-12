import React, { useState, useEffect } from 'react'
import { Button, Input, Tabs } from 'components/ui'
import { HiDownload, HiPlusCircle, HiOutlineSearch } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'
import { injectReducer } from 'store/index'
import { useDispatch } from 'react-redux'

// Import Reducers
import categoryReducer from '../categories/CategoryList/store'
import subcategoryReducer from '../subcategories/SubcategoryList/store'
import brandReducer from '../brands/BrandList/store'

// Import Refactored Tables
import CategoryTable from '../categories/CategoryList/components/CategoryTable'
import SubcategoryTable from '../subcategories/SubcategoryList/components/SubcategoryTable'
import BrandTable from '../brands/BrandList/components/BrandTable'

// Import Actions
import { setActionForm as setCategoryAction, setDrawerOpen as setCategoryDrawer } from '../categories/CategoryList/store/stateSlice'
import { setActionForm as setSubAction, setDrawerOpen as setSubDrawer } from '../subcategories/SubcategoryList/store/stateSlice'
import { setActionForm as setBrandAction, setDrawerOpen as setBrandDrawer } from '../brands/BrandList/store/stateSlice'

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
        else setCurrentTab('categorias') // Default
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
        } else if (currentTab === 'marcas') {
            dispatch(setBrandAction('create'))
            dispatch(setBrandDrawer())
        }
    }

    const handleCategorySelect = (row) => {
        setSelectedCategory(row)
    }

    const getSearchPlaceholder = () => {
        if (currentTab === 'categorias') return 'Buscar categorías…'
        if (currentTab === 'subcategorias') return 'Buscar subcategorías…'
        if (currentTab === 'marcas') return 'Buscar marcas…'
        return 'Buscar…'
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* 1) HEADER SUPERIOR */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* LEFT: Title */}
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Catálogo</h3>
                                <p className="text-slate-500 text-sm mt-0.5">Gestión de inventario</p>
                            </div>
                        </div>

                        {/* CENTER: Tabs (Segmented Control) */}
                        <div className="flex-1 flex justify-center w-full lg:w-auto">
                            <Tabs value={currentTab} onChange={handleTabChange} variant="pill">
                                <TabList className="bg-slate-100 rounded-xl p-1 w-full max-w-md grid grid-cols-3">
                                    <TabNav value="categorias" className="text-center justify-center text-sm font-medium py-1.5 rounded-lg data-[selected=true]:bg-white data-[selected=true]:shadow-sm data-[selected=true]:text-slate-900 text-slate-500 hover:text-slate-700 transition-colors">
                                        Categorías
                                    </TabNav>
                                    <TabNav value="subcategorias" className="text-center justify-center text-sm font-medium py-1.5 rounded-lg data-[selected=true]:bg-white data-[selected=true]:shadow-sm data-[selected=true]:text-slate-900 text-slate-500 hover:text-slate-700 transition-colors">
                                        Subcategorías
                                    </TabNav>
                                    <TabNav value="marcas" className="text-center justify-center text-sm font-medium py-1.5 rounded-lg data-[selected=true]:bg-white data-[selected=true]:shadow-sm data-[selected=true]:text-slate-900 text-slate-500 hover:text-slate-700 transition-colors">
                                        Marcas
                                    </TabNav>
                                </TabList>
                            </Tabs>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                            <Input
                                className="w-full lg:w-64"
                                size="sm"
                                placeholder={getSearchPlaceholder()}
                                prefix={<HiOutlineSearch className="text-lg text-slate-400" />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                inputClass="rounded-xl h-10 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            />
                            <Button
                                size="sm"
                                className="rounded-xl h-10 px-4 font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                                icon={<HiDownload className="text-lg" />}
                            >
                                Exportar
                            </Button>
                            <Button
                                variant="solid"
                                size="sm"
                                className="rounded-xl h-10 px-5 font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 border border-transparent"
                                icon={<HiPlusCircle className="text-lg" />}
                                onClick={handleNewClick}
                            >
                                Nuevo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-6 h-full flex flex-col">
                    {currentTab === 'categorias' ? (
                        /* 3) TAB CATEGORIAS: SPLIT VIEW */
                        <div className="grid grid-cols-12 gap-4 h-full min-h-0">
                            {/* Panel Izquierdo: Categorías */}
                            <div className="col-span-12 lg:col-span-4 h-full flex flex-col min-h-0">
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                                    <div className="py-3 px-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center h-12 min-h-[3rem]">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Categorías</span>
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

                            {/* Panel Derecho: Subcategorías */}
                            <div className="col-span-12 lg:col-span-8 h-full flex flex-col min-h-0">
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col relative">
                                    <div className="py-3 px-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center h-12 min-h-[3rem]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Subcategorías
                                            </span>
                                            {selectedCategory && (
                                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                                                    {selectedCategory.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-hidden relative">
                                        {selectedCategory ? (
                                            <SubcategoryTable
                                                // Split View: Search applies to Master. Detail list is scoped by Master.
                                                // If we want to support searching subcats within a cat, we'd need another search or logic.
                                                // For now, consistent with Master-Detail, we show all subcats of selected cat.
                                                globalFilter=""
                                                categoryIdFilter={selectedCategory.id}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                                                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-300">
                                                    <HiPlusCircle className="text-3xl" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">Selecciona una categoría</p>
                                                <p className="text-xs text-slate-400 mt-1">para ver sus subcategorías asociadas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentTab === 'subcategorias' ? (
                        /* TAB SUBCATEGORIAS (Full List) */
                        <div className="h-full min-h-0 flex flex-col">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="py-3 px-5 bg-slate-50 border-b border-slate-100 h-12 min-h-[3rem] flex items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Todas las Subcategorías</span>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <SubcategoryTable globalFilter={searchTerm} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* TAB MARCAS (Full List) */
                        <div className="h-full min-h-0 flex flex-col">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="py-3 px-5 bg-slate-50 border-b border-slate-100 h-12 min-h-[3rem] flex items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Listado de Marcas</span>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <BrandTable globalFilter={searchTerm} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CatalogoHub
