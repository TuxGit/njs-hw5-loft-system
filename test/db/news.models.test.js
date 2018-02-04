const chai = require('chai');
const expect = chai.expect;
// const should = chai.should();

const mongoose = require('mongoose');
const News = require('../../models/News');

describe('Models: News', function () {
  describe('#find()', function () {
    let modelId = null;

    before(function (done) {
      // runs before all tests in this block
      const news = new News({
        _id: mongoose.Types.ObjectId(),
        theme: 'ThemeTest',
        text: 'TextTest',
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

    it('it should find all news record', function (done) {
      News.find().exec(function (err, models) {
        if (err) { return done(err); }
        expect(models).to.be.a('array');
        expect(models).lengthOf.above(1);
        expect(models[0]).to.have.property('id');
        done();
      });
    });

    it.skip('it should find last news record', function (done) {
      News.findOne().sort('-createdAt').exec(function (err, model) {
        if (err) { return done(err); }
        expect(model.id).to.be.not.null;
        expect(model.id).to.be.equal(modelId);
        expect(model).to.have.property('theme');
        // expect(model.theme).to.be.equal('ThemeTest');
        expect(model).to.have.property('text');
        expect(model).to.have.property('date');
        done();
      });
    });
  });

  describe('#create()', function () {
    let modelId = null;

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

    it('it should create a new News', function (done) {
      const rec = {
        _id: mongoose.Types.ObjectId(),
        theme: 'ThemeTest',
        text: 'TextTest',
        date: '2018-01-01'
      };
      News.create(rec, function (err, createdModel) {
        // expect(err).to.be.null;
        if (err) { return done(err); }
        modelId = createdModel.id;
        // Verify that the returned user is what we expect
        expect(createdModel.id).to.have.lengthOf.above(1); // .to.be.exist;
        expect(createdModel.theme).to.be.equal('ThemeTest');
        expect(createdModel.text).to.be.equal('TextTest');
        expect(createdModel).to.have.property('date');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

  describe('#update()', function () {
    let modelId = null;

    before(function (done) {
      // runs before all tests in this block
      const news = new News({
        _id: mongoose.Types.ObjectId(),
        theme: 'ThemeTest',
        text: 'TextTest',
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

    it('it should update the News record', function (done) {
      const updFields = {
        theme: 'ThemeTest_new'
      };
      // News.update({ _id: modelId }, { $set: updFields }, function (err, createdModel) {
      News.findByIdAndUpdate(modelId, { $set: updFields }, { new: true }, function (err, createdModel) {
        if (err) {
          return done(err);
        }
        // Verify that the returned user is what we expect
        expect(createdModel.id).to.have.lengthOf.above(1); // .to.be.exist;
        expect(createdModel.theme).to.be.equal('ThemeTest_new');
        expect(createdModel.text).to.be.equal('TextTest');
        expect(createdModel).to.have.property('date');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

  describe('#remove()', function () {
    let modelId = null;

    before(function (done) {
      // runs before all tests in this block
      const news = new News({
        _id: mongoose.Types.ObjectId(),
        theme: 'ThemeTest',
        text: 'TextTest',
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

    it('it should delete the News record', function (done) {
      News.remove({ _id: modelId }, function (err) {
        if (err) {
          return done(err);
        }
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });
});
