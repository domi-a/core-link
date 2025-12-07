/** @format */

import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';
const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },

  setupFiles: ['./test-setup.ts'],
  testPathIgnorePatterns: ['./dist'],
  collectCoverage: false,
};
module.exports = config;
