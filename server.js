const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const bcrypt = require("bcrypt");
const crypto = require("crypto");

app.use(express.json());

app.set("port", process.env.PORT || 3000);
app.locals.title = "BBQ BE";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use((request, response, next) => {
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  next();
});

app.use((request, response, next) => {
  response.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.get("/", (request, response) => {
  response.send("MMMMM BBQ");
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});

app.get("/api/v1/users", (request, response) => {
  database("users")
    .select()
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.use("/api/v1/login", (request, response) => {
  response.send({
    token: "1512354123342535",
  });
});

app.get("/api/v1/restaurants", async (request, response) => {
  try {
    const restaurants = await database("restaurants").select();
    response.status(200).json(restaurants);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post("/api/v1/users/new", async (request, response) => {
  const user = await request.body;
  for (let requiredParameter of ["username", "email", "password"]) {
    if (!user[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: { username: <String>, email: <String>, password: <String> }. You're missing a "${requiredParameter}" property.`,
        });
    }
  }
  database("users")
    .insert(user, "id")
    .then((user) => {
      response.status(201).json({ token: 897187921419847 });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post("/api/v1/restaurants", async (request, response) => {
  const restaurant = await request.body;

  for (let requiredParameter of [
    "mealChoice",
    "restaurantName",
    "location",
    "dateVisited",
    "mealRating",
    "experienceDescription",
  ]) {
    if (!restaurant[requiredParameter]) {
      response.status(422).send({
        error: `Expected format: { mealChoice: <String>, restaurantName: <String>, location: <String>, dateVisited: <String>, mealRating: <String>, experienceDescription: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  try {
    const id = await database("restaurants").insert(restaurant, "id");
    response.status(201).json({ id });
  } catch (error) {
    response.status(500).json({ error });
  }
});
