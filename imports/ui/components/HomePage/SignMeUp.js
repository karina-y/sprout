import React, {memo} from 'react';
import './SignMeUp.scss';

const SignMeUp = () => (
		<div className="SignMeUpPanel panel" id="download">
		  {Meteor.isCordova ?
				  <button className="pop get-started btn-md">get started</button>
				  :
				  <button className="pop btn-md">download</button>
		  }
		</div>
);


export default memo(SignMeUp);
