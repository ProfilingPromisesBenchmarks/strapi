'use strict';

module.exports = {
  name: 'Unit test',
  testMatch: ['<rootDir>/packages/**/__tests__/?(*.)+(spec|test).js'],
  modulePathIgnorePatterns: ['.cache'],
  transform: {},
  setupFiles: ['/home/drasync/ProfilingPromisesAnalysis/asyncHooks_require.js']
};
