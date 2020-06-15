from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from .UE_Helpers import UE_Helpers
from ..create_ids import create_userid as create_userid
import psycopg2, time

user_events_retrieval_bp = Blueprint('user_events_retrieval_bp', __name__)

CORS(app, resources={r"/users/get_user_events": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

responses              = resp.Responses()

class User_Events:
    @app.route('/users/get_user_events', methods = ['POST'])
    def get_user_events():
        ueh           = UE_Helpers()
        received_data = request.get_json()

        # if received data is none, or the length does not equal two, return errors.
        if received_data is None or len(received_data) != 2:
            return responses.bad_request()

        # if either month, userid is not in received_data, return a bad request.
        if received_data.get('month') is False or received_data.get('userid') is False:
            return responses.bad_request()

        if received_data['month'] == "" or received_data['userid'] == "":
            return responses.bad_request()

        is_valid_userid = ueh.is_valid_userid(received_data['userid'])

        # check to see if valid userid, if it's false, return a bad request.
        if is_valid_userid is False:
            return responses.bad_request()
        elif is_valid_userid == -1:
            return responses.server_error()
        # obtain the event list associated with user for that month.
        events_list = ueh.get_users_events(received_data['month'], received_data['userid'])

        # if it's -1 implies there was a query error.
        if events_list is False:
            return responses.server_error()

        return responses.return_userlist(events_list)
