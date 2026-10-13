# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The MedSync development team takes security and the privacy of Protected Health Information (PHI) very seriously. If you discover a security vulnerability within MedSync, please follow these guidelines:

1. **Do not create a public issue** on GitHub.
2. Email your findings directly to the security maintainers or system administrator.
3. Include a detailed description of the vulnerability, steps to reproduce, sample payload or PoC, and potential impact.
4. Allow reasonable time for the maintainers to investigate and issue a patch before public disclosure.

## Security Controls in MedSync

- **Role-Based Access Control (RBAC):** Strict server-side verification using `AuthMiddleware` prevents horizontal and vertical privilege escalation.
- **Protected Health Information (PHI) Access:** Uploaded medical proof documents and generated PDFs are forbidden from direct web server access (`.htaccess`). All file streaming is authenticated and authorization-verified via `CertificateController::download_file()`.
- **Injection Mitigation:**
  - Database queries use parameterized PDO prepared statements.
  - HTML & PDF generation dynamic content is sanitized with `htmlspecialchars()` to prevent XSS and SSRF.
- **CSRF Protection:** State-changing requests validate synchronization tokens (`X-CSRF-Token`).
- **Session Security:** Session cookies configured with `HttpOnly`, `SameSite=Lax`, and `Secure` (in HTTPS environments).
