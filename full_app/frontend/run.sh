#!/bin/bash

# Start the first process
# npm run dev &
# Start the second process
# npm run serve &


trap 'kill 0' SIGINT; npm run dev & npm run serve & wait

# Wait for any process to exit
# wait -n

# Exit with status of process that exited first
# exit $?