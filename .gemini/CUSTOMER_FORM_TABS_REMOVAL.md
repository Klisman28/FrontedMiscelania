# Actualización: Formulario de Cliente Unificado

## 🎨 Cambio de Diseño

Se eliminaron las pestañas (Tabs) "Información Básica" y "Contactos" para ofrecer una experiencia de usuario más fluida y rápida en una sola vista con scroll.

## ✅ Estructura Nueva

El formulario ahora se presenta en un solo bloque vertical organizado por secciones claras:

### 1. Sección: Información Personal
- **Nombre** | **Apellidos** (2 columnas)
- **Interruptor Consumidor Final** | **NIT** (2 columnas)
  - _Lógica automática de CF mantenida_

*(Divisor visual)*

### 2. Sección: Datos de Contacto
- **Email** | **Teléfono** (2 columnas)
- **Dirección** (Ancho completo)

## 🔧 Beneficios UX
- **Menos clics**: El usuario no necesita cambiar de pestañas para ver o llenar información.
- **Validación visible**: Los errores en cualquier campo son visibles inmediatamente al hacer scroll.
- **Contexto completo**: Toda la información del cliente es visible de un vistazo.

## 📁 Archivos Modificados
- `src/views/client/customers/CustomerForm/index.jsx`: Eliminación del componente `Tabs`, implementación de `div` contenedores con títulos de sección (`h4`) y bordes inferiores para separar visualmente las áreas.

**¡El formulario ahora es más rápido de llenar y visualizar!** 🚀
