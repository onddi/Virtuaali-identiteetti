var scene, camera, renderer, controls;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

function init() {
    scene = new THREE.Scene();

    initMesh();
    initCamera();
    initLights();
    initRenderer();
    initControls();

    //

    window.addEventListener( 'resize', onWindowResize, false );     

    document.body.appendChild(renderer.domElement);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}   

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);
}

function initControls() {
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

var mesh = null;
function initMesh() {
    var loader = new THREE.JSONLoader();
    loader.load('./otso.json', function(geometry, materials) {
        //mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        //mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
        //mesh.translation = THREE.GeometryUtils.center(geometry);
        //scene.add(mesh);

        /// material
        var material = new THREE.MeshPhongMaterial( {
            color: 0xffffff, 
            shading: THREE.FlatShading,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            wireframe: true
        } );
        
        // mesh
        mesh = new THREE.Mesh( geometry, material );
        mesh.translation = geometry.center(geometry);
        scene.add( mesh );

        // wireframe
        //var helper = new THREE.EdgesHelper( mesh, 0xffffff );
        //var helper = new THREE.WireframeHelper( mesh, 0xffffff ); // alternate
        //helper.material.linewidth = 2;
        //scene.add( helper );

    });
}

function rotateMesh() {
    if (!mesh) {
        return;
    }

    //mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    //mesh.rotation.z -= SPEED * 3;
}

function render() {
    requestAnimationFrame(render);
    rotateMesh();
    renderer.render(scene, camera);
}

init();
render();
