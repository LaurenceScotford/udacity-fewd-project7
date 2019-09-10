let restaurants,
  neighborhoods,
  cuisines;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 *  Set filter options to focus on restaurants list when changed
 */
 document.querySelector('#neighborhoods-select').addEventListener('change', (event) => {
   document.querySelector('#restaurants-list').focus();
 });

 document.querySelector('#cuisines-select').addEventListener('change', (event) => {
   document.querySelector('#restaurants-list').focus();
 });

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.713200, -73.982000],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoibGF1cmVuY2UtcyIsImEiOiJjano5eDlnMGwwMmdzM2hwZHM4cjYwNW5wIn0.0mo-7G4EeA-SSTVAF2S4og',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.classList.add('restaurant-item');

  const picture = document.createElement('picture');
  picture.classList.add('restaurant-pic');

  const imgUrl = DBHelper.imageUrlForRestaurant(restaurant);

  let source = document.createElement('source');
  source.media = '(max-width: 499px)';
  source.srcset = `/img/sml_${imgUrl} 1x, /img/med_${imgUrl} 2x, /img/${imgUrl} 4x`;
  picture.append(source);

  source = document.createElement('source');
  source.media = '(min-width: 500px)';
  source.srcset = `/img/med_${imgUrl} 1x, /img/${imgUrl} 2x`;
  picture.append(source);

  source = document.createElement('source');
  source.media = '(min-width: 1000px)';
  source.srcset = `/img/${imgUrl}`;
  picture.append(source);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = '/img/' + imgUrl;
  image.alt = restaurant.name + ' restaurant';
  picture.append(image);
  li.append(picture);

  const details = document.createElement('div');
  details.className = 'restaurant-details';

  const name = document.createElement('h1');
  name.classList.add('restaurant-name');
  name.innerHTML = restaurant.name;
  details.append(name);

  const cuisine = document.createElement('p');
  cuisine.classList.add('restaurant-detail-item');
  cuisine.innerHTML = restaurant.cuisine_type;
  details.append(cuisine);

  const neighborhood = document.createElement('p');
  neighborhood.classList.add('restaurant-detail-item');
  neighborhood.innerHTML = restaurant.neighborhood;
  details.append(neighborhood);

  li.append(details);

  const address = document.createElement('p');
  address.classList.add('restaurant-detail-item');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.classList.add('restaurant-detail-link');
  more.innerHTML = `View details for<br>${restaurant.name}`;
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
