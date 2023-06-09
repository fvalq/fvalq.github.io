//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let camera, fieldCamera, skyCamera, scene, bufferScene, bufFieldTex, bufSkyTex, renderer;
let controls;
let materialIndex = 0;
let flowerFieldHeightMap = new THREE.TextureLoader().load("https://raw.githubusercontent.com/fvalq/fvalq.github.io/main/textures/heightmap.png");

let grassField;
let geometry, mesh;

let ovni, cockpit, cylinder;
let house, door, roof;
let windows = [];
let trees = [];
let flowers = [];
let stars = [];
let ovniMovement = new THREE.Vector3(0, 0, 0);

let flowerField;

/* Materials */
let flowerFieldMaterials = [];
let skyMaterials = [];
let ovniMaterials = [];
let cockpitMaterials = [];
let cylinderMaterials = [];
let sphereMaterials = [];
let houseMaterials = [];
let windowMaterials = [];
let doorMaterials = [];
let roofMaterials = [];
let trunkMaterials = [];
let leafMaterials = [];

/* Clock and movement */
let clock = new THREE.Clock();
let delta;
let speed = 10;
let baseRotationValue = 5;

/* Lights */
let lights = [];
let spheres = [];
let spotlight;
let directionalLight;

const numPointLights = 4;
const numberFlowers = 100;
const numberStars = 100;
const flowerMeasures = [1.2, 32];
const PlaneGeometryMeasures = [400, 400];
const textureMeasures = [50, 50];

/* Colors */

const whiteColor = 0xffffff;
const lilacColor = 0xc8a2c8;
const yellowColor = 0xffff00;
const lightBlueColor = 0xadd8e6;
const darkBlueColor = "#0000a0";
const purpleColor = "#c8a2c8";
let colors = [whiteColor, lilacColor, yellowColor, lightBlueColor];

let handlingInput = true;
let animationSequence = 0;

let map = {}; // You could also use an array
onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown'
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
}

function createBufferScene() {
    'use strict';

    bufferScene = new THREE.Scene();
	bufferScene.background = new THREE.Color(0x0000FF);
    bufFieldTex = new THREE.WebGLRenderTarget(4096, 4096,  // TODO: fix later
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );
    bufSkyTex = new THREE.WebGLRenderTarget(4096, 4096,  // TODO: fix later
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createOrthographicCamera(x, y, z, viewSize = 150) {
    let cam = new THREE.OrthographicCamera(-PlaneGeometryMeasures[0]/2, PlaneGeometryMeasures[0]/2, PlaneGeometryMeasures[1]/2, -PlaneGeometryMeasures[1]/2, 0, 1000);
    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;
	return cam;
}

function createPerspectiveCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        2000);
    camera.position.x = 300;
    camera.position.y = 150;
    camera.position.z = 300;
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera, renderer.domElement); // TODO - delete before delivery
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////////
/* Manipulate OBJECT3D(S) */
////////////////////////////
function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function translateObject(obj, x = 0, y = 0, z = 0) {
    obj.translateX(x);
    obj.translateY(y);
    obj.translateZ(z);
}


