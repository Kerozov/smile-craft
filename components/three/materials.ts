import { Color, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

/** Емайл: топъл бял, с лак (clearcoat) и мек „sheen“ за подповърхностно усещане */
export function createEnamelMaterial() {
  return new MeshPhysicalMaterial({
    color: new Color("#fbf6ee"),
    roughness: 0.28,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    sheen: 0.8,
    sheenRoughness: 0.5,
    sheenColor: new Color("#fff1dc"),
    ior: 1.62,
    specularIntensity: 0.9,
    specularColor: new Color("#fffaf2"),
  });
}

/** Шампанско злато — за пръстени, брекети и дъга */
export function createGoldMaterial() {
  return new MeshStandardMaterial({
    color: new Color("#d8b98c"),
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.2,
  });
}

/** Перли — малки бели сфери около зъба */
export function createPearlMaterial() {
  return new MeshPhysicalMaterial({
    color: new Color("#ffffff"),
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.6,
    iridescenceIOR: 1.3,
    sheen: 1,
    sheenColor: new Color("#f3e3cf"),
  });
}
