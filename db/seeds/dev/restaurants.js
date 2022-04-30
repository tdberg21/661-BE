/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  try 
  {await knex('restaurants').del()
  await knex('restaurants').insert([
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
  ]);} catch (error) {
    console.log(`Error seeding data: ${error}`);
  }
};
