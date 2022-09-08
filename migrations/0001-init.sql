create table users
(
    id         serial
        constraint users_pk
            primary key,
    first_name varchar(255),
    last_name  varchar(255),
    city       varchar(255),
    email      varchar(512),
    is_active  boolean
);

create table mass_actions_history
(
    id              serial
        constraint mass_actions_history_pk
            primary key,
    "table"         varchar(255) not null,
    table_record_id integer      not null,
    before          text,
    after           text,
    "column"        varchar(255),
    updated_at      timestamp default now()
);

create unique index users_email_uindex
    on users (email);

alter table mass_actions_history
    owner to postgres;

alter table users
    owner to postgres;