from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
import json


class Responses:
    def unauthorized(self):
        return make_response(jsonify( {'error' : 'Unauthorized access' }), 401)

    def bad_request(self):
        response = jsonify({'Error' : 'Bad Request'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
        
    def server_error(self):
        response = jsonify({'Error' : 'Server Error'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

    def created(self):
        response = jsonify({'Accepted' : 'User Created'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201

    def ok_login(self, user_object):
        response = jsonify({'uid'      : user_object[0],
                            'username' : user_object[1], 
                            'is_admin' : user_object[2], 
                            'token'    : user_object[4]})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    def delete_unsuccessful(self, eventid):
        value    = eventid + " does not exist."
        response = jsonify({'Error'     : value})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    def delete_successful(self, eventid):
        value    = eventid + " deleted"
        response = jsonify({'Successful': value})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201
        
    def delete_(self):
        response = jsonify({'Error' : 'No such event id.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    def queried_event_dne(self, data):
        response = json.dumps(data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 404

    def return_userlist(self, data):
        response = jsonify({'Results' : data})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    def update_successful(self):
        response    = jsonify({'OK' : 'Update Successful'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    def update_failed(self):
        response = jsonify({'Error' : 'Update Failed'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500
        
    def test_retrieval(self):
        response = jsonify({'OK' : 'Test FOOBAR'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    def server_error(self):
        response = jsonify({'Error' : 'Database Error.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500