function getGraphLeafByName(obj, name) {
    if (obj.name == name) {
        return obj;
    }
    else if (obj.children.length == 0) {
        return null;
    }
    else {
        var i;
        var result = null;
        for (i = 0; result == null && i < obj.children.length; i++) {
            result = getGraphLeafByName(obj.children[i], name);
            if (result != null) {
                return result;
            }
        }
    }
    return null;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

/* TODO - Reuse functions from last assignment */

//////////////////////
/* CHECK COLLISIONS */
//////////////////////


///////////////////////
/* HANDLE COLLISIONS */
///////////////////////


////////////
/* UPDATE */
////////////
function update() {
    'use strict';

    var recordedEvents = Object.keys(map).length;
    for (var j = 0; j < recordedEvents; j++) {
        var i = Object.keys(map)[j];
        if (map[i]) {
            if (handlingInput) {
                if (i == 37) { // left arrow
                    ovniMovement.set(-2 * delta * speed, 0, 0);
                    ovni.position.add(ovniMovement);
                }
                else if (i == 38) { // up arrow
                    ovniMovement.set(0, 0, -2 * delta * speed);
                    ovni.position.add(ovniMovement);
                }
                else if (i == 39) { // right arrow
                    ovniMovement.set(2 * delta * speed, 0, 0);
                    ovni.position.add(ovniMovement);
                }
                else if (i == 40) { // down arrow
                    ovniMovement.set(0, 0, 2 * delta * speed);
                    ovni.position.add(ovniMovement);
                }
                if (i == 49) { // 1
                    clearFieldTexture();
                    createFieldTexture();
		            genTextures();
                }
                if (i == 50) { // 2
                    clearSkyTexture();
                    createSkyTexture();
		            genTextures();
                }
                if (i == 81 || i == 113) { //Q or q
		            setMaterials(1);
                    map[81] = false;
                    map[113] = false;
                }
                if (i == 87 || i == 119) { //W or w
		            setMaterials(2);
                    map[87] = false;
                    map[129] = false;
                }
                if (i == 68 || i == 100) { //D or d
                    directionalLight.visible = !directionalLight.visible;
                    map[68] = false;
                    map[100] = false;
                }
                if (i == 69 || i == 101) { //E or e
                    setMaterials(3);
                    map[69] = false;
                    map[101] = false;
                }
                if (i == 80 || i == 112) { //P or p
                    // Activate/Deactivate small lights
                    for (let i = 0; i < numPointLights; i++) {
                        lights[i].visible = !lights[i].visible;
                        map[80] = false;
                        map[112] = false;
                    }
                }
                if (i == 83 || i == 115) { //S or s
                    // Activate/Deactivate spotlight
                    spotlight.visible = !spotlight.visible;
                    map[83] = false;
                    map[115] = false;
                }
                if (i == 82 || i == 114) { //R or r
                    // Activate/Deactivate all light computation
                    if (ovni.material == ovniMaterials[0]) {
                        /* If it is using Basic Material */
                        cycleMaterials();
                    }
                    else {
                        setMaterials(0);
                    }
                    map[82] = false;
                    map[114] = false;
                }
            }
        }
    }

    rotateObject(ovni, 0, baseRotationValue * delta * speed, 0);
    controls.update();
}

function genTextures() {
    renderer.setRenderTarget(bufFieldTex);

    /* Render onto offscreen texture */
    renderer.render(bufferScene, fieldCamera);

    renderer.setRenderTarget(bufSkyTex);
    renderer.render(bufferScene, skyCamera);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.setRenderTarget(null);

    /* Render onto screen */
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    createScene();
    createPerspectiveCamera();

    createBufferScene();
	fieldCamera = createOrthographicCamera(0, 0, 0);
    fieldCamera.lookAt(scene.position);
	skyCamera = createOrthographicCamera(0, 0, 0);
	skyCamera.lookAt(0, 0, 100);

    flowerFieldHeightMap.wrapS = flowerFieldHeightMap.wrapT = THREE.RepeatWrapping;
    createFlowerField();
    createSkyDome();
    createOvni();
    createAlentejoHouse();
    let tree1 = createTree();
    tree1.position.z = 50;
    tree1.position.x = -100;
    let tree2 = createTree(1.3);
    tree2.position.z = -100;
    tree2.position.x = 100;
    // scaleObjectGraph(tree1, 1.5);
    let tree3 = createTree(0.8);
    tree3.position.z = 100;
    tree3.position.x = 100;
    // scaleObjectGraph(tree3, 0.8);
    
    rotateObject(tree2, 0, -90, 0);
    rotateObject(tree3, 0, 45, 0);

    createMoon();

    genTextures();
    render();

    window.addEventListener("resize", onResize);
}

function scaleObjectGraph(obj, factor=1) {
    numChildren = obj.children.length;
    for (let i = 0; i < numChildren; i++) {
        obj.children[i].geometry.scale(factor, factor, factor);
        scaleObjectGraph(obj.children[i], factor);
    }
}


function clearScene() {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
}

function createDoor() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        40, 0, 0,
        40, 40, 0,
        50, 0, 0,
        50, 40, 0,
    ]);
    
    const indices = [
        2,1,0,
        1,2,3,
    ]

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals(); 
	
	if (doorMaterials.length == 0) {
      doorMaterials.push(new THREE.MeshBasicMaterial({ color: 0x483a14, side: THREE.DoubleSide}));
      doorMaterials.push(new THREE.MeshLambertMaterial({ color: 0x483a14, side: THREE.DoubleSide}));
      doorMaterials.push(new THREE.MeshPhongMaterial({ color: 0x483a14, side: THREE.DoubleSide}));
      doorMaterials.push(new THREE.MeshToonMaterial({ color: 0x483a14, side: THREE.DoubleSide}));
	}

    door = new THREE.Mesh( geometry, doorMaterials[0] );
    door.material.side = THREE.DoubleSide;
	house.add(door);
}

