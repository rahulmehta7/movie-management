# Movie-management
A service to manages the movie information written using NodeJS.

### Prerequisite 
You'll need node, npm and git installed. Clone this repo and then npm install to load the dependent packages.

Used during development:
```
Node: v14.17.1
npm : 6.14.13
git : git version 2.32.0.windows.2
```
## Installation and Instruction
Once you installed all the dependencey and up the service on the port 3000, You can use postman to test the endpoints.

Example:
```
POST http://localhost:3000/v1/movie/add
Content-Type: application/json

{
    "movieName": "Josh",
    "movieRating": 5,
    "movieYear" : 2021
}

###
GET  http://localhost:3000/v1/movie/getallmovies
Content-Type: application/json

###
POST http://localhost:3000/v1/movie/update
Content-Type: application/json

{
    "movieId": "714",
    "movieName": "Josh",
    "movieRating": 3,
    "movieYear": 1998
}

###
GET  http://localhost:3000/v1/movie/rating/5
Content-Type: application/json

###
GET  http://localhost:3000/v1/movie/year/2021
Content-Type: application/json
```
Note:
1. I have used in-memory MongoDB to persist the data.
2. Once your service is up and connected to database then you can see the below message on console.
![image](https://user-images.githubusercontent.com/81794670/168033268-2ca6ba82-8dfd-4dca-974c-073b59df0a94.png)


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Unit test cases
```
npm run test
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
