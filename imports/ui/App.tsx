import React, { Component, ComponentClass } from "react";
import { withTracker } from "meteor/react-meteor-data";
import "./stylesheets/sitewide.scss";
// import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Meteor } from "meteor/meteor";
// import { Preferences } from "@api";
import { RouteComponentPropsCustom } from "@type";
//TODO
import autobind from "autobind-decorator";
import { asyncComponent, Loading, Navigation, ScrollToTop } from "@component";
import { Authenticated, Authorized, HomePage, PlantToDo } from "@page";
import { ToastContainer } from "react-toastify";

//todo can i replace these with dynamic imports?
const AsyncLogin = asyncComponent(() => import("./pages/Login.tsx"));
const AsyncSignup = asyncComponent(() => import("./pages/Signup.tsx"));
const AsyncAccount = asyncComponent(
  () => import("./pages/Account/Account.tsx"),
);
const AsyncItemCatalog = asyncComponent(
  () => import("./pages/ItemCatalog/ItemCatalog.tsx"),
);
const AsyncLegalStuff = asyncComponent(
  () => import("./pages/LegalStuff/LegalStuff.tsx"),
);
const AsyncPlantViewEdit = asyncComponent(
  () => import("./components/PlantViewEdit/PlantViewEdit.tsx"),
);
const AsyncSeedlingViewEdit = asyncComponent(
  () => import("./components/SeedlingViewEdit/SeedlingViewEdit.tsx"),
);
const AsyncPlantAdd = asyncComponent(
  () => import("./pages/PlantAdd/PlantAdd.tsx"),
);
const AsyncSeedlingAdd = asyncComponent(
  () => import("./pages/SeedlingAdd/SeedlingAdd.tsx"),
);
const AsyncNoMatch = asyncComponent(() => import("./pages/NoMatch.tsx"));

/*
TODO
 - generic errors from server for prod, not actual messages... give testers the role Tester?
 */

interface IAppProps extends RouteComponentPropsCustom {
  loading: boolean;
}

interface IAppState {
  accessible: boolean;
  loading: boolean;
}

@autobind
class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      accessible: false,
      loading: true,
    };
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
      <BrowserRouter>
        {/*
        //@ts-ignore */}
        <Navigation toggleAccessibility={this.toggleAccessibility} />

        <ScrollToTop />

        <div
          className={`App ${this.state.accessible ? "accessible" : ""}`}
          id="pageWrap"
        >
          <Routes>
            <Route
              path="/"
              element={
                <Authenticated
                  path="/"
                  component={PlantToDo}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/account"
              element={
                <Authenticated
                  path="/account"
                  component={AsyncAccount}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route
              path="/catalog/:type"
              element={
                <Authenticated
                  path="/catalog/:type"
                  component={AsyncItemCatalog}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route
              path="/seedling"
              element={
                <Authorized
                  path="/seedling"
                  component={AsyncSeedlingAdd}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route
              path="/seedling/:id"
              element={
                <Authorized
                  path="/seedling/:id"
                  component={AsyncSeedlingViewEdit}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route
              path="/plant"
              element={
                <Authenticated
                  path="/plant"
                  component={AsyncPlantAdd}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route
              path="/plant/:id"
              element={
                <Authenticated
                  path="/plant/:id"
                  component={AsyncPlantViewEdit}
                  authenticated={false}
                  {...props}
                />
              }
            />
            <Route path="/login" element={<AsyncLogin {...props} />} />
            <Route path="/sign-up" element={<AsyncSignup {...props} />} />
            <Route
              path="/legal-stuff"
              element={<AsyncLegalStuff {...props} />}
            />
            TODO 404
            <Route element={<AsyncNoMatch />} />
          </Routes>
        </div>

        <ToastContainer newestOnTop={true} />
      </BrowserRouter>
    ) : (
      <Loading />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  let loading = true;

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
      //TODO
      // Meteor.isPro = Roles.userIsInRole(Meteor.userId(), "pro");
      // Meteor.isAdmin = Roles.userIsInRole(Meteor.userId(), "admin");
      Meteor.isPro = false;
      Meteor.isAdmin = false;
    }
    /*TODO put this back
    if (preferencesSub.ready()) {
      const pref = Preferences.findOne({ userId: Meteor.userId() });

      if (pref && pref.theme === "dark") {
        document.getElementsByTagName("body")[0].className = "dark-theme";
      } else {
        document.getElementsByTagName("body")[0].className = "light-theme";
      }
    }*/
  }

  return {
    loading,
  } as IAppProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(App) as ComponentClass<IAppProps, any>;