function createWindow (x = 20, y = 30) {

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        x, 10, 0,
        x, 40, 0,
        y, 10, 0,
        y, 40 ,0,
    ]);

    const indices = [
        2, 1, 0,
        1, 2, 3,
    ]

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals(); 

	if (windowMaterials.length == 0) {
      windowMaterials.push(new THREE.MeshBasicMaterial({ color: 0x767676, side: THREE.DoubleSide}));
      windowMaterials.push(new THREE.MeshLambertMaterial({ color: 0x767676, side: THREE.DoubleSide}));
      windowMaterials.push(new THREE.MeshPhongMaterial({ color: 0x767676, side: THREE.DoubleSide}));
      windowMaterials.push(new THREE.MeshToonMaterial({ color: 0x767676, side: THREE.DoubleSide}));
	}

    const mesh = new THREE.Mesh( geometry, windowMaterials[0] );
    mesh.material.side = THREE.DoubleSide;
	windows.push(mesh);
    house.add(mesh);
}

function createRoof() {
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        110.0, 50.0,  10.0, // v0
        -10.0,  50.0,  10.0, // v1
        -10.0, 50.0, -60.0, // v2
        110.0, 50.0, -60.0, // v3

        // roof tip
        50, 70, -25 // v4
    ]);

    const indices = [
        1, 2, 4,
        0, 1, 4,
        2, 3, 4,
        4, 3, 0,

        // roof floor
        0, 1, 2,
        1, 2, 3,
    ]

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	
	if (roofMaterials.length == 0) {
      roofMaterials.push(new THREE.MeshBasicMaterial({ color: 0x3b25dc, side: THREE.DoubleSide}));
      roofMaterials.push(new THREE.MeshLambertMaterial({ color: 0x3b25dc, side: THREE.DoubleSide}));
      roofMaterials.push(new THREE.MeshPhongMaterial({ color: 0x3b25dc, side: THREE.DoubleSide}));
      roofMaterials.push(new THREE.MeshToonMaterial({ color: 0x3b25dc, side: THREE.DoubleSide}));
	}

    roof = new THREE.Mesh( geometry, roofMaterials[0] );
    geometry.computeVertexNormals(); 
    scene.add(roof);
}


function createAlentejoHouse() {
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        // side walls floor and ceiling
        0.0, 0.0,  0.0, // v0
        100.0, 0.0,  0.0, // v1
        100.0, 50.0,  0.0, // v2
        0.0,  50.0,  0.0, // v3
        0.0, 0.0, -50.0, // v4
        0.0, 50.0, -50.0, // v5
        100.0, 0.0, -50.0, // v6
        100.0, 50.0, -50.0, // v7

        // portion of wall up to window 1
        20, 0, 0, // v8 = v1.2
        20.0, 50.0,  0.0, // v9 = v2.2
        
        // below window 1
        20, 10, 0, // v10
        30, 10, 0, // 11
        30, 0, 0, // 12

        // above window 1
        20, 40, 0, // 13
        30, 40, 0, // 14
        30, 50, 0, //15

        // above door
        40, 40, 0, // 16
        40, 50, 0, // 17
        50, 40, 0, // 18
        50, 50, 0, // 19

        // wall up to door
        40, 0, 0, // 20

        // portion of wall below window 2
        50, 0, 0, // 21
        100, 0, 0, // 22
        50, 10, 0, // 23
        100, 10, 0, // 24

        // portion of wall above window 2
        50, 40, 0, // 25
        100, 40, 0, // 26
        50, 50, 0, // 27
        100, 50, 0, // 28

        // window 2
        70, 10, 0, // 29
        80, 10, 0, // 30
        70, 40, 0, // 31
        80, 40, 0, // 32
    ]); 

    const indices = [
        // portion of wall up to window
        9, 8, 0,
        0, 3, 9,

        // below window
        8, 10, 11,  
        8, 11, 12,

        // above window
        9, 13, 14,
        14, 15, 9,

        // wall up to door
        12, 15, 20,
        17, 20, 15,

        // door
        16, 17, 18,
        19, 18, 17,

        // below window 2
        21, 22, 23,
        24, 23, 22,
        // above window 2
        25, 26, 27,
        28, 27, 26,

        // from door to window 2
        23, 25, 29,
        31, 29, 25,

        // from window 2 to end of wall
        24, 26, 30,
        32, 30, 26,

        // side walls floor and ceiling
        0, 4, 5,
        5, 3, 0,

        // floor and ceiling
        1,6,7,
        7,2,1,
        6,4,1,
        4,0,1,

        // BEHIND WALL
        6,5,4,
        5,6,7,
    ];

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	if (houseMaterials.length == 0) {
      houseMaterials.push(new THREE.MeshBasicMaterial({ color: 0xcccccc}));
      houseMaterials.push(new THREE.MeshLambertMaterial({ color: 0xcccccc}));
      houseMaterials.push(new THREE.MeshPhongMaterial({ color: 0xcccccc}));
      houseMaterials.push(new THREE.MeshToonMaterial({ color: 0xcccccc}));
	}

    house = new THREE.Mesh( geometry, houseMaterials[0] );
    house.material.side = THREE.DoubleSide;
    geometry.computeVertexNormals();
    createWindow();
    createDoor();
    createWindow(70, 80);
    createRoof();
    scene.add(house);
}

