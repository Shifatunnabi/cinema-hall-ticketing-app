Cinema Hall Ticketing App
Client: Anando Cinema

Setup

- Copy .env.local.example to .env.local and fill values:
  - MONGODB_URI, MONGODB_DB
  - JWT_SECRET
  - NEXT_PUBLIC_APP_URL
  - SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM
- Run: npm install --legacy-peer-deps
- Start dev: npm run dev

Create first admin

- POST http://localhost:3000/api/seed/admin with JSON { email, password, name }
- Or set env vars SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD and run the seed script while server is running.

Admin flow

- Login: /admin/login
- Invite users: /admin/users (admins only) sends email invite link
- Invitee sets password at /admin/activate and gains access
