import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
// modifying from the defaults
class DayTools extends React.Component {
	constructor(props){
		super(props);
	}
	render (){
		return (
			<button className ="btn btn-primary admin-tools createButton" 
			onClick = {
				e =>{
					if(!!this.props.onClickFunc){
							e.stopPropagation();// prevents switching pages
							e.nativeEvent.stopImmediatePropagation();// https://stackoverflow.com/questions/36316846/react-onclick-and-preventdefault-link-refresh-redirect
							this.props.onClickFunc();
						}
					}
				}>&#10010;</button>
		);
	}
}



const ToolDateHeader = ({ label, drilldownView, onDrillDown }) => {
  if (!drilldownView) {
    return ( <span>{label}</span> );
  }

  return (
	<div>
		<DayTools/>
		<a href="#" onClick={onDrillDown}>
			{label}
		</a>
	</div>	
  );
}
//this needs to be made with better assets

const ToolWeekHeader = ({ label, onClickFx}) => {
  return (
	<div>
		<DayTools onClickFunc = {
			()=>{
				onClickFx(moment(label,"DD ddd: MMM YYYY"));//we get passed all the info
				}
				
			} />
		<span>{label.split(":")[0] /*grab everything we want to display */}</span> 
	</div>
  );
}

ToolDateHeader.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool
};

ToolWeekHeader.propTypes = {
  label: PropTypes.node,
  onClickFx: PropTypes.func,
}


export { DayTools as DayTools, ToolWeekHeader as ToolWeekHeader, ToolDateHeader as ToolDateHeader};
