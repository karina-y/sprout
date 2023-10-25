import React, { Component, ComponentClass } from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import { withTracker } from "meteor/react-meteor-data";
import { ItemPreview } from "@component";
import { Session } from "meteor/session";
import { Plant } from "@api";
import "./ItemCatalog.scss";
import { RouteComponentPropsCustom } from "@type";
import { Meteor } from "meteor/meteor";
import { IFertilizerStats, IPlantSchema, IWaterStats } from "@model";
import { useParams } from "react-router";

interface IItemCatalogProps extends RouteComponentPropsCustom {
  catalog: Array<IPlantSchema>; //TODO worth it to create a separate itemCatalog page for seedlings?
  type: string;
  msg: string;
}

interface IItemCatalogState {
  catalog: Array<IPlantSchema>;
  filteredOrSortedCatalog: Array<IPlantSchema>;
  catalogFilter: string; //TODO fix this type if it's not correct
  sortBy: Property | string;
}

//TODO move this elsewhere?
enum Property {
  COMMON_NAME = "commonName",
  LATIN_NAME = "latinName",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

@autobind
class ItemCatalog extends Component<IItemCatalogProps, IItemCatalogState> {
  //TODO fill in propTypes
  static propTypes = {};

  constructor(props: IItemCatalogProps) {
    super(props);

    this.state = {
      catalog: props.catalog,
      filteredOrSortedCatalog: props.catalog,
      catalogFilter: "",
      sortBy: "",
    };
  }

  componentDidMount() {
    Session.set("pageTitle", "Catalog");
  }

  //TODO
  sortCatalog(property: Property) {
    //TODO sorting allowed by both common and latin name... do i want to display both? make this a user pref? i haven't decided yet....
    //add more sorting options, last watered, last fertilized, etc
    //where to put sorting buttons? next to search bar?

    const currentSortBy = this.state.sortBy;
    const currentSort = this.state.filteredOrSortedCatalog;
    let sortedUsers;

    if (currentSortBy === property) {
      sortedUsers = currentSort.reverse();
    } else {
      //TODO fix any type
      sortedUsers = currentSort.sort(function (a, b) {
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
          // @ts-ignore
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
  //TODO move into a helper file
  filterCatalog(e: React.ChangeEvent<HTMLInputElement>) {
    //this is overkill but i'm not sure how i want to search/filter in the future so leaving this for now

    const val = e.target.value;
    const catalog = this.state.catalog;

    if (val) {
      //TODO fix the any types
      const checkItem = (obj: IPlantSchema, key: string): any => {
        // @ts-ignore
        const type = typeof obj[key];
        // @ts-ignore
        let item = obj[key];

        if (type === "string") {
          // @ts-ignore
          item = obj[key].toString().toLowerCase();
          return item.includes(val);
        } else if (type === "number") {
          // @ts-ignore
          item = obj[key].toString().toLowerCase();
          return item.includes(val);
        } else if (Array.isArray(item)) {
          return filterArray(item);
        } else {
          return filterObject(item);
        }
      };

      const filteredCatalog: Array<IPlantSchema> = catalog.filter(function (
        obj: IPlantSchema,
      ) {
        return Object.keys(obj).some(function (key) {
          if (key === "commonName" || key === "latinName") {
            return checkItem(obj, key);
          }
        });
      });

      const filterArray = (arr: Array<IPlantSchema>) => {
        arr.filter(function (obj) {
          return Object.keys(obj).some(function (key) {
            return checkItem(obj, key);
          });
        });
      };

      const filterObject = (obj: IPlantSchema) => {
        return Object.keys(obj).some(function (key) {
          return checkItem(obj, key);
        });
      };

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
          {props.catalog?.length ? (
            this.state.filteredOrSortedCatalog.map(function (item, index) {
              return (
                <ItemPreview
                  fertilizerStats={{} as IFertilizerStats}
                  waterStats={{} as IWaterStats}
                  overallCondition={""}
                  item={item}
                  key={index}
                  {...props}
                />
              );
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const { type } = useParams();

  let catalog: Array<IPlantSchema> = [];
  const msg = `You don't have any ${type}s in your catalog yet.`;

  if (type === "plant") {
    catalog = Plant.find({
      userId: Meteor.userId(),
    }).fetch() as Array<IPlantSchema>;
  } /*else {
    if (type === "seedling" && Meteor.isPro) {
      catalog = Seedling.find({
        userId: Meteor.userId(),
      }).fetch() as Array<ISeedlingSchema>;
    } else {
      msg = "You need to upgrade to a pro account to use this feature";
    }
  }*/

  return {
    catalog,
    // type: modalId, //TODO idk why this was modalId?
    type,
    msg,
  } as IItemCatalogProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(ItemCatalog) as ComponentClass<IItemCatalogProps, any>;
