const apiKey = import.meta.env.VITE_CARTO_API_KEY?.trim();

export const cartoMapConfig = {
  apiKey,
  rasterTileUrl: apiKey
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(apiKey)}`
    : null,
  vectorStyleUrl: apiKey
    ? `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${encodeURIComponent(apiKey)}`
    : null,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
};
