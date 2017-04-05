var scene, camera, renderer, container;
var geometry, material, cube;

init();
animate();

function init() {

	scene = new THREE.Scene();

	//添加相机
	getCamera(scene,5, 3, 4);

	//设置渲染器
	getRenderer();

	//还要有光
	getLight(scene);

	container = new THREE.Object3D();
	scene.add(container);

	//小车主体
	cube = new THREE.Mesh(new THREE.CubeGeometry(6, 2, 3), new THREE.MeshPhongMaterial({
	    color: 0xffffff
	})); 
	container.add(cube);

	//小车轮胎
	var torus1 = getTorus();
	torus1.position.set(2.5, -1, 1.5);
	container.add(torus1);
	var torus1 = getTorus();
	torus1.position.set(-2.5, -1, 1.5);
	container.add(torus1);	
	var torus1 = getTorus();
	torus1.position.set(2.5, -1, -1.5);
	container.add(torus1);
	var torus1 = getTorus();
	torus1.position.set(-2.5, -1, -1.5);
	container.add(torus1);		

	//坐标系 
	var axisHelper = new THREE.AxisHelper( 5 );
	scene.add( axisHelper );

	//窗口大小改变
	window.addEventListener( 'resize', onWindowResize, false );

}

function animate() {

	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	container.rotation.y += 0.01;

	renderer.render( scene, camera );

}

function getCamera(scene, x, y, z) {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set( x, y, z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( camera );
}
function getRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		precision: 'highp' // highp/mediump/lowp
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0x404040 );
	document.getElementsByTagName('body')[0].appendChild(renderer.domElement); 
}
function getLight(scene) {
	var ambientLight = new THREE.AmbientLight( 0x666666 );
	var directionalLight = new THREE.DirectionalLight(0x989898);
	directionalLight.position.set(5, 6, 4); 
	scene.add( ambientLight );
	scene.add( directionalLight );
}

function getTorus() {
	return new THREE.Mesh( new THREE.TorusGeometry(.3, .2, 30, 60), new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		specular: 0xeeeeee
	}) );	
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}