import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM
} from 'constants/navigation.constant'


const navigationConfig = [
    {
        key: 'home',
        path: '/home',
        title: 'Inicio',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'transactionMenu',
        path: '/transacciones',
        title: 'Transacciones',
        translateKey: 'nav.transactions',
        icon: 'transactionIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['CAJERO', 'ADMIN'],
        subMenu: [
            {
                key: 'transactionMenu.openings',
                path: '/transacciones/apertura-de-caja',
                title: 'Apertura de Caja',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'openingsIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO', 'ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.sales.opening.new',
                path: '/transacciones/nueva-venta',
                title: 'Nueva Venta',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'salesOpeningNewIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO', 'ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.sales.opening',
                path: '/transacciones/mis-ventas',
                title: 'Mis Ventas',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'salesOpeningIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO', 'ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.sales.report',
                path: '/transacciones/historial-ventas',
                title: 'Historial Ventas',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'salesReportIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.configs',
                path: '/transacciones/configuracion-de-ventas',
                title: 'Configuración',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'configsIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
        ]
    },
    {
        key: 'warehouseMenu.cashiers',
        path: '/almacen/cajas',
        title: 'Cajas',
        translateKey: 'nav.catalogueMenu.products',
        icon: 'cashiersIcon',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN'],
        subMenu: []
    },
    {
        key: 'warehouseMenu',
        path: '/almacen',
        title: 'Almacén',
        translateKey: 'nav.warehouse',
        icon: 'supplierIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'warehouseMenu.warehouses',
                path: '/warehouses',
                title: 'Bodegas',
                translateKey: 'nav.warehouseMenu.warehouses',
                icon: 'warehouseIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'warehouseMenu.stockIn',
                path: '/inventory/in',
                title: 'Recargar Stock',
                translateKey: 'nav.warehouseMenu.stockIn',
                icon: 'stockInIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'warehouseMenu.transfers',
                path: '/inventory/transfers',
                title: 'Transferencias',
                translateKey: 'nav.warehouseMenu.transfers',
                icon: 'transfersIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
        ]
    },
    {
        key: 'purchasesMenu',
        path: '',
        title: 'Compras',
        translateKey: 'nav.purchases',
        icon: 'purchasesIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'warehouseMenu.purchases.new',
                path: '/almacen/compras/registrar',
                title: 'Nueva Compra',
                translateKey: 'nav.warehouseMenu.purchases.new',
                icon: 'salesOpeningNewIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'warehouseMenu.purchases',
                path: '/almacen/compras',
                title: 'Compras',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'purchasesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
        ]
    },
    {
        key: 'catalogueMenu',
        path: '/catalogo',
        title: 'Catálogo',
        translateKey: 'nav.catalogue',
        icon: 'catalogueIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'catalogueMenu.products',
                path: '/catalogo/productos',
                title: 'Productos',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'productsIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'catalogueMenu.categories',
                path: '/catalogo/categorias',
                title: 'Categorías',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'categoriesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'catalogueMenu.subcategories',
                path: '/catalogo/subcategorias',
                title: 'Subcategorías',
                translateKey: 'nav.catalogueMenu.subcategories',
                icon: 'subcategoriesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'catalogueMenu.brands',
                path: '/catalogo/marcas',
                title: 'Marcas',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'brandsIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            }
        ]
    },
    {
        key: 'clientMenu',
        path: '/clientes',
        title: 'Clientes',
        translateKey: 'nav.clients',
        icon: 'groupsIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'clientMenu.customers',
                path: '/cliente/personas',
                title: 'Clientes',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'customersIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'clientMenu.enterprises',
                path: '/cliente/empresas',
                title: 'Empresas',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'enterprisesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            }
        ]
    },
    {
        key: 'organizationMenu',
        path: '/organizacion',
        title: 'Organización',
        translateKey: 'nav.organization',
        icon: 'bisIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'organizationMenu.users',
                path: '/organizacion/usuarios',
                title: 'Usuarios',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'usersIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'organizationMenu.employees',
                path: '/organizacion/empleados',
                title: 'Empleados',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'employeesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'organizationMenu.suppliers',
                path: '/organizacion/proveedores',
                title: 'Proveedores',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'suppliersIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'organizationMenu.users',
                path: '/notes',
                title: 'Notas',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'notesIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            }
        ]
    },
]

export default navigationConfig