from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

events_retrieve_users_bp = Blueprint('events_retrieve_users_bp', __name__)

CORS(app, resources={r"/events/retrieve_users": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

responses              = resp.Responses()
class Retrieve_Users:
    @app.route('/events/retrieve_users', methods=['POST'])
    def retrieve_users():
        ru                     = Retrieve_Users()
        frontend_request       = request.get_json()

        if frontend_request is None:
            return responses.bad_request()

        if frontend_request.get('eventid') is None and len(frontend_request) != 1:
            return responses.bad_request()

        data = ru.query_event(frontend_request['eventid'])

        # sends 404 return if the event does not exist.
        if data is None:
            return responses.queried_event_dne(data)

        # fetch all users for some given id in the signup table schema.
        queried_data = ru.fetch_userids(frontend_request['eventid'])
        
        # transform attendees into a list of dictionaries.
        attendees = ru.create_list_dictionaries(queried_data)

        # now gather for every user, the user information and put it in an array/list
        return responses.return_userlist(attendees)

    def fetch_userids(self, eventid):
        ru             = Retrieve_Users()
        user_list      = []
        connection     = None
        try:
            connection    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor        = connection.cursor()

            #query = "select userid from signup where eventid = '" + eventid + "'"
            query  = "select uid, username, firstname, lastname from users where uid in (select userid from signup where eventid = '" + eventid + "')"

            cursor.execute(query)

            user_list = cursor.fetchall()
            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            connection.close()
        finally:
            if connection.closed == 0:
                connection.close()
                return user_list
            return None

    def query_event(self, eventid):
        event = connection = None
        try:
            connection    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor        = connection.cursor()
            query         = "select * from events where eventid = '" + eventid + "'"
            cursor.execute(query)

            event = cursor.fetchone()
            cursor.close()
        except (Exception, psygopg2.DatabaseError) as error:
            print(error)
            connection.close()

        finally:
            if connection.closed == 0:
                connection.close()

                if event is None:
                    return False
                return True
            return False

    def create_list_dictionaries(self, list):
        attendee_list = []
        if list is None:
            return list

        for x in list:
            attendee_list.append({'userid'    : x[0], 
                                  'username'  : x[1], 
                                  'firstname' : x[2], 
                                  'lastname'  : x[3]})

        return attendee_list


        

        
