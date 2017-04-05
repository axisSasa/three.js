var scene, 
	camera, 
	renderer, 
	container,
	geometry, 
	material, 
	directionalLight;

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
	var cylinder = new THREE.Mesh(new THREE.TorusKnotGeometry(2, .2, 100, 18)); 
	container.add(cylinder);
	cylinder.castShadow = true;


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

	//载入shader
	$.get('../shader/cartoon.vs', function(vShader) {
		$.get('../shader/cartoon.fs', function(fShader) {

			var mtl = getCartoonMtl( vShader, fShader, directionalLight );
			cylinder.material = mtl;
			torus.forEach(function(item, index, array) {
				item.material = mtl;
			});
		});
	});

}

function animate() {

	requestAnimationFrame( animate );

	container.rotation.y += 0.01;

	renderer.render( scene, camera );

}

function getCamera(scene) {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set( -2, 2, 5 );
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
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 

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

function getCartoonMtl( vs, fs, light ) {

	return new THREE.ShaderMaterial({
		vertexShader: vs,
		fragmentShader: fs,
		uniforms: {
			uColor: {
				type: 'v3',
				value: new THREE.Color( '#f44336' )//传递给着色器的颜色值
			},
			uLight: {
				type: 'v3',
				value: light.position
			}
		},
		side: THREE.DoubleSide
	});
}