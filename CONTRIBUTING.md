# Contributing to MedSync

Thank you for your interest in contributing to MedSync! Follow these guidelines to maintain high code quality and smooth collaboration.

---

## 🌿 Branching Strategy

- `main` / `master` — Production-ready code only.
- `develop` (or feature branches) — Active development branch.
- Feature branches should follow the naming convention:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`
  - `refactor/component-name`

---

## 📝 Commit Message Conventions

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature for the user
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Formatting, missing semi-colons, etc (no code logic changes)
- `refactor:` Code refactoring without behavior modification
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool maintenance

**Example:**
```bash
git commit -m "feat(appointment): implement real-time queue estimation logic"
git commit -m "fix(pdf): escape user input in medical certificate generation"
```

---

## 🚀 Development Workflow

1. **Fork or Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/medsync.git
   cd medsync
   ```

2. **Backend Setup**:
   - Install composer dependencies: `cd api && composer install`
   - Copy `.env.example` to `.env` or set DB parameters in `config/database.php`.
   - Import `database/schema.sql` and `database/seeds.sql` into MySQL.

3. **Frontend Setup**:
   - Install npm packages: `cd frontend && npm install`
   - Copy `.env.example` to `.env` (`VITE_API_URL=http://localhost/medsync/api`).
   - Run the development server: `npm run dev`.

4. **Verify Changes**:
   - Check PHP syntax: `php -l path/to/file.php`
   - Test frontend build: `npm run build` inside `frontend/`

5. **Submit a Pull Request**:
   - Open a PR against the target branch.
   - Describe what changed and link any relevant issue tickets.