function cycleMaterials() {
	(++materialIndex ? materialIndex %= 4 : materialIndex = 0);
	setMaterials();
}

function setMaterials(index = materialIndex) {
	materialIndex = index;
	// Should also do recursively instead of having all these globals
	ovni.material = ovniMaterials[index];
	cockpit.material = cockpitMaterials[index];
	cylinder.material = cylinderMaterials[index];
	for (var i = 0; i < spheres.length; i++)
		spheres[i].material = sphereMaterials[index];
	// Should also do recursively for windows and stuff
	house.material = houseMaterials[index];
    house.material.side = THREE.DoubleSide;
	door.material = doorMaterials[index];
	for (var i = 0; i < windows.length; i++)
		windows[i].material = windowMaterials[index];
	roof.material = roofMaterials[index];
	for (var i = 0; i < trees.length; i++) {
		// For trunk in trees
		for (var j=0; j<4; j++) {
			trees[i].children[j].material = trunkMaterials[index];
		    // For leaves in trees
			if (trees[i].children[j].children.length > 0)
		      trees[i].children[j].children[0].material = leafMaterials[index];
		}
	}

	switch (materialIndex) {
		case 0:
			console.log("Basic");
			break;
		case 1:
			console.log("Lambert");
			break;
		case 2:
			console.log("Phong");
			break;
		case 3:
			console.log("Toon");
			break;
	}
}

function createOvni() {

    /* ovni */
    var ovniGeometry = new THREE.SphereGeometry(50, 32, 32);
    ovniMaterials.push(new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    ovniMaterials.push(new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
    ovniMaterials.push(new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    ovniMaterials.push(new THREE.MeshToonMaterial({ color: 0x00ff00 }));
    ovniGeometry.scale(1, 0.1, 1); // flatten the ship
    ovni = new THREE.Mesh(ovniGeometry, ovniMaterials[0]);
    // ovni.position.z = -0.1;
    ovni.position.y = 150;
    scene.add(ovni);

    /* cockpit */
    var cockpitGeometry = new THREE.SphereGeometry(20, 32, 32,  Math.PI, Math.PI, 3*Math.PI/2);
    cockpitMaterials.push(new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide}));
    cockpitMaterials.push(new THREE.MeshLambertMaterial({ color: 0x0000ff, side: THREE.DoubleSide}));
    cockpitMaterials.push(new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide}));
    cockpitMaterials.push(new THREE.MeshToonMaterial({ color: 0x0000ff, side: THREE.DoubleSide}));
    cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterials[0]);
    ovni.add(cockpit);

    /* spot light */
    var cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    // var cylinderMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    cylinderMaterials.push(new THREE.MeshBasicMaterial({color: 0xffff00}));
    cylinderMaterials.push(new THREE.MeshLambertMaterial({color: 0xffff00}));
    cylinderMaterials.push(new THREE.MeshPhongMaterial({color: 0xffff00}));
    cylinderMaterials.push(new THREE.MeshToonMaterial({color: 0xffff00}));
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterials[0]);
    cylinderGeometry.scale(1, 0.7, 1);
    // translateObject(cylinderMesh, 0, -5, 0);
    ovni.add(cylinder);

	// white spotlight shining from the side, modulated by a texture, casting a shadow
    spotlight = new THREE.SpotLight(0xffffff, 0.4, 0, Math.PI/6, 0.2, 2);
    spotlight.position.set( 0, 140, 0 );
    
	spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    
    spotlight.shadow.camera.near = 500;
    spotlight.shadow.camera.far = 4000;
    spotlight.shadow.camera.fov = 30;
    cylinder.add(spotlight);

    let target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    spotlight.target = target;
	cylinder.add(target);

    /* create 4 spheres */
    var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    // var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    sphereMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    sphereMaterials.push(new THREE.MeshLambertMaterial({ color: 0xff0000 }));
    sphereMaterials.push(new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    sphereMaterials.push(new THREE.MeshToonMaterial({ color: 0xff0000 }));

    for (let i = 0; i < numPointLights; i++) {
       let sphere = new THREE.Mesh(sphereGeometry, sphereMaterials[0]);
       spheres.push(sphere);
       ovni.add(sphere);
       const light = new THREE.PointLight(0xffffff, 0.05, 0, 1000);
       light.position = sphere.position;
	   light.position.y -= 10;
       sphere.add(light);
       lights.push(light);
    }
    
    translateObject(spheres[0], 30, -2, 20);
    translateObject(spheres[1], -30, -2, -20);
    translateObject(spheres[2], 30, -2, -16);
    translateObject(spheres[3], -30, -2, 16);
}

