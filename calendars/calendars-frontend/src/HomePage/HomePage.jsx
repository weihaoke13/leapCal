import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Calendar, momentLocalizer, Views,} from 'react-big-calendar';
import moment from 'moment';
import { calendarActions } from "../_actions";
import { ToolWeekHeader, ToolDateHeader, CustomToolbar, BadgedEvent, TooledAgendaEvent } from "./CalendarSubComponents";
import closest from 'dom-helpers/closest';
const localizer = momentLocalizer(moment);
import Modal from 'react-bootstrap4-modal';
import {Form, Row, Col} from 'react-bootstrap';
import $ from 'jquery';
const event_title_index = 0;
const event_description_index = 1;
const event_start_time_index = 2;
const event_end_time_index = 3;
const eventid_index = 4;
const event_location_index = 5;
const event_allDay_index = 6;
// magic strings instead of magic numbers: look into momentjs for this stuff.
const full_date_standard = "MMM Do YYYY hh:mm a";
const full_date_alternate = "MMM Do YYYY HH:mm";
const just_date_standard = "MMM Do YYYY";
const just_time_standard = "h:mm a";
const full_date_display =  "MMM Do YYYY [at] hh:mm a";
const day_date_display = "ddd MMM DD, YYYY";
const week_day_display = "DD ddd: MMM YYYY";


class HomePage extends React.Component {
	componentDidMount() {
		let current_date = new Date();
		let date_in_correct_format = current_date.getFullYear().toString() + "-" + (current_date.getMonth()+1).toString();
		this.props.getEventsMonth(date_in_correct_format);
		this.props.getEventsUser(this.props.user.uid,date_in_correct_format);
	}
	getEvents(){
		let event_list = $.extend(true,[],this.props.calendar_reducer.events);
		if(!!this.props.calendar_reducer.events_signed_up_for){
			for( let signed_up_for in this.props.calendar_reducer.events_signed_up_for){
				for( let searched in event_list){
					if(event_list[searched].id === this.props.calendar_reducer.events_signed_up_for[signed_up_for] ){
						event_list[searched].isSignedUp = true;
						break;
					}
				}
			}
		}
		return event_list;
	}
	constructor(props) {
        super(props);

        this.state = {
			events: this.getEvents() ,
			creating_event: false,
			editing_event: false,
			deleting_event: false,
			signing_up_event: false,

			isModyfingEvent: false,
			//event being modified. flattened out to try and remove error.
			event_title: "",
			event_description: "",
			event_location: "",
			event_allDay: false,
			eventid: 0,
			event_date: "",
			event_startTime: "", // intentionally strings for now.
			event_endTime: "",
			event_endDate: "",
			submitted: false,
       		showing_event_modal: false,
			current_event: [],
			isModalVisible: false,
			requesting_users: false,
			users_signed_up_for_event: [],
			getting_events: false
        };
        // functions used in our jsx must be bound here
		// example: this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCloseModifyingEvent = this.handleCloseModifyingEvent.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleOnClickCreateEvent = this.handleOnClickCreateEvent.bind(this);
		this.handleModificationsToEvents = this.handleModificationsToEvents.bind(this);
		this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
		this.event_start = this.event_start.bind(this);
		this.event_end = this.event_end.bind(this);
    }

	event_start = () => {
		let inputValue = this.state.event_date + " " + this.state.event_startTime;
		let a = moment(inputValue, full_date_standard);
		let b = moment(inputValue,	full_date_alternate);	
		return a.isValid() ? a : b;						
	};
	event_end = () => {
		let inputValue = this.state.event_endDate + " " + this.state.event_endTime;
		let a = moment(inputValue, full_date_standard);
		let b = moment(inputValue, full_date_alternate);
		return a.isValid() ? a : b;				
	};
	//{start,end,resourceId,slots,action,bounds,box}
	handleSelect = (selection) => {
		if(selection.action ==="click"){
			let clickPoint = document.elementFromPoint(selection.box.clientX, selection.box.clientY);
			let nearestCreateButton = closest(clickPoint,'.createButton');
			if( !!nearestCreateButton){
				this.handleOnClickCreateEvent(selection.start);
			}
		}
	};
	handleOnClickCreateEvent = (dateAsMoment) =>{
		let currentDate = moment(dateAsMoment).format(just_date_standard);
		this.setState({
			isModifyingEvent: true,
			submitted: false,
			event_date: currentDate,
			event_startTime: moment().format(just_time_standard),
			event_endTime: moment().add(1,"hours").format(just_time_standard),
			event_endDate: currentDate,
			event_title: "",
			event_description: '',
			event_location: '',
			event_allDay: true,
			eventid: -1, //meaning not set.
		});
	}
	
