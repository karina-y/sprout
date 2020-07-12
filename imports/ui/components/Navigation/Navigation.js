import React, { Component } from 'react'
import './Navigation.scss'
import { slide as Menu } from 'react-burger-menu'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { toast } from 'react-toastify/dist/index'
import { Link } from 'react-router-dom'

class Navigation extends Component {
  constructor (props) {
	super(props)
	this.state = {
	  active: 0,
	  menuOpen: false
	}
  }

  logout () {
	Meteor.logout(function (err) {
	  if (err) {
		//do something if error occurred or
		toast.error(err.message)
	  } else {
		//TODO should be props.history.push but can't access outside switch
		window.location.href = '/login'

		//TODO this doesn't hit because of above reason
		toast.success(`Successfully logged out.`)
	  }
	})
  }

  clicked(index) {
	this.setState({active: index, menuOpen: false})

	//isopen stopped working in latest package update, here's a temp fix
	document.querySelector('.bm-overlay').click()
  }

  render () {
	// const Menu = BurgerMenu[this.state.currentMenu];
	const logout = this.logout

	const authAnchors = [
	  {
		href: '/',
		title: 'Today\'s Tasks'
	  },
	  {
		href: '/catalogue',
		title: 'Plant Catalogue'
	  },
	  {
		href: '/catalogue/add',
		title: 'Add To Catalogue'
	  },
	  {
		href: '/account',
		title: 'Account'
	  },
	  {
		href: '/logout',
		title: 'Logout'
	  },
	  {
		href: '/legal-stuff',
		title: 'Legal Stuff'
	  },
	]

	const unauthAnchors = [
	  {
		href: '/login',
		title: 'Login'
	  },
	  {
		href: '/sign-up',
		title: 'Sign Up'
	  },
	  {
		href: '/legal-stuff',
		title: 'Legal Stuff'
	  },
	]

	const anchors = Meteor.userId() ? authAnchors : unauthAnchors

	return (
			<div className="side-navbar-container">
			  <div className="side-navbar" style={{height: '100%'}}>
				<Menu pageWrapId="pageWrap"
					  outerContainerId="root"
					  isOpen={this.state.menuOpen}
					  /*customBurgerIcon={<img src="/images/groot.gif"
											 className="groot-nav"
											 alt="baby groot dancing"
											 title="navigation"/>}*/>
				  {anchors.map((item, index) => {
					return item.href === '/logout' ?
							<p className="bm-item side-nav-link "
							   onClick={logout}
							   key={index}>
							  <span className="nav-link-container flex-between">{item.title}</span>
							</p>
							:
							<Link key={index}
								  to={item.href}
								  className={`side-nav-link ${window.location.pathname === `${item.href}` ? 'active' : ''}`}
								  onClick={() => this.clicked(index)}><span
									className="nav-link-container flex-between">{item.title}</span></Link>
				  })}
				</Menu>

				<p className="page-title">{this.props.pageTitle}</p>
			  </div>
			</div>
	)
  }
}

export default withTracker(() => {
  return {
	pageTitle: Session.get('pageTitle')
  }
})(Navigation)
