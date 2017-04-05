var scene, camera, renderer, 
	car = [], geometry, material, 
	cube, controls, stats,
	isTurning = false;

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
	//getDaeCar( scene );
	getCar( scene, '../model/car1/', new THREE.Vector3( 0, 0, 0 ) );
	getCar( scene, '../model/car2/', new THREE.Vector3( 0, 0, 10 ) );
	getCar( scene, '../model/car3/', new THREE.Vector3( 0, 0, 20 ) );

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

	if (car[0] ) {
		camera.lookAt( car[0].getWorldPosition() );
	}
	
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
		car[0].rotation.y += .1 * turn;
	} else {
		isTurning = true;
	}
}

function move(move) {
	if (isTurning) {

		isTurning = false;
				
	} else {

		var direct = car[0].getWorldDirection(),
			x = direct.x,
			z = direct.z;
		//因为加载的模型在世界坐标中其方向在x轴正半轴，所以，移动的时候调整其direction
		car[0].position.x += move * ( z * 1 + x * 0 ) ;
		car[0].position.z += move * ( z * 0 - x * 1 ) ;
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

function getCar(scene, path, pos) {

	//THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( path );
	mtlLoader.load( 'file.mtl', function( materials ) {

		materials.preload();
		console.log(materials);
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( path );
		objLoader.load( 'file.obj', function ( obj ) {

			obj.position.set( pos.x, pos.y, pos.z );
			obj.castShadow = true;
			obj.receiveShadow = true;
			scene.add( obj );

			obj.children.forEach( function( item, index, array ) {

				item.castShadow = true;
				item.receiveShadow = true;
			} );

			car.push( obj );

		}, onProgress, onError );
	});
}

function getDaeCar( scene ) {
	var loader = new THREE.ColladaLoader();

	loader.load( '../model/car11/file.dae', function( collada ) {
		scene.add( collada.scene );
		console.log(collada)
	}, onProgress );
}

function onProgress ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded');
	}
}

function onError ( error ) {
	console.log('loading error');
}

function getFloor(scene) {
	var loader = new THREE.TextureLoader();

	//地面纹理
	var textureFloor = loader.load('./img/floor.jpg');

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
	plane.position.y = 0;
	plane.receiveShadow = true;
}