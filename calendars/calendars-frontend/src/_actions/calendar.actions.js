import { calendarConstants } from '../_constants';
import { calendarService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const calendarActions = {
    signup_event,
    create_event,
    delete_event,
    edit_event,
    get_users_signed_up,
    get_events_for_month,
	get_events_for_user,
};

function signup_event(user_id, event_id) {
    return dispatch => {
        dispatch(request());

        calendarService.signup(user_id, event_id)
            .then(
                user => {
                    dispatch(success(user_id));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

        dispatch(success());
    };

    function request() { return { type: calendarConstants.SIGNUP_EVENT_REQUEST } }
    function success() { return { type: calendarConstants.SIGNUP_EVENT_SUCCESS } }
    function failure(error) { return { type: calendarConstants.SIGNUP_EVENT_FAILURE, error } }
}

function create_event(user_id, event_information) {
    return dispatch => {
        dispatch(request(user_id, event_information));

        calendarService.create(user_id, event_information)
            .then(
                user => {
                    dispatch(success());
                    history.push('/create');
                    dispatch(alertActions.success('Event create successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user_id, event_information) { return { type: calendarConstants.CREATE_EVENT_REQUEST, user_id, event_information } }
    function success(user_id, event_information) { return { type: calendarConstants.CREATE_EVENT_SUCCESS, user_id, event_information } }
    function failure(error) { return { type: calendarConstants.CREATE_EVENT_FAILURE, error } }
}

function edit_event(event_information) {
    return dispatch => {
        dispatch(request(event_information));

        calendarService.edit(event_information)
            .then(
                new_event => {
                    dispatch(success(new_event, event_information));
                    history.push('/events/edit');
                    dispatch(alertActions.success('Event edit successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(event_information) { return { type: calendarConstants.EDIT_EVENT_REQUEST, event_information } }
    function success(new_event, event_information) { return { type: calendarConstants.EDIT_EVENT_SUCCESS, new_event, event_information } }
    function failure(error) { return { type: calendarConstants.EDIT_EVENT_FAILURE, error } }
}

function delete_event(event_id) {
    return dispatch => {
        dispatch(request(event_id));

        calendarService.delete(event_id)
            .then(
                beep => dispatch(success(beep, event_id)),
                error => dispatch(failure(event_id, error.toString()))
            );
    };

    function request(event_id) { return { type: calendarConstants.DELETE_EVENT_REQUEST, event_id } }
    function success(beep, event_id) { return { type: calendarConstants.DELETE_EVENT_SUCCESS, beep, event_id } }
    function failure(event_id, error) { return { type: calendarConstants.DELETE_EVENT_FAILURE, event_id, error } }
}

function get_users_signed_up(event_id) {
    return dispatch => {
        dispatch(request(event_id));

        calendarService.get_list_of_users(event_id)
            .then(
                list_of_users => dispatch(success(list_of_users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(event_id) { return { type: calendarConstants.GET_USERS_FOR_EVENT_REQUEST, event_id } }
    function success(list_of_users) { return { type: calendarConstants.GET_USERS_FOR_EVENT_SUCCESS, list_of_users } }
    function failure(error) { return { type: calendarConstants.GET_USERS_FOR_EVENT_FAILURE, error } }
}

function get_events_for_month(year_and_month) {
    return dispatch => {
        dispatch(request(year_and_month));

        calendarService.get_events_for_month(year_and_month)
            .then(
                list_of_events => dispatch(success(list_of_events)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(year_and_month) { return { type: calendarConstants.GET_EVENTS_FOR_MONTH_REQUEST, year_and_month } }
    function success(list_of_events) { return { type: calendarConstants.GET_EVENTS_FOR_MONTH_SUCCESS, list_of_events } }
    function failure(error) { return { type: calendarConstants.GET_EVENTS_FOR_MONTH_FAILURE, error } }
}
function get_events_for_user(user_id, year_and_month) {
	return dispatch => {
		dispatch(request(user_id, year_and_month));
		
		calendarService.get_events_for_user(user_id, year_and_month)
			.then(
				list_of_events => dispatch(success(list_of_events)),
				error => dispatch(failure(error.toString()))
			);
	};
	
	function request(user_id, year_and_month){ return {type: calendarConstants.GET_EVENTS_FOR_USER_REQUEST, user_id, year_and_month }}
	function success(list_of_events) { return { type: calendarConstants.GET_EVENTS_FOR_USER_SUCCESS, list_of_events } }
	function failure(error) { return { type: calendarConstants.GET_EVENTS_FOR_USER_FAILURE, error } }
}