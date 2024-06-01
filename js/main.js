
//Scene
const scene = new THREE.Scene(); // create the scene

//Camera
const camera = new THREE.PerspectiveCamera(
    60, //field of view
    window.innerWidth/window.innerHeight, // Aspect ratio
    0.1, //near clipping plane
    1000 // far clipping plane
);

scene.add(camera);
camera.position.set(0, 3, 0); // move the camera back 5 units

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: false}); //for smooth edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffff, 1); //background color
document.body.appendChild(renderer.domElement); // add the renderer to our html

// Optimize the lights and shadows
renderer.shadowMap.enabled = true; // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 'renderer.shadowMap.type' is a property that defines the type of shadow map used by the renderer. 'THREE.PCFSoftShadowMap' is one of the available shadow map types and stands for Percentage-Closer filtering Soft Shadow Map. This type of shadow map uses an algorithm to smooth the edges of shadows and make them appear softer

const textureLoader = new THREE.TextureLoader(); // we need a texture loader to load an image

const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());
window.addEventListener('resize', onWindowResize, false); // add an event listener to the window that calls the onWindowResize function when the window is resized. Its work is to update the camera's aspect ratio and the renderer's size. The third parameter is set to false to indicate that the event listener should be triggered in the bubbling phase instead of the capturing phase. The bubbling phase is when the event bubbles up from the target element to the parent elements. The capturing phase is when the event trickles down from the parent elements to the target element. The default value is false, so we don't need to include it, but I included it for clarity. The capturing phase is rarely used, so you can ignore it for now. You can read more about the capturing and bubbling phases here: https://javascript.info/bubbling-and-capturing

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // update the camera's aspect ratio
    camera.updateProjectionMatrix(); // update the camera's projection matrix. The projection matrix is used to determine how 3D points are mapped to the 2D space of the screen. It is used to calculate the frustum of the camera which is a truncated pyramid that represents the camera's field of view. Anything outside the frustum is not rendered. The projection matrix is used to calculate the frustum every time the window is resized.
    renderer.setSize(window.innerWidth, window.innerHeight); // update the size of the renderer
  }


const displayPaintingInfo = (info) => {
    const infoElement = document.getElementById("painting-info");

    infoElement.innerHTML = `
    <h3>${info.title}</h3>
    <p>Artist: ${info.artist}</p>
    <p>Description: ${info.description}</p>
    <p>Year: ${info.year}</p>
    `;
    infoElement.classList.add("show");
}

const hidePaintingInfo = () => {
    const infoElement = document.getElementById("painting-info"); // Get the reference
    infoElement.classList.remove("show"); // Remove the 'show' class
};
const paintingData = [
    // Front Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      // Array.from creates an array from an array-like object. The first parameter is the array-like object. The second parameter is a map function that is called for each element in the array-like object. The map function takes two parameters: the element and the index. The map function returns the value that will be added to the new array. In this case, we are returning an object with the painting data. `_` is a placeholder for the element. We don't need it because we are not using the element. `i` is the index. We use it to set the painting number.
      imgSrc: `artworks/${i + 1}.jpg`, // `i + 1` is the painting number. We add 1 to the index because the index starts at 0 but we want the painting numbers to start at 1.
      width: 5, // width of the painting
      height: 3, // height of the painting
      position: { x: -15 + 10 * i, y: 2, z: -19.5 }, // position of the painting
      rotationY: 0, // rotation of the painting
      info: {
        // info about the painting
        title: `Van Gogh ${i + 1}`,
        artist: 'Vincent van Gogh',
        description: `This is one of the masterpieces by Vincent van Gogh, showcasing his unique style and emotional honesty. Artwork ${
          i + 1
        } perfectly encapsulates his love for the beauty of everyday life.`,
        year: `Year ${i + 1}`,
        link: 'https://github.com/theringsofsaturn',
      },
    })),
    // Back Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      imgSrc: `artworks/${i + 5}.jpg`,
      width: 5,
      height: 3,
      position: { x: -15 + 10 * i, y: 2, z: 19.5 },
      rotationY: Math.PI,
      info: {
        title: `Van Gogh ${i + 5}`,
        artist: 'Vincent van Gogh',
        description: `Artwork ${
          i + 5
        } by Vincent van Gogh is an exceptional piece showcasing his remarkable ability to capture emotion and atmosphere.`,
        year: `Year ${i + 5}`,
        link: 'https://github.com/theringsofsaturn',
      },
    })),
    // Left Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      imgSrc: `artworks/${i + 9}.jpg`,
      width: 5,
      height: 3,
      position: { x: -19.5, y: 2, z: -15 + 10 * i },
      rotationY: Math.PI / 2,
      info: {
        title: `Van Gogh ${i + 9}`,
        artist: 'Vincent van Gogh',
        description: `With its striking use of color and brushwork, Artwork ${
          i + 9
        } is a testament to Van Gogh's artistic genius.`,
        year: `Year ${i + 9}`,
        link: 'https://github.com/theringsofsaturn',
      },
    })),
    // Right Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      imgSrc: `artworks/${i + 13}.jpg`,
      width: 5,
      height: 3,
      position: { x: 19.5, y: 2, z: -15 + 10 * i },
      rotationY: -Math.PI / 2,
      info: {
        title: `Van Gogh ${i + 13}`,
        artist: 'Vincent van Gogh',
        description: `Artwork ${
          i + 13
        } is a captivating piece by Vincent van Gogh, reflecting his distinctive style and deep passion for art.`,
        year: `Year ${i + 13}`,
        link: 'https://github.com/theringsofsaturn',
      },
    })),
  ];

  
