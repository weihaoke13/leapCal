#!/bin/bash

curl -d '{"start_date":"'$1'"}' -H "Content-Type: application/json" -X POST http://localhost:8000/events/retrieve_events
