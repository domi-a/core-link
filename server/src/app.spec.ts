/** @format */
import request from 'supertest';
import { App } from 'supertest/types';
import { initialize, shutdown } from './config/setup';
// import {} from 'express'

describe('smokey', () => {
  let app: App;
  beforeAll(async () => {
    app = await initialize();
  });

  it('should render view', async () => {
    const res = await request(app).get('/view/666');
    expect(res.statusCode).toBe(200);
    expect(res.text.length).toBeGreaterThan(1000);
  });
  it('should render 404', async () => {
    const res = await request(app).get('/view/444');
    expect(res.statusCode).toBe(404);
    expect(res.text.length).toBeGreaterThan(1000);
  });

  it('should update entry', async () => {
    const res1 = await request(app)
      .post('/update/666')
      .send(
        'from=john+doe&to=jane+doe&text=hi+jane.%0D%0Ajust+wanted+to+say%3A+i%27m+happy+that+you+are+there.%0D%0Ahope+to+code+with+you+again+soon.%0D%0Acheckout+our+topic+on+google.com+or+http%3A%2F%2Fgoogle.org+or+https%3A%2F%2Fgoogle.de&imageUrl=https%3A%2F%2Fmedia.tenor.com%2F5Pdhkfq8xYEAAAAC%2Fspongebob-cant-wait.gif&fixateForDays=0'
      );
    expect(res1.statusCode).toBe(200);
    expect(res1.text.length).toBeGreaterThan(1000);
    const res2 = await request(app).get('/view/666');
    expect(res2.statusCode).toBe(200);
    expect(res2.text.length).toBeGreaterThan(1000);
  });

  it('should post new entry', async () => {
    const res1 = await request(app)
      .post('/create')
      .send(
        'from=john+doe&to=jane+doe&text=hi+jane.%0D%0Ajust+wanted+to+say%3A+i%27m+happy+that+you+are+there.%0D%0Ahope+to+code+with+you+again+soon.%0D%0Acheckout+our+topic+on+google.com+or+http%3A%2F%2Fgoogle.org+or+https%3A%2F%2Fgoogle.de&imageUrl=https%3A%2F%2Fmedia.tenor.com%2F5Pdhkfq8xYEAAAAC%2Fspongebob-cant-wait.gif&fixateForDays=0'
      );
    expect(res1.statusCode).toBe(200);
    expect(res1.text.length).toBeGreaterThan(1000);
    const res2 = await request(app).get('/view/666');
    expect(res2.statusCode).toBe(200);
    expect(res2.text.length).toBeGreaterThan(1000);
  });
  afterAll(async () => {
    shutdown();
  });
  // should 404
  //should update
  //should create
});
