const TRIP_PROMPT = `Give me a list of places to visit in {city}, for a {tripParams} of {numberDays} days. Please divide the places per day, and return me a string that follows 
  the structure I provided below. Provide me strictly between 3-4 activities per day, no less. Group the activities based on their walking distance (put the closest on the same day). 
  If you don't know places of a city to visit, you can return me less days or less activities. Don't create places. Take into account if it is a solo, family or friends trip. Example format for a case with 2 days(if there are more than 2 days 
  just add it with the same format and if it's 1 day show only one day). Return a valid json with the format below (I used San Francisco as an example): 
  
  {
    "day1": {
      "title": "day 1",
      "places": [
        {"id": 0, "name": "Golden Gate Bridge", "description": "description of Golden Gate bridge here including its succint history"}, 
        {"id": 1, "name": "Alcatraz", "description": "description of Alcatraz here including its succint history"}, 
        {"id": 2, "name": "Alcatraz", "description": "description of Alcatraz here including its succint history"} 
      ]
    },
    "day2": {
      "title": "day 2",
      "places": [
        {"id": 3, "name": "Golden Gate Bridge", "description": "description of Golden Gate bridge here including its succint history"}, 
        {"id": 4, "name": "Alcatraz", "description": "description of Alcatraz here including its succint history"},
        {"id": 5, "name": "Alcatraz", "description": "description of Alcatraz here including its succint history"} 

      ]
    }
  }

  `

const VISIT_DUR_PROMPT = `Give me in a couple sentences how long should one spend visiting 
{placeName} at {cityName}. Do not use bullet points, give the answer on a paragraph format.`

const VISIT_BEST_TIME_PROMPT = `Give me in a couple sentences when in the day should one spend visiting 
{placeName} at {cityName}. Do not use bullet points, give the answer on a paragraph format.`

module.exports = { TRIP_PROMPT, VISIT_DUR_PROMPT, VISIT_BEST_TIME_PROMPT };
