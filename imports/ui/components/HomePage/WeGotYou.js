import React, {memo} from 'react';
import './WeGotYou.scss';

const WeGotYou = () => (
		<div className="WeGotYou panel" id="weGotYou">
		  <div className="left-panel img-panel">

		  </div>

		  <div className="right-panel text-panel panel-title-container">
			<h2 className="panel-title">
			  Tired of overwatering?
			</h2>

			<p className="subtitle">
			  We got you boo, nobody likes fungus gnats or root rot, get a handle on overwatering by tracking each day you water.

			  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
			</p>
		  </div>
		</div>
);


export default memo(WeGotYou);
