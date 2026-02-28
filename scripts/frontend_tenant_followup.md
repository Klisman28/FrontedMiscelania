# Frontend Multi-Tenant Follow-Up (Data Isolation)

## 📌 Estado Actual

El frontend ha sido reforzado para asegurar aislamiento total de datos en una arquitectura multi-tenant, complementando la protección del backend (TenantGuard). Actualmente, todos los requests dependen exclusivamente del `activeCompanyId` inyectado por el backend a través del JWT y el middleware.

### Medidas Implementadas:
1. **Auth State**: Al hacer login, el token JWT se decodifica en `useAuth.js` extrayendo el `activeCompanyId` y `tenantRole`. Estos quedan persistidos en el Redux store (`userSlice.js`).
2. **Payload Sanitizer**: En `BaseService.js`, se añadió un interceptor global que elimina automáticamente `companyId` o `company_id` de cualquier objeto enviado por el cliente en peticiones tipo `POST/PUT`. Se arroja un `console.warn` en entornos de desarrollo si el cliente intenta inyectar este dato.
3. **Route Guard UX**: En `ProtectedRoute.js`, a menos que seas `SUPERADMIN`, se bloqueará la navegación mostrando la pantalla *"No tienes empresa asignada"* de inmediato si tu JWT no posee un `activeCompanyId`.
4. **Manejadores Globales para 400/403**: `BaseService.js` procesa los errores específicos de `tenantGuard`. Al recibir un `400` ("Usuario sin empresa asignada") o `403` ("No eres miembro de esta empresa") directamente emitirá un componente `toast` con la Notificación respectiva y forzará el deslogueo (`onSignOutSuccess()`).

---

## 🔍 Comandos de Verificación (Escaner Estático)

Para validar de forma automatizada que el código se mantiene limpio, utiliza estos comandos (o `rg` si posees ripgrep):

### 1) Detectar envíos indebidos de companyId/company_id
```bash
# Debería retornar vacío si no se envían params a servicios en src/
npx ripgrep "companyId|company_id" src/ -n
# o con grep nativo:
grep -rni "companyId\|company_id" src/
```

### 2) Detectar manipulaciones del payload 
```bash
npx ripgrep "body\.(companyId|company_id)|payload\.(companyId|company_id)" src/ -n
```

*Excepciones*: Las únicas referencias a `companyId/company` deben hallarse estrictamente dentro de los flujos de creación/administración nativa de SaaS en `src/views/saas/admin/CompaniesList.js`, y en los guards de Auth, jamás como payloads de los recursos del Tenant (productos, usuarios, inventario, etc).

---

## 🧪 Pruebas Manuales (Aislamiento A/B)

### Prerrequisitos:
- 2 Empresas Activas (por ej: `Empresa Alfa` y `Empresa Beta`).
- 2 Usuarios: `userA` (solo en Empresa Alfa) y `userB` (solo en Empresa Beta).

### Flujo de Prueba:
1. **Iniciar Sesión con `userA`**
   - Verificar la pestaña de "Network". El login recibe el JWT, este contiene los Claims.
   - Navega al menú POS (por ej. `Productos`).
   - Crea un producto nuevo, llámalo `Producto Exclusivo Alfa`.
   - Revisa en la pestaña "Network" los headers: el Request solo envía `Authorization: Bearer <token>`, el tabulador *Payload* del request **NO tiene rastros de `companyId`**.
2. **Cambiar Sesión y Validar Aislamiento**
   - Haz Logout e ingresa como `userB`.
   - Navega a los productos de `Empresa Beta`.
   - ¡Confirmar que el `Producto Exclusivo Alfa` no se lista!
3. **Test de Rechazo (403/Forbidden)**
   - Extraer la ID de recurso del `Producto Exclusivo Alfa` desde la DB (por ejemplo id `42`).
   - Con el usuario `userB` (beta), intentar apuntar directo a las URLs o por Postman usando el Bearer Token de beta directo a las rutas `/api/v1/products/42`.
   - Resulte en *403 Forbidden* o *404*, interceptado por el Frontend mandando a `Logout` preventivo y arrojando tu notificación visual en Toast.

---

## ✅ Criterios de Aceptación Cumplidos

- [x] El state del Frontend procesa activamente `activeCompanyId`.
- [x] Axios nunca manda `companyId` a los endpoints SaaS/tenant regulares. (Removido automáticamente desde `interceptors`).
- [x] Se interceptan correctamente los rechazos por `TenantGuard`.
- [x] Un acceso root protegido para SuperAdmins sin afectaciones a módulos multitenant.
