#!/bin/bash

trap 'kill 0' SIGINT; npm run dev & npm run serve & wait