uniform float uTime;
uniform float uRandom;

varying vec2 vUV;

void main() {
  float distanceFl = distance(vUV.x, 0.5);
  gl_FragColor = vec4(vUV.yx * distanceFl, 0.5, 1.0);
}