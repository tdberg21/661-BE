const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(express.json());

app.set("port", process.env.PORT || 3000);
app.locals.title = "BBQ BE";

app.use(bodyParser.urlencoded({
  extended: true
}));

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

app.get("/api/v1/restaurants", async (request, response) => {
  try {
    const restaurants = await database("restaurants").select();
    response.status(200).json(restaurants);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post("/api/v1/restaurants", async (request, response) => {
  console.log(request.body, request.query);
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
      response
        .status(422)
        .send({
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
