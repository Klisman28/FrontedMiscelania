/**
 * EJEMPLO DE USO DE RBAC EN COMPONENTES
 * Este archivo muestra cómo integrar el sistema RBAC en los componentes existentes
 */

// ==================== EJEMPLO 1: StockInPage con RBAC ====================
import React from 'react'
import { useSelector } from 'react-redux'
import { hasRole } from 'utils/rbac'
import { Button, Tooltip } from 'components/ui'

const StockInPageExample = () => {
    // Obtener roles del usuario desde Redux
    const userAuthority = useSelector((state) => state.auth.user.authority)

    // Verificar permisos
    const canCreateProduct = hasRole(userAuthority, ['ADMIN', 'WAREHOUSE'])
    const canReloadStock = hasRole(userAuthority, ['ADMIN', 'WAREHOUSE'])

    return (
        <div>
            {/* Solo mostrar botón "Crear Producto" si tiene permisos */}
            {canCreateProduct && (
                <Button onClick={() => setCreateModalOpen(true)}>
                    Crear Nuevo Producto
                </Button>
            )}

            {/* Botón deshabilitado con tooltip explicativo si no tiene permisos */}
            {!canReloadStock && (
                <Tooltip title="No tienes permisos para recargar stock">
                    <Button variant="solid" disabled>
                        Guardar Ingreso
                    </Button>
                </Tooltip>
            )}

            {/* Botón normal si tiene permisos */}
            {canReloadStock && (
                <Button variant="solid" type="submit">
                    Guardar Ingreso
                </Button>
            )}
        </div>
    )
}

// ==================== EJEMPLO 2: ProductList con botones condicionales ====================
import { hasPermission, isAdmin } from 'utils/rbac'

const ProductListExample = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    // Usar helper específico
    const isUserAdmin = isAdmin(userAuthority)

    // O usar la matriz de permisos
    const canEditProduct = hasPermission(userAuthority, 'CATALOG.canEditProduct')
    const canDeleteProduct = hasPermission(userAuthority, 'CATALOG.canDeleteProduct')

    return (
        <div>
            {/* Botón "Nuevo Producto" solo para ADMIN y WAREHOUSE */}
            {hasRole(userAuthority, ['ADMIN', 'WAREHOUSE']) && (
                <Button onClick={handleNewProduct}>
                    Nuevo Producto
                </Button>
            )}

            {/* Columna de acciones en tabla */}
            <TableRow>
                {canEditProduct && (
                    <ActionButton onClick={handleEdit}>Editar</ActionButton>
                )}

                {/* Eliminar solo para ADMIN */}
                {canDeleteProduct && (
                    <ActionButton onClick={handleDelete}>Eliminar</ActionButton>
                )}
            </TableRow>
        </div>
    )
}

// ==================== EJEMPLO 3: SaleNew - Deshabilitar para WAREHOUSE ====================
import { Navigate } from 'react-router-dom'

const SaleNewExample = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    // Verificar si tiene permiso para crear ventas
    if (!hasRole(userAuthority, ['ADMIN', 'SALES'])) {
        // Redirigir a página de no autorizado
        return <Navigate to="/access-denied" replace />
    }

    // Renderizar componente normal si tiene permisos
    return (
        <div>
            {/* Formulario de venta */}
        </div>
    )
}

// ==================== EJEMPLO 4: TransferCreatePage - Solo ADMIN y WAREHOUSE ====================
const TransferCreatePageExample = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    // Verificar permiso usando la matriz de permisos
    const canTransfer = hasPermission(userAuthority, 'WAREHOUSE.canTransferStock')

    if (!canTransfer) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Acceso Restringido</h3>
                    <p className="text-gray-600 mb-4">
                        Solo usuarios con rol de Bodeguero o Administrador pueden realizar transferencias.
                    </p>
                    <Button onClick={() => navigate('/home')}>
                        Volver al Inicio
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Formulario de transferencia */}
        </div>
    )
}

// ==================== EJEMPLO 5: Warehouse Stock - Lectura para SALES ====================
const WarehouseStockPageExample = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    // SALES puede VER pero no EDITAR
    const canView = hasRole(userAuthority, ['ADMIN', 'WAREHOUSE', 'SALES'])
    const canEdit = hasRole(userAuthority, ['ADMIN', 'WAREHOUSE'])

    if (!canView) {
        return <Navigate to="/access-denied" />
    }

    return (
        <div>
            {/* Tabla de stock (todos pueden ver) */}
            <StockTable data={stockData} />

            {/* Botones de acción (solo ADMIN y WAREHOUSE) */}
            {canEdit && (
                <div className="actions">
                    <Button onClick={handleAdjust}>Ajustar Stock</Button>
                    <Button onClick={handleTransfer}>Transferir</Button>
                </div>
            )}

            {/* Mensaje informativo para SALES */}
            {!canEdit && (
                <div className="bg-blue-50 p-3 rounded text-blue-700 text-sm">
                    Estás viendo esta información en modo solo lectura.
                    No puedes realizar ajustes de inventario.
                </div>
            )}
        </div>
    )
}

