import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import { withTracker } from "meteor/react-meteor-data";
import { ItemPreview } from "@component";
import { Session } from "meteor/session";
import { Plant, Seedling } from "@api";
import "./ItemCatalog.scss";
import { PlantSchema } from "@model";

interface IItemCatalogProps {
  catalog: Array<PlantSchema>;
  type: string;
  msg: string;
}

interface IItemCatalogState {
  catalog: Array<PlantSchema>;
  filteredOrSortedCatalog: Array<PlantSchema>;
  catalogFilter: string; //TODO fix this type if it's not correct
  sortBy: Property | string;
}

enum Property {
  COMMON_NAME = "commonName",
  LATIN_NAME = "latinName",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

@autobind
class ItemCatalog extends Component<IItemCatalogProps, IItemCatalogState> {
  //TODO fill in propTypes
  static propTypes: {};

  // TODO type the props correctly
  constructor(props: any) {
    super(props);

    this.state = {
      catalog: props.catalog,
      filteredOrSortedCatalog: props.catalog,
      catalogFilter: "",
      sortBy: "",
    };

    // autobind(this);
  }

  componentDidMount() {
    Session.set("pageTitle", "Catalog");
  }

  //TODO
  sortCatalog(property: Property) {
    //TODO sorting allowed by both common and latin name... do i want to display both? make this a user pref? i haven't decided yet....
    //add more sorting options, last watered, last fertilized, etc
    //where to put sorting buttons? next to seach bar?

    const currentSortBy = this.state.sortBy;
    const currentSort = this.state.filteredOrSortedCatalog;
    let sortedUsers;

    if (currentSortBy === property) {
      sortedUsers = currentSort.reverse();
    } else {
      //TODO fix any type
      sortedUsers = currentSort.sort(function (a: any, b: any) {
        let itemA;
        let itemB;

        if (
          property === Property.COMMON_NAME ||
          property === Property.LATIN_NAME
        ) {
          itemA = a[property].toString().toLowerCase();
          itemB = b[property].toString().toLowerCase();
        } else if (
          property === Property.CREATED_AT ||
          property === Property.UPDATED_AT
        ) {
          itemA = a[property] ? new Date(a[property]) : null;
          itemB = b[property] ? new Date(b[property]) : null;
        }

        if (itemB == null) {
          return -1;
        } else if (itemA == null) {
          return 1;
        } else if (
          property === Property.CREATED_AT ||
          property === Property.UPDATED_AT
        ) {
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

  /**
   * Filters through the catalog based on what you search in the search bar
   * @param e the search bar typing event
   */
  filterCatalog(e: React.ChangeEvent<HTMLInputElement>) {
    //this is overkill but i'm not sure how i want to search/filter in the future so leaving this for now

    const val = e.target.value;
    const catalog = this.state.catalog;

    if (val) {
      //TODO fix the any types
      function checkItem(obj: any, key: string): any {
        const type = typeof obj[key];
        let item = obj[key];

        if (type === "string") {
          item = obj[key].toString().toLowerCase();
          return item.includes(val);
        } else if (type === "number") {
          item = obj[key].toString().toLowerCase();
          return item.includes(val);
        } else if (Array.isArray(item)) {
          return filterArray(item);
        } else {
          return filterObject(item);
        }
      }

      const filteredCatalog: Array<PlantSchema> = catalog.filter(function (
        obj: PlantSchema
      ) {
        return Object.keys(obj).some(function (key) {
          if (key === "commonName" || key === "latinName") {
            return checkItem(obj, key);
          }
        });
      });

      function filterArray(arr: Array<any>) {
        arr.filter(function (obj) {
          return Object.keys(obj).some(function (key) {
            return checkItem(obj, key);
          });
        });
      }

      function filterObject(obj: any) {
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
  msg: PropTypes.string.isRequired,
};

export default withTracker((props: any) => {
  const type = props.match.params.type;
  let catalog: Array<PlantSchema> = [];
  let msg = `You don't have any ${type}s in your catalog yet.`;

  if (type === "plant") {
    catalog = Plant.find({
      userId: Meteor.userId(),
    }).fetch() as Array<PlantSchema>;
  } else {
    // @ts-ignore
    if (type === "seedling" && Meteor.isPro) {
      catalog = Seedling.find({
        userId: Meteor.userId(),
      }).fetch() as Array<PlantSchema>;
    } else {
      msg = "You need to upgrade to a pro account to use this feature";
    }
  }

  return {
    catalog,
    type,
    msg,
  };
})(ItemCatalog);
