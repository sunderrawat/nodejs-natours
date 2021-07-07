import { displayMap } from './mapbox';

const mapId = document.getElementById('map');
if (mapId) {
  const locations = JSON.parse(mapId.dataset.locations);
  displayMap(locations);
}
