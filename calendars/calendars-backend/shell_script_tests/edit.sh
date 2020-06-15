#!/bin/bash

curl -d '{"eventid":"'$1'", "event_title":"'$2'", "start_date":"'$3'", "end_date":"'$4'", "description":"'$5'", "location":"'$6'", "all_day":"$7"}' -H "Content-Type: application/json" -X POST http://localhost:8000/events/edit
