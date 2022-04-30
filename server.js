const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BBQ BE';

app.use(bodyParser.urlencoded({ extended: true }));

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next()
});

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
  next()
})

app.get('/', (request, response) => {
  response.send('MMMMM BBQ');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.get('/api/v1/restaurants', (request, response) => {
  const restaurants = app.locals.restaurants;

  response.json({ restaurants });
});

app.get('/api/v1/restaurants/:id', (request, response) => {
  const { id } = request.params;
  
  const restaurant = app.locals.restaurants.find(restaurant => restaurant.id === id);
  console.log('request', id, restaurant)
  if (!restaurant) {
    return response.sendStatus(404);
  }
  response.status(200).json(restaurant);
});

app.post('/api/v1/restaurants', (request, response) => {
  const id = Date.now();
  const restaurant = request.body;

  for (let requiredParameter of ['mealChoice', 'restaurantName', 'location', 'dateVisited', 'mealRating', 'experienceDescription']) {
    if (!restaurant[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { mealChoice: <String>, restaurantName: <String>, location: <String>, dateVisited: <String>, mealRating: <String>, experienceDescription: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  const { mealChoice, restaurantName, location, dateVisited, mealRating, experienceDescription } = restaurant;
  app.locals.restaurants.push({ mealChoice, restaurantName, location, dateVisited, mealRating, experienceDescription, id });
  response.status(201).json({ mealChoice, restaurantName, location, dateVisited, mealRating, experienceDescription, id });
});

app.locals.restaurants = [
  {
    mealChoice: "Brisket Meal",
    restaurantName: "AJs Pit BBQ",
    location: "Denver, CO",
    dateVisited: "2022-03-10",
    mealRating: "7.6",
    experienceDescription: "Really good Texas style bbq.",
    id: 1
  },
  {
    mealChoice: "Pulled Pork Sandwich",
    restaurantName: "Pee Wees",
    location: "Blacksburg, VA",
    dateVisited: "2007-03-03",
    mealRating: "8.9",
    experienceDescription: "My favorite place at college, gone too soon",
    id: 2
  },
  {
    mealChoice: "Ribs",
    restaurantName: "Smokin Yard",
    location: "Denver, CO",
    dateVisited: "2022-02-13",
    mealRating: "6.7",
    experienceDescription: "Decent, not great",
    id: 3
  },
  {
    mealChoice: "Pulled Pork Sandwich",
    restaurantName: "Roaming Buffalo",
    location: "Denver, CO",
    dateVisited: "2022-03-13",
    mealRating: "6.1",
    experienceDescription: "Really cool logo. Food is just okay.",
    id: 4
  },
];