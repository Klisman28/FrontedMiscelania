# ⚙️ Ajustes y Configuraciones Opcionales

Este documento describe ajustes opcionales que puedes hacer según tus necesidades específicas.

## 🔧 Ajustes de Backend

### 1. Estructura de Respuesta del Backend

El código asume las siguientes estructuras de respuesta:

#### Búsqueda de Productos
```javascript
// Esperado:
{
  data: {
    data: [
      { id: 1, name: "Producto 1", sku: "SKU001", price: 100, cost: 80 },
      ...
    ]
  }
}

// Si tu backend devuelve diferente, ajustar en:
// src/store/products/productsSlice.js línea 60
```

#### Creación de Producto
```javascript
// Esperado:
{
  data: {
    id: 123,
    name: "Computadora HP 15",
    sku: "HP15-2026",
    price: 1000,
    cost: 850
  }
}

// Si devuelve data.data.product o similar, ajustar en:
// src/store/products/productsSlice.js línea 73
```

#### Stock In
```javascript
// Esperado:
{
  data: {
    success: true,
    // o cualquier estructura, solo necesitamos éxito
  }
}
```

### 2. Campos Adicionales en Productos

Si tu modelo de producto incluye más campos (category, brand, etc.):

**Opción A**: Hacerlos opcionales en el modal
```javascript
// src/components/products/ProductCreateModal.jsx
// Agregar campos al schema:
const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    sku: yup.string().required('El SKU es requerido'),
    cost: yup.number()...,
    price: yup.number()...,
    categoryId: yup.number().optional(), // NUEVO
    brandId: yup.number().optional()     // NUEVO
})
```

**Opción B**: Hacer un modal más completo
- Crear un `ProductFormModalFull.jsx` con todos los campos
- Usarlo en lugar del modal simple actual

## 🎨 Ajustes de UI/UX

### 1. Navegación Automática después de Guardar

Actualmente está comentado. Para activarlo:

```javascript
// src/views/inventory/StockInPage/index.js línea ~73
// Descomentar:
if (selectedWarehouseId) {
    navigate(`/warehouses/${selectedWarehouseId}/stock`)
}
```

### 2. Tiempo de Debounce

Cambiar de 300ms a otro valor:

```javascript
// src/components/inventory/ProductSearchSelect.jsx línea ~36
searchTimeoutRef.current = setTimeout(() => {
    dispatch(searchProducts(searchTerm))
    setShowDropdown(true)
}, 500) // Cambiar a 500ms por ejemplo
```

### 3. Límite de Resultados de Búsqueda

Actualmente busca 10 resultados:

```javascript
// src/services/catalogue/ProductService.js línea ~61
url: `/products/search?offset=0&limit=10&search=${query.search}`,
// Cambiar limit=10 a limit=20 si necesitas más
```

### 4. Campos por Defecto

Puedes establecer valores por defecto:

```javascript
// src/views/inventory/StockInPage/index.js
defaultValues: {
    warehouseId: 1, // ID de bodega principal
    productId: '',
    quantity: 1,    // Cantidad por defecto
    description: ''
}
```

## 🔐 Permisos y Autorización

### 1. Restringir por Rol

La ruta ya tiene `authority: ['ADMIN']` en la configuración. Para permitir otros roles:

```javascript
// src/configs/navigation.config/index.js línea ~55
{
    key: 'warehouseMenu.stockIn',
    path: '/inventory/in',
    title: 'Recargar Stock',
    translateKey: 'nav.warehouseMenu.stockIn',
    icon: 'stockInIcon',
    type: NAV_ITEM_TYPE_ITEM,
    authority: ['ADMIN', 'ENCARGADO'], // Agregar roles
    subMenu: []
}

// También en routes:
// src/configs/routes.config/index.js línea ~119
{
    key: 'warehouseMenu.stockIn',
    path: '/inventory/in',
    component: React.lazy(() => import('views/inventory/StockInPage')),
    authority: ['ADMIN', 'ENCARGADO'], // Agregar roles
}
```

## 📊 Mejoras de Performance

### 1. Cancelar Búsquedas Pendientes

Implementar AbortController para cancelar requests anteriores:

```javascript
// src/components/inventory/ProductSearchSelect.jsx
const abortControllerRef = useRef(null)

useEffect(() => {
    if (searchTerm.trim().length > 0) {
        // Cancelar búsqueda anterior
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        
        abortControllerRef.current = new AbortController()
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            dispatch(searchProducts({
                searchTerm,
                signal: abortControllerRef.current.signal
            }))
            setShowDropdown(true)
        }, 300)
    }
    // ...
}, [searchTerm, dispatch])
```

