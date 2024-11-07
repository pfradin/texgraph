var container = document.getElementById('mycanvas');
var containerGUI = document.getElementById('panel');
document.body.appendChild( container );
document.body.appendChild( containerGUI );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(80,80,80)' );

var camera = new THREE.PerspectiveCamera( 45, container.clientWidth/container.clientHeight, 0.1, 1000 );            
scene.add(camera);

var light = new THREE.AmbientLight( 'rgb(212, 235, 255)',0.5 ); // soft white light
scene.add( light );
var spotcolor = "rgb(120,120,120)";
var intens = 0.45;
var light2 = new THREE.SpotLight(spotcolor,intens);
light2.position.set(20,5,25);
scene.add(light2);
var light2 = new THREE.SpotLight(spotcolor,intens);
light2.position.set(-20,-5,-25);
scene.add(light2);

var light3 = new THREE.SpotLight(spotcolor,intens);
light3.position.set(0,50,0);
scene.add(light3);
var light3 = new THREE.SpotLight(spotcolor,intens);
light3.position.set(0,-50,0);
scene.add(light3);

var light3 = new THREE.SpotLight(spotcolor,intens);
light3.position.set(0,0,20);
scene.add(light3);
var light3 = new THREE.SpotLight(spotcolor,intens);
light3.position.set(0,0,-20);
scene.add(light3);

var group = new THREE.Object3D();            
scene.add(group);
var Sommets = new THREE.Object3D();            
group.add(Sommets);
var Aretes = new THREE.Object3D();            
group.add(Aretes);
var Faces = new THREE.Object3D();            
group.add(Faces);

window.addEventListener( 'resize', onWindowResize, false );

var faceColor = [//tableau de couleurs, 4 types de faces maximum
    new THREE.Color(0.8627,0.0784,0.2353), //crimson
    new THREE.Color(1,0.8431,0), //gold
    new THREE.Color(0,0,0.502), //navy    
    new THREE.Color(0.1961,0.8039,0.1961), //limegreen
    new THREE.Color(0.8235,0.4118,0.1176), //chocolate
    ];
var faceOpacity = 0.8;
var edgeColor = new THREE.Color(0.4941,0.3961,0.30120);
var edgeWidth = 4;
var rotation = true;
var nbTypeFaces;

function init(){ //création de la scène pour le type de solide souhaité
    camera.position.z = 2.5;
    camera.position.x = 2;
    camera.position.y = 0.5;
 //scene 3D       
    var vertex = POLYEDRE["vertex"];
    var edge = POLYEDRE["edge"];
    var dot = POLYEDRE["dot"]; //sommets à afficher
    if (dot.length==0){
        dot = vertex;
    }
    else{
        var S = [];
        for (var i=0; i< dot.length; i++){
            S.push(vertex[dot[i]])
        };
        dot = S
    };
    var face = POLYEDRE["face"]; //tableau de tableaux de faces (rangées par nombre identique de sommets)
    nbTypeFaces = face.length;
// faces
    for ( var k = 0; k<face.length; k++) {    
        var geometry = new THREE.BufferGeometry();
        var L = face[k];
        var couleur = faceColor[k]; //couleur en fonction du type de faces
        var V = [];
        for ( var i = 0; i < L.length; i ++ ) {
            if (L[i].length>3){ //il faut trianguler
               for (var j = 1; j<L[i].length-1; j++) {
                    V.push(vertex[L[i][0]][0], vertex[L[i][0]][1], vertex[L[i][0]][2]); 
                    V.push(vertex[L[i][j]][0], vertex[L[i][j]][1], vertex[L[i][j]][2]); 
                    V.push(vertex[L[i][j+1]][0], vertex[L[i][j+1]][1], vertex[L[i][j+1]][2]); 
                }
            }
            else {//else c'est déjà un triangle
                for (var j = 0; j<3; j++) {
                    V.push(vertex[L[i][j]][0], vertex[L[i][j]][1], vertex[L[i][j]][2]);
                };
            };
        };
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( V, 3 ) );
        geometry.computeVertexNormals();
        material =  new THREE.MeshPhongMaterial( {
            color : couleur,
            emissive : 'black',
            transparent: (faceOpacity!=1), opacity: faceOpacity,
            specular : "white",
            shininess : 95,
            flatShading : true,
            side : THREE.DoubleSide,
            } );
        var mesh = new THREE.Mesh( geometry, material );
        Faces.add( mesh );
    };
// sommets
    var material = new THREE.MeshStandardMaterial( {
            color: 'white',
            emissive : 'black',
            metalness: 1,
            roughness: 0.5,
        } );
    var geometry = new THREE.SphereBufferGeometry( 0.0325, 10, 10 );
    for ( var i = 0; i < dot.length; i ++ ) {//une petite sphère par sommet
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(dot[i][0],dot[i][1],dot[i][2]);
        Sommets.add( mesh );
    };
