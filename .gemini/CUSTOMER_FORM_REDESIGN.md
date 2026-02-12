# Rediseño del Formulario de Cliente (Customer)

## 🎨 Objetivo

Actualizar el formulario de "Cliente" para alinearse con el nuevo modelo de datos (firstName, lastName, isFinalConsumer) y mejorar la UX/UI.

## ✅ Cambios Implementados

### 1. **Nuevo Modelo de Datos**
Se actualizó el manejo de campos para soportar la nueva estructura del backend, manteniendo retrocompatibilidad con datos antiguos durante la edición.

**Mapeo de Campos:**
- `firstName` ← `name` (Viejo)
- `lastName` ← `${firstLastname} ${secondLastname}` (Viejo)
- `nit` ← `dni` (Viejo)

### 2. **Lógica de Consumidor Final (CF)**
- **Switcher "Consumidor Final"**: Permite alternar rápidamente el modo de venta sin NIT.
- **Automatización**: 
  - Al activar CF: El campo NIT se deshabilita y se llena automáticamente con "CF".
  - Al desactivar CF: El campo NIT se habilita y limpia para ingreso manual.
- **Validación**:
  - Si CF es activo, NIT es opcional/ignorado.
  - Si CF es inactivo, NIT valida formato (números y guiones).

### 3. **Layout Mejorado (2 Columnas vs 1 Columna)**
- **Desktop**: 
  - "Nombre" y "Apellidos" lado a lado.
  - Switch CF y campo NIT lado a lado.
  - Contactos en 2 columnas.
- **Móvil**: Todo colapsa a 1 columna vertical para mejor usabilidad.

### 4. **UX Profesional**
- **Sticky Header/Footer**: El título y los botones de acción siempre están visibles al hacer scroll.
- **Indicadores de Error**: Si hay errores de validación en un tab oculto (ej: falta el Apellido en Info Básica), aparece un punto rojo en la pestaña.
- **AutoFocus**: El campo "Nombre" recibe foco automático al abrir.
- **Placeholders Claros**: Ejemplos reales en cada campo.

### 5. **Archivos Modificados**

1.  `CustomerEditDialog.jsx`: Implementación de Drawer con Sticky Header/Footer.
2.  `CustomerForm/index.jsx`: Lógica de negocio, mapeo de datos, validación Yup y control de tabs.
3.  `CustomerForm/BasicInfoFields.jsx`: Layout de campos principales y lógica de UI para CF.
4.  `CustomerForm/ContactFields.jsx`: Layout de campos de contacto opcionales.

## 🎯 Validación

### Caso 1: Nuevo Cliente (Consumidor Final)
1. Abrir "Nuevo Cliente".
2. Activar switch "Consumidor Final".
3. NIT se pone en "CF" y se deshabilita.
4. Llenar Nombre/Apellido.
5. Guardar -> Payload: `isFinalConsumer: true`, `nit: 'CF'`.

### Caso 2: Nuevo Cliente (Con NIT)
1. Abrir "Nuevo Cliente".
2. Switch CF apagado (default).
3. Ingresar NIT (valida formato).
4. Guardar -> Payload: `isFinalConsumer: false`, `nit: '123...'`.

### Caso 3: Edición (Datos Viejos)
1. Editar cliente antiguo (`name: "Juan", firstLastname: "Perez"`).
2. Formulario muestra: `firstName: "Juan"`, `lastName: "Perez"`.
3. Guardar -> Se actualiza al nuevo formato.

**¡El formulario ahora es moderno, rápido para ventas (CF) y visualmente consistente!** 👥✨
