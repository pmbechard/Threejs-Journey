uniform float uTime;
uniform float uRandom;

varying vec2 vUV;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.x += sin(modelPosition.z) * 0.01;
  modelPosition.z += cos(modelPosition.x * uTime) * 0.2;
  modelPosition.y += sin(modelPosition.x + modelPosition.z / uTime) / uTime;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  vUV = uv;
}