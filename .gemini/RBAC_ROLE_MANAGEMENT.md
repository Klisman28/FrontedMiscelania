# Gestión de Roles - Guía Completa

## 📍 ¿Dónde se Gestionan los Roles?

### **IMPORTANTE:** Los roles se crean y gestionan en el **BACKEND**, NO en el frontend.

El frontend solo:
- ✅ **Visualiza** los roles del usuario
- ✅ **Valida** permisos basados en roles
- ✅ **Filtra** UI según roles

## 🔍 Dónde Visualizar Roles en el Frontend

### 1. **Ver Tus Propios Roles** (Usuario Actual)

**Ubicación:** Dropdown del usuario (esquina superior derecha)

**Archivo:** `src/components/template/UserDropdown.js`

Cuando haces clic en tu avatar, verás:
```
┌─────────────────────────┐
│  👤 admin              │
│  Nombre Completo       │
│  [ADMIN] [SALES]      │ ← Tus roles
├─────────────────────────┤
│  🚪 Cerrar Sesión      │
└─────────────────────────┘
```

**Código relevante:**
```javascript
// Líneas 55-62 de UserDropdown.js
{userInfo.authority?.map((role, index) => (
    <span className="...">
        {role}  {/* Muestra cada rol */}
    </span>
))}
```

### 2. **Gestionar Roles de Otros Usuarios** (Solo ADMIN)

**Ubicación:** Menú → Organización → Usuarios

**Ruta:** `/organizacion/usuarios`

**Archivo:** `src/views/organization/users/UserForm/BasicInfoFields.jsx`

En el formulario de crear/editar usuario verás:

```
Roles:
☑ ADMIN
☐ SALES
☐ WAREHOUSE
```

**Código relevante (líneas 80-99):**
```javascript
<FormItem label="Roles">
    <Field name="roles">
        {({ field, form }) => (
            <Checkbox.Group
                onChange={options => form.setFieldValue(field.name, options)}
                value={values.roles}
            >
                {roleList?.map((role, key) => (
                    <Checkbox key={key} name="roles" value={role.id}>
                        {role.name}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        )}
    </Field>
</FormItem>
```

## 🔧 Cómo se Obtienen los Roles

### En el Login

**Archivo:** `src/utils/hooks/useAuth.js` (líneas 20-56)

```javascript
const signIn = async ({ username, password }) => {
    const resp = await apiSignIn({ username, password })
    
    if (resp.data) {
        const { token, user } = resp.data.data
        
        // 1. Guardar token
        dispatch(onSignInSuccess(token))
        
        // 2. Procesar y guardar roles
        const roles = user.roles.map((role) => {
            return role.toUpperCase() // Normaliza a mayúsculas
        })
        
        // 3. Guardar usuario con roles en Redux
        dispatch(setUser({
            avatar: '',
            username: user.username,
            owner: user.employee.fullname,
            authority: roles  // ← AQUÍ se guardan los roles
        }))
    }
}
```

### En Redux

**Archivo:** `src/store/auth/userSlice.js`

```javascript
export const initialState = {
    avatar: '',
    username: '',
    owner: '',
    authority: []  // ← Array de roles
}
```

**Acceder a roles en cualquier componente:**
```javascript
import { useSelector } from 'react-redux'

const MyComponent = () => {
    const userRoles = useSelector((state) => state.auth.user.authority)
    
    console.log(userRoles) // ['ADMIN', 'SALES']
}
```

## 🎯 Roles Disponibles

### Roles Estándar del Sistema

```javascript
// src/utils/rbac.js
export const ROLES = {
    ADMIN: 'ADMIN',
    SALES: 'SALES',
    WAREHOUSE: 'WAREHOUSE'
}
```

### Equivalencias (Compatibilidad Backward)

```javascript
CAJERO → SALES
BODEGUERO → WAREHOUSE
```

El helper `normalizeRole()` automáticamente convierte nombres legacy:
```javascript
import { normalizeRole } from 'utils/rbac'

normalizeRole('cajero')     // → 'SALES'
normalizeRole('BODEGUERO')  // → 'WAREHOUSE'
normalizeRole('admin')      // → 'ADMIN'
```

## 🗄️ Gestión de Roles en el Backend

### **Debes crear los roles en la base de datos del backend:**

#### Opción 1: Mediante Panel de Administración (si existe)
Si tu backend tiene un panel admin, crear roles:
```
Nombre: Admin
Slug: admin
Permisos: (todos)
```

#### Opción 2: SQL Directo

```sql
-- Crear tabla de roles (si no existe)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles estándar
INSERT INTO roles (id, name) VALUES
(1, 'admin'),
(2, 'sales'),
(3, 'warehouse');

-- Tabla pivot usuario-roles
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Asignar rol a usuario
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),  -- Usuario 1 es ADMIN
(2, 2),  -- Usuario 2 es SALES
(3, 3);  -- Usuario 3 es WAREHOUSE
```

#### Opción 3: API del Backend

Si tienes endpoints de gestión de roles:

