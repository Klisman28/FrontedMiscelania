# Registro de Venta - Flujo POS Refactorizado

## 📋 Resumen de Cambios

Se ha refactorizado completamente la UI/UX de "Registrar Venta" para convertirla en un sistema tipo **Punto de Venta (POS)** moderno y eficiente.

## ✨ Nuevas Características

### 1. Barra de Búsqueda/Escaneo Rápido
- **Componente**: `ProductQuickAddBar.jsx`
- **Ubicación**: Siempre visible en la parte superior del formulario
- **Funcionalidades**:
  - Búsqueda por nombre, SKU o código de barras
  - Debounce de 300ms para tipeo normal
  - Búsqueda inmediata al presionar Enter (escaneo)
  - Detección de coincidencias exactas por SKU/código
  - Auto-incremento de cantidad si el producto ya está en el carrito
  - Dropdown navegable con teclado (↑↓)
  - Caché de búsquedas en memoria para optimización

### 2. Selección de Bodega
- **Ubicación**: Panel derecho "Información Básica"
- **Validación**: Campo requerido (el backend lo necesita)
- **Integración**: La bodega seleccionada se incluye en la venta

### 3. Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `F2` | Foco en el campo de búsqueda |
| `Enter` | Agregar producto escaneado/seleccionado |
| `Ctrl+Enter` | Guardar venta |
| `Esc` | Cerrar dropdown/limpiar búsqueda |
| `↑↓` | Navegar en resultados de búsqueda |

### 4. Modal de Búsqueda (Fallback)
- El modal anterior se mantiene como opción "Búsqueda avanzada"
- Aparece como botón secundario debajo de la barra de búsqueda
- Útil para búsquedas más complejas o exploración de productos

## 🔧 Archivos Modificados

### Nuevos Archivos
1. `src/views/transaction/sales/SaleForm/components/ProductQuickAddBar.jsx`
   - Componente principal de búsqueda/escaneo rápido

2. `src/views/transaction/sales/SaleForm/components/KeyboardShortcutsHelper.jsx`
   - Helper visual que muestra los atajos disponibles

### Archivos Modificados
1. `src/views/transaction/sales/SaleForm/index.jsx`
   - Integración de ProductQuickAddBar
   - Validación de warehouseId
   - Atajos de teclado globales (Ctrl+Enter)
   - Modal de búsqueda como fallback

2. `src/views/transaction/sales/SaleForm/BasicInfoFields.jsx`
   - Ya incluía el selector de bodega (sin cambios)

## 🔌 Endpoints Utilizados

### Búsqueda de Productos
```
GET /api/v1/products/search?search=TERM&limit=10&offset=0
```

### Bodegas
```
GET /api/v1/warehouses
```

### Crear Venta
```
POST /api/v1/sales
Body: {
  warehouseId: number (requerido),
  products: [...],
  ...otros campos
}
```

## 📱 Flujo de Usuario (UX)

### Caso 1: Escaneo de Código de Barras
1. Usuario ingresa a "Registrar Venta"
2. Cursor automáticamente en el campo de búsqueda
3. Lector de barras envía el código + Enter
4. Sistema busca coincidencia exacta por SKU/código
5. Producto se agrega automáticamente al carrito
6. Si ya existe, incrementa cantidad +1
7. Toast de confirmación
8. Campo listo para siguiente escaneo

### Caso 2: Búsqueda Manual
1. Usuario escribe nombre parcial del producto
2. Después de 300ms, aparece dropdown con resultados
3. Usuario navega con ↑↓ o mouse
4. Enter o click para agregar

### Caso 3: Búsqueda Avanzada
1. Usuario hace click en "buscar con filtros avanzados"
2. Se abre modal con búsqueda completa
3. UI tradicional del modal anterior

## ✅ Validación Final

### Checklist de Funcionalidades
- [x] Input de búsqueda con autofocus al entrar
- [x] Escanear código + Enter → agregar directo
- [x] Escanear SKU existente → quantity aumenta
- [x] Dropdown con navegación por teclado
- [x] Selector de bodega visible y validado
- [x] Guardar venta incluye warehouseId
- [x] Atajos de teclado funcionando
- [x] Modal de búsqueda como fallback
- [x] Componentes Elstar mantenidos
- [x] Sin librerías nuevas

## 🎨 Estilo y Componentes

- ✅ **Input**: Componente Elstar existente
- ✅ **Button**: Componente Elstar existente
- ✅ **Card**: Componente Elstar existente
- ✅ **Alert**: Componente Elstar existente
- ✅ **Notification/Toast**: Componente Elstar existente
- ✅ **Spinner**: Componente Elstar existente
- ✅ **Dark Mode**: Totalmente compatible

## 🚀 Performance

- **Debounce**: 300ms para evitar spam de requests
- **Caché**: Map en memoria para búsquedas repetidas
- **Búsqueda inmediata**: Solo en escaneo (Enter)
- **Límite de resultados**: 10 productos máximo

## 🔮 Mejoras Futuras (Opcionales)

1. **Stock por Bodega en Dropdown**
   - Consultar `/api/v1/warehouses/:id/stock` 
   - Mostrar stock específico de la bodega seleccionada

2. **Sonido de Confirmación**
   - Feedback auditivo al agregar producto

3. **Historial de Productos**
   - Últimos productos vendidos para acceso rápido

4. **Sugerencias Inteligentes**
   - Productos más vendidos o relacionados

5. **Modo Offline**
   - Caché de productos en IndexedDB

## 📝 Notas Técnicas

### Redux State
- `saleForm.data.productList`: Lista de productos de búsqueda
- `saleForm.data.customerList`: Lista de clientes
- `saleForm.data.enterpriseList`: Lista de empresas
- `warehouses.warehouses`: Lista de bodegas

### React Hook Form
- `warehouseId`: Nuevo campo validado
- `products`: Array de productos en el carrito
- Validaciones con Yup

### Componente ProductQuickAddBar
- Estado local para búsqueda y dropdown
- useCallback para optimización
- useEffect para atajos y eventos
- Refs para input y dropdown

## 🐛 Troubleshooting

### Problema: El autofocus no funciona
**Solución**: Verificar que `autoFocus={true}` esté en ProductQuickAddBar

### Problema: Ctrl+Enter no guarda
**Solución**: Verificar que el useEffect de atajos esté montado

### Problema: No se incrementa la cantidad
**Solución**: Verificar que `handleAppendProduct` detecte productos existentes por `productId`

### Problema: Búsqueda muy lenta
**Solución**: El debounce está en 300ms, ajustar si es necesario

## 👥 Equipo

- Desarrollo: [Tu Nombre]
- Template: Elstar
- Framework: React 18 + Redux Toolkit
- Validación: Yup + React Hook Form
