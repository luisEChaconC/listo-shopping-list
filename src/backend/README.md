# Listo Shopping List Backend

This backend uses Express and Swagger for API documentation. The folder structure is designed for scalability and separation of concerns.

## Folder Structure
- `application/` — Application logic (use cases, services)
- `composition/` — Dependency injection and composition root
- `domain/` — Domain models and business logic
- `infrastructure/` — External integrations (DB, APIs)
- `presentation/` — Express routers, controllers, and middleware

## Adding New Routes
1. **Define Domain Model:**
   - Add or update models/entities in `domain/` (e.g. `Product.ts`).

2. **Implement Business Logic:**
   - Add services or use cases in `application/` (e.g. `ProductService.ts`).

3. **Implement Data Access:**
   - Add repositories or integrations in `infrastructure/` (e.g. `ProductRepository.ts`).

4. **Register Dependencies:**
   - Use `composition/` to wire up dependencies and configure DI containers if needed.

5. **Create Router:**
   - Add a new file in `presentation/`, e.g. `productsRouter.ts`.
   - Export an Express Router with your endpoints, calling the logic from `application/`.

6. **Register the Router:**
   - Import your router in `presentation/app.ts`.
   - Use `app.use(yourRouter)` to register it.

7. **Document the Route:**
    - Add comments or documentation as needed.

## Running Backend & Frontend Together
Use `npm run dev` from the project root to start both backend and frontend with hot reload.
