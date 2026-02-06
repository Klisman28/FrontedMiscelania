# Test Script - Stock In Flow

Este documento describe cómo probar el flujo completo de Recarga de Stock.

## Prerequisitos
1. Backend corriendo en `http://localhost:3000`
2. Al menos una bodega creada
3. Frontend corriendo (`npm start`)

## Pasos de Prueba

### 1. Navegación
1. Iniciar sesión en el sistema
2. En el menú lateral, expandir **"Almacén"**
3. Hacer clic en **"Recargar Stock"**
4. Verificar que se carga la página `/inventory/in`

### 2. Caso 1: Crear Producto Nuevo y Registrar Stock

#### A. Seleccionar Bodega
- Hacer clic en el dropdown "Bodega"
- Seleccionar cualquier bodega (ej: "Bodega Central")

#### B. Buscar Producto (que no existe)
- En el campo "Producto", escribir: `Computadora HP`
- Esperar 300ms (debounce)
- Verificar que aparece dropdown con "Sin resultados"
- Hacer clic en el botón **"Crear Producto"**

#### C. Crear Producto en Modal
- Verificar que se abre el modal "Crear Nuevo Producto"
- Llenar el formulario:
  - **Nombre**: Computadora HP 15
  - **SKU**: HP15-2026
  - **Costo**: 850
  - **Precio de Venta**: 1000
- Hacer clic en **"Guardar"**
- Verificar:
  - ✅ Toast de éxito: "Producto creado exitosamente"
  - ✅ Modal se cierra
  - ✅ Producto queda seleccionado en el campo de búsqueda

#### D. Ingresar Cantidad y Descripción
- En "Cantidad", escribir: `20`
- En "Descripción", escribir: `Compra - factura 001-00045`

#### E. Guardar Entrada
- Hacer clic en **"Guardar Ingreso"**
- Verificar:
  - ✅ Botón muestra loading state
  - ✅ Toast de éxito: "Stock ingresado exitosamente"
  - ✅ Formulario se limpia automáticamente

### 3. Caso 2: Usar Producto Existente

#### A. Seleccionar Bodega
- Seleccionar una bodega

#### B. Buscar Producto (que existe)
- Escribir en "Producto": `Computadora`
- Esperar el dropdown con resultados
- Verificar que aparece "Computadora HP 15"
- Hacer clic para seleccionarlo

#### C. Ingresar Stock
- Cantidad: `10`
- Descripción: `Recarga adicional`
- Hacer clic en "Guardar Ingreso"
- Verificar toast de éxito

### 4. Caso 3: Validaciones

#### A. Validación de Campos Requeridos
- Intentar guardar sin llenar campos
- Verificar mensajes de error:
  - "La bodega es requerida"
  - "El producto es requerido"
  - "La cantidad es requerida"

#### B. Validación de Cantidad
- Ingresar cantidad `0` o negativa
- Verificar error: "Debe ser mayor a 0"

#### C. Validación de Precio vs Costo (al crear producto)
- Intentar crear producto con:
  - Costo: 1000
  - Precio: 500
- Verificar error: "El precio debe ser mayor o igual al costo"

#### D. SKU Duplicado
- Intentar crear producto con SKU ya existente (ej: "HP15-2026")
- Verificar mensaje de error: "El SKU ya existe. Por favor, usa uno diferente."

### 5. Verificar Stock en Bodega

#### A. Navegar al Stock
- Método 1: Hacer clic en "Ver Stock de esta Bodega" (si está visible)
- Método 2: Ir a Almacén > Bodegas > (icono Ver Stock de la bodega usada)

#### B. Verificar Entrada
- Buscar "Computadora HP 15" en la tabla
- Verificar que la cantidad refleja las entradas realizadas
- Ejemplo: Si hicimos entrada de 20 + 10 = 30 unidades

### 6. Verificar en Backend (Opcional)

Si tienes acceso directo a la base de datos:

```sql
-- Verificar producto creado
SELECT * FROM products WHERE sku = 'HP15-2026';

-- Verificar balance de inventario
SELECT * FROM inventory_balances 
WHERE product_id = (SELECT id FROM products WHERE sku = 'HP15-2026')
AND warehouse_id = <ID_BODEGA>;

-- Verificar movimientos
SELECT * FROM inventory_movements 
WHERE product_id = (SELECT id FROM products WHERE sku = 'HP15-2026')
AND type = 'IN'
ORDER BY created_at DESC
LIMIT 10;
```

## Casos de Error a Probar

### 1. Backend No Disponible
- Detener el backend
- Intentar crear producto o registrar stock
- Verificar mensaje de error apropiado

### 2. Red Lenta
- Simular red lenta (Chrome DevTools > Network > Slow 3G)
- Verificar que los loading states funcionan correctamente

### 3. Sesión Expirada
- Limpiar token de localStorage
- Intentar alguna operación
- Verificar que redirige a login (401 handler)

## Resultados Esperados

✅ **Todos los casos de prueba pasan**
- Creación de productos funciona
- Búsqueda con debounce funciona
- Selección automática después de crear producto
- Validaciones funcionan correctamente
- Notificaciones se muestran apropiadamente
- Stock se actualiza en la bodega

## Reportar Problemas

Si encuentras algún problema, documenta:
1. Pasos para reproducir
2. Comportamiento esperado
3. Comportamiento actual
4. Consola del navegador (errores)
5. Network tab (requests fallidos)

---

**Última actualización**: 2026-02-04
