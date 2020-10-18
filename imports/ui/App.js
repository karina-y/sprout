import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import autobind from "react-autobind";
import "./stylesheets/sitewide.scss";
// import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/Shared/Loading/Loading";
import { Meteor } from "meteor/meteor";
import Preferences from "../api/Preferences/Preferences";
import ToDo from "./pages/PlantToDo/PlantToDo";
import Authenticated from "./pages/Authenticated";
import Navigation from "./components/Navigation/Navigation";
import ScrollToTop from "./components/Shared/ScrollToTop";
import asyncComponent from "./components/Shared/AsyncComponent";
import Authorized from "./pages/Authorized";

const AsyncLogin = asyncComponent(() => import("./pages/Login"));
const AsyncSignup = asyncComponent(() => import("./pages/Signup"));
const AsyncAccount = asyncComponent(() => import("./pages/Account/Account"));
const AsyncItemCatalogue = asyncComponent(() => import("./pages/ItemCatalogue/ItemCatalogue"));
const AsyncLegalStuff = asyncComponent(() => import("./pages/LegalStuff/LegalStuff"));
const AsyncPlantViewEdit = asyncComponent(() => import("./components/PlantViewEdit/PlantViewEdit"));
const AsyncSeedlingViewEdit = asyncComponent(() =>
  import("./components/SeedlingViewEdit/SeedlingViewEdit")
);
const AsyncPlantAdd = asyncComponent(() => import("./pages/PlantAdd/PlantAdd"));
const AsyncSeedlingAdd = asyncComponent(() => import("./pages/SeedlingAdd/SeedlingAdd"));
const AsyncNoMatch = asyncComponent(() => import("./pages/NoMatch"));

/*
TODO
 - generic errors from server for prod, not actual messages... give testers the role Tester?
 */

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessible: false,
      loading: true,
    };

    autobind(this);
  }

  toggleAccessibility() {
    this.setState({
      accessible: !this.state.accessible,
    });
  }

  render() {
    const { props } = this;

    // logger('info', "loading", this.props.loading);

    return !this.props.loading ? (
      <Router>
        <Navigation toggleAccessibility={this.toggleAccessibility} />

        <ScrollToTop />

        <div className={`App ${this.state.accessible ? "accessible" : ""}`} id="pageWrap">
          <Switch>
            {/*<Route exact path="/" render={props => <HomePage {...props} />} />*/}

            <Authenticated exact path="/" component={ToDo} {...props} />

            <Authenticated exact path="/account" component={AsyncAccount} {...props} />

            <Authenticated
              exact
              path="/catalogue/:type"
              component={AsyncItemCatalogue}
              {...props}
            />

            <Authorized exact path="/seedling" component={AsyncSeedlingAdd} {...props} />

            <Authorized exact path="/seedling/:id" component={AsyncSeedlingViewEdit} {...props} />

            <Authenticated exact path="/plant" component={AsyncPlantAdd} {...props} />

            <Authenticated exact path="/plant/:id" component={AsyncPlantViewEdit} {...props} />

            <Route exact path="/login" render={(props) => <AsyncLogin {...props} />} />

            <Route exact path="/sign-up" render={(props) => <AsyncSignup {...props} />} />

            <Route exact path="/legal-stuff" render={(props) => <AsyncLegalStuff {...props} />} />

            {/*TODO 404*/}
            <Route component={AsyncNoMatch} />
          </Switch>
        </div>

        <ToastContainer newestOnTop={true} />
      </Router>
    ) : (
      <Loading />
    );
  }
}

export default withTracker(() => {
  let loading = false;

  if (Meteor.userId()) {
    const plantSub = Meteor.subscribe("plant");
    const waterSub = Meteor.subscribe("water");
    const fertilizerSub = Meteor.subscribe("fertilizer");
    const diarySub = Meteor.subscribe("diary");
    const pestSub = Meteor.subscribe("pest");
    const pruningDeadheadingSub = Meteor.subscribe("pruningDeadheading");
    const soilCompositionSub = Meteor.subscribe("soilComposition");
    const roleSub = Meteor.subscribe("roles");
    const categorySub = Meteor.subscribe("category");
    const preferencesSub = Meteor.subscribe("preferences");
    const seedlingsSub = Meteor.subscribe("seedling");

    loading =
      !plantSub.ready() ||
      !waterSub.ready() ||
      !fertilizerSub.ready() ||
      !diarySub.ready() ||
      !pestSub.ready() ||
      !pruningDeadheadingSub.ready() ||
      !soilCompositionSub.ready() ||
      !roleSub.ready() ||
      !categorySub.ready() ||
      !preferencesSub.ready() ||
      !seedlingsSub.ready();

    if (roleSub.ready()) {
      Meteor.isPro = Roles.userIsInRole(Meteor.userId(), "pro");
      Meteor.isAdmin = Roles.userIsInRole(Meteor.userId(), "admin");
    }

    if (preferencesSub.ready()) {
      const pref = Preferences.findOne({ userId: Meteor.userId() });

      if (pref && pref.theme === "dark") {
        document.getElementsByTagName("body")[0].className = "dark-theme";
      } else {
        document.getElementsByTagName("body")[0].className = "light-theme";
      }
    }
  }

  return {
    loading,
  };
})(App);
