uniform vec3 uColor;
uniform vec3 uLight;

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vLight;

void main() {
	vColor = uColor;
	vNormal = normalize(normalMatrix * normal);

	vec4 viewLight = viewMatrix * vec4( uLight, 1.0 );
	vLight = viewLight.xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );//每个顶点的位置转换
}