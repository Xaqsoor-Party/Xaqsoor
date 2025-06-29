CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO roles (
    reference_id,
    is_deleted,
    created_by,
    created_date,
    name,
    authorities
) VALUES
    (uuid_generate_v4()::text, FALSE, 0, NOW(), 'ADMIN',
     'view_member,view_constituencies,view_candidates,view_dashboard,view_results,create_member,update_member,view_member,manage_roles,review_forms,send_followup,import_members,view_members,manage_constituencies,manage_candidates,view_candidates,view_dashboard,view_reports');


-- Insert system user (role_id retrieved from roles table where name = 'ADMIN')
INSERT INTO users (
    id,
    reference_id,
    is_deleted,
    created_by,
    created_date,
    user_id,
    first_name,
    middle_name,
    last_name,
    gender,
    place_of_birth,
    date_of_birth,
    status,
    membership_level,
    role_id,
    email,
    phone,
    network_operator,
    bio,
    failed_login_attempts,
    last_login,
    profile_image_key,
    account_non_expired,
    account_non_locked,
    is_login_restricted,
    email_verified,
    enabled,
    mfa_enabled,
    mfa_secret,
    mfa_qr_code_image_uri
)
VALUES (
           0,
           uuid_generate_v4()::text,
           FALSE,
           0,
           NOW(),
           'XQ-RZKT-968721-KMRG',
           'Asal',    -- First Name
           '',      -- Middle Name
           'Solutions',     -- Last Name
           'UNKNOWN',   -- Gender (default value)
           NULL,        -- Place of Birth
           NULL,        -- Date of Birth
           'ACTIVE',    -- Status (default value)
    'LIFETIME',
           (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1),
    'system@asalsolutions.com',
    '+252771700700',        -- Phone
    'Hormuud',
    'Core system guardian account responsible for security, auditing, and system integrity. Not for interactive use. Visit us at https://asalsolutions.com/',
    0,           -- Failed login attempts
    NULL,        -- Last login
    'https://asalsolutions.com/wp-content/themes/asalsolutions/assets/images/logo.svg', -- Profile image key
    TRUE,        -- Account non expired
    TRUE,        -- Account non locked
    FALSE,       -- Is login restricted
    FALSE,       -- Email verified
    TRUE,        -- Enabled
    FALSE,       -- MFA enabled
    NULL,        -- MFA secret
    NULL         -- MFA QR code image URI
    );


-- Insert normal user (role_id retrieved from roles table where name = 'USER')
INSERT INTO users (
    reference_id,
    is_deleted,
    created_by,
    created_date,
    user_id,
    first_name,
    middle_name,
    last_name,
    gender,
    place_of_birth,
    date_of_birth,
    status,
    membership_level,
    role_id,
    email,
    phone,
    network_operator,
    bio,
    failed_login_attempts,
    last_login,
    profile_image_key,
    account_non_expired,
    account_non_locked,
    is_login_restricted,
    email_verified,
    enabled,
    mfa_enabled,
    mfa_secret,
    mfa_qr_code_image_uri
)
VALUES (

           uuid_generate_v4()::text,    -- Reference ID
           FALSE,                      -- Is deleted
           0,                          -- Created by
           NOW(),                      -- Created date
           'XQ-VKGD-357548-JRMV',              -- User ID
           'Abdihakim',                -- First Name
           'Ismail',                         -- Middle Name (optional)
           'Mohamed',                  -- Last Name
           'Male',                     -- Gender
           'Mogadishu',                -- Place of Birth (example)
           '1998-01-01',               -- Date of Birth (example)
           'ACTIVE',                   -- Status (default value)
           'LIFETIME',                 -- Membership Level (example, adjust as needed)
           (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1),  -- Role ID for 'USER'
    'abdihakin18@gmail.com',    -- Email
    '+252771700700',            -- Phone
    'Hormuud',                  -- Network Operator
    'Normal user account with access to basic features.', -- Bio
    0,                          -- Failed login attempts
    NULL,                       -- Last login (to be set on first login)
    NULL,  -- Profile image key (can be changed)
    TRUE,                       -- Account non expired
    TRUE,                       -- Account non locked
    FALSE,                      -- Is login restricted
    TRUE,                      -- Email verified
    TRUE,                       -- Enabled
    FALSE,                      -- MFA enabled
    NULL,                       -- MFA secret
    NULL                        -- MFA QR code image URI
    );

-- Enforce NOT NULL on role_id
ALTER TABLE users
    ALTER COLUMN role_id SET NOT NULL;

-- Add FK constraint to roles
ALTER TABLE users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;

-- Optional: Add other FK constraints
ALTER TABLE users
    ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_users_modified_by FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add constraints to roles table
ALTER TABLE roles
    ADD CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    ADD CONSTRAINT fk_roles_modified_by FOREIGN KEY (modified_by) REFERENCES users (id);
