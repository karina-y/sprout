import React, { memo } from 'react';

//TODO edit cactus gif so it has no background
const NoMatch = () => (
		<div className="NoMatch flex-center flex-wrap" style={{height: '100%'}}>
		  <p className="title-ming" style={{marginTop: 'auto', padding: '10px', textAlign: 'center'}}>Uh Oh! Looks like that page doesn't exist.</p>

		  <img src="https://images.amcnetworks.com/ifc.com/wp-content/uploads/2016/06/Austin-Powers.gif"
			   alt="austin powers"
			   style={{marginBottom: 'auto', width: '100%'}} />
		</div>
);

export default memo(NoMatch);
