uniform vec3 iResolution;
uniform int maxIter;
const float scale = 3.0;

vec2 squareImaginary(vec2 number){
	return vec2(
		pow(number.x,2.0)-pow(number.y,2.0),
		2.0*number.x*number.y
	);
}

float iterateMandelbrot(vec2 coord){
	vec2 z = vec2(0.0,0.0);
	for(int i=0;i<maxIter;i++){
		z = squareImaginary(z) + coord;
		if(length(z)>2.0) return float(i);
	}
	return float(maxIter);
}
 void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    
    vec2 uv= fragCoord.xy/iResolution.xy;
    uv.y/=iResolution.x*(1.0/iResolution.y) ;
    uv*=scale;
    uv.x-=2.0;
    
    float col = iterateMandelbrot(uv)/float(maxIter);
    fragColor = vec4(col,col,col,1.0);
  }

  void main() {
    
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }