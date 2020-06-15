#!/bin/bash

curl -d '{"eventid" : "'$1'"}' -H "Content-Type: application/json" http://localhost:8000/events/retrieve_users
