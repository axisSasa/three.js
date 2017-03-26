var scene, camera, renderer, container;
var geometry, material, cube, controls;

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

	//控制器
	controls = new THREE.TrackballControls( camera );
	controls.keys = [65, 83, 68];
	controls.addEventListener('change', render);

	//container包含小车主体和轮胎，方便之后做旋转
	container = new THREE.Object3D();
	scene.add(container);

	var loader = new THREE.TextureLoader();

	//地面纹理
	var textureFloor = loader.load('./img/floor.jpg', function(){	
		console.log('加载完了')
	} );
	textureFloor.magFilter = THREE.LinearFilter;
	textureFloor.minFilter = THREE.LinearFilter;

	//小车纹理
	var materials = [],
		textureCar,
		materialCar;
	for (var i = 6; i > 0; i--) {
		//导入图片作为纹理
		textureCar = loader.load('./img/girl' + i + '.png',function() {});
		textureCar.magFilter = THREE.LinearFilter;
		textureCar.minFilter = THREE.LinearFilter;
		//通过纹理设置材质
		materialCar = new THREE.MeshBasicMaterial({
			map: textureCar,
			overdraw: true
		})

		materials.push(materialCar);
	}
	//小车主体
	cube = new THREE.Mesh(new THREE.CubeGeometry(6, 2, 3), materials ); 
	container.add(cube);
	cube.castShadow = true;

	//轮胎纹理
	var textureWheel = loader.load('./img/wheel.png');
	textureWheel.magFilter = THREE.LinearFilter;
	textureWheel.minFilter = THREE.LinearFilter;	
	//小车轮胎
	var torus1 = getTorus(textureWheel),
		torus2 = getTorus(textureWheel),
		torus3 = getTorus(textureWheel),
		torus4 = getTorus(textureWheel);

	torus1.position.set(2, -1, 1.5);
	torus2.position.set(-2, -1, 1.5);
	torus3.position.set(2, -1, -1.5);
	torus4.position.set(-2, -1, -1.5);

	container.add(torus1);
	container.add(torus2);
	container.add(torus3);
	container.add(torus4);

	torus1.castShadow = true;
	torus2.castShadow = true;
	torus3.castShadow = true;
	torus4.castShadow = true;


	//地平面
	var geometry = new THREE.PlaneGeometry( 15, 15 );
	var material = new THREE.MeshPhongMaterial( {
		map: textureFloor,
		overdraw: true
	} );
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );	
	plane.rotation.x -= Math.PI / 2;
	plane.position.y = -1.6;
	plane.receiveShadow = true;

	//坐标系 
	var axisHelper = new THREE.AxisHelper( 5 );
	scene.add( axisHelper );

	setTimeout(render, 0);
}

function animate() {

	requestAnimationFrame( animate );	

	// cube.rotation.x += 0.01;
	//container.rotation.y += 0.01;
	controls.update();

	//render();
}

function render() {
	console.log(1);
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

function getTorus(texture) {
	return new THREE.Mesh( new THREE.TorusGeometry(.5, .2, 30, 60), new THREE.MeshPhongMaterial( {
		map: texture,
		overdraw: true
	}) );	
}