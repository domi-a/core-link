/** @format */
import request from 'supertest';
import { App } from 'supertest/types';
import { initialize, shutdown } from './config/setup';

describe('smokey', () => {
  let app: App;
  beforeEach(async () => {
    app = await initialize();
  });

  it('should render view', async () => {
    const res = await request(app).get('/view/666');
    expect(res.statusCode).toBe(200);
    expect(res.text.length).toBeGreaterThan(100);
  });
  afterEach(async () => {
    shutdown();
  });
  // should 404
  //should update
});
