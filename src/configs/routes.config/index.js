import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: React.lazy(() => import('views/Home')),
        authority: [],
    },
    {
        key: 'catalogueMenu.products',
        path: '/catalogo/productos',
        component: React.lazy(() => import('views/catalogue/products/ProductList')),
        authority: [],
    },
    {
        key: 'catalogueMenu.products.nuevo',
        path: '/catalogo/productos/nuevo',
        component: React.lazy(() => import('views/catalogue/products/ProductNew')),
        authority: [],
    },
    {
        key: 'catalogueMenu.products.edit',
        path: '/catalogo/productos/:productId/edit',
        component: React.lazy(() => import('views/catalogue/products/ProductEdit')),
        authority: [],
    },
    {
        key: 'catalogueMenu.categories',
        path: '/catalogo/categorias',
        component: React.lazy(() => import('views/catalogue/categories/CategoryList')),
        authority: [],
    },
    {
        key: 'catalogueMenu.subcategories',
        path: '/catalogo/subcategorias',
        component: React.lazy(() => import('views/catalogue/subcategories/SubcategoryList')),
        authority: [],
    },
    {
        key: 'catalogueMenu.brands',
        path: '/catalogo/marcas',
        component: React.lazy(() => import('views/catalogue/brands/BrandList')),
        authority: [],
    },
    //ORGANIZATION ROUTES
    {
        key: 'organizationMenu.employees',
        path: '/organizacion/empleados',
        component: React.lazy(() => import('views/organization/employees/EmployeeList')),
        authority: [],
    },
    {
        key: 'organizationMenu.suppliers',
        path: '/organizacion/proveedores',
        component: React.lazy(() => import('views/organization/suppliers/SupplierList')),
        authority: [],
    },
    {
        key: 'organizationMenu.users',
        path: '/organizacion/usuarios',
        component: React.lazy(() => import('views/organization/users/UserList')),
        authority: [],
    },
    //CLIENTS ROUTES
    {
        key: 'clientMenu.customers',
        path: '/cliente/personas',
        component: React.lazy(() => import('views/client/customers/CustomerList')),
        authority: [],
    },
    {
        key: 'clientMenu.enterprises',
        path: '/cliente/empresas',
        component: React.lazy(() => import('views/client/enterprises/EnterpriseList')),
        authority: [],
    },
    //TRANSACTION ROUTES
    {
        key: 'warehouseMenu.purchases',
        path: '/almacen/compras',
        component: React.lazy(() => import('views/transaction/purchases/PurchasList')),
        authority: [],
    },
    {
        key: 'warehouseMenu.purchases.new',
        path: '/almacen/compras/registrar',
        component: React.lazy(() => import('views/transaction/purchases/PurchasNew')),
        authority: [],
    },
    {
        key: 'warehouseMenu.cashiers',
        path: '/almacen/cajas',
        component: React.lazy(() => import('views/transaction/cashiers/CashierList')),
        authority: [],
    },
    {
        key: 'transactionMenu.openings',
        path: '/transacciones/apertura-de-caja',
        component: React.lazy(() => import('views/transaction/openings/OpeningList')),
        authority: [],
    },
    {
        key: 'transactionMenu.sales.opening',
        path: '/transacciones/mis-ventas',
        component: React.lazy(() => import('views/transaction/sales/SaleList')),
        authority: [],
    },
    {
        key: 'transactionMenu.sales.opening.new',
        path: '/transacciones/nueva-venta',
        component: React.lazy(() => import('views/transaction/sales/SaleNew')),
        authority: [],
    },
    {
        key: 'transactionMenu.sales.print',
        path: '/transacciones/ventas/:saleId/imprimir',
        component: React.lazy(() => import('views/transaction/sales/SalePrint')),
        authority: [],
    },
    {
        key: 'transactionMenu.sales.report',
        path: '/transacciones/historial-ventas',
        component: React.lazy(() => import('views/transaction/sales/SaleReport')),
        authority: [],
    },
    {
        key: 'transactionMenu.configs',
        path: '/transacciones/configuracion-de-ventas',
        component: React.lazy(() => import('views/transaction/configs/ConfigNew')),
        authority: [],
    },
    {
        key: 'transactionMenu.configs.edit',
        path: '/transacciones/configuracion-de-ventas/:configId/editar',
        component: React.lazy(() => import('views/transaction/configs/ConfigEdit')),
        authority: [],
    },
    {
        key: 'notes',
        path: '/notes',
        component: React.lazy(() => import('views/notes/NoteFields')),
        authority: [],
    },
]