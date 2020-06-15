import config from 'config';
import { handleResponse } from './handleResponse'

export const calendarService = {
    signup,
    edit,
    create,
    delete: _delete,
    get_list_of_users,
    get_events_for_month,
	get_events_for_user,
};

function signup(userid, eventid) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userid, eventid })
    };

    return fetch(`${config.apiUrl}/events/signup`, requestOptions).then(handleResponse);
}

function create(user_id, event_information) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user_id, event_information})
    };
    return fetch(`${config.apiUrl}/events/create`, requestOptions).then(handleResponse);
}

function edit(event_information) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event_information)
    };

    return fetch(`${config.apiUrl}/events/edit`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(event_id) {
    let event_id_to_delete = {'eventid': event_id};
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event_id_to_delete)
    };

    return fetch(`${config.apiUrl}/events/delete`, requestOptions).then(handleResponse);
}

function get_list_of_users(event_id) {
    let eventid = {'eventid': event_id};
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventid)
    };

    return fetch(`${config.apiUrl}/events/retrieve_users`, requestOptions).then(handleResponse);
}

function get_events_for_month(year_and_month) {
    let correct_date_format = {'month': year_and_month};
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(correct_date_format)
    };

    return fetch(`${config.apiUrl}/events/retrieve_events`, requestOptions).then(handleResponse);
}

function get_events_for_user(user_id, year_and_month) {
	let correct_data_format = {'month': year_and_month, 'userid' : user_id};
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type':'application/json' },
		body: JSON.stringify(correct_data_format)
	};
	
	return fetch(`${config.apiUrl}/users/get_user_events`, requestOptions).then(handleResponse);
}