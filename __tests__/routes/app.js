const app = require("../../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
var got = require("got");
jest.mock("got");
const mongod = new MongoMemoryServer();

describe("movie-management", () => {
  beforeAll(async () => {
    try {
      got.mockImplementation(() =>
        Promise.resolve({ body: { accessLevel: "success" } })
      );
      const uri = await mongod.getUri();

      const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      if (mongoose.connection.name != "") await mongoose.connection.close();

      await mongoose.connect(uri, mongooseOpts);

      mongoose.Promise = global.Promise;
      var db = mongoose.connection;

      db.on(
        "error",
        console.error.bind(console, "MongoDB connection error:")
      );

      db.once("open", function () {
        // we're connected!
        console.log("db object" + db);
      });
    } catch (error) {
      console.error("MongoDB connection FAIL", error);
    }
  });

  it("Returns 200 /health", async (done) => {
    var result = await request
      .get("/health")
      .expect("Content-Type", /json/)
      .expect(200);
      expect(result.body.name).toBe("movie-management");
      done();
  });

  it("Returns 404 with unknown json request", async (done) => {
    var result = await request
      .get("/404")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
      expect(result.body).toStrictEqual({
        message: "Not Found"
      });
      done();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongod.stop();
  });    

});