function clearField() {
    for (let i = 0; i < numFlowers; i++) {
        scene.remove(flowers[i]);
    }
    flowers = [];

    scene.remove(flowerField);
}

function createFlowerField() {
    let flowerFieldGeometry = new THREE.PlaneBufferGeometry(PlaneGeometryMeasures[0] * 3, PlaneGeometryMeasures[1] * 3, textureMeasures[0] * 3, textureMeasures[1] * 3);
    if (flowerFieldMaterials.length == 0) {
       flowerFieldMaterials.push(new THREE.MeshPhongMaterial({color: 0xffffff, map: bufFieldTex.texture, displacementMap: flowerFieldHeightMap, displacementScale: 20, displacementBias: 0, bumpMap: flowerFieldHeightMap, bumpScale: 20, side: THREE.DoubleSide}));
    }
    flowerField = new THREE.Mesh(flowerFieldGeometry, flowerFieldMaterials[0]);
    // uncomment to see the back of the plane
    // // flowerField.material.side = THREE.DoubleSide;
    rotateObject(flowerField, -90, 0, 45);
    scene.add(flowerField);

    createFieldTexture();
}

function createFieldTexture() {
    let texturePlaneGeometry = new THREE.PlaneBufferGeometry(PlaneGeometryMeasures[0], PlaneGeometryMeasures[1]);
    let texturePlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00});
    grassField = new THREE.Mesh(texturePlaneGeometry, texturePlaneMaterial);
    grassField.position.z = -50;
    bufferScene.add(grassField);

    createFlowers(numberFlowers);
}

function clearFieldTexture() {
    bufferScene.remove(grassField);
    grassField = null;

    for (let i = 0; i < numberFlowers; i++) {
        bufferScene.remove(flowers[i]);
    }
    flowers = [];
}


function clearSkyTexture() {
    for (let i = 0; i < numberStars; i++) {
        bufferScene.remove(stars[i]);
    }
    stars = [];
}

function createFlowers(n=-1) {
    for (var i = 0; i < n; i++) {
        let color = getFlowerColor();
        let circleGeometry = new THREE.CircleGeometry(flowerMeasures[0], flowerMeasures[1]);
        let circleMaterial = new THREE.MeshBasicMaterial({ color: color });
        let circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.x = getRandomPosition(-2* PlaneGeometryMeasures[0]/9+flowerMeasures[0]*2/9, 2*PlaneGeometryMeasures[0]/9-flowerMeasures[0]*2/9);
        circle.position.y = getRandomPosition(-2*PlaneGeometryMeasures[1]/9+flowerMeasures[0]*2/9, 2*PlaneGeometryMeasures[1]/9-flowerMeasures[0]*2/9);
        bufferScene.add(circle);
        flowers.push(circle);
    }
}

