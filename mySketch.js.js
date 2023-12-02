
		
		
		let objects = [];
let gravity = 0.8; // Gravity for gentle falling
const numObjects = 50; // Number of floating objects (increased for the new photos)
let imageSize = 270; // Size of the image (increased size)
const separation = 1; // Separation between stacked images

// Define an ordered list of image file names
const imageOrder = [
  'pizza.png',  // New photo 
  'tropi.png',  // New photo
  'arti2.png',  // New photo   
  'peni.png',  // New photo   
  'gosti.png',  // New photo   
  'tropit.png',  // New photo      
  'tilt.png',  // New photo   
  'loli2.png',  // New photo   
  'cakep.png',  // New photo   
  'cloudi.png',  // New photo   
  'pilp.png',  // New photo
  'cakee.png',  // New photo
  'arti3.png',  // New photo
  // Add other image filenames here
];

function setup() {
  createCanvas(1500, 700); // Set canvas size to 1500x600 initially
  initializeObjects();
}

function initializeObjects() {
  let y = height - imageSize / 2; // Starting position at the bottom of the canvas

  // Loop through the ordered list of images
  for (let i = 0; i < numObjects; i++) {
    const x = random(width); // Random initial x position within the canvas
    const rotationSpeed = random(-0.2, 0.2); // Random rotation speed with a wider range

    // Load images based on the ordered list, cycling through them
    const imgFileName = imageOrder[i % imageOrder.length];
    const img = loadImage(imgFileName);

    objects.push(new FloatingObject(x, y, rotationSpeed, img));
    y -= imageSize + separation; // Update the y position for the next image with separation
  }
}

function draw() {
  // Draw transparent background
  clear();
  
  // Draw rounded rectangle as canvas background
  fill('#FCE8ED'); // Set container color to FCE8ED
  noStroke(); // No stroke for the rectangle
  rect(0, 0, width, height, 30); // Rounded corners with 30 degrees

  for (let object of objects) {
    object.applyGravity(gravity);
    object.floatWithHover();
    object.display();
    
    // Check and adjust if objects go beyond canvas bounds
    if (object.x - imageSize / 2 < 0) {
      object.x = imageSize / 2;
    } else if (object.x + imageSize / 2 > width) {
      object.x = width - imageSize / 2;
    }

    // Check for collisions with other objects and adjust the y-coordinate
    for (let other of objects) {
      if (other !== object) {
        const overlap = 0.1; // Minimum separation between images
        const minDistance = object.size / 2 + other.size / 2 + overlap;
        const distance = dist(object.x, object.y, other.x, other.y);
        if (distance < minDistance) {
          const pushForce = (minDistance - distance) * 0.5;
          if (object.y < other.y) {
            object.y -= pushForce;
            object.speedY = 0;
          } else {
            object.y += pushForce;
          }
        }
      }
    }
  }
}

function windowResized() {
  deleteExtra();
  es = [];
  width = windowWidth;
  height = windowHeight;

  resizeCanvas(width, height);
  let dep = max(width, height);
  ortho(-width / 2, width / 2, height / 2, -height / 2, -dep * 2, dep * 2);
  eyeZ = height / 2 / tan((30 * PI) / 180);
  wall = new IntersectPlane(0, 0, 1, 0, 0, 300);
  noStroke();
  init();

  const maxWidth = 1920; // Maximum width allowed
  const maxHeight = 700; // Maximum height allowed

  let canvasWidth = min(maxWidth, windowWidth);
  let canvasHeight = (canvasWidth * maxHeight) / maxWidth;

  if (canvasHeight > windowHeight) {
    canvasHeight = windowHeight;
    canvasWidth = (canvasHeight * maxWidth) / maxHeight;
  }

  imageSize = (270 * canvasWidth) / 1500; // Adjust imageSize proportionally

  objects = []; // Clear existing objects
  initializeObjects(); // Reinitialize objects with updated canvas size
}



	
		
		
class FloatingObject {
  constructor(x, y, rotationSpeed, img) {
    this.x = x;
    this.y = y;
    this.speedY = 0;
    this.rotationSpeed = rotationSpeed;
    this.img = img;
    this.size = imageSize; // Size of the image
  }

  updateProperties(x, y, rotationSpeed, img) {
    this.x = x;
    this.y = y;
    this.rotationSpeed = rotationSpeed;
    this.img = img;
  }

  applyGravity(gravity) {
    this.speedY += gravity;
    this.y += this.speedY;

    // Bounce off the bottom
    if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
      this.speedY *= -0.6; // Bounce back up with reduced velocity
    }
  }

  floatWithHover() {
    const hoverDist = 100;
    if (dist(mouseX, mouseY, this.x, this.y) < hoverDist) {
      // Move based on the difference between mouse position and object's position
      const moveX = mouseX - pmouseX;
      const moveY = mouseY - pmouseY;
      this.x += moveX;
      this.y += moveY;
    }
  }

  display() {
    push(); // Save the current transformation matrix
    translate(this.x, this.y); // Move the origin to the object's position
    rotate(this.rotationSpeed); // Rotate the object based on rotationSpeed
    image(this.img, -this.size / 2, -this.size / 2, this.size, this.size); // Draw the image at the origin with the specified size
    pop(); // Restore the previous transformation matrix
  }
}