// ==================== EJEMPLO 6: Dashboard con widgets condicionales ====================
const DashboardExample = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    return (
        <div className="dashboard-grid">
            {/* Widget de ventas - Solo ADMIN y SALES */}
            {hasRole(userAuthority, ['ADMIN', 'SALES']) && (
                <SalesWidget />
            )}

            {/* Widget de inventario - Solo ADMIN y WAREHOUSE */}
            {hasRole(userAuthority, ['ADMIN', 'WAREHOUSE']) && (
                <InventoryWidget />
            )}

            {/* Widget de compras - Solo ADMIN y WAREHOUSE */}
            {hasRole(userAuthority, ['ADMIN', 'WAREHOUSE']) && (
                <PurchasesWidget />
            )}

            {/* Widget de usuarios - Solo ADMIN */}
            {hasRole(userAuthority, ['ADMIN']) && (
                <UsersWidget />
            )}
        </div>
    )
}

// ==================== EJEMPLO 7: Componente Reutilizable con RBAC ====================
const RestrictedAction = ({ children, allowedRoles, disabledMessage }) => {
    const userAuthority = useSelector((state) => state.auth.user.authority)
    const hasAccess = hasRole(userAuthority, allowedRoles)

    if (!hasAccess && disabledMessage) {
        return (
            <Tooltip title={disabledMessage}>
                <span>
                    {React.cloneElement(children, { disabled: true })}
                </span>
            </Tooltip>
        )
    }

    if (!hasAccess) {
        return null // Ocultar completamente
    }

    return children
}

// Uso del componente reutilizable:
const UsageExample = () => (
    <div>
        {/* Ocultar si no tiene permiso */}
        <RestrictedAction allowedRoles={['ADMIN', 'WAREHOUSE']}>
            <Button>Crear Producto</Button>
        </RestrictedAction>

        {/* Deshabilitar con tooltip si no tiene permiso */}
        <RestrictedAction
            allowedRoles={['ADMIN']}
            disabledMessage="Solo administradores pueden eliminar"
        >
            <Button variant="danger">Eliminar</Button>
        </RestrictedAction>
    </div>
)

// ==================== EJEMPLO 8: Hook personalizado para RBAC ====================
const useRBAC = () => {
    const userAuthority = useSelector((state) => state.auth.user.authority)

    return {
        userRoles: userAuthority,

        // Helpers específicos
        isAdmin: isAdmin(userAuthority),
        isSales: isSales(userAuthority),
        isWarehouse: isWarehouse(userAuthority),

        // Helpers genéricos
        hasRole: (roles) => hasRole(userAuthority, roles),
        hasPermission: (permission) => hasPermission(userAuthority, permission),
        canAccess: (roles) => canAccess(userAuthority, roles),

        // Permisos específicos de negocio
        canCreateProduct: hasRole(userAuthority, ['ADMIN', 'WAREHOUSE']),
        canCreateSale: hasRole(userAuthority, ['ADMIN', 'SALES']),
        canManageInventory: hasRole(userAuthority, ['ADMIN', 'WAREHOUSE']),
        canViewReports: hasRole(userAuthority, ['ADMIN']),
    }
}

// Uso del hook:
const ComponentWithHookExample = () => {
    const rbac = useRBAC()

    return (
        <div>
            {rbac.isAdmin && <AdminPanel />}
            {rbac.canCreateProduct && <Button>Nuevo Producto</Button>}
            {rbac.canCreateSale && <Button>Nueva Venta</Button>}

            {!rbac.canManageInventory && (
                <Alert>No tienes permisos para gestionar inventario</Alert>
            )}
        </div>
    )
}

// ==================== EJEMPLO 9: Validación en formularios ====================
const FormWithRBACExample = () => {
    const { canCreateProduct } = useRBAC()
    const { handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        // Verificar permisos antes de enviar
        if (!canCreateProduct) {
            toast.push(
                <Notification type="danger">
                    No tienes permisos para crear productos
                </Notification>
            )
            return
        }

        // Enviar formulario
        dispatch(createProduct(data))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Campos */}
            <Button
                type="submit"
                disabled={!canCreateProduct}
            >
                Guardar
            </Button>
        </form>
    )
}

// ==================== EJEMPLO 10: Tabla con acciones condicionales ====================
const TableWithRBACExample = () => {
    const rbac = useRBAC()

    const columns = [
        { label: 'Nombre', value: 'name' },
        { label: 'SKU', value: 'sku' },
        { label: 'Precio', value: 'price' },
        // Columna de acciones solo si puede editar o eliminar
        ...(rbac.isAdmin || rbac.isWarehouse ? [{
            label: 'Acciones',
            render: (row) => (
                <div className="flex gap-2">
                    {rbac.hasRole(['ADMIN', 'WAREHOUSE']) && (
                        <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                        </IconButton>
                    )}

                    {rbac.isAdmin && (
                        <IconButton onClick={() => handleDelete(row)}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </div>
            )
        }] : [])
    ]

    return <Table columns={columns} data={products} />
}

export {
    StockInPageExample,
    ProductListExample,
    SaleNewExample,
    TransferCreatePageExample,
    WarehouseStockPageExample,
    DashboardExample,
    RestrictedAction,
    useRBAC,
    ComponentWithHookExample,
    FormWithRBACExample,
    TableWithRBACExample
}
