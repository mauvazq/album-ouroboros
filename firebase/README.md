# Configuración de Firebase

## Pasos en Firebase Console

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com) (plan Spark gratuito).
2. Habilitar **Authentication** → Email/Password.
3. Crear base de datos **Firestore** en modo producción.
4. Habilitar **Storage** con bucket por defecto.
5. Registrar app web y copiar credenciales a `.env` (ver `.env.example`).

## Desplegar reglas de seguridad

```bash
firebase deploy --only firestore:rules,storage
```

O copiar manualmente el contenido de `firestore.rules` y `storage.rules` en la consola de Firebase.

## Índices compuestos recomendados

Crear en Firestore → Indexes cuando la consola lo solicite:

| Colección | Campos |
|-----------|--------|
| `albumes` | `usuario_uid` ASC, `fecha_creacion` DESC |
| `fotos` | `usuario_uid` ASC, `album_id` ASC, `eliminada` ASC |
| `fotos` | `usuario_uid` ASC, `favorito` ASC, `eliminada` ASC |
| `fotos` | `usuario_uid` ASC, `eliminada` ASC, `fecha_subida` DESC |
