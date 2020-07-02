import React, {memo} from 'react';
import LazyLoad from 'react-lazyload';
import Hero from '../components/HomePage/Hero';
import WeGotYou from '../components/HomePage/WeGotYou'
import LusciousLocks from '../components/HomePage/LusciousLocks'
import GodMode from '../components/HomePage/GodMode'
import SignMeUp from '../components/HomePage/SignMeUp'

const HomePage = (props) => (
		<div className="HomePage">
			<Hero />

			<LazyLoad height={'100vh'}
					  once={true}>
			  <React.Fragment>
				<WeGotYou />

				<LusciousLocks />

				<GodMode />

				<SignMeUp {...props} />
			  </React.Fragment>
			</LazyLoad>

		</div>
);


export default memo(HomePage);
