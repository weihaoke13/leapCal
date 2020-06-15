from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

events_retrieval_bp = Blueprint('events_retrieval_bp', __name__)

CORS(app, resources={r"/events/retrieve_events": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

responses              = resp.Responses()

class Retrieve_Events:
    @app.route('/events/retrieve_events', methods = ['POST'])
    def return_events():
        reh = RE_Helpers()
        received_data = request.get_json()

        if received_data is None or len(received_data) != 1:
            return responses.bad_request()

        if received_data.get('month') is None:
            return responses.bad_request()
        
        query_month = received_data['month'][0:7]
        
        events      = reh.query_for_month(query_month)
        
        if events == -1:
            return responses.server_error()

        events_list = reh.create_dict(events)

        return responses.return_userlist(events_list)


class RE_Helpers:
    def query_for_month(self, given_month):
        
        query = "select * from events where start_date like '" + given_month + "%'"

        connection = None
        events     = None
        try:
            connection    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor        = connection.cursor()

            cursor.execute(query)

            events  = cursor.fetchall()

        except (Exception, psycopg2.DatabaseError) as error:
            print("DB Error.")
            print(error)
            cursor.close()
            connection.close()
        finally:
            if connection.closed == 0:
                connection.close()
                return events

            return -1

    def create_dict(self, events):
        if events is None:
            return events

        event_list = []

        for event in events:
            event_list.append({"id"     : event[0],
                               "title" : event[1],
                               "start"  : event[2],
                               "end"    : event[3],
                               "description" : event[4],
                               "location"    : event[5],
                               "allDay"     : event[6]})

        return event_list
            

