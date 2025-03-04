#!/bin/bash
#
# rutil-setup-postgres-simple
# 
psql -U postgres -c "CREATE ROLE rutil WITH LOGIN ENCRYPTED PASSWORD 'rutil1!';" -d ovirt_engine_history
psql -U postgres -c "ALTER ROLE rutil WITH login superuser createdb createrole inherit;"
