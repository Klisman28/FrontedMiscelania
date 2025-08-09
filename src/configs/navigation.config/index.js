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
        key: 'warehouseMenu',
        path: '',
        title: 'Almacén',
        translateKey: 'nav.home',
        icon: 'supplierIcon',
        type: NAV_ITEM_TYPE_TITLE,
        authority: ['ADMIN'],
        subMenu: [
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
            // {
            //     key: 'warehouseMenu.kardex',
            //     path: '/almacen/kardex',
            //     title: 'Kardex',
            //     translateKey: 'nav.catalogueMenu.products',
            //     icon: 'groupSingleMenu',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [],
            //     subMenu: []
            // },
        ]
    },
    {
        key: 'transactionMenu',
        path: '',
        title: 'Transacciones',
        translateKey: 'nav.home',
        icon: 'transactionIcon',
        type: NAV_ITEM_TYPE_TITLE,
        authority: ['CAJERO','ADMIN'],
        subMenu: [
            {
                key: 'transactionMenu.openings',
                path: '/transacciones/apertura-de-caja',
                title: 'Apertura de Caja',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'openingsIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO','ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.sales.opening',
                path: '/transacciones/mis-ventas',
                title: 'Mis Ventas',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'salesOpeningIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO','ADMIN'],
                subMenu: []
            },
            {
                key: 'transactionMenu.sales.opening.new',
                path: '/transacciones/nueva-venta',
                title: 'Nueva Venta',
                translateKey: 'nav.catalogueMenu.products',
                icon: 'salesOpeningNewIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['CAJERO','ADMIN'],
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
        key: 'catalogueMenu',
        path: '',
        title: 'Catálogo',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'catalogueIcon',
        type: NAV_ITEM_TYPE_TITLE,
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
        path: '',
        title: 'Clientes',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'groupsIcon',
        type: NAV_ITEM_TYPE_TITLE,
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
        path: '',
        title: 'Organización',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'bisIcon',
        type: NAV_ITEM_TYPE_TITLE,
        authority: ['ADMIN'],
        subMenu: [
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
                path: '/organizacion/usuarios',
                title: 'Usuarios',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'usersIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            },
            {
                key: 'organizationMenu.users',
                path: '/notes',
                title: 'Notas',
                translateKey: 'nav.catalogueMenu.categories',
                icon: 'salesOpeningNewIcon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: []
            }
        ]
    },
    
]

export default navigationConfig