// arêtes
    var materialLine = new THREE.MeshPhongMaterial( {
            color : edgeColor,
            emissive : 'black',
            specular : "white",
            shininess : 10,
            flatShading : false,
            } );//new THREE.LineBasicMaterial({color: edgeColor, linewidth : edgeWidth});
    var L = edge;
    for ( var i = 0; i < L.length; i ++ ) {
        var V = [];
        for (var j = 0; j<2; j++) {
            V.push(new THREE.Vector3(vertex[L[i][j]][0], vertex[L[i][j]][1], vertex[L[i][j]][2]))
            
        };
        //var geometry = new THREE.BufferGeometry();
        //geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( V, 3 ) );
        //geometry.computeVertexNormals();
        //mesh = new THREE.LineSegments( geometry, materialLine);
        //Aretes.add( mesh );
        var mesh = cylinderMesh( V[0].clone(), V[1].clone(),materialLine);
        Aretes.add(mesh)
    };
};//fin init

var controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function recalculer(){
    while (Sommets.children.length>0){
        Sommets.remove(Sommets.children[0]);
        };
    while (Aretes.children.length>0){
        Aretes.remove(Aretes.children[0]);
        };
    while (Faces.children.length>0){
        Faces.remove(Faces.children[0]);
        };
    init()
};

//création du menu avec DAT.GUI  
function createPanel() {
    dat.GUI.TEXT_CLOSED='Enlever les contrôles';
    dat.GUI.TEXT_OPEN='Contrôles du solide';
    
    var panel = new dat.GUI( {width: 150 } );
    containerGUI.appendChild( panel.domElement );
    var folder1 = panel.addFolder( 'Voir :' );
    var settings = {'vertex': true, 'edges': true,'faces1': true, 'faces2': true, 'faces3': true, 'faces4': true, 'faces5': true,'rotation': true,'transp.':true};
    folder1.add( settings, 'vertex' ).onChange( showVertex );
    folder1.add( settings, 'edges' ).onChange( showEdges );
    folder1.add( settings, 'faces1' ).onChange( showFaces1 );
    if (nbTypeFaces>1){
        folder1.add( settings, 'faces2' ).onChange( showFaces2 );
    };
    if (nbTypeFaces>2){
        folder1.add( settings, 'faces3' ).onChange( showFaces3 );
    };
    if (nbTypeFaces>3){
        folder1.add( settings, 'faces4' ).onChange( showFaces4 );
    };
    if (nbTypeFaces>4){
        folder1.add( settings, 'faces5' ).onChange( showFaces5 );
    };
    folder1.add( settings, 'rotation' ).onChange( showRotation );
    folder1.add( settings, 'transp.' ).onChange( showTransparency );
    folder1.open();
    panel.closed = true;    
};
function showFaces1( visibility ) {
    Faces.children[0].visible = visibility
};
function showFaces2( visibility ) {
    Faces.children[1].visible = visibility
};
function showFaces3( visibility ) {
    Faces.children[2].visible = visibility
};
function showFaces4( visibility ) {
    Faces.children[3].visible = visibility
};
function showFaces5( visibility ) {
    Faces.children[4].visible = visibility
};
function showTransparency( visibility ) {
    for (i=0; i<Faces.children.length; i++) {
        Faces.children[i].material.transparent = visibility
    }
};            
function showVertex( visibility ) {
    Sommets.visible = visibility;
};
function showEdges( visibility ) {
    Aretes.visible = visibility;
};
function showFaces( visibility ) {
    Faces.visible = visibility;
};
function showRotation( visibility ) {
    rotation = visibility;
};
function onWindowResize() {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    controls.handleResize();
    renderer.render(scene,camera);
    // Pour replacer le dat.GUI.
    containerGUI.style.top=container.offsetTop+1+'px';
    containerGUI.style.left=container.offsetLeft+container.clientWidth-146-3+'px';
};
function animate() {
    requestAnimationFrame(animate);
    if (rotation) {group.rotation.y += 0.01 };
    renderer.render(scene,camera);
    controls.update();
};

function cylinderMesh(point1, point2, material){//arête sous forme d'un cylindre
    var direction = new THREE.Vector3().subVectors(point2, point1);
    var arrow = new THREE.ArrowHelper(direction.clone().normalize(), point1);
    var edgeGeometry = new THREE.CylinderGeometry( 0.01, 0.01, direction.length(), 10, 1 );
    var edge = new THREE.Mesh(edgeGeometry, material); 
    edge.applyQuaternion(arrow.quaternion);//met le cylindre dans la bonne direction
    var pos = new THREE.Vector3().addVectors(point1, direction.multiplyScalar(0.5));       
    edge.position.set(pos.x,pos.y,pos.z); 
    return edge;
};
//programme principal
init();
//création du menu
createPanel();
// Pour placer correctement le panel dat.GUI.
containerGUI.style.top=container.offsetTop+1+'px';
containerGUI.style.left=container.offsetLeft+container.clientWidth-146-3+'px';
animate();   
