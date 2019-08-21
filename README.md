# Movie Comparison App

## UNC Coding Bootcamp Project 1

Movie Comparison App allows users to search movies and compare them by budget, box office totals, and ratings from three different movie ratings sites.

There are several movie information websites such as Rotten Tomatoes, IMDB, and Metacritic. However, we discovered that none of these sites has a feature to compare two movies at once on the same screen. 


## First, we looked at the upsides and downsides of each API and assessed their viability.

### OMDB
- Consistently provided ‘Internet Movie Data’ ratings.
- Occasionally provided box office totals, Rotten Tomatoes and Metacritic ratings.

### Wikipedia
- Could provide box office totals and budget information.
- Could reliably provide links to more information about the movies.
- Since Wikipedia searches everything, not just movies, we knew we needed to only search Wikipedia if a movie could be found with OMDB.


## Second, we created the HTML and CSS elements for the application

### Materialize CSS Framework
- Materialize CSS was used in this project. Features used include: Materialize's grid, text inputs, chip elements, and buttons.

### Chart.js
- We used the Chart.js library to visualize the data received from the OMDB and Wikipedia.
- Charts are rendered in <canvas> elements, and are created using JavaScript objects with various parameter keys.
- Chart.js is open-source, mobile-responsive, and allows the developer to visualize data in 8 different ways--all animated and customizable.

### Future Directions
- In future development we plan to incorporate API’s that will allow us to include movie trailers for each movie  as well as some popular movie quotes, excluding spoilers. 
- We found that the current API’s that we sourced were limited to pulling data through specific urls for each quote and/or trailer.
- Incorporation of an option to save your favorite movie comparisons and/or favorite movie listings into your local storage for selection along with the already featured recent searches.
- Plans for adding movie trivia along with fun facts for popular movies along with all current information as well!

### See the project at: https://fzachary.github.io/project1/.