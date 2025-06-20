-- Create sequence for Auditable ID
CREATE SEQUENCE IF NOT EXISTS id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    user_id VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(15) NOT NULL,
    middle_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    place_of_birth VARCHAR(50),
    date_of_birth DATE,
    status VARCHAR(10) NOT NULL,
    membership_level VARCHAR(10) NOT NULL,
    role_id BIGINT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    network_operator VARCHAR(50) NOT NULL,
    bio VARCHAR(500),
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    last_login TIMESTAMP WITHOUT TIME ZONE,
    profile_image_key VARCHAR(255),
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    is_login_restricted BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    mfa_qr_code_image_uri TEXT,

    street VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),

    CONSTRAINT account_email_unique UNIQUE (email)
);

-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    name VARCHAR(30) NOT NULL UNIQUE,
    authorities VARCHAR(500)
);

-- Create User Credentials table
CREATE TABLE IF NOT EXISTS user_credentials (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    user_id BIGINT NOT NULL,
    password VARCHAR(255) NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    is_temporary_password BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_credential_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_credentials_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_credentials_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);

-- Create Password History table
CREATE TABLE IF NOT EXISTS password_history (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    credential_id BIGINT NOT NULL,
    old_password VARCHAR(255) NOT NULL,

    CONSTRAINT fk_password_credential FOREIGN KEY (credential_id) REFERENCES user_credentials (id) ON DELETE CASCADE,
    CONSTRAINT fk_password_history_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_password_history_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);

-- Create Confirmations table
CREATE TABLE IF NOT EXISTS confirmations (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    confirmation_key VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    CONSTRAINT unique_confirmation_key UNIQUE (confirmation_key),
    CONSTRAINT fk_confirmation_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_confirmations_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_confirmations_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);

-- Create Refresh Tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    user_id BIGINT NOT NULL,
    token TEXT NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(200),
    device_info VARCHAR(100),

    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_refresh_token_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_refresh_token_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);

-- Create Work Experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    user_id BIGINT NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    currently_working BOOLEAN NOT NULL DEFAULT FALSE,
    description VARCHAR(1000),

    CONSTRAINT fk_work_experience_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_work_experience_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_work_experience_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);

-- Create Work academic record table
CREATE TABLE IF NOT EXISTS academic_record (
    id BIGINT PRIMARY KEY DEFAULT nextval('id_sequence'),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    modified_by BIGINT,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    modified_date TIMESTAMP WITHOUT TIME ZONE,

    user_id BIGINT NOT NULL,
    institution_name VARCHAR(150) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    currently_studying BOOLEAN NOT NULL DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE,

    CONSTRAINT fk_education_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_education_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_education_modified_by FOREIGN KEY (modified_by) REFERENCES users (id)
);
