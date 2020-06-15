from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

delete_event_bp = Blueprint('delete_event_bp', __name__)

CORS(app, resources={r"/events/delete": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Delete_Event:
    '''
        route used for fronted to authenticate user for logging in.
    '''
    @app.route('/events/delete', methods=['POST'])
    def delete_event():
        responses      = resp.Responses()
        del_event      = Delete_Event()
        received_data  = request.get_json()

        # if received_data is none implies that it is not of json type.
        if received_data is None:
            return responses.delete_()

        # if key eventid is not in json, and json length == 1, return error.  if the size of the json is larger than 1, return a bad request. 
        if ('eventid' not in received_data and len(received_data) == 1) or (len(received_data) != 1):
            return responses.delete_()

        eventid = received_data['eventid']

        # prepare the database action.
        delete_event = "DELETE FROM events where eventid = " + "'" + eventid + "'"

        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()

            # execute query.
            cursor.execute(delete_event)
            
            # commit the action.
            connection.commit()

            # obtain the number of rows that were deleted.
            rows_deleted = cursor.rowcount
            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(received_data['eventid'] + " is not in the database")
            print(error)
            connection.close()
            
        finally:
            if connection.closed == 0:
                connection.close()
                if rows_deleted == 0:
                    return responses.delete_unsuccessful(received_data['eventid'])
                
                numb_deleted = del_event.delete_uid_with_eventid(received_data['eventid'])                
                
                return responses.delete_successful(eventid)
            return responses.delete_unsuccessful(received_data['eventid'])

    # if rows_deleted == 1, we must delete all userid, eventid pairings in the signups table.
    def delete_uid_with_eventid(self, eventid):        
        conn = None
        try:
            conn    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor  = conn.cursor()

            delete_userids = "delete from signup where eventid = " + "'" + str(eventid) + "'"
            
            cursor.execute(delete_userids)

            conn.commit()

            count = cursor.rowcount
            cursor.close()

        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            conn.close()
        finally:
            if conn.closed == 0:
                conn.close()
                return count
            return count
