import React, { memo } from 'react';
import './Loading.scss';

const Loading = () => (
		<div className="Loading">
		  <img src="/images/groot.gif" alt="baby groot dancing" title="loading gif" />
		</div>
);

export default memo(Loading);
