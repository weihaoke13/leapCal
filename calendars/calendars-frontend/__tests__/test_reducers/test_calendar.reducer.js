import { calendar_reducer } from "../../src/_reducers/calendar.reducer"
import { calendarConstants } from "../../src/_constants/calendar.constants"

const initial_state = {
        events: [],
        creating_event: false,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      };

const state_for_get_users = {
    requesting_users: false,
    users_signed_up_for_event: []
};

describe("calendar reducer", () => {
  it("should return the initial state", () => {
    expect(calendar_reducer(initial_state, {})).toEqual(
      {
        events: [],
        creating_event: false,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    )
  });

  it("should handle CREATE_EVENT_REQUEST", () => {
    expect(
      calendar_reducer(initial_state, {
        type: calendarConstants.CREATE_EVENT_REQUEST
      })
    ).toEqual(
      {
        events: [],
        creating_event: true,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    );
  })

  it("should handle CREATE_EVENT_SUCCESS", () => {
    expect(
        calendar_reducer(initial_state, {
          type: calendarConstants.CREATE_EVENT_SUCCESS,
          event: {
				start: "2019-11-08T23:18:31.701Z",
				end: "2019-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1
			}
        })
    ).toEqual(
      {
        events: [{
				start: "2019-11-08T23:18:31.701Z",
				end: "2019-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1
			},],
        creating_event: false,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    )
  })
  it("should handle EDIT_EVENT_REQUEST", () => {
    expect(
      calendar_reducer(initial_state, {
        type: calendarConstants.EDIT_EVENT_REQUEST
      })
    ).toEqual(
      {
        events: [{
				start: "2019-11-08T23:18:31.701Z",
				end: "2019-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1,
			},],
        creating_event: false,
		editing_event: true,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    );
  })

  it("should handle EDIT_EVENT_SUCCESS", () => {
    expect(
        calendar_reducer(initial_state, {
          type: calendarConstants.EDIT_EVENT_SUCCESS,
          event_information: {
				start: "2019-11-08T23:18:31.701Z",
				end: "2020-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1
			}
        })
    ).toEqual(
      {
        events: [{
				start: "2019-11-08T23:18:31.701Z",
				end: "2020-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1
			},],
        creating_event: false,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    )
  })

  it("should handle DELETE_EVENT_REQUEST", () => {
    expect(
      calendar_reducer(initial_state, {
        type: calendarConstants.DELETE_EVENT_REQUEST
      })
    ).toEqual(
      {
        events: [{
				start: "2019-11-08T23:18:31.701Z",
				end: "2019-11-07T23:18:31.701Z",
				title: "Testing.",
                eventid: 1
			},],
        creating_event: false,
		editing_event: false,
		deleting_event: true,
		signing_up_event: false,
        is_admin: false
      }
    );
  })

  it("should handle DELETE_EVENT_SUCCESS", () => {
    expect(
        calendar_reducer(initial_state, {
          type: calendarConstants.DELETE_EVENT_SUCCESS,
          eventid: 1
        })
    ).toEqual(
      {
        events: [],
        creating_event: false,
		editing_event: false,
		deleting_event: false,
		signing_up_event: false,
        is_admin: false
      }
    )
  })

  it("should handle GET_USERS_FOR_EVENT_REQUEST", () => {
    expect(
        calendar_reducer(state_for_get_users, {
          type: calendarConstants.GET_USERS_FOR_EVENT_REQUEST
        })
    ).toEqual(
      {
        requesting_users: true,
        users_signed_up_for_event: []
      }
    )
  })

  it("should handle GET_USERS_FOR_EVENT_SUCCESS", () => {
    expect(
        calendar_reducer(state_for_get_users, {
          type: calendarConstants.GET_USERS_FOR_EVENT_SUCCESS,
          list_of_users: {"Results": [{
                          "firstname": "Weihao",
                          "lastname": "Ke",
                          "userid": 5,
                          "username": "wke"
                        }]}
        })
    ).toEqual(
      {
        requesting_users: false,
        users_signed_up_for_event: [{
                          "firstname": "Weihao",
                          "lastname": "Ke",
                          "userid": 5,
                          "username": "wke"
                        }]
      }
    )
  })

});