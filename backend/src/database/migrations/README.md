# Migrations

TypeORM migrations are stored here.

Generate a new migration:
```
npm run migration:generate -- src/database/migrations/MigrationName
```

Run migrations:
```
npm run migration:run
```

Revert last migration:
```
npm run migration:revert
```
