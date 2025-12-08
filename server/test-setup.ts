/** @format */

function setup() {
  // console.log('--------------set envs------------');
  process.env.STAGE = 'test';
  process.env.PORT = '3001';
  process.env.HOST = 'http://localhost:3001';
}
module.exports = setup();
