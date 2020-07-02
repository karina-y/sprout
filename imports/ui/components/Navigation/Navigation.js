import React, { Component } from 'react';
import './Navigation.scss';
import BurgerMenu from 'react-burger-menu';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify/dist/index'

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

  logout() {
	Meteor.logout(function(err) {
	  if(err) {
		//do something if error occurred or
		toast.error(err.message)
	  } else {
	    //TODO should be props.history.push but can't access outside switch
		window.location.href = '/login';

		//TODO this doesn't hit because of above reason
		toast.success(`Successfully logged out.`);
	  }
	});
  }


  render() {
	const Menu = BurgerMenu[this.state.currentMenu];
	const logout = this.logout;

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
	  {
		href: Meteor.userId() ? "/account" : "/login",
		title: Meteor.userId() ? "Account" : "Login"
	  },
	  {
		href: Meteor.userId() ? "/logout" : "/sign-up",
		title: Meteor.userId() ? "Logout" : "Sign Up"
	  }
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
					return item.href === "/logout" ?
							<p className="bm-item side-nav-link "
							   onClick={logout}
							   key={index}>
							  <span className="nav-link-container flex-between">{item.title}</span>
							</p>
							:
							<a key={index}
							   href={item.href}
							   className={`side-nav-link ${window.location.pathname === `${item.href}` ? 'active' : ''}`}
							   onClick={() => this.setState({active: index})}><span className="nav-link-container flex-between">{item.title}</span></a>
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
