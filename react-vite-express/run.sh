#!/bin/bash

npm run build --prefix frontend & wait

trap 'kill 0' SIGINT; npm run preview --prefix frontend  & npm run serve --prefix backend & wait