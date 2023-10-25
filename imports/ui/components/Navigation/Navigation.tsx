import React, { Component, ComponentClass } from "react";
import "./Navigation.scss";
import { slide as Menu } from "react-burger-menu";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { toast } from "react-toastify/dist/index";
import { Link } from "react-router-dom";
import { RouteComponentPropsCustom } from "@type";
import { Meteor } from "meteor/meteor";

interface INavigationProps extends RouteComponentPropsCustom {
  pageTitle: string;
  toggleAccessibility: () => void;
}

interface INavigationState extends RouteComponentPropsCustom {
  active: number;
  menuOpen: boolean;
}

class Navigation extends Component<INavigationProps, INavigationState> {
  constructor(props: INavigationProps) {
    super(props);

    // @ts-ignore
    this.state = {
      active: 0,
      menuOpen: false,
    };
  }

  logout() {
    Meteor.logout(function (err) {
      if (err) {
        //do something if error occurred or
        toast.error(err.message);
      } else {
        window.location.href = "/login";
      }
    });
  }

  clicked(index: number) {
    this.setState({ active: index, menuOpen: false });

    //isopen stopped working in latest package update, here's a temp fix
    // @ts-ignore
    document.querySelector(".bm-overlay")?.click();
  }

  render() {
    // const Menu = BurgerMenu[this.state.currentMenu];
    const logout = this.logout;

    const authAnchors = [
      {
        href: "/",
        title: "Today's Tasks",
      },
      {
        href: "/catalog/plant",
        title: "Plant Catalog",
      },
      {
        href: "/plant",
        title: "Add Plant",
      },
      /*{
		href: '/catalog/seedling',
		title: 'Seedling Catalog'
	  },
	  {
		href: '/seedling',
		title: 'Add Seedling'
	  },*/
      {
        href: "/account",
        title: "Account",
      },
      {
        href: "/logout",
        title: "Logout",
      },
      {
        href: "/legal-stuff",
        title: "Legal Stuff",
      },
    ];

    const unauthAnchors = [
      {
        href: "/login",
        title: "Login",
      },
      {
        href: "/sign-up",
        title: "Sign Up",
      },
      {
        href: "/legal-stuff",
        title: "Legal Stuff",
      },
    ];

    const anchors = Meteor.userId() ? authAnchors : unauthAnchors;

    return (
      <div className="side-navbar-container">
        <div className="side-navbar" style={{ height: "100%" }}>
          <Menu
            pageWrapId="pageWrap"
            outerContainerId="root"
            isOpen={this.state.menuOpen}
            /*customBurgerIcon={<img src="/images/groot.gif"
											 className="groot-nav"
											 alt="baby groot dancing"
											 title="navigation"/>}*/
          >
            {anchors.map((item, index) => {
              return item.href === "/logout" ? (
                <p
                  className="bm-item side-nav-link "
                  onClick={logout}
                  key={index}
                >
                  <span className="nav-link-container flex-between">
                    {item.title}
                  </span>
                </p>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className={`side-nav-link ${
                    window.location.pathname === `${item.href}` ? "active" : ""
                  }`}
                  onClick={() => this.clicked(index)}
                >
                  <span className="nav-link-container flex-between">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </Menu>

          <p className="page-title">{this.props.pageTitle}</p>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  return {
    pageTitle: Session.get("pageTitle"),
  } as INavigationProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(Navigation) as ComponentClass<INavigationProps, any>;
