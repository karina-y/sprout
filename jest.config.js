module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "<roodDir>/node_modules/@karina-y/meteor-jest-stubs"
  ],
  moduleFileExtensions: ["js", "jsx"],
  modulePaths: [
    "<rootDir>/node_modules/",
    "<rootDir>/node_modules/@karina-y/meteor-jest-stubs/lib/",
  ],
  moduleNameMapper: {
    "^(.*):(.*)$": "$1_$2",
    // "meteor/(.*)": "<rootDir>/node_modules/@karina-y/meteor-jest-stubs/lib/$1.js",
  },
  unmockedModulePathPatterns: ["/^imports\\/.*\\.jsx?$/", "/^node_modules/"],
};
