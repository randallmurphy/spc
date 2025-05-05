const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let likesCount = 0;

  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "TSLA" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.equal(res.body.stockData.stock, "TSLA");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        likesCount = res.body.stockData.likes;
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.equal(res.body.stockData.likes, likesCount); // Should NOT increase
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["MSFT", "AAPL"] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        res.body.stockData.forEach(stock => {
          assert.property(stock, "stock");
          assert.property(stock, "price");
          assert.property(stock, "rel_likes");
          assert.isNumber(stock.price);
          assert.isNumber(stock.rel_likes);
        });
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["MSFT", "AAPL"], like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        res.body.stockData.forEach(stock => {
          assert.property(stock, "stock");
          assert.property(stock, "price");
          assert.property(stock, "rel_likes");
          assert.isNumber(stock.price);
          assert.isNumber(stock.rel_likes);
        });
        done();
      });
  });
});
