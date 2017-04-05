var scene, camera, renderer, container;
var geometry, material, cube;

init();
animate();

function init() {

	scene = new THREE.Scene();

	//添加相机
	getCamera(scene);

	//设置渲染器
	getRenderer();

	//还要有光
	getLight(scene);

	container = new THREE.Object3D();
	scene.add(container);

	//小车主体
	cube = new THREE.Mesh(new THREE.CubeGeometry(6, 2, 3), new THREE.MeshPhongMaterial({
	    color: 0xffffff,
	    specular: 0xeeeeee
	})); 
	container.add(cube);
	cube.castShadow = true;

	//小车轮胎
	var torus = [];
	for (var i = 0; i < 4; i++) {
		torus.push(getTorus());
		container.add(torus[i]);
		torus[i].castShadow = true;
	}

	torus[0].position.set(2, -1, 1.5);
	torus[1].position.set(-2, -1, 1.5);
	torus[2].position.set(2, -1, -1.5);
	torus[3].position.set(-2, -1, -1.5);


	//地平面
	var geometry = new THREE.PlaneGeometry( 15, 15 );
	var material = new THREE.MeshPhongMaterial( {color: 0xa3b77a, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );	
	plane.rotation.x += Math.PI / 2;
	plane.position.y = -1.7;
	plane.receiveShadow = true;

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

function getCamera(scene) {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set( 5, 3, 4 );
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
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	document.getElementsByTagName('body')[0].appendChild(renderer.domElement); 
}
function getLight(scene) {
	var ambientLight = new THREE.AmbientLight( 0x666666 );
	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 

	scene.add( ambientLight );
	scene.add( directionalLight );

	directionalLight.position.set(-2, 5, 5);
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.castShadow = true;

	var camH = new THREE.CameraHelper( directionalLight.shadow.camera );
	scene.add(camH);
}

function getTorus() {
	return new THREE.Mesh( new THREE.TorusGeometry(.5, .2, 30, 60), new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		specular: 0xeeeeee
	}) );	
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}