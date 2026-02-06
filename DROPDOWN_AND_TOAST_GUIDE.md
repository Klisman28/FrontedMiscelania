# 🎯 Guía Detallada: Dropdown Interactivo y Toast Notifications

Esta guía explica en detalle cómo funcionan estas dos características implementadas.

---

## 1️⃣ Dropdown Interactivo con Click Fuera para Cerrar

### 📍 Ubicación
`src/components/inventory/ProductSearchSelect.jsx`

### 🔧 Implementación Actual

#### A. Referencias y Estado
```javascript
const wrapperRef = useRef(null)  // Referencia al contenedor del dropdown
const [showDropdown, setShowDropdown] = useState(false)  // Estado del dropdown
```

#### B. Hook para Detectar Click Fuera
```javascript
useEffect(() => {
    // Función que detecta clicks fuera del componente
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowDropdown(false)  // Cierra el dropdown si el click es fuera
        }
    }
    
    // Agrega el listener al montar el componente
    document.addEventListener('mousedown', handleClickOutside)
    
    // Limpia el listener al desmontar
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
}, [])
```

#### C. Contenedor con Ref
```javascript
return (
    <div className="relative" ref={wrapperRef}>
        {/* Input de búsqueda */}
        <Input ... />
        
        {/* Dropdown posicionado absolutamente */}
        {showDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white ...">
                {/* Contenido del dropdown */}
            </div>
        )}
    </div>
)
```

### 🎨 Estilos del Dropdown

```javascript
className="absolute z-50 mt-1 w-full 
           bg-white dark:bg-gray-800 
           border border-gray-200 dark:border-gray-600 
           rounded-md shadow-lg 
           max-h-60 overflow-y-auto"
```

**Desglose:**
- `absolute` - Posición absoluta respecto al contenedor
- `z-50` - Alto z-index para estar por encima de otros elementos
- `mt-1` - Margen superior de 4px
- `w-full` - Ancho 100% del contenedor
- `bg-white dark:bg-gray-800` - Fondo blanco (modo claro) o gris (modo oscuro)
- `border border-gray-200 dark:border-gray-600` - Borde
- `rounded-md` - Bordes redondeados
- `shadow-lg` - Sombra grande para efecto elevado
- `max-h-60 overflow-y-auto` - Altura máxima de 240px con scroll vertical

### 🔄 Flujo de Interacción

```
1. Usuario escribe en el input
   ↓
2. Después de 300ms (debounce), se buscan productos
   ↓
3. showDropdown = true → Dropdown aparece
   ↓
4. Usuario puede:
   a. Hacer click en un resultado → selecciona y cierra
   b. Hacer click en "Crear Producto" → abre modal y cierra
   c. Hacer click FUERA del dropdown → detecta y cierra
```

### 💡 Personalización del Click Fuera

#### Opción 1: Agregar Excepciones
Si quieres que el dropdown NO se cierre al hacer click en ciertos elementos:

```javascript
const handleClickOutside = (event) => {
    // No cerrar si el click es en un elemento con clase específica
    if (event.target.closest('.no-close-dropdown')) {
        return
    }
    
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false)
    }
}

// Uso:
<div className="no-close-dropdown">
    Este elemento no cerrará el dropdown
</div>
```

#### Opción 2: Cerrar con Escape
```javascript
useEffect(() => {
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowDropdown(false)
        }
    }
    
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            setShowDropdown(false)
        }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)  // NUEVO
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)  // NUEVO
    }
}, [])
```

#### Opción 3: Cambiar Evento de Click
```javascript
// Usar 'click' en lugar de 'mousedown'
document.addEventListener('click', handleClickOutside)

// Diferencia:
// - mousedown: Se activa al presionar el botón del mouse
// - click: Se activa al soltar el botón del mouse
```

### 🎨 Mejorar la Animación del Dropdown

#### Agregar Transición Suave
```javascript
// 1. Instalar framer-motion (opcional)
npm install framer-motion

// 2. Importar
import { motion, AnimatePresence } from 'framer-motion'

// 3. Usar en el dropdown
<AnimatePresence>
    {showDropdown && (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full ..."
        >
            {/* Contenido */}
        </motion.div>
    )}
</AnimatePresence>
```

