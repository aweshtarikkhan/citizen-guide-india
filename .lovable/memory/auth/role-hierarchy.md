---
name: Admin Role Hierarchy
description: Super Admin > Vice Super Admin > Admin > Editor hierarchy with database-level protection
type: feature
---
## Role Hierarchy (highest to lowest)
1. **Super Admin** (1 only) — Full control, cannot be removed by anyone. User: aweshtarikkhan@gmail.com (ff541307)
2. **Vice Super Admin** (1 only) — Same as super admin but can be removed/reassigned by super admin. Cannot modify super admin.
3. **Admin** — Can edit website content, write blogs, manage leads. Cannot see super/vice admin in user list. Cannot manage roles.
4. **Editor** — Can write and manage own blogs only.

## Database Protection
- `protect_super_admin` trigger on `user_roles` prevents:
  - Removing/modifying super_admin role
  - Non-super assigning vice_super_admin
  - More than 1 vice_super_admin
  - Anyone assigning super_admin role
- Helper functions: `is_super_admin()`, `is_super_or_vice()`
- RLS: super_admin and vice_super_admin have ALL access to user_roles table

## UI Rules
- Users & Roles tab only visible to super/vice super admin
- Regular admins never see super_admin or vice_super_admin users
- Vice super admin cannot see super_admin user
- Role badges use Crown (super), Star (vice), Shield (admin), Edit (editor) icons
