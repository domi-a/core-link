/** @format */
const { JSDOM } = require('jsdom');
import { default as request, default as supertest } from 'supertest';
import { App } from 'supertest/types';
import { initialize, shutdown } from './config/setup';

describe('full app - important usecases', () => {
  let app: App;
  beforeAll(async () => {
    app = await initialize();
  });

  it('should render view and contain text with link and image', async () => {
    const res = await request(app).get('/view/666');
    expect(res.statusCode).toBe(200);
    expect(getByDataTest(res, 'from').outerHTML).toContain('john doe');
    expect(getByDataTest(res, 'to').outerHTML).toContain('jane doe');
    const text = getByDataTest(res, 'text').outerHTML;
    expect(text).toContain(
      "hi jane.\njust wanted to say: i'm happy that you are there.\nhope to code with you again soon.\ncheckout our topic"
    );
    expect(text).toContain(
      '<a href="https://google.com" target="_blank">google.com</a>'
    );
    expect(getByDataTest(res, 'img').outerHTML).toContain(
      ' src=\"https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif\"'
    );
  });

  it('should render view and contain text with emojis and image', async () => {
    const res = await request(app).get('/view/777');
    expect(res.statusCode).toBe(200);
    expect(getByDataTest(res, 'from').outerHTML).toContain('CoreLink');
    expect(getByDataTest(res, 'to').outerHTML).toContain('creator');
    const text = getByDataTest(res, 'text').outerHTML;
    expect(text).toContain('<span class="fw-bold">strong</span>');
    expect(text).toContain('<em class=\"\">italic</em>');
    expect(text).toContain('<s class=\"\">stroked</s>');
    expect(text).toContain('idunt ut 👌 labore et dolorolu');
    expect(text).toContain('<p style=\"font-size:3rem;\">❤️</p>');
    expect(text).toContain('<p style=\"font-size:3rem;\">👌</p>');
    expect(getByDataTest(res, 'img').outerHTML).toContain(
      ' src=\"https://media2.giphy.com/media/whatever/giphy.gif\"'
    );
  });

  it('should render fallback view', async () => {
    const res = await request(app).get('/view/888');
    expect(res.statusCode).toBe(200);
    expect(getByDataTest(res, 'from').outerHTML).toContain('CoreLink');
    expect(getByDataTest(res, 'to').outerHTML).toContain('You');
    const text = getByDataTest(res, 'text').outerHTML;
    expect(text).toContain(
      'created: 04.12.25, 18:11:46\nthis entry is just an example, click menu to change entry. \n maybe have a 👀 at the formating capabilities <p style="font-size:3rem;">👊</p>'
    );
    expect(getByDataTest(res, 'img').outerHTML).toContain(
      ' src=\"https://media.tenor.com/67UlO1i1iB0AAAAC/good-fine.gif\"'
    );
  });

  it('should render 404', async () => {
    const res = await request(app).get('/view/444');
    expect(res.statusCode).toBe(404);
    expect(res.text.length).toBeGreaterThan(1000);
    expect(superQuery(res, 'h2').outerHTML).toContain('error: 404');
    expect(superQuery(res, 'img').outerHTML).toContain(
      '<img src=\"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDFnemZxbzFub2V6YnJwbHp0NGNnbnE5N3YycHgzYW1lbmJtZndwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9J7tdYltWyXIY/giphy.gif'
    );
  });

  it('should render 403', async () => {
    const res = await request(app)
      .post('/update/777')
      .send(
        'from=john+doe&to=jane+doe&text=hi+jane.%0D%0Ajust+wanted+to+say%3A+i%27m+happy+that+you+are+there.%0D%0Ahope+to+code+with+you+again+soon.%0D%0Acheckout+our+topic+on+google.com+or+http%3A%2F%2Fgoogle.org+or+https%3A%2F%2Fgoogle.de&imageUrl=https%3A%2F%2Fmedia.tenor.com%2F5Pdhkfq8xYEAAAAC%2Fspongebob-cant-wait.gif&fixateForDays=0'
      );
    expect(res.statusCode).toBe(403);
    expect(superQuery(res, 'h2').outerHTML).toContain('error: 403');
    expect(superQuery(res, 'img').outerHTML).toContain(
      '<img src=\"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExejhjNWhuOHQxNzZ6M3IxYmRpYmdvMXg2YnZuOTF0eTdtczA2dWN6bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1Yw4BmHn8QNWD4Bl4l/giphy.gif'
    );
  });

  it('should update entry', async () => {
    //todo: show edit
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
    //todo: show create/edit first
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
    //todo check url and rest
  });

  //todo: /create-blank
  //todo: /unlock

  //todo: render /
  //todo: render /create-instructios
  //todo: render /create-instructio

  afterAll(async () => {
    shutdown();
  });
});

function superQuery(res: supertest.Response, query: string) {
  const document = new JSDOM(res.text).window.document;
  return document.querySelector(query);
}

function getByDataTest(res: supertest.Response, testId: string) {
  return superQuery(res, `[data-test=${testId}]`);
}
