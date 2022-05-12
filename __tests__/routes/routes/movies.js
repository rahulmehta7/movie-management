const app = require("../../../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const mockData = require("../helpers/data.json");
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
          console.error.bind(console, "mongoDB connection error:")
        );
  
        db.once("open", function () {
          // we're connected!
          console.log("db object" + db);
        });
      } catch (error) {
        console.error("MongoDB connection FAIL", error);
      }
    });

    it("movie-management /v1/movie/add POST query success", async () => {
      var bodyData = mockData.test_movie;
      var response = await request
      .post(`/v1/movie/add`)
      .send(bodyData)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(200)
    });    

    it("movie-management /v1/movie/add POST query falure - Minimum 2 alphanumeric value for movie Id required" , async () => {
      var bodyData = mockData.min_validation_failed_movie_name;
      var response = await request
      .post(`/v1/movie/add`)
      .send(bodyData)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe("\"movieName\" length must be at least 2 characters long");        
    });  

    it("movie-management /v1/movie/add POST query falure - Maximum 80 alphanumeric value for movie Id required" , async () => {
      var bodyData = mockData.max_validation_failed_movie_name;
      var response = await request
      .post(`/v1/movie/add`)
      .send(bodyData)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe("\"movieName\" length must be less than or equal to 80 characters long");        
    });      

    it("movie-management /v1/movie/getallmovies GET query success", async () => {
      var response = await request
      .get(`/v1/movie/getallmovies`)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(1);        
    });    

    it("movie-management /v1/movie/rating/:movieRating GET query success", async () => {
      var response = await request
      .get(`/v1/movie/rating/3`)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(1);
      expect(response.body[0].movieName).toBe("testmoviename");        
    });   
    
    it("movie-management /v1/movie/rating/:movieRating GET query failure", async () => {
      var response = await request
      .get(`/v1/movie/rating/5`)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toBe("Movies not exist");        
    });    
    
    it("movie-management /v1/movie/year/:movieYear GET query success", async () => {
      var response = await request
      .get(`/v1/movie/year/2021`)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(1);
      expect(response.body[0].movieName).toBe("testmoviename");        
    });   
    
    it("movie-management /v1/movie/year/:movieYear GET query failure", async () => {
      var response = await request
      .get(`/v1/movie/year/2022`)
      .expect("Content-Type", /json/)
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toBe("Movies not exist");        
    });    
    
    it("movie-management /v1/movie/update POST query success", async () => {
      var response = await request
      .get(`/v1/movie/getallmovies`)
      
      var movieId = response.body[0].movieId;      
      var bodyData = mockData.test_update_movie;
      bodyData.movieId = movieId;
      var response = await request
      .post(`/v1/movie/update`)
      .expect("Content-Type", /json/)
      .send(bodyData)        
      expect(response.statusCode).toBe(200)
      expect(response.body.modifiedCount).toBe(1);
  
    }); 
        
    it("movie-management /v1/movie/update POST query movie not exist failed", async () => {
      var bodyData = mockData.test_update_movie_not_exist;
      var response = await request
      .post(`/v1/movie/update`)
      .expect("Content-Type", /json/)
      .send(bodyData)        
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toBe("movie not exist");
    });      
    
    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoose.disconnect();
      await mongod.stop();
    });          
});
  