# 🎨 Demo de Dropdown y Toast

## 🚀 Cómo ver la demo

### Opción 1: Agregar ruta temporal (Recomendado)

1. Abre `src/configs/routes.config/index.js`

2. Agrega esta ruta en el array `protectedRoutes`:

```javascript
{
    key: 'demo.dropdownToast',
    path: '/demo/dropdown-toast',
    component: React.lazy(() => import('views/demo/DropdownToastDemo')),
    authority: [],
}
```

3. Navega en tu navegador a: `http://localhost:3000/demo/dropdown-toast`

### Opción 2: Probar directamente en Stock In Page

La funcionalidad ya está implementada en:
- **Dropdown**: `http://localhost:3000/inventory/in` (campo de Producto)
- **Toast**: Aparece al guardar exitosamente o al crear un producto

## 📖 Características Implementadas

### 1. Dropdown Interactivo ✅

**Ubicación**: `src/components/inventory/ProductSearchSelect.jsx`

**Funcionalidades**:
- ✅ Click fuera para cerrar (usando `useRef` y event listener)
- ✅ Escape para cerrar
- ✅ Búsqueda con debounce de 300ms
- ✅ Resultados en tiempo real
- ✅ Botón "Crear Producto" cuando no hay resultados
- ✅ Selección automática al hacer click

**Implementación**:
```javascript
// Detectar click fuera
useEffect(() => {
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowDropdown(false)
        }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
}, [])
```

### 2. Toast Notifications ✅

**Ubicación**: Usado en múltiples archivos

**Características**:
- ✅ Posicionamiento: `top-center` (modificable)
- ✅ Duración: 3000ms por defecto (modificable)
- ✅ Tipos: success, danger, warning, info
- ✅ Cierre manual o automático
- ✅ Múltiples toasts simultáneos

**Implementación**:
```javascript
import { Notification, toast } from 'components/ui'

toast.push(
    <Notification title="Éxito" type="success">
        Operación completada exitosamente.
    </Notification>,
    { 
        placement: 'top-center',  // Posición
        duration: 3000            // Duración en ms
    }
)
```

## 🎯 Posiciones Disponibles para Toast

```
┌────────────────────────────────┐
│  top-start   top-center   top-end
│
│  center-start  center  center-end
│
│  bottom-start bottom-center bottom-end
└────────────────────────────────┘
```

**Más comunes**:
- `top-center` - Para mensajes importantes que requieren atención
- `top-end` - Para notificaciones no intrusivas
- `bottom-end` - Para confirmaciones rápidas (estilo móvil)

## 📝 Ejemplos de Uso

### Notificación Simple
```javascript
toast.push(
    <Notification title="Guardado" type="success">
        Los cambios se guardaron correctamente.
    </Notification>,
    { placement: 'top-center' }
)
```

### Notificación con Detalles
```javascript
toast.push(
    <Notification title="Stock Actualizado" type="success">
        <div>
            <p><strong>Producto:</strong> Computadora HP 15</p>
            <p><strong>Cantidad:</strong> +20 unidades</p>
        </div>
    </Notification>,
    { placement: 'top-end', duration: 5000 }
)
```

### Notificación de Error
```javascript
toast.push(
    <Notification title="Error" type="danger">
        {errorMessage}
    </Notification>,
    { placement: 'top-center', duration: 5000 }
)
```

### Notificación Permanente
```javascript
toast.push(
    <Notification title="Importante" type="warning" closable={true}>
        Esta notificación no se cierra automáticamente.
    </Notification>,
    { placement: 'top-center', duration: 0 }
)
```

## 🧪 Probar en Vivo

1. **Dropdown con click fuera**:
   - Ir a `/inventory/in`
   - Click en campo "Producto"
   - Escribir algo para ver resultados
   - Click FUERA del dropdown → Se cierra ✅
   - Presionar ESC → Se cierra ✅

2. **Toast notifications**:
   - Ir a `/inventory/in`
   - Llenar el formulario
   - Click en "Guardar Ingreso"
   - Ver notificación en `top-center` ✅

3. **Demo completa** (si agregaste la ruta):
   - Ir a `/demo/dropdown-toast`
   - Probar todas las variantes

## 📚 Documentación

- **Guía Completa**: Ver `DROPDOWN_AND_TOAST_GUIDE.md`
- **Implementación**: Ver `STOCK_IN_IMPLEMENTATION.md`
- **Código Fuente**:
  - Dropdown: `src/components/inventory/ProductSearchSelect.jsx`
  - Toast: Buscar `toast.push` en el proyecto

## 🎨 Personalización

### Cambiar posición del toast
```javascript
// En cualquier archivo donde uses toast
toast.push(
    <Notification ... />,
    { placement: 'bottom-end' }  // Cambiar aquí
)
```

### Cambiar duración
```javascript
toast.push(
    <Notification ... />,
    { 
        placement: 'top-center',
        duration: 5000  // 5 segundos
    }
)
```

### Agregar Escape al dropdown (ya está implementado en la demo)
```javascript
useEffect(() => {
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            setShowDropdown(false)
        }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
        document.removeEventListener('keydown', handleEscape)
    }
}, [])
```

## ✅ Status

| Característica | Estado | Ubicación |
|----------------|--------|-----------|
| Click fuera para cerrar | ✅ Implementado | ProductSearchSelect.jsx |
| Toast con posicionamiento | ✅ Implementado | Múltiples archivos |
| Escape para cerrar | ✅ Implementado | Demo (opcional) |
| Debounce en búsqueda | ✅ Implementado | ProductSearchSelect.jsx |
| Tipos de toast | ✅ Implementado | success, danger, warning, info |
| Duraciones personalizadas | ✅ Implementado | Configurable |

---

**Todo está listo y funcionando!** 🎉

Ambas características están completamente implementadas y en uso en la página de Recargar Stock.
