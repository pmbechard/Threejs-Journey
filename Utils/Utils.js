export function getRandomRGB() {
  return [
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
  ];
}

export function getRandomXY(limit = 4) {
  return [
    Math.round(Math.random() * limit) - limit / 2,
    Math.round(Math.random() * limit) - limit / 2,
  ];
}

export function getRandomXYZ(limit = 4) {
  return [
    Math.round(Math.random() * limit) - limit / 2,
    Math.round(Math.random() * limit) - limit / 2,
    Math.round(Math.random() * limit) - limit / 2,
  ];
}
