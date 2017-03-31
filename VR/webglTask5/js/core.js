var scene, camera, renderer, 
	car, geometry, material, 
	cube, controls, stats,
	isTurning = false,
	torusArr = [];

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

	//添加地面
	getFloor(scene)

	//添加小车
	getCar(scene);

	//坐标系 
	var axisHelper = new THREE.AxisHelper( 5 );
	scene.add( axisHelper );

	getStats();

	//窗口大小改变
	window.addEventListener( 'resize', onWindowResize, false );

	//监听移动
	document.addEventListener('keydown', handleMove, false);
}

function animate() {

	requestAnimationFrame( animate );	

	controls.update();

	stats.update();

	render();
}

function render() {
	camera.lookAt( car.getWorldPosition() );
	renderer.render( scene, camera );
}

function getCamera(scene) {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set( 10, 10, 10 );
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

	directionalLight.position.set(-10, 25, 25);
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.castShadow = true;

	// directionalLight.position.set(-40, 60, -10);
	directionalLight.shadow.camera.near = 2;
	directionalLight.shadow.camera.far = 300;
	directionalLight.shadow.camera.top = 20;
	directionalLight.shadow.camera.bottom = -20;
	directionalLight.shadow.camera.left = -20;
	directionalLight.shadow.camera.right = 20;
    directionalLight.shadowDarkness = 1;

	var camH = new THREE.CameraHelper( directionalLight.shadow.camera );
	scene.add(camH);
}

function getTorus(texture) {
	return new THREE.Mesh( new THREE.TorusGeometry(.5, .2, 30, 60), new THREE.MeshPhongMaterial( {
		map: texture,
		overdraw: true
	}) );	
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function handleMove(ev) {

	switch(ev.keyCode) {
		case 37:
		case 65:
			//左转，逆时针
			turn(1);
			break;
		case 38:
		case 87:
			move(1);
			break;
		case 39:
		case 68:
			//右转， 顺时针
			turn(-1);
			break;
		case 40:
		case 83:
			move(-1);
			break;
	}
}

function turn(turn) {
	if (isTurning) {
		//turn<0 左转 >0右转
		car.rotation.y += .1 * turn;
	} else {
		isTurning = true;
	}
	var angle = Math.PI / 2 + Math.PI / 6 * turn;
	torusArr[0].rotation.y = angle;
	torusArr[1].rotation.y = angle;
}

function move(move) {
	if (isTurning) {

		isTurning = false;
		torusArr[0].rotation.y = Math.PI / 2;
		torusArr[1].rotation.y = Math.PI / 2;
	} else {

		var direct = car.getWorldDirection();

		car.position.x += move * direct.x ;
		car.position.z += move * direct.z ;
	}
}

function getStats() {
	//帧率监控
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.right = '0';
	stats.domElement.style.top = '0';
	document.getElementsByTagName('body')[0].appendChild(stats.domElement);	
}

function getCar(scene) {
	var loader = new THREE.TextureLoader();

	//car包含小车主体和轮胎，方便之后做旋转
	car = new THREE.Object3D();
	scene.add(car);

	//小车纹理
	var materials = [],
		textureCar,
		materialCar;
	for (var i = 6; i > 0; i--) {
		//导入图片作为纹理
		textureCar = loader.load('./img/car' + i + '.png');
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
	cube = new THREE.Mesh(new THREE.CubeGeometry(3, 2, 6), materials ); 
	scene.add(cube);
	car.add(cube);
	cube.castShadow = true;

	//轮胎纹理
	var textureWheel = loader.load('./img/wheel.png');
	textureWheel.magFilter = THREE.LinearFilter;
	textureWheel.minFilter = THREE.LinearFilter;	
	//小车轮胎
	for (let i = 0; i <= 3; i++) {
		torusArr[i] = getTorus(textureWheel);
		torusArr[i].castShadow = true;
		torusArr[i].rotation.y = Math.PI / 2;
		scene.add(torusArr[i]);
		car.add(torusArr[i]);
	}

	torusArr[0].position.set(1.5, -1, 1.5);
	torusArr[1].position.set(-1.5, -1, 1.5);
	torusArr[2].position.set(1.5, -1, -1.5);
	torusArr[3].position.set(-1.5, -1, -1.5);	
}

function getFloor(scene) {
	var loader = new THREE.TextureLoader();

	//地面纹理
	var textureFloor = loader.load('./img/floor.jpg');
	// textureFloor.magFilter = THREE.LinearFilter;
	// textureFloor.minFilter = THREE.LinearFilter;
	textureFloor.wrapS = textureFloor.wrapT = THREE.RepeatWrapping;
	textureFloor.repeat.set(5,5);
	textureFloor.magFilter = THREE.LinearFilter;
	textureFloor.minFilter = THREE.LinearFilter;
	//地面
	var geometry = new THREE.PlaneGeometry( 50, 50 );
	var material = new THREE.MeshPhongMaterial( {
		map: textureFloor,
		overdraw: true,
		side: THREE.DoubleSide
	} );
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );	
	plane.rotation.x -= Math.PI / 2;
	plane.position.y = -1.7;
	plane.receiveShadow = true;
}