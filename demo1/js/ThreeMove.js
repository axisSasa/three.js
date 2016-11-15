/*
*@author shaYanL / https://github.com/axisSasa 
*/

THREE.ThreeMove = function( scene, camera, controls, orient ) {
	//assign pointer this to that to avoid unexpected errors brought by this. 
	var that = this;

	//used to count
	var count = 0;
	var raycaster = new THREE.Raycaster();

	//set the orient to (0,0,1)->camera point positive axis of Z
	//or (0,0,-1)->camera point negative axis of Z
	var negAxis = new THREE.Vector3( 0, 0, -1 );
	if ( orient && orient.z != 0 ) {
		orient.setX( 0 );
		orient.setY( 0 );
		orient.z /= Math.abs( orient.z );
	} else {
		orient = negAxis;
	}

	//set the target of controls
	controls.target.set(
		camera.position.x + orient.x,
		camera.position.y + orient.y,
		camera.position.z + orient.z
		);

	//init the ForwardIcon and BackwardIcon
	this.init = function( url, redius ) {
		var loader, circleGeometry;
		//set default value
		url = ( arguments[0] && typeof arguments[0] === 'string' ) ? arguments[0] : './img/Forward.png';
		redius = ( arguments[1] && typeof arguments[1] === 'number')  ? arguments[1] : 30;

		loader = new THREE.TextureLoader(),
		circleGeometry = new THREE.CircleGeometry( redius, 100 );
		loader.load( url,
		        	function(texture) {
		        		var material = new THREE.MeshBasicMaterial({
						    map: texture
						});
						var Forward = new THREE.Mesh( circleGeometry, material );
						var Backward = new THREE.Mesh( circleGeometry, material );
						var x_cam = camera.position.x;
						var y_cam = camera.position.y;
						var z_cam = camera.position.z;

						redius = orient.z < 0 ? redius : -redius;
						orient = orient.multiplyScalar( 500 );
						Forward.position.set( x_cam, y_cam, z_cam + orient.z );
						Backward.position.set( x_cam + 2 * redius, y_cam, z_cam + orient.z );

						//rotate to a appropriate angle  for a good display
						Forward.rotation.x -= 45 * Math.PI / 180;
						Backward.rotation.z -= Math.PI;
						Backward.rotation.x -= 45 * Math.PI / 180;

						if ( orient.z > 0) {
							Forward.rotation.y += Math.PI;
							Backward.rotation.y += Math.PI;
						};					

						that.Forward = Forward;
						that.Backward = Backward;
					    scene.add( that.Forward );
					    scene.add( that.Backward );
		        	});
	};

	this.update = function() {
		var intersect = '', 
			speed = 1,
			direct;
		raycaster.setFromCamera( {x: 0, y: 0}, camera );

		//move forward
		if ( that.Forward !== undefined) {
			intersect = raycaster.intersectObject( that.Forward );
			speed = -speed;
		}
		//move backward
		if ( that.Backward !== undefined && intersect == '') {
			intersect = raycaster.intersectObject( that.Backward );
			speed = -speed;
		}
		//orientation change if the controls towards Z positive half axis
		if ( orient.z > 0 ) {
			speed = -speed;
		};

		//while crosspair point the Icon(Forward or Backward)
		if ( intersect.length > 0 ) {
			//reset intersect to '';
			intersect = '';

			//count plus 1 per frame
			count++;

			//prevent overflow
			count = count > 12000 ? 121 : count;

			//if the crosspair point the Icon(Forward or Backward) for 120 frams(about 2s), start move
			if ( count > 120 ) {
				camera.position.z += speed;
				that.Forward.position.z += speed;
				that.Backward.position.z += speed;

				direct = camera.getWorldDirection();
				controls.target.set(
					camera.position.x + direct.x,
					camera.position.y + direct.y,
					camera.position.z + direct.z
					);
			}
		} else {
			//reset count to 0;
			count = 0;
		}	
	};
};