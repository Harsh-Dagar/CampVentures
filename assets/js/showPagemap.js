

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  });
  const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h6>${campground.title}</h6>`)

  )
  .addTo(map);
  map.addControl(new mapboxgl.NavigationControl());
   
//   // Create a default Marker, colored black, rotated 45 degrees.
//   const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
//   .setLngLat([12.65147, 55.608166])
//   .addTo(map);