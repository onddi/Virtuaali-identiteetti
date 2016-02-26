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

    document.body.appendChild(renderer.domElement);
} 

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 1000);
    camera.position.set(0, 0, -15);
    camera.lookAt(scene.position);
}

function initControls() {
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.center =  new THREE.Vector3(
        200,
        200,
        0
    );
}


function initRenderer() {

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

/*function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

var rows = 4;
var rows = 4;

var meshPos = Create2DArray(4);

for(var i = 0; i < rows; i++)
    for(var j = 0; j < cols; j++)
    {
        meshPos[i][j] = [i*5,j*5];
    }

console.log(meshPos);*/

var group = null;
var mesh = null;
var mx = 0;
var rotate = true;

/***** Centering content guide:
       Center the orbit control camera 
       Translate the group to mesh center point

******/


var meshPos = [ 
                      [0,0], [5,0], [10,0], [15,0],[20,0],[25,0],
                      [0,5], [5,5], [10,5], [15,5],[20,5],[25,5],
                      [0,10], [5,10], [10,10], [15,10],[20,10],[25,10],
                      [0,15], [5,15], [10,15], [15,15], [20,15],[25,15],
                      
              ];

var models = ['cong','dami','derita','gundogdu','haikala','heiskanen',
              'herraX','kokkola', 'kokkonen', 'koskinen', 'makela',
              'metteri','pahkala','pakkasvirta','palovaara',
              'pasanen','puska','salin','sorvettula','vuorensalmi',
              'kekalainen','lofgren','nguyen','heino'];


function initMesh() {
    var loader = new THREE.JSONLoader();
    group = new THREE.Object3D();
    for(var i = 0; i < meshPos.length; i++){
        (function(index){
            loader.load('./models/'+models[i]+'.json', function(geometry, materials) {
                /*console.log(materials)
                mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
                mesh.translation = THREE.GeometryUtils.center(geometry);
                scene.add(mesh);*/

                /// material
                var material = new THREE.MeshPhongMaterial( {
                    color: 0x00000, 
                    shading: THREE.FlatShading,
                    polygonOffset: true,
                    polygonOffsetFactor: 1, // positive value pushes polygon further away
                    polygonOffsetUnits: 1,
                    wireframe: true,
                    wireframeLinewidth: 1,
                } );
                
                // mesh
                mesh = new THREE.Mesh( geometry, material );
                mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.3;
                mesh.translation = geometry.center(geometry);
                mesh.position.x = meshPos[index][0];
                mesh.position.y = meshPos[index][1];
                mesh.rotationSpeed = (Math.random() * (0.0120 - 0.0010) + 0.0010).toFixed(4)
                //scene.add( mesh );
                group.add(mesh);

                // wireframe
                /*var helper = new THREE.EdgesHelper( mesh, 0xffffff );
                var helper = new THREE.WireframeHelper( mesh, 0xffffff ); // alternate
                helper.material.linewidth = 1;
                scene.add( helper );*/

            });
        })(i);
    }
    //Center the group (value depends on the grid size)
    group.translateY(-7.5);
    group.translateX(-10);
    console.log(group);
    scene.add(group);
}

function rotateMesh() {
    if (!mesh || !group) {
        return;
    }

    //mesh.rotation.x -= SPEED * 2;
    //mesh.rotation.y -= SPEED;
    //mesh.rotation.z -= SPEED * 3;
    //group.rotation.y -= SPEED;
    for(var index in group.children)
        group.children[index].rotation.y -= group.children[index].rotationSpeed;
        //group.children[index].rotation.y -=SPEED;
}

function render() {
    requestAnimationFrame(render);
    if(rotate)
        rotateMesh();
    renderer.render(scene, camera);
}

window.addEventListener( 'resize', onWindowResize, false );   

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 32) { //up key
        rotate = !rotate;
    }
};

document.body.addEventListener( 'mousewheel', mousewheel, false );
var focalLength = 25.734; // equivalent to FOV=50
function mousewheel( e ) { 

    event.preventDefault();

    focalLength += e.wheelDelta/500;
    if(focalLength < 0) focalLength = 0.1;
    camera.setLens(focalLength);
};

var hammertime = new Hammer(document.body);
hammertime.get('pinch').set({ enable: true });
hammertime.on('pinch    ', function(ev) {
    console.log(ev);
});

init();
render();