//Create a painting
function createPainting(imageURL, width, height, position) {
    
    const paintingTexture = textureLoader.load(imageURL); // method to load an image
    const paintingMaterial = new THREE.MeshBasicMaterial({
        // MeshBasicMaterial is a material that doesn't react to light. It's used for things like UI elements, skyboxes, and other objects that don't need to be lit.
        map: paintingTexture, // 'map' is a property of the material which takes a texture and applies it to the surface of the geometry
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);// PlaneGeometry is a flat rectangle
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);// Mesh is an object that takes a geometry and a material and combines them to create the final rendered object
    painting.position.set(position.x, position.y, position.z); // set the position of painting
    return painting;
}

/*
// Create paintings and add them to the scene using the creating functions
// Painting on the front wall at the left
const painting1 = createPainting(
    './artworks/0.jpg', // the image url
    10, // width
    5, // height
    new THREE.Vector3(-10, 5, -19.99) // position in x, y, z coordinates
);

// Painting on the front wall at the right
const painting2 = createPainting(
    './artworks/1.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(10, 5, -19.99)
);

// Painting on the left wall
const painting3 = createPainting(
    './artworks/3.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(-19.99, 5, -10)
);
painting3.rotation.y = Math.PI / 2; // 90 degrees. If we don't rotate this, it will show up the front of us instead of lying on the left wall

// Painting on the right wall (near the front wall)
const painting4 = createPainting(
    './artworks/5.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(19.99, 5, -10)
);
painting4.rotation.y = -Math.PI / 2 // -90 degrees. The same as above but for the right wall

const painting5 = createPainting(
    './artworks/8.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(-19.5, 5, 10)
);
painting5.rotation.y = Math.PI / 2

const painting6 = createPainting(
    './artworks/9.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(19.5, 5, 10)
);
painting6.rotation.y = -Math.PI / 2

const painting7 = createPainting(
    './artworks/6.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(-10, 5, 19.5)
);
painting7.rotation.y = Math.PI;

const painting8 = createPainting(
    './artworks/7.jpg', 
    10, // width
    5, //height
    new THREE.Vector3(10, 5, 19.5)
);
painting8.rotation.y = Math.PI;
scene.add(painting1, painting2, painting3, painting4, painting5, painting6, painting7, painting8);
*/

// Let there be light
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); //color, intensity, distance, decay
ambientLight.position = camera.position; // Light follows camera
scene.add(ambientLight);

function createSpotlight(x, y, z, intensity, targetPosition) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);
    spotlight.castShadow = true;
    spotlight.angle = Math.PI / 3;
    spotlight.penumbra = 1;
    spotlight.decay = 1.5;
    spotlight.distance = 40;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    return spotlight;
}
const spotlight1 = createSpotlight(0, 20, 10, 2, new THREE.Vector3(0, 2, -20));
const spotlight2 = createSpotlight(0, 20, 10, 2, new THREE.Vector3(0, 2, 20));
const spotlight3 = createSpotlight(-10, 20, 0, 2, new THREE.Vector3(-20, 2, 0));
const spotlight4 = createSpotlight(10, 20, 0, 2, new THREE.Vector3(20, 2, 0));

scene.add(spotlight1, spotlight2, spotlight3, spotlight4);
scene.add(spotlight1.target, spotlight2.target, spotlight3.target, spotlight4.target);

let paintings = [];