**GET /api/roles** - Listar roles
```json
{
  "data": {
    "roles": [
      { "id": 1, "name": "admin" },
      { "id": 2, "name": "sales" },
      { "id": 3, "name": "warehouse" }
    ]
  }
}
```

**POST /api/roles** - Crear rol
```json
{
  "name": "admin"
}
```

**POST /api/users/:id/roles** - Asignar rol a usuario
```json
{
  "roleIds": [1, 2]
}
```

## 📋 Checklist de Configuración

### Backend
- [ ] Tabla `roles` creada
- [ ] Tabla `user_roles` (pivot) creada
- [ ] Roles básicos insertados: admin, sales, warehouse
- [ ] Endpoint `/api/roles` para listar roles
- [ ] Endpoint `/api/users/:id/roles` para asignar roles
- [ ] Login devuelve roles en respuesta:
  ```json
  {
    "user": {
      "id": 1,
      "username": "admin",
      "roles": ["admin", "sales"]
    },
    "token": "JWT..."
  }
  ```

### Frontend (Ya Implementado ✅)
- [✅] `useAuth.js` procesa roles del login
- [✅] Redux guarda roles en `auth.user.authority`
- [✅] Helpers RBAC (`hasRole`, `canAccess`, etc.)
- [✅] Rutas protegidas con authorities
- [✅] Navegación filtrada por roles
- [✅] UserDropdown muestra roles
- [✅] UserForm permite asignar roles (checkboxes)

## 🔍 Debug: Verificar Roles

### 1. En Redux DevTools

```javascript
// Estado de Redux
{
  auth: {
    user: {
      username: "admin",
      owner: "Juan Pérez",
      authority: ["ADMIN", "SALES"]  // ← Aquí están los roles
    },
    session: {
      token: "eyJ...",
      signedIn: true
    }
  }
}
```

### 2. En Console del Browser

```javascript
// Abrir DevTools Console y ejecutar:
const state = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.()?.getState?.() || {}
console.log('User Roles:', state.auth?.user?.authority)
```

### 3. Agregar Componente de Debug

```javascript
// Crear: src/components/RoleDebug.jsx
import { useSelector } from 'react-redux'

const RoleDebug = () => {
    const user = useSelector(state => state.auth.user)
    
    if (process.env.NODE_ENV !== 'development') return null
    
    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded z-50 text-xs">
            <div><strong>Usuario:</strong> {user.username}</div>
            <div><strong>Roles:</strong> {user.authority?.join(', ') || 'Ninguno'}</div>
        </div>
    )
}

export default RoleDebug

// Agregar en App.js o Layout:
import RoleDebug from 'components/RoleDebug'

<RoleDebug />  {/* Solo en desarrollo */}
```

## 🎯 Ejemplo Completo: Crear Usuario con Roles

### 1. Usuario ADMIN crea nuevo usuario

```
Navegación → Organización → Usuarios → Nuevo Usuario
```

### 2. Llenar formulario

```
Nombre de Usuario: cajero1
Contraseña: ********
Confirmar Contraseña: ********
Empleado: [Seleccionar empleado]

Roles:
☑ SALES       ← Marcar este
☐ ADMIN
☐ WAREHOUSE
```

### 3. Backend recibe

```json
POST /api/users
{
  "username": "cajero1",
  "password": "********",
  "userableId": 5,
  "roles": [2]  // ID del rol SALES
}
```

### 4. Backend responde

```json
{
  "data": {
    "user": {
      "id": 10,
      "username": "cajero1",
      "roles": ["sales"]
    }
  }
}
```

### 5. Nuevo usuario hace login

Login devuelve:
```json
{
  "user": {
    "id": 10,
    "username": "cajero1",
    "roles": ["sales"]
  },
  "token": "eyJ..."
}
```

Frontend guarda en Redux:
```javascript
auth: {
  user: {
    username: "cajero1",
    authority: ["SALES"]  // Normalizado a mayúsculas
  }
}
```

## 📝 Resumen Rápido

### Para el Usuario Final:
1. **Ver mi rol actual:** Click en avatar (arriba derecha)
2. **Mis permisos:** Menú lateral se filtra automáticamente

### Para el Administrador:
1. **Gestionar usuarios:** Menú → Organización → Usuarios
2. **Asignar roles:** Al crear/editar usuario, marcar checkboxes de roles
3. **Ver quién tiene qué rol:** En la lista de usuarios

### Para el Desarrollador:
- **Roles se definen en:** Backend (base de datos)
- **Roles se leen desde:** `state.auth.user.authority`
- **Helpers RBAC en:** `src/utils/rbac.js`
- **Ejemplos de uso en:** `.gemini/RBAC_USAGE_EXAMPLES.jsx`

## ⚠️ Importante

1. **Los roles SIEMPRE vienen del backend** - El frontend NO puede modificarlos localmente
2. **Redux persiste los roles** - Sobreviven a refresh de página
3. **El logout limpia los roles** - Se borran al cerrar sesión
4. **Validación doble** - Frontend verifica UI, backend verifica API
