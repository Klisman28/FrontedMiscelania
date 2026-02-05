import React from 'react'
import {
    LuHome,
    LuReceipt,
    LuWallet,
    LuShoppingCart,
    LuShoppingBag,
    LuHistory,
    LuCog,
    LuTv,
    LuWarehouse,
    LuDownload,
    LuArrowLeftRight,
    LuClipboard,
    LuGrid,
    LuPackage,
    LuBox,
    LuList,
    LuCheckCircle,
    LuUsers,
    LuBuilding,
    LuBriefcase,
    LuUserCog,
    LuBadge,
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
    configsIcon: (props) => <LuCog size={ICON_SIZE} {...props} />,
    cashiersIcon: (props) => <LuTv size={ICON_SIZE} {...props} />,

    // Almacen Group & Items
    supplierIcon: (props) => <LuWarehouse size={ICON_SIZE} {...props} />, // Almacen Group
    warehouseIcon: (props) => <LuWarehouse size={ICON_SIZE} {...props} />, // Bodegas
    stockInIcon: (props) => <LuDownload size={ICON_SIZE} {...props} />,
    transfersIcon: (props) => <LuArrowLeftRight size={ICON_SIZE} {...props} />,

    // Compras
    purchasesIcon: (props) => <LuClipboard size={ICON_SIZE} {...props} />,

    // Catalogue
    catalogueIcon: (props) => <LuGrid size={ICON_SIZE} {...props} />,
    productsIcon: (props) => <LuPackage size={ICON_SIZE} {...props} />,
    categoriesIcon: (props) => <LuBox size={ICON_SIZE} {...props} />,
    subcategoriesIcon: (props) => <LuList size={ICON_SIZE} {...props} />,
    brandsIcon: (props) => <LuCheckCircle size={ICON_SIZE} {...props} />,

    // Clients
    groupsIcon: (props) => <LuUsers size={ICON_SIZE} {...props} />, // Client Group
    customersIcon: (props) => <LuUsers size={ICON_SIZE} {...props} />, // Client Item
    enterprisesIcon: (props) => <LuBuilding size={ICON_SIZE} {...props} />,

    // Organization
    bisIcon: (props) => <LuBriefcase size={ICON_SIZE} {...props} />, // Org Group
    usersIcon: (props) => <LuUserCog size={ICON_SIZE} {...props} />,
    employeesIcon: (props) => <LuBadge size={ICON_SIZE} {...props} />,
    suppliersIcon: (props) => <LuTruck size={ICON_SIZE} {...props} />,
    notesIcon: (props) => <LuStickyNote size={ICON_SIZE} {...props} />,
}

export default navigationIcon