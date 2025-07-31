#!/bin/bash

# Make sure we are in the right directory
# (This isn't strictly necessary inside Docker with WORKDIR, but good practice)
cd "$(dirname "$0")"

echo "--- Starting shc compilation ---"

# Find the rutilvm script and compile it
# The -r flag makes it redistributable
# The -f flag specifies the input file
./shc-3.8.9b/shc -r -f ./rutilvm-engine-setup.sh
./shc-3.8.9b/shc -r -f ./rutilvm-engine-patch.sh
./shc-3.8.9b/shc -r -f ./rutilvm-host-patch.sh
./shc-3.8.9b/shc -r -f ./test.sh

echo "--- Compilation finished ---"
echo "Generated files:"
ls -l rutilvm-*.sh.x*
