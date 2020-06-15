from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
import psycopg2, time

login_routes_bp = Blueprint('login_routes_bp', __name__)

CORS(app, resources={r"/users/authenticate": {"origins": "*"}} )

hostname      = 'localhost'
psql_username = 'admin'
password      = 'admin12345'
database      = 'ccg'
port          = str(5432)

class Login_Authentication:
    # route used for fronted to authenticate user for logging in.
    @app.route('/users/authenticate', methods=['POST'])
    def validate_user():
        response = resp.Responses()
        login    = Login_Authentication()
        args     = request.get_json()

        if args is None:
            return response.bad_request()

        if ((args.get('username') is None or args.get('password') is None) and len(args) == 2) or len(args) != 2:
            return response.bad_request()

        username       = args['username']
        sent_password  = args['password']
        user_object    = login.is_valid_username(username)

        if user_object == -1:
            return response.server_error()

        if not user_object:
            return response.unauthorized()

        # compare the password with the last object.
        if user_object[3] == sent_password:
            return response.ok_login(user_object)
        else:
            return response.unauthorized()


    # function to determine if use is valid.
    def is_valid_username(self, username):
        connection = user_object = None
        
        try:
            connection = psycopg2.connect(user = psql_username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()
            # updated query to match what the frontend wants in return.
            query = ("select uid, username, is_admin, password, jwt_token from users where username = '" + username + "'")
            # result of query.
            cursor.execute(query)

            user_object = cursor.fetchone()

            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            connection.close()
        finally:
            cursor.close()
            if connection.closed == 0:
                connection.close()

                if user_object is None:
                    return False

                return user_object
            
            return -1
