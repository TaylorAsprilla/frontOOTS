import 'jsvectormap';

type RegisterMap = (name: string, data: unknown) => void;

const registry: {
  addMap: RegisterMap;
  prototype: { addMap?: RegisterMap };
} = window.jsVectorMap;

// Official legacy country data uses the prototype API removed in jsvectormap 1.5.
registry.prototype.addMap = (name, data) => registry.addMap(name, data);
