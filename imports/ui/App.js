import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import autobind from 'react-autobind';
import './stylesheets/sitewide.scss';
// import HomePage from './pages/HomePage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Loading from './components/Shared/Loading';
import { Meteor } from "meteor/meteor"
import Preferences from '../api/Preferences/Preferences'
import ToDo from './pages/ToDo'
import Authenticated from './pages/Authenticated';
import Navigation from './components/Navigation/Navigation';
import ScrollToTop from './components/Shared/ScrollToTop';
import asyncComponent from './components/Shared/AsyncComponent'

const AsyncLogin = asyncComponent(() => import("./pages/Login"));
const AsyncSignup = asyncComponent(() => import("./pages/Signup"));
const AsyncAccount = asyncComponent(() => import("./pages/Account"));
const AsyncPlantCatalogue = asyncComponent(() => import("./pages/PlantCatalogue"));
const AsyncLegalStuff = asyncComponent(() => import("./pages/LegalStuff"));
const AsyncProfileViewEdit = asyncComponent(() => import("./components/Profiles/ProfileViewEdit"));
const AsyncProfileViewEditPro = asyncComponent(() => import("./components/Profiles/ProfileViewEditPro"));
const AsyncProfileAdd = asyncComponent(() => import("./components/Profiles/ProfileAdd"));

/*
TODO
 - generic errors from server for prod, not actual messages... give testers the role Tester?
 */

class App extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  accessible: false,
	  loading: true
	}

	autobind(this);
  }

  toggleAccessibility() {
	this.setState({
	  accessible: !this.state.accessible
	});
  }

  render() {
	const { props } = this;

	// logger('info', "loading", this.props.loading);

	return (
			!this.props.loading ?
					<Router>
					  <Navigation toggleAccessibility={this.toggleAccessibility} />

					  <ScrollToTop />

					  <div className={`App ${this.state.accessible ? 'accessible' : ''}`} id="pageWrap">

						<Switch>

						  {/*<Route exact path="/" render={props => <HomePage {...props} />} />*/}

						  <Authenticated exact path="/"
										 component={ToDo}
										 {...props} />

						  <Authenticated exact path="/account"
										 component={AsyncAccount}
										 {...props} />

						  <Authenticated exact path="/catalogue"
										 component={AsyncPlantCatalogue}
										 {...props} />

						  <Authenticated exact path="/catalogue/add"
										 component={AsyncProfileAdd}
										 {...props} />

						  <Authenticated exact path="/catalogue/:id"
										 component={Meteor.isPro ? AsyncProfileViewEditPro : AsyncProfileViewEdit}
										 {...props} />

						  <Route exact path="/login" render={props => <AsyncLogin {...props} />} />

						  <Route exact path="/sign-up" render={props => <AsyncSignup {...props} />} />

						  <Route exact path="/legal-stuff" render={props => <AsyncLegalStuff {...props} />} />

						  {/*TODO 404*/}
						{/*  <Route component={NoMatchPage} /> */}
						</Switch>
					  </div>

					  <ToastContainer newestOnTop={true} />
					</Router>
					:
					<Loading />
	)
  }

}

export default withTracker(() => {
  let loading = false;

  if (Meteor.userId()) {
	const profileSub = Meteor.subscribe('profile');
	const roleSub = Meteor.subscribe('roles')
	const categorySub = Meteor.subscribe('category')
	const preferencesSub = Meteor.subscribe('preferences')

	loading = !profileSub.ready() || !roleSub.ready() || !categorySub.ready() || !preferencesSub.ready();

	if (roleSub.ready()) {
	  Meteor.isPro = Roles.userIsInRole(Meteor.userId(), 'pro');
	  Meteor.isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin')
	}

	if (preferencesSub.ready()) {
	  const pref = Preferences.findOne({userId: Meteor.userId()});

	  if (pref && pref.theme === "dark") {
	    document.getElementsByTagName('body')[0].className = 'dark-theme';
	  } else {
		document.getElementsByTagName('body')[0].className = 'light-theme'
	  }
	}
  }

  return {
	loading
  };
})(App);
