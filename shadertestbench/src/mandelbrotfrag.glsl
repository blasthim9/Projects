precision highp float;
uniform vec3 iResolution;
uniform vec4 Area;
uniform float maxIter;
uniform float numzoom;
varying vec2 vUv;
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 c = Area.xy+(vUv-.5)*Area.zw;
  vec2 z = vec2(0.);
  float iter;
  for(iter = 0.; iter<maxIter;iter++){
    z = vec2(z.x*z.x-z.y*z.y,numzoom*z.x*z.y)+c;
    if(length(z)>2.) break; 
  }
  float col = iter/maxIter;
  fragColor = vec4(col,col,col, 1.);
}

void main() {

  mainImage(gl_FragColor, gl_FragCoord.xy);
}