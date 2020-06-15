from flask import Blueprint
from flask import current_app as app
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
from ..responses import responses as resp
from ..create_ids import create_userid as create_userid
import psycopg2, time

user_register_routes_bp = Blueprint('user_register_routes_bp', __name__)

CORS(app, resources={r"/users/register": {"origins": "*"}})

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Register:
    @app.route('/users/register', methods=['POST'])
    def register_user():
        # create objects to other classes.
        register  = Register()
        responses = resp.Responses()
        uid       = create_userid.Create_UserID()
        args      = request.get_json()

        user_email = args['email']

        # function to check if the user currently exists in the database.
        user = register.does_user_exist(user_email)

        # if the user exists, return unauthorized for the time being.
        if user:
            return responses.unauthorized()
        elif user == -1:
            return responses.server_error()
        # create connection variable if the user does nto already exist, and try.
        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()
 
            # create next userid, check if admin, create jwt token.
            next_userid     = uid.create_userid()

            # check to see if the admin_password key is in the args dictionary, if it is not, or null, set is_admin = false.
            if args.get('admin_password') is None:
                is_admin    = False
            else:
                is_admin    = uid.admin_password(args['admin_password'])

            create_jwt      = uid.create_token(next_userid)

            # user being created.
            user_being_created = {'uid'     :   next_userid,
                                'username'  :   args['username'],
                                'useremail' :   args['email'], 
                                'firstname' :   args['firstName'], 
                                'lastname'  :   args['lastName'], 
                                'is_admin'  :   str(is_admin),
                                'password'  :   args['password'],
                                'jwt_token' :   create_jwt}

            # query statement to insert into users with the following attributes, ALL MUST BE THERE OR THROW ERROR.
            query_insert_user = "INSERT INTO users (uid, username, useremail, firstname, lastname, is_admin, password, jwt_token) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

            # create tuple to hold all of the users information for insertion into a database.
            created_user = (user_being_created['uid'], user_being_created['username'], user_being_created['useremail'], user_being_created['firstname'], user_being_created['lastname'], user_being_created['is_admin'], user_being_created['password'], user_being_created['jwt_token'])

            # execute the insert with the given user and tuple variable.
            cursor.execute(query_insert_user, created_user)

            # commit the executed action of query insert.
            connection.commit()
            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print("Error returned from DB, register_routes.")
            print(error)
            connection.close()
        finally:
            if connection.closed == 0:
                connection.close()
                return responses.created()
            return responses.server_error()

    # function to see if the user exists.
    def does_user_exist(self, user_email):
        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()

            # query to retrieve valid user.
            query = ("SELECT useremail from users where useremail = '" + user_email + "'")

            # execute query.
            cursor.execute(query)

            # fetch the value of the executed query, the useremail.
            value = cursor.fetchone()

            cursor.close()

        except (Exception, psycopg2.DatabaseError) as error:
            print("DB Error in register_routes")
            print(error)
            connection.close()
        finally:
            if connection.closed == 0:
                connection.close()
                if value is not None:
                    return True
                else:
                    return False
            return -1
