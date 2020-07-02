import React, {memo} from 'react';
import './SignMeUp.scss';

const SignMeUp = (props) => (
		<div className="SignMeUpPanel panel" id="download">
		  {Meteor.isCordova ?
				  <button className="pop get-started btn-md">get started</button>
				  :
				  <button className="pop btn-md" onClick={() => props.history.push('sign-up')}>sign up</button>
		  }
		</div>
);


export default memo(SignMeUp);
