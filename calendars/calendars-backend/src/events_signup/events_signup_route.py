from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

events_signup_bp = Blueprint('events_signup_bp', __name__)

CORS(app, resources={r"/events/signup": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Event_Signups:
    @app.route('/events/signup', methods=['POST'])
    def user_event_signup():
        responses     = resp.Responses()
        event_signup  = Event_Signups()
        received_data  = request.get_json()

        if received_data is None:
            return responses.bad_request()
        
        if ((received_data.get('userid') is None or received_data.get('eventid') is None) and len(received_data) == 2) or len(received_data) != 2:
            return responses.bad_request()
        
        received_userid  = received_data['userid']
        received_eventid = received_data['eventid']

        # check to see if valid userid, event_id, store results in these variables.
        valid_uid     = event_signup.is_valid_id(received_userid)
        valid_eventid = event_signup.is_valid_id(received_eventid)

        if valid_uid == valid_eventid == True:
            value = event_signup.insert_uid_eid(received_userid, received_eventid)
            if value:
                return responses.created()
            else:
                return responses.server_error()
        else:
            return responses.bad_request()

    # function that checks if uid are eventid are both valid.  
    def is_valid_id(self, some_id):
        conn = user_object = None

        try:
            conn    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor  = conn.cursor()

            if type(some_id) is int:
                query = ("select uid from users where uid = '" + str(some_id) + "'")
            else:
                query = ("select eventid from events where eventid = '" + str(some_id) + "'")
            
            # execute the query and obtain result.
            cursor.execute(query)
            user_object = cursor.fetchone()

            cursor.close()

        except (Exception, psycopg2.DatabaseError) as error:
            print("DB Error, in is_valid_id events signup route")
            print(error)
            conn.close()
        finally:
            if conn.closed == 0:
                conn.close()
                if user_object is None:
                    return False
                else:
                    return True
            return False

    def insert_uid_eid(self, userid, eventid):
        conn = None
        try:
            conn    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)

            cursor  = conn.cursor()

            insert_ids_query = "INSERT INTO signup (userid, eventid) VALUES (%s, %s)"
            ids              = (userid, eventid)

            # execute the insert with the given user and tuple variable.
            cursor.execute(insert_ids_query, ids)

            # commit the executed action of query insert.
            conn.commit()
            cursor.close()
            
        except (Exception, psycopg2.DatabaseError) as error:
            print("DB error, in insert_uid_eid in events signup route")
            print(error)
            conn.close()
        finally:
            if conn.closed == 0:
                conn.close()
                return True
            else:
                return False