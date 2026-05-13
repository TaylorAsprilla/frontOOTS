// This file must be imported BEFORE zone.js in polyfills.ts
// Prevents zone.js from registering wheel/touch events as passive,
// which allows ApexCharts to call preventDefault() on scroll/zoom interactions.
(window as any).__zone_symbol__PASSIVE_EVENTS = [];
