/* C:\Users\Junaid\.gemini\antigravity\scratch\3d-portfolio\js\skills-sphere.js */
import * as THREE from 'three';

let scene, camera, renderer, sphereGroup;
let canvas;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0.005, y: 0.005 };
let raycaster, mouse;
let sprites = [];

const skills = [
  'Maya', 'After Effects', 'Substance Painter', '3DEqualizer',
  'Photoshop', 'Illustrator', 'Blender', 'Matchmoving',
  '3D Generalist', 'VFX Compositing', 'AOV Rendering', 'Camera Tracking',
  'PBR Texturing', 'Storyboarding', 'Scene Blocking', 'Hard Surface Modeling',
  'Lighting & Shading'
];

// Helper to create glowing dynamic text textures
function createTextTexture(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Translucent background for text container matching new dark bento theme
  ctx.fillStyle = 'rgba(18, 18, 18, 0.85)';
  ctx.roundRect ? ctx.roundRect(4, 4, 248, 56, 12) : ctx.rect(4, 4, 248, 56);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glow effect on text
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;

  // Text details
  let fontSize = 24;
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  
  // Dynamically shrink font size for longer text strings to fit within margins
  const maxWidth = 220;
  while (ctx.measureText(text).width > maxWidth && fontSize > 12) {
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  return new THREE.CanvasTexture(canvas);
}

function init() {
  canvas = document.getElementById('skills-3d-canvas');
  if (!canvas) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  const maxPixelRatio = window.innerWidth < 768 ? 1.3 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

  sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  const radius = window.innerWidth < 768 ? 2.2 : 3.0;
  const total = skills.length;
  const colors = ['#ff5c00', '#ff8800', '#7c3aed', '#ffaa33'];

  // Place sprites using Fibonacci Sphere algorithm
  for (let i = 0; i < total; i++) {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const randomColor = colors[i % colors.length];
    const texture = createTextTexture(skills[i], randomColor);

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    // Keep scale proportions
    sprite.scale.set(1.8, 0.45, 1);
    
    // Custom properties for raycasting and hover actions
    sprite.userData = {
      baseScale: { x: 1.8, y: 0.45 },
      hoverScale: { x: 2.2, y: 0.55 },
      color: randomColor,
      text: skills[i]
    };

    sphereGroup.add(sprite);
    sprites.push(sprite);
  }

  // Set up Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Attach Interaction Listeners
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // Handle Touch interactions
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onMouseUp);

  // Resize listener
  window.addEventListener('resize', onWindowResize);

  animate();
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  
  // Update mouse position for raycasting (-1 to +1)
  mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    // Update target speeds based on mouse motion
    rotationVelocity.y = deltaMove.x * 0.005;
    rotationVelocity.x = deltaMove.y * 0.005;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
}

function onTouchStart(event) {
  if (event.touches.length === 1) {
    isDragging = true;
    previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
}

function onTouchMove(event) {
  if (isDragging && event.touches.length === 1) {
    const deltaMove = {
      x: event.touches[0].clientX - previousMousePosition.x,
      y: event.touches[0].clientY - previousMousePosition.y
    };

    rotationVelocity.y = deltaMove.x * 0.008;
    rotationVelocity.x = deltaMove.y * 0.008;

    previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
}

function onMouseUp() {
  isDragging = false;
}

function onWindowResize() {
  if (!canvas) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);

  // Decay velocity slowly to simulate inertia
  if (!isDragging) {
    rotationVelocity.x *= 0.95;
    rotationVelocity.y *= 0.95;

    // Minimum slow rotation
    if (Math.abs(rotationVelocity.x) < 0.002) rotationVelocity.x = 0.0015;
    if (Math.abs(rotationVelocity.y) < 0.002) rotationVelocity.y = 0.0015;
  }

  // Rotate group
  sphereGroup.rotation.y += rotationVelocity.y;
  sphereGroup.rotation.x += rotationVelocity.x;

  // Raycaster checks for hover scaling
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(sprites);

  // Reset all sprites
  sprites.forEach(sprite => {
    sprite.scale.x += (sprite.userData.baseScale.x - sprite.scale.x) * 0.1;
    sprite.scale.y += (sprite.userData.baseScale.y - sprite.scale.y) * 0.1;
    sprite.material.opacity = 0.85;
  });

  if (intersects.length > 0) {
    const hitSprite = intersects[0].object;
    hitSprite.scale.x += (hitSprite.userData.hoverScale.x - hitSprite.scale.x) * 0.2;
    hitSprite.scale.y += (hitSprite.userData.hoverScale.y - hitSprite.scale.y) * 0.2;
    hitSprite.material.opacity = 1.0;
  }

  renderer.render(scene, camera);
}

// Trigger setup on DOM loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
