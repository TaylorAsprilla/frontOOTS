import './country-map-registry';
import 'jsvectormap-country-maps/dist/maps/canada.js';
import 'jsvectormap-country-maps/dist/maps/iraq.js';
import 'jsvectormap-country-maps/dist/maps/italy.js';
import 'jsvectormap-country-maps/dist/maps/russia.js';
import 'jsvectormap-country-maps/dist/maps/spain.js';
import 'jsvectormap-country-maps/dist/maps/us-merc-en.js';

describe('Country map registration', () => {
  const MapConstructor: new (options: {
    selector: string;
    map: string;
  }) => { destroy(): void } = window.jsVectorMap;

  for (const country of ['canada', 'iraq', 'italy', 'russia', 'spain', 'us_merc_en']) {
    it(`renders ${country} with the installed jsvectormap runtime`, () => {
      const container = document.createElement('div');
      container.id = 'country-map-test';
      container.style.width = '600px';
      container.style.height = '400px';
      document.body.appendChild(container);
      let map: { destroy(): void } | undefined;
      try {
        map = new MapConstructor({ selector: '#country-map-test', map: country });
        expect(container.querySelectorAll('svg path').length).toBeGreaterThan(0);
      } finally {
        map?.destroy();
        container.remove();
      }
    });
  }
});
