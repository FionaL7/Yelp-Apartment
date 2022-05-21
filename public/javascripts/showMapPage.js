mapboxgl.accessToken =
  "pk.eyJ1IjoiZmlvbmFsMjIiLCJhIjoiY2t0dHZnZzQzMWhtZzJvbnEwN3ltZzh5dyJ9.g-g3F7QDBPJaNFbj0B499g";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: apartment.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(apartment.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<h3>${apartment.title}</h3>`)
  )
  .addTo(map);