paintingData.forEach((data) => {
   
    const painting = new THREE.Mesh( 
      new THREE.PlaneGeometry(data.width, data.height),
      new THREE.MeshLambertMaterial({ map: textureLoader.load(data.imgSrc) })
    );

    painting.position.set(data.position.x, data.position.y, data.position.z); 
    painting.rotation.y = data.rotationY; 

    
    painting.userData = {
      type: 'painting', 
      info: data.info, 
      url: data.info.link,
    };

    painting.castShadow = true; 
    painting.receiveShadow = true; 
    
    paintings.push(painting); 
});

paintings.forEach((object) => {
    scene.add(object);
});
  
const createBoundingBoxes = (objects) => {
    // objects will be either paintings or walls that we pass in from main.js
    if (!Array.isArray(objects)) {
      objects = objects.children;
    }
  
    objects.forEach((object) => {
      object.BoundingBox = new THREE.Box3(); // create a new bounding box for each object
      object.BoundingBox.setFromObject(object); // set the bounding box to the object (painting or wall)
    });
};
  
  // Note: Without the checking won't work!
  // if (!Array.isArray(objects)) {
  //     objects = objects.children;
  //   }
  
  // Checking for both THREE.Group and arrays is because the `createWalls` function is returning a THREE.Group while `createPaintings` is returning an array.
  
  // In Three.js, a THREE.Group is a type of object used to create hierarchical (parent-child) relationships between objects. In other words, a Group is an object that can contain other objects. This is useful if we want to manipulate several objects as one.
  
  // The children property of a Group is an array that contains all the objects (child objects) that have been added to the group. So when we add an object to a group with group.add(object), we can access that object later with group.children.
  
  // In our code, createWalls returns a Group that contains several wall objects. When we pass this group to createBoundingBoxes, we want to create a bounding box for each wall in the group. To do that, we need to loop over the children array of the group.
  
  // So, when we call createBoundingBoxes(walls), the objects parameter of createBoundingBoxes is a Group object. In order to loop over each wall in the group, we need to set objects to objects.children.
  
  // However, createPaintings returns an array, not a Group. When you call createBoundingBoxes(paintings), the objects parameter of createBoundingBoxes is already an array, so you don't need to do anything.
  
  // That's why createBoundingBoxes starts by checking if objects is an array with if (!Array.isArray(objects)). If objects is not an array, it assumes that it's a Group and sets objects to objects.children. If objects is already an array, it skips this step.
  
  // After this check, objects is always an array, whether it was originally an array or a Group. This means that you can use objects.forEach to loop over each object in objects and add a bounding box to it, regardless of whether objects was originally an array or a Group. This is a way of making createBoundingBoxes flexible so it can work with both Groups and arrays.


// Controls
// Event Listener for when we press the keys
//document.addEventListener("keydown", onKeyDown, false);

// Texture of the floor
const floorTexture = textureLoader.load("img/floor.png") //ImageUtils is deprecated in the newer version of Three.js
floorTexture.wrapS = THREE.RepeatWrapping; // wrapS is horizontal direction
floorTexture.wrapT = THREE.RepeatWrapping; // wrapT is vertical direction
floorTexture.repeat.set(20, 20); // how many times to repeat the texture
// let textureLoader = new THREE.TextureLoader().load('img/floor.png');
// textureLoader.load("img/floor.png")

// Create the floor plane
const planeGeometry = new THREE.PlaneBufferGeometry(45, 45); // PlaneGeometry is the shape of the plane
const planeMaterial = new THREE.MeshPhongMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

floorPlane.rotation.x = Math.PI / 2 // 90 degree rotation
floorPlane.position.y = -Math.PI // 180 degree rotation
scene.add(floorPlane);

// Create the walls
let wallGroup = new THREE.Group(); // Create a groupto hold the walls
scene.add(wallGroup) // add the group to the scene, then any child added to the group will display to the scene

// Create wall material with realistic colors and texture
const wallTexture = textureLoader.load('img/white-texture.jpg') //load the texture
wallTexture.wrapS = THREE.RepeatWrapping; // 'wrapS' and 'wrapT' are properties of a texture that define how the texture should be repeated in the x and y directions. 'wrapS' is the horizontal direction and 'wrapT' is the vertical direction. 'Repeatwrapping' is one of the available wrapping modes and means that the texture will be repeated in the specified direction. 'Repeatwrapping' is the default wrapping mode for textures
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1,1); // 'repeat' property of a texture is a Vector2 that defines how many times the texture should be repeated in the x and y directions. Sets the texture to be repeated once in both the x and y directions. This means that the texture will not be repeated and will only be displayed once on the material

const wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture}); // create the material with the texture for the walls

// Front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({map: wallTexture})
);

