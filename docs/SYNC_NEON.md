# Sincronización con Neon (offline-first)

La app móvil sigue usando **SQLite** en el dispositivo. **Neon** (PostgreSQL) es la base en la nube, accesible solo desde `apps/api`.

## Flujo

1. El usuario crea o consulta cápsulas → siempre **SQLite** primero.
2. Si `EXPO_PUBLIC_API_URL` y `EXPO_PUBLIC_SYNC_TOKEN` están configurados, la app intenta sincronizar en segundo plano.
3. **Push**: filas con `sync_status = 'pending'` → `POST /v1/capsules/sync`.
4. **Pull**: `GET /v1/capsules?since=<último updated_at local>` → upsert en SQLite.
5. Si la red o la API fallan, la experiencia local **no se rompe** (sin alertas de sync).

## Configuración

### 1. Neon

1. Crea un proyecto en [Neon](https://neon.tech).
2. Copia la **connection string** (pooled recomendado para serverless).

### 2. API (`apps/api`)

```bash
cd apps/api
cp .env.example .env
# Edita DATABASE_URL y SYNC_API_SECRET
npm install
npm run db:migrate
npm run dev
```

La API escucha en `http://localhost:3001` por defecto.

### 3. App móvil (`apps/mobile`)

```bash
cd apps/mobile
cp .env.example .env
# Mismo SYNC_API_SECRET que en la API, como EXPO_PUBLIC_SYNC_TOKEN
# En dispositivo físico usa la IP de tu Mac en lugar de localhost
npm start
```

Reinicia Metro después de cambiar `.env`.

## Seguridad (MVP)

- Autenticación: `Authorization: Bearer <SYNC_API_SECRET>`.
- Espacio compartido: `COUPLE_ID` en la API (mismo valor para ambos móviles de la pareja).
- **No** expongas `DATABASE_URL` en la app; solo la API habla con Neon.

## Próximos pasos (fuera de este slice)

- Emparejamiento de pareja y JWT por usuario.
- Resolución de conflictos más rica que last-write-wins por `updated_at`.
