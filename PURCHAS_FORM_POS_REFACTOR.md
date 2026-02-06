# Registro de Compra - Flujo POS Refactorizado

## 📋 Resumen de Cambios

Se ha replicado completamente la refactorización del sistema **Punto de Venta (POS)** del módulo de ventas al módulo de **"Registrar Compra"** para mantener consistencia en la experiencia de usuario.

## ✨ Características Implementadas

### 1. Barra de Búsqueda/Escaneo Rápido
- **Componente**: `ProductQuickAddBar.jsx`
- **Ubicación**: Siempre visible en la parte superior del formulario
- **Funcionalidades**:
  - Búsqueda por nombre, SKU o código de barras
  - Debounce de 300ms para tipeo normal
  - Búsqueda inmediata al presionar Enter (escaneo)
  - Detección de coincidencias exactas por SKU/código
  - Auto-incremento de cantidad si el producto ya está en la orden
  - Dropdown navegable con teclado (↑↓)
  - Caché de búsquedas en memoria para optimización
  - Muestra costo del producto en lugar de precio

### 2. Selección de Bodega
- **Ubicación**: Panel derecho "Información Básica" (arriba de Fecha y Proveedor)
- **Validación**: Campo requerido (el backend lo necesita)
- **Integración**: La bodega seleccionada se incluye en la compra

### 3. Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `F2` | Foco en el campo de búsqueda |
| `Enter` | Agregar producto escaneado/seleccionado |
| `Ctrl+Enter` | Guardar compra |
| `Esc` | Cerrar dropdown/limpiar búsqueda |
| `↑↓` | Navegar en resultados de búsqueda |

### 4. Modal de Búsqueda (Fallback)
- El modal anterior se mantiene como opción "Búsqueda avanzada"
- Aparece como botón secundario debajo de la barra de búsqueda
- Útil para búsquedas más complejas o exploración de productos

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos
1. `src/views/transaction/purchases/PurchasForm/components/ProductQuickAddBar.jsx`
   - Componente principal de búsqueda/escaneo rápido (versión compras)

2. `src/views/transaction/purchases/PurchasForm/components/KeyboardShortcutsHelper.jsx`
   - Helper visual que muestra los atajos disponibles

### Archivos Modificados
1. `src/views/transaction/purchases/PurchasForm/index.jsx`
   - Integración de ProductQuickAddBar
   - Validación de warehouseId en Yup schema
   - Atajos de teclado globales (Ctrl+Enter)
   - Modal de búsqueda como fallback

2. `src/views/transaction/purchases/PurchasForm/BasicInfoFields.jsx`
   - Selector de bodega agregado
   - Integración con store de warehouses

3. `src/views/transaction/purchases/PurchasForm/components/SearchProducts.jsx`
   - Soporte para children personalizable
   - Ahora funciona como fallback

## 🔌 Endpoints Utilizados

### Búsqueda de Productos
```
GET /api/v1/products/search?search=TERM&limit=10&offset=0
```

### Bodegas
```
GET /api/v1/warehouses
```

### Proveedores
```
GET /api/v1/suppliers
```

### Crear Compra
```
POST /api/v1/purchases
Body: {
  warehouseId: number (requerido),
  supplier: { value, label },
  products: [...],
  dateIssue: date,
  applyIgv: boolean
}
```

## 📱 Flujo de Usuario (UX)

### Caso 1: Escaneo de Código de Barras
1. Usuario ingresa a "Registrar Compra"
2. Cursor automáticamente en el campo de búsqueda
3. Lector de barras envía el código + Enter
4. Sistema busca coincidencia exacta por SKU/código
5. Producto se agrega automáticamente a la orden
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

## ✅ Diferencias vs Ventas

### Datos Mostrados
- **Ventas**: Muestra precio de venta y stock
- **Compras**: Muestra costo de compra (sin stock)

### Proveedor vs Cliente
- **Ventas**: Requiere cliente (según tipo de comprobante)
- **Compras**: Requiere proveedor (siempre)

### Validaciones
Ambos módulos ahora requieren:
- ✅ Bodega (warehouseId)
- ✅ Al menos un producto
- ✅ Fecha válida
- ✅ Proveedor/Cliente según corresponda

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

## 📝 Validación de Checklist

- ✅ **Barra de búsqueda fija** siempre visible arriba
- ✅ **Búsqueda por nombre, SKU o código** 
- ✅ **Agregar con Enter** (escaneo)
- ✅ **Incrementar cantidad** si producto ya existe
- ✅ **Modal opcional** como fallback
- ✅ **Selector de bodega** integrado y validado
- ✅ **Componentes Elstar** mantenidos
- ✅ **Sin librerías nuevas**
- ✅ **Debounce (300ms)** para búsqueda
- ✅ **Inmediato para escaneo** (Enter)
- ✅ **Caché en memoria** (Map)
- ✅ **Atajos de teclado** completos
- ✅ **Autofocus** al entrar

## 🔄 Consistencia entre Módulos

Ahora tanto **Ventas** como **Compras** comparten:
- ✅ Mismo flujo de trabajo POS
- ✅ Mismos atajos de teclado
- ✅ Misma experiencia de búsqueda/escaneo
- ✅ Misma validación de bodega
- ✅ Mismo sistema de notificaciones
- ✅ Misma navegación por teclado

## 🐛 Troubleshooting

### Problema: El autofocus no funciona
**Solución**: Verificar que `autoFocus={true}` esté en ProductQuickAddBar

### Problema: Ctrl+Enter no guarda
**Solución**: Verificar que el useEffect de atajos esté montado

### Problema: No se incrementa la cantidad
**Solución**: Verificar que `handleAppendProduct` detecte productos existentes por `productId`

### Problema: No se ve el selector de bodega
**Solución**: Verificar que el store de warehouses esté cargado

## 🚀 Pruebas Sugeridas

1. **Cargar bodegas**: Abrir "Registrar Compra" y verificar que aparezcan bodegas
2. **Escaneo rápido**: Escanear código + Enter → debe agregar
3. **Incremento**: Escanear mismo código → cantidad debe aumentar
4. **Búsqueda manual**: Escribir y esperar dropdown
5. **Navegación teclado**: Usar ↑↓ en dropdown
6. **Atajos**: Probar F2 y Ctrl+Enter
7. **Validación**: Intentar guardar sin bodega → debe mostrar error
8. **Modal fallback**: Click en "buscar con filtros avanzados"

## 📊 Resumen Ejecutivo

Las mejoras del flujo POS implementadas en "Registrar Venta" han sido **replicadas exitosamente** en "Registrar Compra", creando una experiencia de usuario **consistente y eficiente** en ambos módulos. Los usuarios ahora pueden trabajar de manera más rápida usando lectores de código de barras o búsqueda rápida en cualquiera de los dos procesos.

---

**Fecha de implementación**: 2026-02-04  
**Módulos afectados**: Compras (Purchases)  
**Compatibilidad**: 100% con módulo de Ventas
