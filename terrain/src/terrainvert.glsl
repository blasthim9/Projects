varying vec2 vUv;
void main(){
  vUv.xy = uv.xy;
  gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}