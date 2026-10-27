# Marbellin: Vercel + Supabase

## Estado actual
- La tienda estática (`index.html` y `producto.html`) se publica desde GitHub.
- `vercel.json` prepara el repositorio para el despliegue estático en Vercel.
- `supabase/schema.sql` define tablas y políticas RLS.
- `js/supabase-config.js` configura el cliente público; falta pegar la publishable key real del proyecto.
- El catálogo actual todavía usa una lista local de respaldo. La conexión dinámica del catálogo se realizará una vez ejecutado el esquema y configurada la clave.

## 1. Configurar Supabase
1. Abre el proyecto `ckgvgfpcxeqyilfphnsu` en Supabase.
2. En **SQL Editor**, ejecuta el contenido de `supabase/schema.sql`.
3. En **Project Settings / API Keys**, copia la **Publishable key** (o la anon key heredada).
4. Pégala en `js/supabase-config.js`, reemplazando `PEGA_AQUI_TU_SUPABASE_PUBLISHABLE_KEY`.
5. Nunca pegues una `service_role` o `secret key` en este archivo ni en código del navegador.

## 2. Preparar los productos
La tabla `products` usa `product_code`, `name`, `category`, `price`, `description`, `images`, `stock` y `active`. Los códigos de catálogo actuales pueden cargarse como registros en esta tabla. Los clientes solo pueden leer productos activos; la administración requiere un usuario autenticado con rol `admin`.

## 3. Publicar en Vercel
1. Entra en Vercel y elige **Add New → Project**.
2. Importa `nexaltustecsac/Marbellin`.
3. Para esta versión estática, no configures un framework; deja la raíz del proyecto como `./`.
4. Despliega. Los cambios que se hagan en `main` se publicarán automáticamente.
5. Si ya existe un proyecto Vercel enlazado, verifica que el repositorio y la rama sean `nexaltustecsac/Marbellin` y `main`.

## 4. Importante sobre el ZIP Laravel
El ZIP recibido contiene controladores y migraciones Laravel 12, pero no incluye `routes/` ni `resources/views/`. No es una aplicación Laravel completa lista para desplegar. Vercel puede servir la versión estática actual; para ejecutar toda la lógica PHP/Laravel se necesita completar esas piezas y elegir un entorno compatible con Laravel, o migrar esa lógica a Supabase/funciones serverless.

## 5. Administración segura
- No se permite que el navegador se asigne el rol de administrador.
- Crea el usuario en Supabase Auth y luego asígnale el rol desde SQL Editor usando su UID real:
  `UPDATE public.profiles SET role = 'admin' WHERE id = 'UID_DEL_ADMIN';`
- Protege cada acción administrativa mediante sesión y RLS; ocultar un botón no es seguridad.
