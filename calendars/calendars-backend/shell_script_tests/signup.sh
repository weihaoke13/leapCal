#!/bin/bash

curl -d '{"userid":"'$1'", "eventid":"'$2'"}' -H "Content-Type: application/json" -X POST http://localhost:8000/events/signup
