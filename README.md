# FiestaMania — Demo Público

E-commerce de artículos para fiestas y piñatería, construido con **Next.js 15**, **Tailwind CSS v4**, y **shadcn/ui**.

> **Demo sin base de datos** — todos los datos provienen de archivos mock en `src/data/`. No requiere PostgreSQL ni Docker.

## Demo en vivo

[![Deploy with Vercel](https://vercel.com/button)](https://demofiestamaniamockdata.vercel.app/)

### Credenciales de prueba

| Rol | Usuario / Email | Contraseña |
|-----|----------------|------------|
| **Admin panel** | `admin` | `admin` |
| **Cliente** | `demo@fiestamania.com` | `demo1234` |
| **Admin (cuenta)** | `admin@fiestamania.com` | `admin1234` |

- Tienda: `/`
- Panel admin: `/admin/login`
- Cuenta cliente: `/login`

## Stack

- **Next.js 15** App Router (Server Components + Route Handlers)
- **Tailwind CSS v4** — tokens en `src/app/globals.css`
- **shadcn/ui** (new-york) — componentes en `src/components/ui/`
- **Zustand** — carrito y wishlist (localStorage)
- **react-hook-form + zod** — formularios
- **sonner** — notificaciones toast

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Solo `SESSION_SECRET` es necesaria para producción (firma de cookies). En desarrollo funciona sin ella.

## Estructura

```
src/
├── app/
│   ├── (shop)/          # Tienda pública
│   ├── admin/           # Panel de administración
│   └── api/             # Route Handlers
├── components/
│   ├── ui/              # shadcn/ui
│   ├── products/        # ProductCard, ProductGrid, etc.
│   ├── admin/           # Componentes del panel admin
│   └── shared/          # Componentes compartidos
├── data/                # Datos mock (products, categories, orders, etc.)
├── lib/
│   ├── mock-db.ts       # Capa de datos mock (reemplaza Prisma)
│   └── auth.ts          # Sesiones HMAC (sin base de datos)
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## Diferencias con la versión de producción

| Característica | Demo | Producción |
|---|---|---|
| Base de datos | ❌ Mock data | ✅ PostgreSQL + Prisma |
| Autenticación | ✅ Credenciales hardcodeadas | ✅ Usuarios reales en DB |
| Persistencia | ❌ Solo en memoria | ✅ PostgreSQL |
| Pagos | ❌ Simulado | ✅ Stripe/Conekta |
| Emails | ❌ No enviados | ✅ Resend |

## Licencia

MIT