### 2. Caché de Productos

Guardar productos buscados recientemente:

```javascript
// src/store/products/productsSlice.js
const initialState = {
    searchResults: [],
    searchCache: {}, // NUEVO
    // ...
}

// En el reducer:
.addCase(searchProducts.fulfilled, (state, action) => {
    state.loadingSearch = false
    state.searchResults = action.payload.data || action.payload
    // Guardar en caché
    state.searchCache[action.meta.arg] = action.payload.data || action.payload
})
```

## 🌍 Internacionalización (i18n)

Si necesitas múltiples idiomas:

```javascript
// Agregar traducciones en tu archivo de i18n
{
    "stockIn": {
        "title": "Recargar Stock",
        "warehouse": "Bodega",
        "product": "Producto",
        "quantity": "Cantidad",
        "description": "Descripción",
        "save": "Guardar Ingreso",
        "success": "Stock ingresado exitosamente",
        // ...
    }
}

// Usar en componentes:
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
<h3>{t('stockIn.title')}</h3>
```

## 📱 Responsive Design

El diseño actual ya usa grid responsive. Ajustes adicionales:

```javascript
// src/views/inventory/StockInPage/index.js
// Cambiar de 2 columnas a 1 en móvil:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Esto ya está así, solo documentando */}
</div>
```

## 🔔 Notificaciones Personalizadas

Cambiar posición o duración:

```javascript
toast.push(
    <Notification title="Éxito" type="success">
        Stock ingresado exitosamente.
    </Notification>,
    { 
        placement: 'top-center',  // Cambiar a 'bottom-right', etc.
        duration: 5000            // Duración en ms (default: 3000)
    }
)
```

## 📝 Logging y Debugging

### 1. Activar Logs Detallados

```javascript
// src/store/products/productsSlice.js
export const searchProducts = createAsyncThunk(
    SLICE_NAME + '/searchProducts',
    async (searchTerm) => {
        console.log('[DEBUG] Searching products:', searchTerm) // AGREGAR
        const response = await apiSearchProducts({ search: searchTerm })
        console.log('[DEBUG] Search results:', response.data) // AGREGAR
        return response.data
    }
)
```

### 2. Redux DevTools

Ya está habilitado por defecto. Para ver el estado:
1. Abrir Chrome DevTools
2. Ir a la pestaña "Redux"
3. Ver acciones y state changes

## 🧪 Testing

### Unit Tests para Slices

```javascript
// tests/store/products/productsSlice.test.js
import reducer, { searchProducts, createProduct } from 'store/products/productsSlice'

describe('productsSlice', () => {
    it('should handle searchProducts.pending', () => {
        const state = reducer(undefined, searchProducts.pending())
        expect(state.loadingSearch).toBe(true)
    })
    
    // Más tests...
})
```

### Integration Tests

```javascript
// tests/views/inventory/StockInPage.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StockInPage from 'views/inventory/StockInPage'

test('renders stock in form', () => {
    render(<StockInPage />)
    expect(screen.getByText('Recargar Stock')).toBeInTheDocument()
})

// Más tests...
```

## 🔄 Sincronización en Tiempo Real

Si necesitas actualización en tiempo real (WebSockets):

```javascript
// src/views/inventory/StockInPage/index.js
useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws')
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'STOCK_UPDATED' && data.warehouseId === selectedWarehouseId) {
            // Refrescar stock o mostrar notificación
            toast.push(
                <Notification type="info">
                    Stock actualizado por otro usuario
                </Notification>
            )
        }
    }
    
    return () => socket.close()
}, [selectedWarehouseId])
```

## 🎯 Validaciones Personalizadas

### Validar Stock Disponible

```javascript
// Antes de crear una salida (si implementas)
const validationSchema = yup.object().shape({
    // ...
    quantity: yup.number()
        .positive()
        .required()
        .test('stock-available', 'Stock insuficiente', async function(value) {
            const { productId, warehouseId } = this.parent
            const stock = await checkAvailableStock(productId, warehouseId)
            return value <= stock.available
        })
})
```

---

**Nota**: Estos son ajustes opcionales. El código base ya funciona correctamente sin ninguno de estos cambios.
