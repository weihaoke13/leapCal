from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_eventid as create_eventid
import psycopg2, time

events_create_bp = Blueprint('events_create_b`p', __name__)

CORS(app, resources={r"/events/create": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Event_Create:
    @app.route('/events/create', methods=['POST'])
    def create_event():
        event              = Event_Create()
        responses          = resp.Responses()
        eventid            = create_eventid.Create_EventID()
        received_data      = request.get_json()

        if received_data is None:
            return responses.bad_request()

        if ((received_data.get('user_id') is None or received_data.get('event_information') is None) and len(received_data) == 2) or len(received_data) != 2:
            return responses.bad_request()

        if not received_data['user_id']['is_admin']:
            return responses.bad_request()
    
        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()

            next_eventid = eventid.create_eventid()

            #event being created
            event_being_created = { 'eventid'     : next_eventid,
                                    'event_title' : received_data['event_information']['title'],
                                    'start_date'  : received_data['event_information']['start'],
                                    'end_date'    : received_data['event_information']['end'],
                                    'description' : received_data['event_information']['description'],
                                    'location'    : received_data['event_information']['location'],
                                    'all_day'     : received_data['event_information']['allDay']
                                    }

            #query statement to insert into events table.
            query_insert_event = "INSERT INTO events (eventid, event_title, start_date, end_date, description, location, all_day) VALUES (%s, %s, %s, %s, %s, %s, %s)"

            created_event = (event_being_created['eventid'],
                            event_being_created['event_title'],
                            event_being_created['start_date'],
                            event_being_created['end_date'],
                            event_being_created['description'],
							event_being_created['location'],
                            event_being_created['all_day']
                            )

            cursor.execute(query_insert_event, created_event)

            connection.commit()

            cursor.close()
        
        except(Exception,psycopg2.DatabaseError) as error:
            print("Error returned from DB, events_create_route.")
            print(error)
            connection.close()

        finally:
            if connection.closed == 0:
                connection.close()
                return responses.created()

            return responses.server_error()