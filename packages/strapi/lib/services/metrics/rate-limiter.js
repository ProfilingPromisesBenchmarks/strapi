'use strict';

/**
 * @param events a list of events that need to be limited
 */
module.exports = (sender, { limitedEvents = [] } = {}) => {
  let currentDay = new Date().getDate();
  const eventCache = new Map();

  return (event, ...args) => {
    ///////////////////
    // Anti-pattern #2
    const { exec } = require('child_process');
    let stackTrace = {};
    Error.captureStackTrace(stackTrace);
    exec(
      `echo '${Date.now()}: \t anti-pattern #2 executed! ${stackTrace.stack}\n\n\n' >> ~/detections`
    );
    ///////////////////

    if (!limitedEvents.includes(event)) {
      return sender(event, ...args);
    }

    if (new Date().getDate() !== currentDay) {
      eventCache.clear();
      currentDay = new Date().getDate();
    }

    if (eventCache.has(event)) {
      return false;
    }

    eventCache.set(event, true);
    return sender(event, ...args);
  };
};
