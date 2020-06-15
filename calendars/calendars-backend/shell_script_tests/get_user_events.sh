#!/bin/bash

curl -d '{"month" : "'$1'", "userid" : "'$2'"}' -H "Content-Type: application/json" -X POST http://localhost:8000/users/get_user_events
