-- create the schema
CREATE DATABASE coastguard;
USE coastguard;

-- parent tables (no FKs yet)
CREATE TABLE orgs (
    id         VARCHAR(255) PRIMARY KEY,
    name       TEXT,
    icon       TEXT,
    created    BIGINT
);

CREATE TABLE accounts (
    id          VARCHAR(255) PRIMARY KEY,
    name        TEXT,
    username    TEXT,
    email       TEXT,
    profile_pic TEXT,
    pronouns    TEXT,
    created     BIGINT,
    locked      BOOL DEFAULT FALSE,
    suspended   BOOL DEFAULT FALSE
);

CREATE TABLE projects (
    id        VARCHAR(255) PRIMARY KEY,
    namespace VARCHAR(255),
    name      TEXT,
    icon      TEXT,
    created   BIGINT
);

CREATE TABLE namespaces (
    id       VARCHAR(255) PRIMARY KEY,
    org      VARCHAR(255),
    name     TEXT,
    icon     TEXT,
    created  BIGINT,
    FOREIGN KEY (org) REFERENCES orgs(id)
);

CREATE TABLE device (
    id          VARCHAR(255) PRIMARY KEY,
    account_id  VARCHAR(255),
    name        TEXT,
    public_key  TEXT,
    created     BIGINT,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE discussions (
    message_id  VARCHAR(255) PRIMARY KEY,
    discussion  VARCHAR(255),
    author      VARCHAR(255),
    content     TEXT,
    attachments TEXT,
    created     BIGINT,
    project     VARCHAR(255),
    FOREIGN KEY (author)  REFERENCES accounts(id),
    FOREIGN KEY (project) REFERENCES projects(id)
);

CREATE TABLE user_rating (
    id       VARCHAR(255) PRIMARY KEY,
    emoji    TEXT,
    author   VARCHAR(255),
    project  VARCHAR(255),
    created  BIGINT NOT NULL,
    FOREIGN KEY (author)  REFERENCES accounts(id),
    FOREIGN KEY (project) REFERENCES projects(id)
);

CREATE TABLE issue (
    id         VARCHAR(255) PRIMARY KEY,
    title      TEXT,
    created    BIGINT,
    project    VARCHAR(255),
    discussion VARCHAR(255),
    FOREIGN KEY (project)    REFERENCES projects(id),
    FOREIGN KEY (discussion) REFERENCES discussions(message_id)
);

CREATE TABLE bug (
    id      VARCHAR(255) PRIMARY KEY,
    author  VARCHAR(255),
    title   TEXT,
    created BIGINT,
    FOREIGN KEY (author) REFERENCES accounts(id)
);