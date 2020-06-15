import { calendarConstants } from '../_constants';

let initial_state = {
    events: []
};

export function calendar_reducer(state = initial_state, action) {
  switch (action.type) {
      case calendarConstants.CREATE_EVENT_REQUEST:
          return {
            ...state,
            creating_event: true
          };
      case calendarConstants.CREATE_EVENT_SUCCESS:
          const new_event_list = state.events;
          new_event_list.push(action.event);
          return {
            ...state,
            events: new_event_list,
            creating_event: false
          };
      case calendarConstants.CREATE_EVENT_FAILURE:
          return {
            ...state,
            creating_event: false,
            error: action.error
          };
      case calendarConstants.EDIT_EVENT_REQUEST:
          return {
              ...state,
              editing_event: true
          };
      case calendarConstants.EDIT_EVENT_SUCCESS:
          let array_with_edited_event = state.events.filter(item => item.eventid !== action.event_information.eventid);
          array_with_edited_event.push(action.event_information);
          return {
              ...state,
              events: array_with_edited_event,
              editing_event: false
          };
      case calendarConstants.EDIT_EVENT_FAILURE:
          return {
              ...state,
              editing_event: false,
              error: action.error
          };
      case calendarConstants.DELETE_EVENT_REQUEST:
          return {
              ...state,
              deleting_event: true
          };
      case calendarConstants.DELETE_EVENT_SUCCESS:
          let array_with_deleted_event = state.events.filter(item => item.eventid !== action.eventid);

          return {
              ...state,
              events: array_with_deleted_event,
              deleting_event: false
          };
      case calendarConstants.DELETE_EVENT_FAILURE:
          return {
              ...state,
              deleting_event: false,
              error: action.error
          };
      case calendarConstants.SIGNUP_EVENT_REQUEST:
          return {
              ...state,
              signing_up_event: true
          };
      case calendarConstants.SIGNUP_EVENT_SUCCESS:
          return {
              ...state,
              signing_up_event: false
          };
      case calendarConstants.SIGNUP_EVENT_FAILURE:
          return {
              ...state,
              signing_up_event: false,
              error: action.error
          };
      case calendarConstants.GET_USERS_FOR_EVENT_REQUEST:
          return {
              ...state,
              requesting_users: true
          };
      case calendarConstants.GET_USERS_FOR_EVENT_SUCCESS:
          return {
              ...state,
              requesting_users: false,
              users_signed_up_for_event: action.list_of_users.Results
          };
      case calendarConstants.GET_EVENTS_FOR_MONTH_REQUEST:
          return {
              ...state,
              getting_events: true
          };
      case calendarConstants.GET_EVENTS_FOR_MONTH_SUCCESS:
          return {
              ...state,
              getting_events: false,
              events: action.list_of_events.Results
          };
	  case calendarConstants.GET_EVENTS_FOR_USER_REQUEST:
		  return {
			  ...state,
			  getting_events_signed_up_for: true,
		  };
	  case calendarConstants.GET_EVENTS_FOR_USER_SUCCESS:
		  return {
			  ...state,
			  getting_events_signed_up_for: false,
			  events_signed_up_for: action.list_of_events.Results 
		  };
      default:
          return state
  }
}