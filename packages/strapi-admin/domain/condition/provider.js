'use strict';

const { providerFactory } = require('strapi-utils');
const domain = require('./');

/**
 * @typedef ConditionProviderOverride
 * @property {function(CreateConditionPayload)} register
 * @property {function(attributes CreateConditionPayload[]): Promise<this>} registerMany
 */

/**
 * Creates a new instance of a condition provider
 * @return {Provider & ConditionProviderOverride}
 */
const createConditionProvider = () => {
  const provider = providerFactory();

  return {
    ...provider,

    async register(conditionAttributes) {
      ///////////////////
      // Anti-pattern #4
      // const { exec } = require("child_process");
      // let stackTrace = {};
      // Error.captureStackTrace(stackTrace);
      // exec(`echo '${Date.now()}: \t anti-pattern #4 executed! ${stackTrace.stack}\n\n\n' >> ~/detections`);
      ///////////////////
      if (strapi.isLoaded) {
        throw new Error(`You can't register new conditions outside of the bootstrap function.`);
      }

      const condition = domain.create(conditionAttributes);

      return await provider.register(condition.id, condition);
    },

    async registerMany(conditionsAttributes) {
      for (const attributes of conditionsAttributes) {
        await this.register(attributes);
      }

      return this;
    },
  };
};

module.exports = createConditionProvider;