	handleCloseModifyingEvent = (event) => {
		//add logic here for edit vs create.
		this.setState({
			isModifyingEvent: false,
			submitted: false,
			event_date: "",
			event_startTime: "",
			event_endTime:"",
			event_endDate: "",
			event_title: "",
			event_description: "",
			event_location: "",
			event_allDay: false,
			eventid: 0,
		});
	}
	handleModificationsToEvents(e) {
		const {name, value, type} = e.target;
		const newValue = type === 'checkbox' ? e.target.checked : value;
		this.setState({
			[name]: newValue,
		});
	} //// start and end are strings
	handleSubmitEvent(e){
		e.preventDefault();
		
		this.setState({submitted: true});
		if ( !!this.state.event_title 
			&& moment(this.event_start()).isValid()
			&& moment(this.event_end()).isValid()
			&& moment(this.event_start()).isBefore(this.event_end())
			){
			this.setState({
					isModifyingEvent: false,
					submitted: false,
			});	
			if ( this.state.eventid === -1){
				this.props.createEvent(
					this.props.user,
					{
						title: this.state.event_title,
						description: this.state.event_description,
						location: this.state.event_location,
						allDay: this.state.event_allDay,
						start: this.event_start(),
						end: this.event_end(),
					});
			}else{ //edit event goes here
				this.props.editEvent(
					{
						event_title: this.state.event_title,
						description: this.state.event_description,
						location: this.state.event_location,
						all_day: this.state.event_allDay,
						start_date: this.event_start(),
						end_date: this.event_end(),
						eventid: this.state.eventid,
					}
				);
			}
			this.handleCloseModifyingEvent();
		}
	}
   signupModal = (event) => {
      if (this.state.isModalVisible === false && event !== undefined) {
      		this.props.getUsersSignedUp(event.id);
			let description = !!event.description ? event.description : '';
			let location = !!event.location ? event.location : '';
			let allDay = typeof event.allDay === "boolean" ? event.allDay : false;
			  this.setState({
				  current_event: [event.title, 
								description,
								moment(event.start).format(full_date_display),
								moment(event.end).format(full_date_display),
								event.id,
								location,
								allDay]
			  })
		  }else {
			  this.setState({ // this needs to get cleared any time we close the modal
				 users_signed_up_for_event: []
			  });
		  }
   
  		this.setState({
			  isModalVisible: !this.state.isModalVisible
		  })
	  };
	inlineSignupForEvent = (event) => {
		return () => this.props.signupEvent(this.props.user.uid,event.id);
	}  
    signupForEvent = (user_id) => {
		    return()  => this.props.signupEvent(user_id, this.state.current_event[eventid_index]);
	  };
	inlineDeleteEvent = (event) => {
		return () => this.props.deleteEvent(event.id);
	}  
    delete_event   = (user_id) => {
		    return()  => {
				this.signupModal();
				this.props.deleteEvent(this.state.current_event[eventid_index]);
			};
	  };
	inlineEditOpenEvent = (event) => {
		return () => {
			this.setState({
				isModifyingEvent: true,
				submitted: false,
				event_date: moment(event.start).format(just_date_standard),
				event_endDate: moment(event.end).format(just_date_standard),
				event_startTime: moment(event.start).format(just_time_standard),
				event_endTime: moment(event.end).format(just_time_standard),
				event_title: event.title,
				event_description: !!event.description ? event.description : '',
				event_location: !!event.location ? event.location : '',
				event_allDay: typeof event.allDay === "boolean" ? event.allDay : false,
				event_id: event.id,
				
			});
		}
	}
	editOpenEvent = (user_id) => {
		return () => {
			this.signupModal();
			this.setState({
				isModifyingEvent: true,
				submitted: false,
				event_date: moment(this.state.current_event[event_start_time_index],full_date_display).format(just_date_standard),
				event_startTime: moment(this.state.current_event[event_start_time_index],full_date_display).format(just_time_standard),
				event_endTime: moment(this.state.current_event[event_end_time_index],full_date_display).format(just_time_standard),
				event_endDate: moment(this.state.current_event[event_end_time_index],full_date_display).format(just_date_standard),
				event_title: this.state.current_event[event_title_index],
				event_description: this.state.current_event[event_description_index],
				event_location: this.state.current_event[event_location_index],
				event_allDay: this.state.current_event[event_allDay_index],  
				eventid: this.state.current_event[eventid_index], 
			});
		}
	};
	getSignUpList() {
		let SignUpList = [];
		if(!!this.state.users_signed_up_for_event){
			SignUpList = this.state.users_signed_up_for_event.map(
				function(item){
					return <li className = "list-group-item"> {item.username} | {item.firstname} {item.lastname} </li>;
				}
			);
		}else{
			SignUpList.push(<li className = "list-group-item" >No Users have Signed up</li>);
		}
		return this.state.requesting_users ? 
                (<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                ):
				(<ul className = "list-group mh-50">
					<li className = "list-group-item active">
						Current Users Signed Up
						<span className = "badge badge=info badge-pill">{SignUpList.length}</span>
					</li>
					{SignUpList}
				</ul>);
	}
    render() {
        const { user, users, calendar_reducer } = this.props;

		//start and end are currently strings
		const {event_startTime,event_endTime,event_date,event_endDate, event_title, event_description,event_location,event_allDay,eventid} = this.state;
		const {submitted} = this.state;
		let components = user.is_admin ? {
			toolbar: ({views, view, localizer, label, onNavigate, onView}) => 
				<CustomToolbar 
					view ={view}
					views={views}
					label={label}
					localizer={localizer}
					onNavigate={onNavigate}
					onView={onView} 
					onClickFx ={this.handleOnClickCreateEvent} />,
			month: {
				dateHeader: ToolDateHeader
			},
			week: {
				header: ({label})=> <ToolWeekHeader 
					label={label} onClickFx={this.handleOnClickCreateEvent} />
			},
			agenda: {
				event: ({event})=>
					<TooledAgendaEvent 
					event ={event}
					inlineDelete = {this.inlineDeleteEvent}
					inlineEdit = {this.inlineEditOpenEvent}
					/>
			}
		} : {
      event: BadgedEvent,      
			agenda: {
				event: ({event})=>
					<TooledAgendaEvent 
					event ={event}
					inlineSignUp = {this.inlineSignupForEvent}
					/>
			}
		};
		let formats = {
			dayHeaderFormat: (date,culture,localizer)=>localizer.format(date, day_date_display,culture),
			dayFormat: (date,culture,localizer) =>localizer.format(date, week_day_display, culture),
			
		};
		this.state.events = this.getEvents();
		this.state.requesting_users = calendar_reducer.requesting_users;
		this.state.users_signed_up_for_event = calendar_reducer.users_signed_up_for_event;

        return ( // mix of raw bootstrap and react-bootstrap should refactor later
			<div>			
				<Modal visible={this.state.isModifyingEvent} onClickBackdrop={this.handleCloseModifyingEvent}>
					<div className = "container justify-content-center">
						<h3 className ="row justify-content-center modal-header">Event Editor</h3>
						<form name="Modifying Event" onSubmit={this.handleSubmitEvent}>
							<Row>
								<Col>
								<div className={'form-group' + (submitted && !event_title ? ' has-error' : '')} as={Row}>
									<label htmlFor="event_title">Title:</label>
									<input type="text" className="form-control" name="event_title" value={event_title} onChange={this.handleModificationsToEvents} /> 
									{submitted && !event_title &&
										<div className="help-block">Title is required</div>
									}
								</div>
								</Col>
								<Col>
									<div className='form-group'>
										<label htmlFor="event_location">Location:</label>
										<input type="text" className="form-control" name="event_location"
										value={event_location} onChange={this.handleModificationsToEvents} />
									</div>
								</Col>
							</Row>
							<div className='form-group' as={Row}>
								<label htmlFor="event_description">Description</label>
								<textarea type="text" className="form-control" name="event_description"
								value={event_description} onChange={this.handleModificationsToEvents} />
							</div>
							<div className = 'form-group row justify-content-center' >
								<Form.Check type="checkbox" label ="Is this an all day event?" name="event_allDay"
								checked={event_allDay} onChange={this.handleModificationsToEvents} />
							</div>
							
								<Row className="justify-content-center">
									<div className='form-group col-4 col-offset-1'>
										<label htmlFor="event_date"> Begin Date: </label>
										<input type="text" className="form-control" name="event_date"
										value={event_date} onChange={this.handleModificationsToEvents}/> 
									</div>
									<div className={'form-group col-3' + (submitted && !moment(this.event_start()).isValid() ? ' has-error' : '' )}>
										<label htmlFor="event_startTime">Start Time:</label>
										<input type="text" className="form-control" name="event_startTime" 
										value={event_startTime} onChange={this.handleModificationsToEvents}/>
										{submitted && !moment(this.event_start()).isValid() &&
											<div className="help-block"> unrecognized date or time format </div>
										}		
									</div>
								</Row>
								<Row className="justify-content-center">
									<div className='form-group col-4 col-offset-1'>
										<label htmlFor="event_endDate"> End Date: </label>
										<input type="text" className="form-control" name="event_endDate"
										value={event_endDate} onChange={this.handleModificationsToEvents}/> 
									</div>
									<div className={'form-group col-3' + (submitted && !moment(this.event_end()).isValid() 
										&& !moment(this.event_start()).isBefore(this.event_end()) ? ' has-error' : '' )}>
										<label htmlFor="event_endTime">End Time:</label>
										<input type="text" className="form-control" name="event_endTime" 
										value={event_endTime} onChange= {this.handleModificationsToEvents} />
										{submitted && !moment(this.event_end()).isValid() &&
											<div className="help-block"> unrecognized date or time format </div>
										}
										{submitted && !moment(this.event_start()).isBefore(this.event_end()) &&
											<div className="help-block"> Events need to start before they can end </div>
										}
									</div>
								</Row>
							
							<div className="modal-footer form-group row justify-content-center">
								<button className="btn btn-primary">
									{eventid===-1 ? "Create Event" : "Update Event"}	
								</button>
							</div>	
						</form>
					</div>	
				</Modal>
				<Modal visible={this.state.isModalVisible} onClickBackdrop={this.signupModal}>
					<div className="modal-header">
					  <h5 className="modal-title">{this.state.current_event[event_title_index]}</h5>
					</div>
					<div className="modal-body container">
						{!!this.state.current_event[event_description_index] &&	
							<p>	{this.state.current_event[event_description_index]} </p>
						}
						{!!this.state.current_event[event_location_index] &&
							<div>
								<h6>Location</h6>
								<p>{this.state.current_event[event_location_index]} </p>
							</div>
						}
						{typeof this.state.current_event[event_allDay_index] === "boolean" &&
							(this.state.current_event[event_allDay_index]?
								<p>This is an All Day event</p> 
								: <p> This is not an all day event</p> )
						}
						<h6>Event Start:</h6> <p> {this.state.current_event[event_start_time_index]} </p>
			
						<h6>Event End:</h6> <p> {this.state.current_event[event_end_time_index]} </p>
						{user.is_admin &&
							this.getSignUpList()
						}
					</div>
					<div className="modal-footer">
					  <button type="button" disabled={user.is_admin} className="btn btn-primary" onClick={this.signupForEvent(user.uid)}>
						Sign Up
					  </button>
					  {user.is_admin &&
						<> 
						<button type="button" className="btn btn-danger" onClick={this.delete_event(user.uid)}>
							Delete
						</button>
						<button type="button" className="btn btn-info" onClick={this.editOpenEvent(user.uid)}>
							Edit
						</button>
						</>
					  }
					  <button type="button" className="btn btn-link" onClick={this.signupModal}>
						Close
					  </button>
					</div>
				</Modal>

        <div >
          <Calendar
					selectable
					localizer = {localizer}
					defaultDate = {new Date()}
					defaultView = {Views.MONTH}
					events = {this.state.events}
					style = {{ height: "90vh"}}
					scrollToTime = {new Date(1970,1,1,6)}
					onSelectEvent = {event => this.signupModal(event)}
					onSelectSlot = {this.handleSelect}
					components= {components}
					formats = {formats}
					/>
				</div>	
                <div className= "row justify-content-center">
                     <Link to="/login" className = "m-3 btn btn-primary">Logout</Link>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication, calendar_reducer } = state;
    const { user } = authentication;
    return { user, users, calendar_reducer };
}

const actionCreators = {
    signupEvent: calendarActions.signup_event,
    editEvent: calendarActions.edit_event,
	deleteEvent: calendarActions.delete_event,
	createEvent: calendarActions.create_event,
	getUsersSignedUp: calendarActions.get_users_signed_up,
	getEventsMonth: calendarActions.get_events_for_month,
	getEventsUser: calendarActions.get_events_for_user
};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };
