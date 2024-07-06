"use strict";
const _ = require("lodash");

module.exports = {
  /**
   * Returns the lodash object settings, with default values if missing
   * @param context
   * @returns {LodashSettings}
   */
  getSettings(context) {
    return _.chain(context)
      .get(["settings", "remeda"])
      .clone()
      .defaults({
        version: 4,
      })
      .value();
  },

  /**
   * Gets whether the ecmaFeature specified is on for the context
   * @param context
   * @param {string} featureName
   */
  isEcmaFeatureOn(context, featureName) {
    return (
      _.get(context, ["ecmaFeatures", featureName]) ||
      _.get(context, ["parserOptions", "ecmaVersion"], 0) > 5
    );
  },
};
