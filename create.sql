
CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE person (
    id_person SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name_1 VARCHAR(100) NOT NULL,
    last_name_2 VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    id_person INT NOT NULL,
    id_role INT NOT NULL,
    ci INT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_person
        FOREIGN KEY (id_person) REFERENCES person(id_person),

    CONSTRAINT fk_user_role
        FOREIGN KEY (id_role) REFERENCES role(id_role)
);

CREATE TABLE institution (
    id_institution SERIAL PRIMARY KEY,
    institution_name VARCHAR(150) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE contact (
    id_contact SERIAL PRIMARY KEY,
    id_person INT NOT NULL,
    id_institution INT NOT NULL,
    position VARCHAR(100),
    description TEXT,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT NOT NULL,

    CONSTRAINT fk_contact_person
        FOREIGN KEY (id_person) REFERENCES person(id_person),

    CONSTRAINT fk_contact_institution
        FOREIGN KEY (id_institution) REFERENCES institution(id_institution),

    CONSTRAINT fk_contact_user
        FOREIGN KEY (created_by) REFERENCES users(id_user),

    CONSTRAINT unique_person_institution
        UNIQUE (id_person, id_institution)
);

CREATE TABLE phone (
    id_phone SERIAL PRIMARY KEY,
    number VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    id_person INT,
    id_institution INT,

    CONSTRAINT fk_phone_person
        FOREIGN KEY (id_person) REFERENCES person(id_person),

    CONSTRAINT fk_phone_institution
        FOREIGN KEY (id_institution) REFERENCES institution(id_institution),

    CONSTRAINT chk_phone_owner
        CHECK (
            (id_person IS NOT NULL AND id_institution IS NULL)
            OR
            (id_person IS NULL AND id_institution IS NOT NULL)
        )
);

CREATE INDEX idx_person_name ON person(name);
CREATE INDEX idx_institution_name ON institution(institution_name);
CREATE INDEX idx_contact_active ON contact(is_active);
CREATE INDEX idx_phone_active ON phone(is_active);

-- password debería ser opcional (cambiar not null)