function createTree(scalingFactor = 1) {
    var trunkGeometry = new THREE.CylinderGeometry(6, 6, 40, 40);

    trunkGeometry.scale(scalingFactor, scalingFactor, scalingFactor);
    if (trunkMaterials.length == 0) {
      trunkMaterials.push(new THREE.MeshBasicMaterial({color: 0x8b4513}));
      trunkMaterials.push(new THREE.MeshLambertMaterial({color: 0x8b4513}));
      trunkMaterials.push(new THREE.MeshPhongMaterial({color: 0x8b4513}));
      trunkMaterials.push(new THREE.MeshToonMaterial({color: 0x8b4513}));
    }
    var trunks = new THREE.Object3D();
    var trunk = new THREE.Mesh(trunkGeometry, trunkMaterials[0]); // first rotation
    var trunk2 = new THREE.Mesh(trunkGeometry, trunkMaterials[0]); // side trunk
    var trunk3 = new THREE.Mesh(trunkGeometry, trunkMaterials[0]); // Main trunk
    var trunk4 = new THREE.Mesh(trunkGeometry, trunkMaterials[0]); // big rotation
    trunks.add(trunk);
    trunks.add(trunk2);
    trunks.add(trunk3);
    trunks.add(trunk4);
    trunks.position.y = 50 * scalingFactor;
    trunks.position.z = 10 * scalingFactor;
    
    translateObject(trunk, 0 * scalingFactor, -5 * scalingFactor, 8 * scalingFactor);
    rotateObject(trunk, 30, 0, 0);
    translateObject(trunk3, 0 * scalingFactor, -35 * scalingFactor, 0 * scalingFactor);
    translateObject(trunk2, -14 * scalingFactor, 0 * scalingFactor, 6 * scalingFactor);
    rotateObject(trunk2, 0, 0, 60);
    translateObject(trunk4, 0 * scalingFactor, -11 * scalingFactor, -14 * scalingFactor);
    rotateObject(trunk4, -60, 0, 0);

    var leavesGeometry = new THREE.SphereGeometry(28, 32, 32);
    leavesGeometry.scale(scalingFactor, scalingFactor, scalingFactor);
    if (leafMaterials.length == 0) {
      leafMaterials.push(new THREE.MeshBasicMaterial({color: 0x026440}));
      leafMaterials.push(new THREE.MeshLambertMaterial({color: 0x026440}));
      leafMaterials.push(new THREE.MeshPhongMaterial({color: 0x026440}));
      leafMaterials.push(new THREE.MeshToonMaterial({color: 0x026440}));
    }
    var leaves1 = new THREE.Mesh(leavesGeometry, leafMaterials[0]);
    var leaves2 = new THREE.Mesh(leavesGeometry, leafMaterials[0]);
    var leaves3 = new THREE.Mesh(leavesGeometry, leafMaterials[0]);
    leaves1.position.y = 20* scalingFactor;
    leaves2.position.y = 20* scalingFactor;
    leaves3.position.y = 20* scalingFactor;
    leavesGeometry.scale(0.8, 0.5, 1); // flatten the sphere
    trunk.add(leaves1);
    trunk2.add(leaves2);
    trunk4.add(leaves3);
    scene.add(trunks);

    trees.push(trunks);
    return trunks;
}

function createMoon() {
    var moonGeometry = new THREE.SphereGeometry(20, 32, 32);
    var moonMaterial = new THREE.MeshStandardMaterial({ color: 0xf0c420, side: THREE.BackSide });
    moonMaterial.emissive = new THREE.Color(0xf0c420);
    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
    translateObject(moon, 0, 250, -80);
    scene.add(moon);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffff00, 0);
    moon.add(directionalLight);
}

function getFlowerColor() {
    var index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}


function createSkyDome() {
	createSkyTexture();
    var skyDomeGeometry = new THREE.SphereBufferGeometry(PlaneGeometryMeasures[0], 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    // var skyDomeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, map: bufSkyTex.texture });
    skyMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, map: bufSkyTex.texture }));
    skyMaterials.push(new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide, map: bufSkyTex.texture }));
    skyMaterials.push(new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.BackSide, map: bufSkyTex.texture }));
    skyMaterials.push(new THREE.MeshToonMaterial({ color: 0xffffff, side: THREE.BackSide, map: bufSkyTex.texture }));
    var skyDome = new THREE.Mesh(skyDomeGeometry, skyMaterials[2]);
    scene.add(skyDome);
}

function createSkyTexture() {
	bufferScene.background = createGradientBackground();
    createStars();
}

function createStars() {
    /* add stars */
    var starsGeometry = new THREE.SphereGeometry(0.5, 50, 60);
    var starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    for (var i = 0; i < numberStars; i++) {
        var star = new THREE.Points(starsGeometry, starsMaterial);
        star.position.x = getRandomPosition(-200, 200);
        star.position.y = getRandomPosition(-200, 200);
        star.position.z = 100;
        bufferScene.add(star);
        stars.push(star);
    }
}

function createGradientBackground() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var gradient = context.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, darkBlueColor);
    gradient.addColorStop(0.3, purpleColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    delta = clock.getDelta();
    update();
    render();

	renderer.setAnimationLoop(animate);

    
}
////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
