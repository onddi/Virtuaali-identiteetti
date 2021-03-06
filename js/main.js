var scene, camera, renderer, controls;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

if (document.location.hostname == "localhost") {
    var rotate = false;
    var angleLimit =  0;
} else {
    rotate = true;
}

var SPEED = 0.01;

function init() {
    scene = new THREE.Scene();

    initMesh();
    initCamera();
    initLights();
    initRenderer();
    initControls();

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
    if (document.location.hostname == "localhost") {
        renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, antialias: true, alpha: 1});
    } else {
        renderer = new THREE.WebGLRenderer({antialias: true, alpha: 1});
    }
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

var mesh = null;
function initMesh() {
    var loader = new THREE.JSONLoader();
    loader.load('./ossi.json', function(geometry, materials) {
        /*console.log(materials)
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
        mesh.translation = THREE.GeometryUtils.center(geometry);
        scene.add(mesh);*/

        /// material
        var material = new THREE.MeshPhongMaterial( {
            color: 0x000000, 
            shading: THREE.FlatShading,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            wireframe: true
        } );
        
        // mesh
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
        mesh.translation = geometry.center(geometry);
        scene.add( mesh );

        // wireframe
        /*var helper = new THREE.EdgesHelper( mesh, 0xffffff );
        var helper = new THREE.WireframeHelper( mesh, 0xffffff ); // alternate
        helper.material.linewidth = 1;
        scene.add( helper );*/

    });
}

function rotateMesh() {
    if (!mesh) {
        return;
    }

    //mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    //mesh.rotation.z -= SPEED * 3;

    if (document.location.hostname == "localhost") { // if on localhost
        if (mesh.rotation.y > angleLimit) { //record frames of the first rotation
            var image = renderer.domElement.toDataURL('image/png');
            var req = new XMLHttpRequest();
            req.open("POST", "http://localhost:8080", true);
            var data = {
                cmd: 'screenshot',
                dataURL: image,
            };
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        }
    }
}

function render() {
    requestAnimationFrame(render);
    if (rotate) {
        rotateMesh();
    };
    renderer.render(scene, camera);
}

document.body.onkeydown = function(e) {
    if (e.keyCode == 32) { 
      rotate = true;
      angleLimit = mesh.rotation.y - 6.283;
    };
}

init();
render();