frontWall.position.z = -20 // push the wall forward in the z axis

// Left Wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({
        map: wallTexture
    })
);

leftWall.rotation.y = Math.PI / 2 // this is 90 degree
leftWall.position.x = -20 // -20 is for 20 units left

// Right Wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({
        map: wallTexture
    })
);

rightWall.rotation.y = Math.PI / 2 // this is 90 degree
rightWall.position.x = 20

// Back wall
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({map: wallTexture})
)
backWall.position.z = 20;
wallGroup.add(frontWall, backWall, leftWall, rightWall);

createBoundingBoxes(wallGroup);
createBoundingBoxes(paintings);

// Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience() {
    // Lock the pointer
    controls.lock()
    // Hide the menu
    hideMenu();
}

/*
const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);
*/
let lockPointer = true;
let showMenuOnUnLock = false;
// Hide menu
function hideMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = "none";
}

// Show menu
function showMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = "block";
}

function setupPlayButton() {
    const playButton = document.getElementById('play_button'); // Get the reference
    playButton.addEventListener('click', () => startExperience()); // Add the click event listener to the play button to start the experience
}

setupPlayButton();

let sound;
let bufferLoaded = false;

const listener = new THREE.AudioListener();
camera.add(listener);

sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader(); // create an audio loader
audioLoader.load("sounds/bassboostedsong.mp3", function (buffer) {
    // load the audio file
    sound.setBuffer(buffer); // set the audio source buffer
    sound.setLoop(true); // set the audio source to loop
    sound.setVolume(0.5); // set the audio source volume
    bufferLoaded = true; // set bufferLoaded flag to true once the audio buffer is loaded
});


const startAudio = () => {
    if (sound && bufferLoaded) {
      // check if the buffer is loaded before playing
      sound.play();
    }
};

const stopAudio = () => {
    if (sound) {
      // check if the buffer is loaded before playing
      sound.pause();
    }
};

document.getElementById("start_audio").addEventListener('click', startAudio);
document.getElementById("stop_audio").addEventListener('click', stopAudio);

controls.addEventListener('unlock', () => {
    if (showMenuOnUnLock) {
        showMenu();
    }
    showMenuOnUnLock = false;
});

function togglePointerLock(controls) {
    if (lockPointer) {
        controls.lock();
    }
    else
    {
        showMenuOnUnLock = false;
        controls.unlock();
    }
    lockPointer = !lockPointer; 
}

//object to hold the keys pressed
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};

//Event Listener for when we pressed the keys
document.addEventListener("keydown", (event) => { // //keydown is an event that fires when a key is pressed
    if (event.key in keysPressed) {
        // check if the key is in the keyPressed object
        keysPressed[event.key] = true;
    }

    if (event.key === " ") {
        togglePointerLock(controls)
    }

    if (event.key === "Escape") {
        showMenu();
        showMenuOnUnLock = true;
        controls.unlock();
        lockPointer = false;
    }
    if (event.key === "Enter") {
        hideMenu();
        controls.lock();
        lockPointer = true;
    }
}, false);

//Event Listener for when we release the keys
document.addEventListener("keyup", (event) => { // keyup is an event that fires when a key is released
    if (event.key in keysPressed) {
        // check if the key released is in the keyPressed object
        keysPressed[event.key] = false;
    }

}, false);

let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(paintings);
    if (intersects.length > 0) {
        const painting = intersects[0].object;

        console.log("Clicked painting", painting.userData.info.title);

        window.open(painting.userData.info.link, "_blank");
    }
}, false);


/*
controls.addEventListener('unlock', showMenu});
*/

// Loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++)
{
    wallGroup.children[i].BoundingBox = new THREE.Box3();
    wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}

// check if the player intersects with the wall
function checkCollision() {
    const playerBoundingBox = new THREE.Box3(); //create a bounding box for the player
    const cameraWorldPosition = new THREE.Vector3(); // create a vector to hold the camera position
    camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. Note : The camera represents the player's position in our case
    playerBoundingBox.setFromCenterAndSize(
        // setFromCenterAndASize is a method that takes the center and size of the box. We set the player's bounding box size and center it on the camera's world position.
        cameraWorldPosition,
        new THREE.Vector3(1,1,1)
    );

    //loop through each wall
    for (let i = 0; i < wallGroup.children.length; i++)
    {
        const wall = wallGroup.children[i]; // get the wall
        if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
            // check if the player's bounding box intersects with any of the wall bounding boxes
            return true; // if it does, return true
        }
    }
    return false; // if it doesn't, return false
}

