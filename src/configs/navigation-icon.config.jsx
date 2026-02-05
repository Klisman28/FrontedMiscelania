import React from 'react'
import {
    LuHome,
    LuReceipt,
    LuWallet,
    LuShoppingCart,
    LuShoppingBag,
    LuHistory,
    LuSettings,
    LuMonitor,
    LuWarehouse,
    LuPackagePlus,
    LuArrowLeftRight,
    LuClipboardList,
    LuLayoutGrid,
    LuPackage,
    LuShapes,
    LuListTree,
    LuBadgeCheck,
    LuUsers,
    LuBuilding2,
    LuUsersCog,
    LuUserCog,
    LuIdCard,
    LuTruck,
    LuStickyNote
} from 'react-icons/lu'

const ICON_SIZE = 18

const navigationIcon = {
    home: (props) => <LuHome size={ICON_SIZE} {...props} />,
    transactionIcon: (props) => <LuReceipt size={ICON_SIZE} {...props} />,
    openingsIcon: (props) => <LuWallet size={ICON_SIZE} {...props} />,
    salesOpeningNewIcon: (props) => <LuShoppingCart size={ICON_SIZE} {...props} />,
    salesOpeningIcon: (props) => <LuShoppingBag size={ICON_SIZE} {...props} />,
    salesReportIcon: (props) => <LuHistory size={ICON_SIZE} {...props} />,
    configsIcon: (props) => <LuSettings size={ICON_SIZE} {...props} />,
    cashiersIcon: (props) => <LuMonitor size={ICON_SIZE} {...props} />,

    // Almacen Group & Items
    supplierIcon: (props) => <LuWarehouse size={ICON_SIZE} {...props} />, // Almacen Group
    warehouseIcon: (props) => <LuWarehouse size={ICON_SIZE} {...props} />, // Bodegas
    stockInIcon: (props) => <LuPackagePlus size={ICON_SIZE} {...props} />,
    transfersIcon: (props) => <LuArrowLeftRight size={ICON_SIZE} {...props} />, // New key: Transferencias

    // Compras
    purchasesIcon: (props) => <LuClipboardList size={ICON_SIZE} {...props} />,

    // Catalogue
    catalogueIcon: (props) => <LuLayoutGrid size={ICON_SIZE} {...props} />,
    productsIcon: (props) => <LuPackage size={ICON_SIZE} {...props} />,
    categoriesIcon: (props) => <LuShapes size={ICON_SIZE} {...props} />,
    subcategoriesIcon: (props) => <LuListTree size={ICON_SIZE} {...props} />,
    brandsIcon: (props) => <LuBadgeCheck size={ICON_SIZE} {...props} />,

    // Clients
    groupsIcon: (props) => <LuUsers size={ICON_SIZE} {...props} />, // Client Group
    customersIcon: (props) => <LuUsers size={ICON_SIZE} {...props} />, // Client Item
    enterprisesIcon: (props) => <LuBuilding2 size={ICON_SIZE} {...props} />,

    // Organization
    bisIcon: (props) => <LuUsersCog size={ICON_SIZE} {...props} />, // Org Group
    usersIcon: (props) => <LuUserCog size={ICON_SIZE} {...props} />,
    employeesIcon: (props) => <LuIdCard size={ICON_SIZE} {...props} />,
    suppliersIcon: (props) => <LuTruck size={ICON_SIZE} {...props} />,
    notesIcon: (props) => <LuStickyNote size={ICON_SIZE} {...props} />, // New key: Notas
}

export default navigationIcon