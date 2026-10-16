# Admin panel setup

The admin panel is available only by entering `/admin` directly. It is not
linked from public navigation and does not provide public registration.

## Configure the server

1. Copy `.env.example` to `.env` and configure `MONGO_URI`, `CLIENT_ORIGINS`,
   `OWNER_EMAIL`, `ADMIN_JWT_SECRET`, `ADMIN_OTP_SECRET`, `MAIL_USER`, and
   `MAIL_PASS`. To upload project screenshots, also configure
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
   `CLOUDINARY_API_SECRET`. Use different randomly generated secrets of at
   least 32 characters for the JWT and OTP secrets. Do not put these values in
   the frontend environment.
2. Set `OWNER_BOOTSTRAP_CODE` to a one-time random secret of at least 32
   characters.
3. Set the client `VITE_API_BASE_URL` to the server's API origin, then build
   and deploy the client. In production, use HTTPS and set
   `CLIENT_ORIGINS` to the exact deployed client origin(s).
   For local Vite development, allow the origins you use, for example
   `CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`.
4. Start the server and open `/admin`. If there is no owner account yet, the
   private setup form will ask for the exact `OWNER_EMAIL`, the
   `OWNER_BOOTSTRAP_CODE`, and the password you want to use. The server stores
   only a password hash in MongoDB; the owner password does not belong in
   `.env`. Setup can also be completed directly with
   `POST /api/admin/auth/owner/bootstrap`:

   ```json
   {
     "email": "the exact OWNER_EMAIL",
     "code": "the OWNER_BOOTSTRAP_CODE",
     "password": "a unique password with at least 12 characters"
   }
   ```

   Send this request over HTTPS in production. The bootstrap endpoint only
   works before an owner exists and is rate-limited. After successful setup,
   remove `OWNER_BOOTSTRAP_CODE` from the server environment and restart. It
   is not needed for regular sign-in or recovery.
5. Visit `/admin`, sign in as the owner, and create admin accounts there.
   Admins cannot register, self-reset passwords, manage accounts, or recover
   passwords. The owner can change an admin password, disable an account, or
   remove it. Password changes and disabling an account revoke existing
   sessions.

## Owner password recovery

The private admin sign-in page has an owner-only recovery flow. A short-lived
one-time code is emailed to `OWNER_EMAIL`. The owner enters that code with the
new password. Codes expire after 10 minutes and are limited to five attempts.
Configure the existing Gmail SMTP `MAIL_USER` and `MAIL_PASS` as an app
password. The email entered during recovery must match an active owner account
already registered in the database and `OWNER_EMAIL`. On successful code
delivery, a separate notification (never containing the OTP) is sent to
`MAIL_RECEIVER`. Delivery failures are logged without printing credentials;
failed OTP delivery is also reported to the recovery page.

## Admin features

- Add, hide, publish, and remove projects. Upload up to 20 JPG, PNG, or WebP
  screenshots per project (8 MB each maximum); images are stored in Cloudinary. Existing
  screenshot URLs can also be entered directly.
- Review contact form enquiries in the Admin inbox, view submitted contact
  details, and update their status to New, In progress, or Done. Enquiries are
  ordered newest first and the inbox supports pagination.
- Manage FAQs from the Admin panel: add, edit, delete, reorder, and publish or
  hide questions and answers. Existing FAQ content is seeded only when missing.
- Add certificates and activate or revoke records. Revoked records no longer
  pass public certificate verification. Certificate records are added through
  the admin panel. Project and certificate lists support pagination with page
  sizes of 5, 10, or 20; there is no certificate seed file or startup sync.
- Add confirmation letters, review their records, and activate or revoke them
  from the Admin panel. Revoked letters no longer pass public verification.
  Existing confirmation-letter seed records are inserted only when missing, so
  Admin changes are preserved across server restarts.
- Manage service cards, package categories, and package tiers from the Admin
  panel, including names, descriptions, prices, timelines, included features,
  and public visibility. The initial catalog is inserted into MongoDB only
  when records are missing; subsequent Admin edits are not overwritten.
- Add, edit, and remove homepage client reviews from the Admin panel, up to
  12 total. Changes publish live, and the review section is hidden when there
  are no reviews. Initial review content is inserted only when missing.
- Edit the three existing homepage statistics from the Admin panel, including
  their numbers, labels, and suffixes. The initial values are inserted only
  when missing, and changes are published live.
- Edit the existing Skill Lab courses from the Admin panel, including
  descriptions, pricing, duration, skills, modules, projects, schedule, and
  public availability. Courses can also be permanently removed from the public
  catalog with typed DELETE confirmation. Course identities and URLs remain
  fixed; initial course data is inserted only when missing.
- Edit the Services page offer banner and its optional display window. Its
  public call-to-action is fixed to the Contact page.
- Public project listing and active offer endpoints are read-only. All content
  mutations require an authenticated admin session; account administration is
  owner-only.

Admin cookies are HTTP-only and expire after seven days, and are accompanied
by exact-origin and custom-header checks. The API applies rate limits to
sign-in, recovery, and owner bootstrap requests. Configure a strong unique
`ADMIN_JWT_SECRET`, keep dependencies updated, and restrict database access in
production.
