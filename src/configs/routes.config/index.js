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
        authority: [], // Accessible to all authenticated users
    },
    {
        key: 'unauthorized',
        path: '/access-denied',
        component: React.lazy(() => import('views/Unauthorized')),
        authority: [], // Accessible to all
    },
    // CATALOGUE ROUTES - Read access for all, write for ADMIN + WAREHOUSE
    {
        key: 'catalogueMenu.products',
        path: '/catalogo/productos',
        component: React.lazy(() => import('views/catalogue/products/ProductList')),
        authority: ['ADMIN', 'SALES', 'WAREHOUSE'], // All can view
    },
    {
        key: 'catalogueMenu.products.nuevo',
        path: '/catalogo/productos/nuevo',
        component: React.lazy(() => import('views/catalogue/products/ProductNew')),
        authority: ['ADMIN', 'WAREHOUSE'], // Only admin and warehouse can create
    },
    {
        key: 'catalogueMenu.products.edit',
        path: '/catalogo/productos/:productId/edit',
        component: React.lazy(() => import('views/catalogue/products/ProductEdit')),
        authority: ['ADMIN', 'WAREHOUSE'], // Only admin and warehouse can edit
    },
    {
        key: 'catalogueMenu.categories',
        path: '/catalogo/categorias',
        component: React.lazy(() => import('views/catalogue/Hub')),
        authority: ['ADMIN'], // Only admin
    },
    {
        key: 'catalogueMenu.subcategories',
        path: '/catalogo/subcategorias',
        component: React.lazy(() => import('views/catalogue/Hub')),
        authority: ['ADMIN'], // Only admin
    },
    {
        key: 'catalogueMenu.brands',
        path: '/catalogo/marcas',
        component: React.lazy(() => import('views/catalogue/Hub')),
        authority: ['ADMIN'], // Only admin
    },
    // ORGANIZATION ROUTES - Admin only
    {
        key: 'organizationMenu.employees',
        path: '/organizacion/empleados',
        component: React.lazy(() => import('views/organization/employees/EmployeeList')),
        authority: ['ADMIN'],
    },
    {
        key: 'organizationMenu.suppliers',
        path: '/organizacion/proveedores',
        component: React.lazy(() => import('views/organization/suppliers/SupplierList')),
        authority: ['ADMIN', 'WAREHOUSE'], // Warehouse can view suppliers
    },
    {
        key: 'organizationMenu.users',
        path: '/organizacion/usuarios',
        component: React.lazy(() => import('views/organization/users/UserList')),
        authority: ['ADMIN'],
    },
    // CLIENTS ROUTES - Admin and Sales
    {
        key: 'clientMenu.customers',
        path: '/cliente/personas',
        component: React.lazy(() => import('views/client/customers/CustomerList')),
        authority: ['ADMIN', 'SALES'],
    },
    {
        key: 'clientMenu.enterprises',
        path: '/cliente/empresas',
        component: React.lazy(() => import('views/client/enterprises/EnterpriseList')),
        authority: ['ADMIN', 'SALES'],
    },
    // WAREHOUSE ROUTES - Admin and Warehouse
    {
        key: 'warehouseMenu.warehouses',
        path: '/warehouses',
        component: React.lazy(() => import('views/warehouses/WarehouseListPage')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    {
        key: 'warehouseMenu.warehouses.stock',
        path: '/warehouses/:id/stock',
        component: React.lazy(() => import('views/warehouses/WarehouseStockPage')),
        authority: ['ADMIN', 'WAREHOUSE', 'SALES'], // Sales can view, not edit
    },
    {
        key: 'inventory.transfers',
        path: '/inventory/transfers',
        component: React.lazy(() => import('views/inventory/transfers/TransfersListPage')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    {
        key: 'inventory.transfers.new',
        path: '/inventory/transfers/new',
        component: React.lazy(() => import('views/inventory/transfers/TransferCreatePage')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    {
        key: 'inventory.transfers.detail',
        path: '/inventory/transfers/:id',
        component: React.lazy(() => import('views/inventory/transfers/TransferDetailPage')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    {
        key: 'warehouseMenu.stockIn',
        path: '/inventory/in',
        component: React.lazy(() => import('views/inventory/StockInPage')),
        authority: ['ADMIN', 'WAREHOUSE'], // Only admin and warehouse can reload stock
    },
    // PURCHASES ROUTES - Admin and Warehouse
    {
        key: 'warehouseMenu.purchases',
        path: '/almacen/compras',
        component: React.lazy(() => import('views/transaction/purchases/PurchasList')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    {
        key: 'warehouseMenu.purchases.new',
        path: '/almacen/compras/registrar',
        component: React.lazy(() => import('views/transaction/purchases/PurchasNew')),
        authority: ['ADMIN', 'WAREHOUSE'],
    },
    // CASHIERS ROUTES - Admin only
    {
        key: 'warehouseMenu.cashiers',
        path: '/almacen/cajas',
        component: React.lazy(() => import('views/transaction/cashiers/CashierList')),
        authority: ['ADMIN'], // Admin manages cashiers
    },
    // TRANSACTIONS ROUTES - Admin and Sales
    {
        key: 'transactionMenu.openings',
        path: '/transacciones/apertura-de-caja',
        component: React.lazy(() => import('views/transaction/openings/OpeningList')),
        authority: ['ADMIN', 'SALES'], // Cash register operations
    },
    {
        key: 'transactionMenu.sales.opening',
        path: '/transacciones/mis-ventas',
        component: React.lazy(() => import('views/transaction/sales/SaleList')),
        authority: ['ADMIN', 'SALES'], // My sales
    },
    {
        key: 'transactionMenu.sales.opening.new',
        path: '/transacciones/nueva-venta',
        component: React.lazy(() => import('views/transaction/sales/SaleNew')),
        authority: ['ADMIN', 'SALES'], // New sale
    },
    {
        key: 'transactionMenu.sales.print',
        path: '/transacciones/ventas/:saleId/imprimir',
        component: React.lazy(() => import('views/transaction/sales/SalePrint')),
        authority: ['ADMIN', 'SALES'], // Print sale
    },
    {
        key: 'transactionMenu.sales.report',
        path: '/transacciones/historial-ventas',
        component: React.lazy(() => import('views/transaction/sales/SaleReport')),
        authority: ['ADMIN'], // Only admin can see all sales
    },
    {
        key: 'transactionMenu.configs',
        path: '/transacciones/configuracion-de-ventas',
        component: React.lazy(() => import('views/transaction/configs/ConfigNew')),
        authority: ['ADMIN'], // Only admin configures
    },
    {
        key: 'transactionMenu.configs.edit',
        path: '/transacciones/configuracion-de-ventas/:configId/editar',
        component: React.lazy(() => import('views/transaction/configs/ConfigEdit')),
        authority: ['ADMIN'], // Only admin configures
    },
    // NOTES - All authenticated
    {
        key: 'notes',
        path: '/notes',
        component: React.lazy(() => import('views/notes/NoteFields')),
        authority: [],
    },
    {
        key: 'reports',
        path: '/reportes',
        component: React.lazy(() => import('views/reports/Reports')),
        authority: ['ADMIN', 'MANAGER'],
    },
]