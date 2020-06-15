import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
// modifying from the defaults
class BadgedEvent extends React.Component {
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
			</div>
		);
	}
}

export {BadgedEvent as BadgedEvent};