// Create the ceiling
const ceilingTexture = textureLoader.load('img/white-texture.jpg')
const ceilingGeometry = new THREE.PlaneBufferGeometry(45, 40);
const ceilingMaterial = new THREE.MeshBasicMaterial({
    map: ceilingTexture,
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = Math.PI / 2
ceilingPlane.position.y = 10
scene.add(ceilingPlane);


// Enable shadows on objects
/*
floorPlane.receiveShadow = true // receive shadows
ceilingPlane.receiveShadow = true;
frontWall.castShadow = true; // cast shadows
frontWall.receiveShadow = true;
leftWall.castShadow = true;
leftWall.receiveShadow = true;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
backWall.castShadow = true;
backWall.receiveShadow = true;
painting1.castShadow = true;
painting1.receiveShadow = true;
painting2.castShadow = true;
painting2.receiveShadow = true;
*/

// Add the movement (left/right/forward/backward) to the scene. Pressed the arrow keys or WASD
const clock = new THREE.Clock(); //create a clock to keep track of the time between frames

function updateMovement(delta) {
    const moveSpeed = 5 * delta; // moveSpeed i the distance the camera will move in one second, we multiply by delta to make the movement framerate independent. This means that the movement will be the same regardless of the framerate. This is important because if the framerate is low, the movement will be slow and if the framerate is high, the movement will be fast. This is not what we want, we want the movement to be the same regardless of the framerate.
    const previousPosition = camera.position.clone(); // clone the camera position before the movement
    if (keysPressed.ArrowRight || keysPressed.d)
    {
        controls.moveRight(moveSpeed);
    }
    if (keysPressed.ArrowLeft || keysPressed.a)
    {
        controls.moveRight(-moveSpeed);
    }
    if (keysPressed.ArrowUp || keysPressed.w)
    {
        controls.moveForward(moveSpeed);
    }
    if (keysPressed.ArrowDown || keysPressed.s)
    {
        controls.moveForward(-moveSpeed);
    }
    // After the movementis applied, we check for collisionsby calling the checkCollision function. If a collision is detected, we revert the camera's position to its previous position, effectively preventing the player from moving through walls.
    if (checkCollision()) {
        camera.position.copy(previousPosition);
    }
}

//Used to render the scene
let render = function () {
    const delta = clock.getDelta(); // get the time between frames
    updateMovement(delta); // update the movement
    const distanceThreshold = 8;

    
    let paintingToShow = "";
    paintings.forEach((paint) => {
      const distanceToPainting = camera.position.distanceTo(paint.position);
      if (distanceToPainting < distanceThreshold) {
        paintingToShow = paint;
      }
    });

    if (paintingToShow) {
      // if there is a painting to show
        displayPaintingInfo(paintingToShow.userData.info);
    } 
    else {
        hidePaintingInfo();
    }
    
    renderer.render(scene, camera); //render the scene
    requestAnimationFrame(render); // requestAnimationFrame is a method that calls the render function before the next repaint. This is used to render the scene at 60 frames per second and is more efficient than using setInterval because it only renders when the browser is ready to repaint
};

// Load a statue in the middle
const loader = new THREE.GLTFLoader();
loader.load('statue/demon/scene.gltf', function (gltf) {
    const statue = gltf.scene;
    statue.position.set(0, 0.25, 0);
    statue.scale.set(0.5, 0.5, 0.5); // Scale the statue if necessary
    scene.add(statue);
    // Iterate through all the meshes in the statue and update their materials
    statue.traverse((child) => {
        if (child.isMesh) {
          map: child.material.map,
            // Modify child.material here to improve appearance
            (child.material.metalness = 0.0),
            (child.material.roughness = 0.2),
            // Cast shadow
            (child.castShadow = true);

          // console.log("Statue Material:", child.material);
        }
    });

    // render(); // Start the animation loop after the model is loaded
}, undefined, function (error) {
    console.log(error);
});

/*
//Function when a key is pressed, execute this function
function onKeyDown(event) {
    let keycode = event.which;

    // right arrow key
    if (keycode === 39 || keycode === 68) {
        controls.moveRight(0.08);
    }
    // left arrow key
    else if (keycode === 37 || keycode == 65) {
        controls.moveRight(-0.08);
    }
    // up arrow key
    else if (keycode === 38 || keycode === 87) {
        controls.moveForward(0.08);
    }
    // down arrow key
    else if (keycode === 40 || keycode === 83) {
        controls.moveForward(-0.08);
    }

}

let render = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Render
    renderer.render(scene, camera); // Taking screen shot, render the scene
    requestAnimationFrame(render)
};
*/
render();
