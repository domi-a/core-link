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
    expect(getByDataTest(res, 'from').outerHTML).toContain('You');
    expect(getByDataTest(res, 'to').outerHTML).toContain('Someone');
    const text = getByDataTest(res, 'text').outerHTML;
    expect(text).toContain('attach a message to this coin');
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
    //initial state
    const res = await request(app).get('/edit/666');
    expect(res.statusCode).toBe(200);
    expect(superQuery(res, 'form[method=post]')).toBeTruthy();
    expect(superQuery(res, 'form input[name=from]').value).toEqual('john doe');
    expect(superQuery(res, 'form input[name=to]').value).toEqual('jane doe');
    expect(superQuery(res, 'form textarea[name=text]').value).toContain(
      'st wanted to say'
    );
    expect(superQuery(res, 'form input[name=imageUrl]').value).toEqual(
      'https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif'
    );
    //update
    const res2 = await request(app)
      .post('/update/666')
      .send(
        'from=john+111&to=jane+222&text=hi+jane.%0D%0Ajust+wanted+to+say%3A+i%27m+happy+that+you+are+there.%0D%0Ahope+to+code+with+you+again+soon.%0D%0Acheckout+our+topic+on+google.com+or+http%3A%2F%2Fgoogle.org+or+https%3A%2F%2Fgoogle.de&imageUrl=https%3A%2F%2Fmedia.tenor.com%2F5Pdhkfq8xYEAAAAC%2Fspongebob-cant-wait.gif&fixateForDays=0'
      );
    expect(res2.statusCode).toBe(200);
    expect(getByDataTest(res2, 'from').outerHTML).toContain('john 111');
    expect(getByDataTest(res2, 'to').outerHTML).toContain('jane 222');
    const text = getByDataTest(res2, 'text').outerHTML;
    expect(text).toContain(
      "just wanted to say: i'm happy that you are there.\nhope to code with you again soon."
    );
    expect(getByDataTest(res2, 'img').outerHTML).toEqual(
      '<img class="w-100 border border-dark border-2 rounded-2" src="https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif" data-test="img">'
    );
  });

  it('should create new entry', async () => {
    //initial state
    const res = await request(app).get('/create');
    expect(res.statusCode).toBe(200);
    expect(superQuery(res, 'form[method=post]')).toBeTruthy();
    expect(superQuery(res, 'form input[name=from]').value).toEqual('');
    expect(superQuery(res, 'form input[name=to]').value).toEqual('');
    expect(superQuery(res, 'form textarea[name=text]').value).toContain('');
    expect(superQuery(res, 'form input[name=imageUrl]').value).toEqual('');
    //after create
    const res2 = await request(app)
      .post('/create')
      .send(
        'from=john&to=jane&text=hi+jane.%0D%0Ajust+wanted+to+say%3A+i%27m+happy+that+you+are+there.%0D%0Ahope+to+code+with+you+again+soon.%0D%0Acheckout+our+topic+on+google.com+or+http%3A%2F%2Fgoogle.org+or+https%3A%2F%2Fgoogle.de&imageUrl=https%3A%2F%2Fmedia.tenor.com%2F5Pdhkfq8xYEAAAAC%2Fspongebob-cant-wait.gif&fixateForDays=0'
      );
    expect(res2.statusCode).toBe(200);
    expect(getByDataTest(res2, 'from').outerHTML).toContain('john');
    expect(getByDataTest(res2, 'to').outerHTML).toContain('jane');
    const text = getByDataTest(res2, 'text').outerHTML;
    expect(text).toContain(
      "just wanted to say: i'm happy that you are there.\nhope to code with you again soon."
    );
    expect(getByDataTest(res2, 'img').outerHTML).toEqual(
      '<img class="w-100 border border-dark border-2 rounded-2" src="https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif" data-test="img">'
    );
    expect(superQuery(res2, '#url').value).toContain(
      'http://localhost:3001/view/'
    );
  });

  it('should create blank entry', async () => {
    const res = await request(app).get('/create-blank');
    expect(res.statusCode).toBe(200);
    // expect(getByDataTest(res, 'from').outerHTML).toContain('CoreLink');
    // expect(getByDataTest(res, 'to').outerHTML).toContain('You');
    const text = getByDataTest(res, 'text').outerHTML;
    expect(text).toContain('in menu to create your own');
    expect(getByDataTest(res, 'img').outerHTML).toEqual(
      '<img class="w-100 border border-dark border-2 rounded-2" src="https://media.tenor.com/67UlO1i1iB0AAAAC/good-fine.gif" data-test="img">'
    );
    expect(superQuery(res, '#url').value).toContain(
      'http://localhost:3001/view/'
    );
  });

  it('should unlock entry', async () => {
    const res = await request(app).get('/unlock/777').set('cookie', '777=123');
    expect(res.statusCode).toBe(200);
  });

  it('should return text pages', async () => {
    const res0 = await request(app).get('/');
    expect(res0.statusCode).toBe(200);
    expect(res0.text.length).toBeGreaterThan(1000);

    const res1 = await request(app).get('/create-instructions');
    expect(res1.statusCode).toBe(200);
    expect(res1.text.length).toBeGreaterThan(1000);
  });

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
