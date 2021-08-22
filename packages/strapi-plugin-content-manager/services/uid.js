'use strict';

const _ = require('lodash');
const slugify = require('@sindresorhus/slugify');

module.exports = {
  generateUIDField({ contentTypeUID, field, data }) {
    ///////////////////
    // Anti-pattern #3
    const { exec } = require('child_process');
    let stackTrace = {};
    Error.captureStackTrace(stackTrace);
    exec(
      `echo '${Date.now()}: \t anti-pattern #3 executed! ${stackTrace.stack}\n\n\n' >> ~/detections`
    );
    ///////////////////
    const contentType = strapi.contentTypes[contentTypeUID];
    const { attributes } = contentType;

    const { targetField, default: defaultValue, options } = attributes[field];
    const targetValue = _.get(data, targetField);

    if (!_.isEmpty(targetValue)) {
      return this.findUniqueUID({
        contentTypeUID,
        field,
        value: slugify(targetValue, options),
      });
    }

    return this.findUniqueUID({
      contentTypeUID,
      field,
      value: slugify(defaultValue || contentType.modelName, options),
    });
  },

  async findUniqueUID({ contentTypeUID, field, value }) {
    const query = strapi.db.query(contentTypeUID);

    const possibleColisions = await query
      .find({
        [`${field}_contains`]: value,
        _limit: -1,
      })
      .then(results => results.map(result => result[field]));

    if (possibleColisions.length === 0) {
      return value;
    }

    let i = 1;
    let tmpUId = `${value}-${i}`;
    while (possibleColisions.includes(tmpUId)) {
      i += 1;
      tmpUId = `${value}-${i}`;
    }

    return tmpUId;
  },

  async checkUIDAvailability({ contentTypeUID, field, value }) {
    const query = strapi.db.query(contentTypeUID);

    const count = await query.count({
      [field]: value,
    });

    if (count > 0) return false;
    return true;
  },
};
