const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Translation with text and locale fields: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "Paracetamol takes up to an hour to work.",
        locale: "british-to-american",
      })
      .end(function (err, res) {
        const expected = {
          text: "Paracetamol takes up to an hour to work.",
          translation:
            '<span class="highlight">Tylenol</span> takes up to an hour to work.',
        };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "Paracetamol takes up to an hour to work.",
        locale: "british-to-americano",
      })
      .end(function (err, res) {
        const expected = { error: "Invalid value for locale field" };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });

  test("Translation with missing text field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        locale: "british-to-american",
      })
      .end(function (err, res) {
        const expected = { error: "Required field(s) missing" };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });

  test("Translation with missing locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "british-to-american",
      })
      .end(function (err, res) {
        const expected = { error: "Required field(s) missing" };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });

  test("Translation with empty text: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "",
        locale: "british-to-americano",
      })
      .end(function (err, res) {
        const expected = { error: "No text to translate" };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });

  test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "takes up to an hour to work.",
        locale: "british-to-american",
      })
      .end(function (err, res) {
        const expected = {
          text: "takes up to an hour to work.",
          translation: "Everything looks good to me!",
        };
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected);
        done();
      });
  });
});
