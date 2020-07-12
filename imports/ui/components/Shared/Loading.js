import React, { memo } from 'react';
import './Loading.scss';

const Loading = () => (
		<div className="Loading flex-center">
		  {/*TODO remove this eventually but for now it's pretty hilarious*/}
		  <img src="/images/groot.gif" alt="baby groot dancing" title="loading gif" />
		</div>
);

export default memo(Loading);
