#!/bin/bash
#
# rutil-setup-postgres
# 
POSTGRES_USER_RUTIL="rutil"
psql -U postgres -c "CREATE ROLE ${POSTGRES_USER_RUTIL} WITH LOGIN ENCRYPTED PASSWORD 'rutil1!';" -d ovirt_engine_history
psql -U postgres -c "ALTER ROLE ${POSTGRES_USER_RUTIL} WITH login superuser createdb createrole inherit;"

psql -U postgres -c "GRANT CONNECT ON DATABASE ovirt_engine_history TO ${POSTGRES_USER_RUTIL};"
psql -U postgres -c "GRANT USAGE ON SCHEMA public TO ${POSTGRES_USER_RUTIL};" ovirt_engine_history
psql -U postgres -c "SELECT 'GRANT SELECT ON ' || relname || ' TO ${POSTGRES_USER_RUTIL};' FROM pg_class JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace WHERE nspname = 'public' AND relkind IN ('r', 'v');" --pset=tuples_only=on ovirt_engine_history > grant_history.sql
psql -U postgres -f grant_history.sql ovirt_engine_history

psql -U postgres -c "GRANT CONNECT ON DATABASE engine TO ${POSTGRES_USER_RUTIL};"
psql -U postgres -c "GRANT USAGE ON SCHEMA public TO ${POSTGRES_USER_RUTIL};" engine
psql -U postgres -c "SELECT 'GRANT SELECT ON ' || relname || ' TO ${POSTGRES_USER_RUTIL};' FROM pg_class JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace WHERE nspname = 'public' AND relkind IN ('r', 'v');" --pset=tuples_only=on engine > grant_engine.sql
psql -U postgres -f grant_engine.sql engine
psql -U postgres -c "GRANT USAGE ON SCHEMA aaa_jdbc TO ${POSTGRES_USER_RUTIL};" engine
psql -U postgres -c "SELECT 'GRANT SELECT ON ' || relname || ' TO ${POSTGRES_USER_RUTIL};' FROM pg_class JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace WHERE nspname = 'aaa_jdbc' AND relkind IN ('r', 'v');" --pset=tuples_only=on engine > grant_engine_aaa.sql
psql -U postgres -f grant_engine_aaa.sql engine
