# Fix: Formulario de Edición de Usuario No Guardaba Cambios

## 🐛 Problema Identificado

Cuando se intentaba editar un usuario y asignar roles, al hacer clic en "Guardar" no se ejecutaba la acción debido a **errores de validación de contraseña**.

### Causa Raíz

El esquema de validación (`validationSchema`) en `UserForm/index.jsx` **siempre requería contraseña**, incluso al editar usuarios existentes. Esto causaba que:

1. Al editar un usuario sin cambiar la contraseña (dejarla vacía), la validación fallaba
2. El formulario no se enviaba al backend
3. No había feedback visual del error

## ✅ Solución Implementada

### 1. Validación Condicional de Contraseña

**Archivo:** `src/views/organization/users/UserForm/index.jsx`

#### Antes:
```javascript
password: Yup.string()
    .required("La contraseña es requerida")  // ❌ Siempre requerida
    .min(8, "La contraseña debe ser mayor a 8 caracteres"),
```

#### Después:
```javascript
password: Yup.string()
    .when('$isEdit', {
        is: false, // Si NO es edición (crear usuario)
        then: (schema) => schema
            .required("La contraseña es requerida")
            .min(8, "La contraseña debe ser mayor a 8 caracteres"),
        otherwise: (schema) => schema
            .nullable() // ✅ Opcional al editar
            .min(8, "La contraseña debe ser mayor a 8 caracteres")
    }),
```

### 2. Validación Condicional de Confirmación

```javascript
passwordConfirmation: Yup.string()
    .when('password', {
        is: (val) => val && val.length > 0, // Solo si hay contraseña
        then: (schema) => schema
            .required("La confirmación de contraseña es requerida")
            .oneOf([Yup.ref('password'), null], "La confirmación no coincide"),
        otherwise: (schema) => schema.nullable() // ✅ Opcional
    }),
```

### 3. Contexto de Validación

Agregamos `validationContext` para indicar al esquema si estamos en modo edición:

```javascript
const isEdit = !!user?.id // Si tiene ID, estamos editando

<Formik
    validationContext={{ isEdit }} // Pasar contexto
    // ...
>
```

### 4. Limpieza de Password en Submit

Si estamos editando y NO hay password, lo eliminamos del payload:

```javascript
onSubmit={(values, { setSubmitting }) => {
    const submitData = { ...values }
    delete submitData.__isEdit // No enviar flag interno
    
    if (isEdit && !values.password) {
        delete submitData.password
        delete submitData.passwordConfirmation
    }
    
    onFormSubmit?.(submitData)
    setSubmitting(false)
}}
```

### 5. UI Mejorado en Campos de Contraseña

**Archivo:** `src/views/organization/users/UserForm/BasicInfoFields.jsx`

Agregamos indicadores visuales para modo edición:

```jsx
<FormItem
    label={`Contraseña${values.__isEdit ? ' (Dejar vacío para no cambiar)' : ''}`}
    // ...
>
    <Field
        placeholder={values.__isEdit ? "Nueva contraseña (opcional)" : "contraseña"}
        // ...
    />
</FormItem>

<FormItem
    label={`Confirmar Contraseña${values.__isEdit ? ' (Solo si cambias contraseña)' : ''}`}
    // ...
>
    <Field
        placeholder={values.__isEdit ? "Confirmar nueva contraseña" : "confirmar"}
        // ...
    />
</FormItem>
```

### 6. Flag Interno `__isEdit`

Agregamos un flag interno para que el UI sepa si está en modo edición:

```javascript
initialValues={{
    __isEdit: isEdit, // Flag para UI
    username: user?.username || '',
    // ... otros campos
}}
```

## 📋 Archivos Modificados

1. ✅ `src/views/organization/users/UserForm/index.jsx`
   - Validación condicional de password
   - Context de validación
   - Limpieza de password en submit
   - Flag `__isEdit`

2. ✅ `src/views/organization/users/UserForm/BasicInfoFields.jsx`
   - Labels dinámicos para contraseñas
   - Placeholders informativos

## 🎯 Comportamiento Actualizado

### Crear Usuario Nuevo
- ✅ Contraseña **REQUERIDA**
- ✅ Confirmación **REQUERIDA**
- ✅ Roles **REQUERIDOS** (mínimo 1)

### Editar Usuario Existente
- ✅ Contraseña **OPCIONAL** (solo si quiero cambiarla)
- ✅ Si escribo contraseña nueva → confirmación REQUERIDA
- ✅ Si dejo vacía → NO se valida, NO se envía al backend
- ✅ Roles pueden editarse sin problema
- ✅ Labels indican: "(Dejar vacío para no cambiar)"

## ✅ Validación

### Caso 1: Editar solo roles (sin cambiar password)
```
1. Abrir usuario "Shop"
2. Checkear/Deschequear roles
3. Dejar password VACÍA
4. Clic "Guardar"
5. ✅ Se guarda correctamente
```

### Caso 2: Editar roles Y cambiar password
```
1. Abrir usuario "Shop"
2. Cambiar roles
3. Escribir nueva password
4. Confirmar nueva password
5. Clic "Guardar"
6. ✅ Se actualiza todo correctamente
```

### Caso 3: Crear usuario nuevo
```
1. Clic "Nuevo Usuario"
2. Llenar username
3. Dejar password vacía
4. Clic "Guardar"
5. ❌ Error: "La contraseña es requerida" (correcto)
```

## 🔍 Debug

Si el problema persiste:

1. **Abrir DevTools Console**
2. **Editar usuario**
3. **Clic "Guardar"**
4. **Verificar:**
   - Errores de validación en consola
   - Network request (debería aparecer PUT /api/users/:id)
   - Payload enviado

```javascript
// Ver errores de validación en consola
// Se imprimen automáticamente por Formik
```

## 🚀 Beneficios

1. ✅ Experiencia de usuario mejorada
2. ✅ No es necesario escribir password al editar
3. ✅ Feedback visual claro sobre qué es opcional
4. ✅ Validación robusta en ambos modos (crear/editar)
5. ✅ Backend recibe payload limpio (sin campos innecesarios)
