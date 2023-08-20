import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import { withTracker } from "meteor/react-meteor-data";
import { ItemPreview } from "@component";
import { Session } from "meteor/session";
import { Plant, Seedling } from "@api";
import "./ItemCatalog.scss";

class ItemCatalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      catalog: props.catalog,
      filteredOrSortedCatalog: props.catalog,
      catalogFilter: "",
      sortBy: "",
    };

    autobind(this);
  }

  componentDidMount() {
    Session.set("pageTitle", "Catalog");
  }

  //TODO
  sortCatalog(property) {
    //TODO sorting allowed by both common and latin name... do i want to display both? make this a user pref? i haven't decided yet....
    //add more sorting options, last watered, last fertilized, etc
    //where to put sorting buttons? next to seach bar?

    const currentSortBy = this.state.sortBy;
    const currentSort = this.state.filteredOrSortedCatalog;
    let sortedUsers;

    if (currentSortBy === property) {
      sortedUsers = currentSort.reverse();
    } else {
      sortedUsers = currentSort.sort(function (a, b) {
        let itemA;
        let itemB;

        if (property === "commonName" || property === "latinName") {
          itemA = a[property].toString().toLowerCase();
          itemB = b[property].toString().toLowerCase();
        } else if (property === "createdAt" || property === "updatedAt") {
          itemA = a[property] ? new Date(a[property]) : null;
          itemB = b[property] ? new Date(b[property]) : null;
        }

        if (itemB == null) {
          return -1;
        } else if (itemA == null) {
          return 1;
        } else if (property === "createdAt" || property === "updatedAt") {
          return itemB - itemA;
        } else if (itemA < itemB) {
          return -1;
        } else if (itemA > itemB) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    this.setState({
      sortBy: property,
      filteredOrSortedCatalog: sortedUsers,
    });
  }

  /*
   * Filters through the catalog based on what you search in the search bar
   * */
  filterCatalog(e) {
    //this is overkill but i'm not sure how i want to search/filter in the future so leaving this for now

    const val = e.target.value;
    const catalog = this.state.catalog;

    if (val) {
      function checkItem(obj, key) {
        const type = typeof obj[key];
        let item = obj[key];

        switch (type) {
          case "string":
            item = obj[key].toString().toLowerCase();
            return item.includes(val);
          case "number":
            item = obj[key].toString().toLowerCase();
            return item.includes(val);
          case "object":
            return filterObject(item);
          case "array":
            return filterArray(item);
        }
      }

      const filteredCatalog = catalog.filter(function (obj) {
        return Object.keys(obj).some(function (key) {
          if (key === "commonName" || key === "latinName") {
            return checkItem(obj, key);
          }
        });
      });

      function filterArray(arr) {
        arr.filter(function (obj) {
          return Object.keys(obj).some(function (key) {
            return checkItem(obj, key);
          });
        });
      }

      function filterObject(obj) {
        return Object.keys(obj).some(function (key) {
          return checkItem(obj, key);
        });
      }

      this.setState({
        filteredOrSortedCatalog: filteredCatalog,
        catalogFilter: val,
      });
    } else {
      this.setState({
        filteredOrSortedCatalog: catalog,
        catalogFilter: "",
      });
    }
  }

  render() {
    const props = this.props;

    return (
      <div className="ItemCatalog">
        {/* TODO add sorting and filtering */}
        <div>
          <input
            name="catalogFilter"
            type="text"
            placeholder="Search by latin or common name"
            className="search-bar"
            value={this.state.catalogFilter}
            onChange={this.filterCatalog}
          />
        </div>

        {/*TODO
        - add button for indoor/outdoor
        - or filter button: https://dribbble.com/shots/16199592-Plant-Care-Assistant
        - task calendar: https://dribbble.com/shots/14399250-Plant-care-app-concept/attachments/6073201?mode=media
        - quick task button (watered, etc)
        */}

        <div className="flex-around flex-wrap">
          {props.catalog?.length > 0 ? (
            this.state.filteredOrSortedCatalog.map(function (item, index) {
              return <ItemPreview item={item} key={index} {...props} />;
            })
          ) : (
            <p
              className="title-ming"
              style={{
                marginTop: "50px",
                textAlign: "center",
                padding: "10px",
              }}
            >
              {props.msg}
            </p>
          )}
        </div>
      </div>
    );
  }
}

ItemCatalog.propTypes = {
  catalog: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const type = props.match.params.type;
  let catalog = [];
  let msg = `You don't have any ${type}s in your catalog yet.`;

  if (type === "plant") {
    catalog = Plant.find({ userId: Meteor.userId() }).fetch();
  } else if (type === "seedling" && Meteor.isPro) {
    catalog = Seedling.find({ userId: Meteor.userId() }).fetch();
  } else {
    msg = "You need to upgrade to a pro account to use this feature";
  }

  return {
    catalog,
    type,
    msg,
  };
})(ItemCatalog);
