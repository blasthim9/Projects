precision highp float;
uniform vec3 iResolution;
uniform vec4 Area;
uniform float maxIter;
uniform float numzoom;
varying vec2 vUv;
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 c = Area.xy+(vUv-.5)*Area.zw;
    vec2 z;
    z.x = 3.0 * (vUv.x - 0.5);
    z.y = 2.0 * (vUv.y - 0.5);

    int i;
    for(i=0; i<int(maxIter); i++) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;

        if((x * x + y * y) > 4.0) break;
        z.x = x;
        z.y = y;
    }
    vec3 col = vec3((i == int(maxIter) ? 0.0 : float(i)) / 100.0);
    fragColor = vec4(col,1.0);
}
void main() {

  mainImage(gl_FragColor, gl_FragCoord.xy);
}