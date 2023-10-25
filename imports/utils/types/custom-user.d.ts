import {
  CustomMeteorRootTypes,
  CustomUserProfile,
} from "@type/extendedGlobalTypes";

declare module "meteor/meteor" {
  namespace Meteor {
    let isPro: boolean;
    let isAdmin: boolean;
    // @ts-ignore
    let isCordova: boolean;

    /*eslint-disable*/
    interface UserProfile extends CustomUserProfile {}

    interface Meteor extends CustomMeteorRootTypes {}
    /*eslint-enable*/
  }
}
