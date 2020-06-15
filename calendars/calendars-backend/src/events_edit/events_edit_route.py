from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

events_edit_bp = Blueprint('events_edit_bp', __name__)

CORS(app, resources={r"/events/edit": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Edit_Events:
    @app.route('/events/edit', methods = ["POST"])
    def edit_events():
        responses    = resp.Responses()
        received_data = request.get_json()

        if received_data is None:
            return responses.bad_request()

        if received_data.get('eventid') is None:
            return responses.delete_()

        conn = None
        try:
            conn       = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = conn.cursor()
            
            event_info = { 'eventid'      :    received_data['eventid'],
                           'event_title'  :    received_data['event_title'],
                           'start_date'   :    received_data['start_date'],
                           'end_date'     :    received_data['end_date'],
                           'description'  :    received_data['description'],
                           'location'     :    received_data['location'],
                           'all_day'      :    received_data['all_day']}


            # variable to hold the update query
            update_event = "UPDATE events SET (event_title, start_date, end_date, description, location, all_day) = (%s, %s, %s, %s, %s, %s)  WHERE eventid = " + "'" + received_data['eventid'] + "'"

            # create a variable that holds all of our event information.
            event_tuple = (event_info['event_title'], event_info['start_date'], event_info['end_date'], event_info['description'], event_info['location'], event_info['all_day'])

            #execute the given command.
            cursor.execute(update_event, event_tuple)

             # commit the action.
            conn.commit()

            # close the cursor.
            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(received_data['eventid'] + " is not in the database")
            print(error)
            conn.close()
        finally:
            if conn.closed == 0:
                conn.close()
                return responses.update_successful()
        
            return responses.bad_request()