#### Alternativa con CSS Puro
```javascript
// Agregar clase con transición
className="absolute z-50 mt-1 w-full ... 
           transition-all duration-200 ease-in-out
           transform"

// Usar estado para clases condicionales
className={`absolute z-50 mt-1 w-full ... 
            ${showDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
```

---

## 2️⃣ Notificaciones Toast con Posicionamiento

### 📍 Ubicación
Usado en múltiples archivos:
- `src/components/products/ProductCreateModal.jsx`
- `src/views/inventory/StockInPage/index.js`

### 🔧 Implementación Actual

#### Uso Básico
```javascript
import { Notification, toast } from 'components/ui'

toast.push(
    <Notification title="Éxito" type="success">
        Producto creado exitosamente.
    </Notification>,
    { placement: 'top-center' }
)
```

### 🎯 Opciones de Posicionamiento

#### Todas las Posiciones Disponibles
```javascript
// Superior
{ placement: 'top-start' }    // Arriba a la izquierda
{ placement: 'top-center' }    // Arriba al centro ✅ ACTUAL
{ placement: 'top-end' }       // Arriba a la derecha

// Centro
{ placement: 'center-start' }  // Centro a la izquierda
{ placement: 'center' }        // Centro absoluto
{ placement: 'center-end' }    // Centro a la derecha

// Inferior
{ placement: 'bottom-start' }  // Abajo a la izquierda
{ placement: 'bottom-center' } // Abajo al centro
{ placement: 'bottom-end' }    // Abajo a la derecha (común en móvil)
```

### 🎨 Tipos de Notificaciones

```javascript
// Éxito (verde)
<Notification title="Éxito" type="success">
    Operación completada exitosamente.
</Notification>

// Error (rojo)
<Notification title="Error" type="danger">
    Ocurrió un error al procesar la solicitud.
</Notification>

// Advertencia (amarillo/naranja)
<Notification title="Advertencia" type="warning">
    Esta acción puede tener consecuencias.
</Notification>

// Información (azul)
<Notification title="Info" type="info">
    Información importante para el usuario.
</Notification>
```

### ⚙️ Opciones Avanzadas

#### Duración Personalizada
```javascript
toast.push(
    <Notification title="Éxito" type="success">
        Este mensaje durará 5 segundos
    </Notification>,
    { 
        placement: 'top-center',
        duration: 5000  // 5000ms = 5 segundos (default: 3000)
    }
)

// Notificación permanente (no se cierra automáticamente)
toast.push(
    <Notification title="Importante" type="warning">
        Debes cerrar esto manualmente
    </Notification>,
    { 
        placement: 'top-center',
        duration: 0  // 0 = sin auto-close
    }
)
```

#### Notificación con Acción
```javascript
toast.push(
    <Notification 
        title="Producto creado" 
        type="success"
        closable={true}
    >
        <div className="flex flex-col gap-2">
            <p>Producto creado exitosamente.</p>
            <Button 
                size="sm" 
                onClick={() => navigate(`/products/${newProduct.id}`)}
            >
                Ver Producto
            </Button>
        </div>
    </Notification>,
    { 
        placement: 'top-end',
        duration: 5000
    }
)
```

### 📋 Ejemplos Completos

#### 1. Notificación de Éxito Simple
```javascript
toast.push(
    <Notification title="Guardado" type="success">
        Los cambios se guardaron correctamente.
    </Notification>,
    { placement: 'top-center' }
)
```

#### 2. Notificación de Error Detallada
```javascript
const handleError = (error) => {
    const errorMessage = error.response?.data?.message || 'Error desconocido'
    
    toast.push(
        <Notification title="Error al guardar" type="danger">
            <div>
                <p className="mb-2">No se pudo completar la operación.</p>
                <p className="text-sm text-gray-500">
                    Detalles: {errorMessage}
                </p>
            </div>
        </Notification>,
        { 
            placement: 'top-center',
            duration: 5000 
        }
    )
}
```

#### 3. Notificación de Progreso
```javascript
// Mostrar al iniciar
const toastId = toast.push(
    <Notification title="Procesando..." type="info">
        Guardando cambios...
    </Notification>,
    { 
        placement: 'bottom-end',
        duration: 0  // No cerrar automáticamente
    }
)

// Actualizar cuando termine
setTimeout(() => {
    toast.remove(toastId)  // Remover el toast de progreso
    
    toast.push(
        <Notification title="Completado" type="success">
            Cambios guardados exitosamente.
        </Notification>,
        { placement: 'bottom-end' }
    )
}, 2000)
```

#### 4. Notificación con Múltiples Líneas
```javascript
toast.push(
    <Notification title="Stock Actualizado" type="success">
        <div className="space-y-1">
            <p><strong>Producto:</strong> Computadora HP 15</p>
            <p><strong>Bodega:</strong> Bodega Central</p>
            <p><strong>Cantidad:</strong> +20 unidades</p>
            <p className="text-sm text-gray-500 mt-2">
                Nuevo total: 50 unidades
            </p>
        </div>
    </Notification>,
    { 
        placement: 'top-end',
        duration: 6000 
    }
)
```

### 🎨 Personalización Visual

#### Notificación Personalizada
```javascript
toast.push(
    <Notification 
        title="¡Nuevo Pedido!"
        type="success"
        className="border-l-4 border-green-500"
    >
        <div className="flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div>
                <p className="font-semibold">Pedido #12345</p>
                <p className="text-sm text-gray-600">
                    3 productos - $1,500.00
                </p>
            </div>
        </div>
    </Notification>,
    { 
        placement: 'top-end',
        duration: 7000 
    }
)
```

### 🔄 Patrón Recomendado

#### Para Operaciones CRUD
```javascript
// ✅ CREAR
toast.push(
    <Notification title="Creado" type="success">
        {itemName} creado exitosamente.
    </Notification>,
    { placement: 'top-center', duration: 3000 }
)

// ✅ ACTUALIZAR
toast.push(
    <Notification title="Actualizado" type="success">
        Cambios guardados correctamente.
    </Notification>,
    { placement: 'top-center', duration: 3000 }
)

// ✅ ELIMINAR
toast.push(
    <Notification title="Eliminado" type="warning">
        {itemName} eliminado permanentemente.
    </Notification>,
    { placement: 'top-center', duration: 4000 }
)

// ❌ ERROR
toast.push(
    <Notification title="Error" type="danger">
        {errorMessage}
    </Notification>,
    { placement: 'top-center', duration: 5000 }
)
```

### 🌍 Internacionalización
```javascript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

toast.push(
    <Notification title={t('notifications.success')} type="success">
        {t('notifications.productCreated')}
    </Notification>,
    { placement: 'top-center' }
)
```

### 🧪 Testing
```javascript
import { render, screen, waitFor } from '@testing-library/react'

test('shows success notification on save', async () => {
    const { getByText } = render(<StockInPage />)
    
    // Simular guardar
    fireEvent.click(getByText('Guardar Ingreso'))
    
    // Verificar que aparece la notificación
    await waitFor(() => {
        expect(screen.getByText('Stock ingresado exitosamente')).toBeInTheDocument()
    })
})
```

---

## 🎯 Mejores Prácticas

### ✅ DO's (Hacer)
1. Usar `top-center` para mensajes importantes
2. Usar `bottom-end` para notificaciones no intrusivas
3. Duración de 3-5 segundos para la mayoría de mensajes
4. Mensajes claros y concisos
5. Usar el tipo correcto (success, danger, warning, info)

### ❌ DON'Ts (No Hacer)
1. No usar `center` (bloquea toda la pantalla)
2. No usar duraciones menores a 2 segundos (muy rápido)
3. No usar duraciones mayores a 10 segundos (muy largo)
4. No poner múltiples toasts simultáneos del mismo tipo
5. No usar notificaciones para información trivial

---

## 📱 Responsive

### Ajustar Posición en Móvil
```javascript
const isMobile = window.innerWidth < 768

toast.push(
    <Notification title="Éxito" type="success">
        Cambios guardados.
    </Notification>,
    { 
        placement: isMobile ? 'bottom-center' : 'top-end',
        duration: 3000 
    }
)
```

---

**¡Todo implementado y funcionando!** 🚀
