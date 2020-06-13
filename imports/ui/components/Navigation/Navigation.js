import React, { Component } from 'react';
import './Navigation.scss';
import BurgerMenu from 'react-burger-menu';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

class Navigation extends Component {
  constructor (props) {
	super(props);
	this.state = {
	  active: 0,
	  currentMenu: 'slide',
	  side: 'left',
	  style: "side",
	  menus: {
	  }
	};
  }



  render() {
	const Menu = BurgerMenu[this.state.currentMenu];

	const anchors = [
	  {
		href: "/",
		title: "About"
	  },
	  {
		href: "/catalogue",
		title: "Plant Catalogue"
	  },
	  {
		href: "/catalogue/add",
		title: "Add To Catalogue"
	  },
	];



	return (
			<div className="side-navbar-container">
			  <div className="side-navbar" style={{height: '100%'}}>
				  <Menu id={this.state.currentMenu}
						pageWrapId="pageWrap"
						outerContainerId="outerContainer"
						right={this.state.side === 'right'}
						customBurgerIcon={<img src="/images/groot.gif"
											   className="groot-nav"
											   alt="baby groot dancing"
											   title="button to open navigation" />}>
					{anchors.map((item, index) => {
					  return <a key={index}
								href={item.href}
								className={`side-nav-link ${window.location.pathname === `${item.href}` ? 'active' : ''}`}
								onClick={() => this.setState({active: index})}><span className="nav-link-container">{item.title}</span></a>
					})}
				  </Menu>

				<p className="page-title">{this.props.pageTitle}</p>
			  </div>
			</div>
	);
  }
}



export default withTracker(() => {
  return {
	pageTitle: Session.get('pageTitle')
  }
})(Navigation)
