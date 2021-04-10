precision highp float;
uniform vec3 iResolution;
uniform vec4 Area;
uniform int maxIter;
uniform float numzoom;
varying vec2 vUv;
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec4 testa = vec4(0,0,0,0);
  vec2 c = Area.xy+(vUv-.5)*Area.zw;
  vec2 z;
  int iter;
  for(iter = 0; iter<maxIter;iter++){
    z = vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c;
    if(length(z)>2.) break; 
    
  }
  if (iter == maxIter){
    iter = 0;
  }
  float col = float(iter)/float(maxIter);
  fragColor = vec4(col,col,col, 1.);
}

void main() {

  mainImage(gl_FragColor, gl_FragCoord.xy);
}