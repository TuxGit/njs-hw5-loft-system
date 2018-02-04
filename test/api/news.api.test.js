const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../../bin/server_test'); // server не закрывается, и тесты висят в консоли. добавил флаг --exit

const mongoose = require('mongoose');
const News = require('../../models/News');

chai.use(chaiHttp);

// describe.skip
describe('API: News', () => {
  // /api/getNews
  describe('GET all News - /api/getNews', () => {
    before(function () {
      // runs before all tests in this block
    });

    after(function () {
      // runs after all tests in this block
    });

    // it.skip
    it('it should Get all the news', (done) => {
      const testObj = chai.request(server)
        .get('/api/getNews')
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.a('array');
          done();
        });
      // console.log(request);
      // done();
    }).timeout(5000);
  });

  // /api/deleteNews/:id
  describe('DELETE News - /api/deleteNews/:id', () => {
    let modelId = null;
    const agent = chai.request.agent(server); // app
    // const agent = chai.request(server).keepOpen();

    before(function (done) {
      // runs before all tests in this block
      const news = new News({
        _id: mongoose.Types.ObjectId(),
        theme: 'ThemeTest_001',
        text: 'Text test ...',
        date: '2018-01-01'
      });
      news.save((err, model) => {
        if (err) {
          // throw err;
          done(err);
        } else {
          // console.log('[before] model=', model);
          modelId = model._id;
          done();
        }
      });
    });

    after(function (done) {
      // runs after all tests in this block
      // agent.close();
      News.remove({_id: modelId}, (err) => {
        if (err) { /* throw err; */ done(err); }
        // console.log('[after] modelId=', modelId);
        done();
      });
    });

    it('it should Delete a news by the given id', (done) => {
      // console.log('testing', modelId);
      agent
        .del(`/api/deleteNews/${modelId}`)
        .end((err, res) => {
          // console.log(res);
          if (err) { done(err); }
          // expect(err).to.be.null;
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  // PUT /api/updateNews/:id
  describe('PUT News - /api/updateNews/:id', () => {
    let modelId = null;
    const agent = chai.request(server);

    before(function (done) {
      // runs before all tests in this block
      const news = new News({
        _id: mongoose.Types.ObjectId(),
        theme: 'Theme_001',
        text: 'Text default',
        date: '2018-01-01'
      });
      news.save((err, model) => {
        if (err) { done(err); }
        modelId = model._id.toString(); // Object('id hash...')
        done();
      });
    });

    after(function (done) {
      // runs after all tests in this block
      News.remove({_id: modelId}, (err) => {
        if (err) { done(err); }
        done();
      });
    });

    it('it should Update a news by the given id', (done) => {
      agent
        .put(`/api/updateNews/${modelId}`)
        .send({ theme: 'Theme_002' })
        .end((err, res) => {
          // console.log(res.body);
          if (err) { done(err); }
          // fix - res.body - array of all records
          const data = res.body.filter((val) => { return val._id === modelId; })[0];

          expect(res).to.have.status(200);
          expect(data.theme).to.be.equal('Theme_002');
          expect(data.text).to.be.equal('Text default');
          expect(data).to.have.property('date');
          done();
        });
    });
  });

  // POST /api/newNews
  describe('POST News - /api/newNews', () => {
    let modelId = null;
    const agent = chai.request(server);

    before(function () {
      // runs before all tests in this block
    });

    after(function (done) {
      // runs after all tests in this block
      News.remove({_id: modelId}, (err) => {
        if (err) { done(err); }
        done();
      });
    });

    it('it should Create a news by the given id', (done) => {
      agent
        .post(`/api/newNews`)
        .send({
          theme: 'NewTheme_001',
          text: 'Text default',
          date: '2018-01-01'
        })
        .end((err, res) => {
          // console.log(res.body);
          if (err) { done(err); }
          // fix - res.body - array of all records
          const data = res.body.filter((val) => { return val.theme === 'NewTheme_001'; })[0];
          modelId = data.id;

          expect(res).to.have.status(201);
          expect(data.theme).to.be.equal('NewTheme_001');
          expect(data.text).to.be.equal('Text default');
          expect(data).to.have.property('date');
          done();
        });
    });
  });
});
