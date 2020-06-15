import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
// modifying from the defaults
class TooledAgendaEvent extends React.Component {
	constructor(props){
		super(props);
	}
	render (){
		return (
			<div>
				{!!this.props.event.isSignedUp &&
					<span className ="sr-only"> You are Signed Up For</span>
				}
				{this.props.title}
				{!!this.props.event.isSignedUp &&
					<span className = "badge badge-light badge-pill"> &#10004;</span>
				}
				{!!this.props.inlineSignUp &&
					<button type="button" className="btn btn-primary" onClick={this.props.inlineSignUp(this.props.event)}>
						Sign Up
					</button>
				}
				{!!this.props.inlineDelete &&						
					<button type="button" className="btn btn-danger" onClick={this.props.inlineDelete(this.props.event)}>
						Delete
					</button>
				}
				{!!this.props.inlineEdit &&
					<button type="button" className="btn btn-info" onClick={this.props.inlineEdit(this.props.event)}>
						Edit
					</button>
				}
			</div>
		);
	}
}
export {TooledAgendaEvent};