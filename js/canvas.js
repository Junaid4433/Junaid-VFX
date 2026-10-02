/* C:\Users\Junaid\.gemini\antigravity\scratch\3d-portfolio\js\canvas.js */
import * as THREE from 'three';

let scene, camera, renderer;
let blobMesh, particlesGeometry, particlesMesh;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let currentWidth = window.innerWidth;
let currentHeight = window.innerHeight;
let windowHalfX = currentWidth / 2;
let windowHalfY = currentHeight / 2;
let scrollProgress = 0;

// Custom shaders for the morphing liquid blob
const vertexShader = `
  uniform float uTime;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Stable organic wave function (eliminates float overflow on lower-precision GPUs)
  float getDisplacement(vec3 p, float t, float freq, float amp) {
    vec3 np = p * freq;
    float d = sin(np.x + t * 0.8) * cos(np.y + t * 0.7) * 0.4;
    d += sin(np.z * 1.4 - t * 1.2) * 0.3;
    d += cos(np.x * 2.2 + np.y * 1.8 + t * 1.5) * 0.15;
    return d * amp;
  }

  void main() {
    vNormal = normal;
    vPosition = position;
    
    float noiseVal = getDisplacement(position, uTime, uNoiseFreq, uNoiseAmp);
    vec3 newPosition = position + normal * noiseVal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    float intensity = dot(normal, vec3(0.0, 0.0, 1.0));
    
    // Core gradients
    vec3 cyanColor = vec3(0.0, 0.95, 1.0);
    vec3 purpleColor = vec3(0.62, 0.31, 0.87);
    vec3 mixedColor = mix(purpleColor, cyanColor, intensity * 0.5 + 0.5);
    
    // Fresnel glow edge
    float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    vec3 pinkGlow = vec3(1.0, 0.0, 0.5);
    
    vec3 finalColor = mixedColor + (fresnel * pinkGlow * 1.5);
    
    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

function init() {
  const container = document.getElementById('bg-canvas-container');
  if (!container) return;

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const maxPixelRatio = window.innerWidth < 768 ? 1.3 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 1. Particle Starfield
  const particleCount = window.innerWidth < 768 ? 600 : 1800;
  particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color('#00f2fe'), // Cyan
    new THREE.Color('#9d4edd'), // Purple
    new THREE.Color('#ff007f'), // Pink
  ];

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Spherical layout or random spread
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 15 - 5; // pushed back

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i] = randomColor.r;
    colors[i + 1] = randomColor.g;
    colors[i + 2] = randomColor.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular Canvas Texture for Particles
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 16;
  pCanvas.height = 16;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 16, 16);
  const pTexture = new THREE.CanvasTexture(pCanvas);

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    map: pTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // 2. Liquid Blob Mesh
  const segments = window.innerWidth < 768 ? 48 : 96;
  const blobGeometry = new THREE.SphereGeometry(2.2, segments, segments);
  const blobMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uNoiseFreq: { value: 0.5 },
      uNoiseAmp: { value: 0.35 }
    },
    transparent: true
  });

  blobMesh = new THREE.Mesh(blobGeometry, blobMaterial);
  blobMesh.frustumCulled = false; // Disable frustum culling to prevent blinking when vertices deform outside original bounds
  
  // Initial positioning: shift right on desktop, centered on mobile
  if (window.innerWidth > 991) {
    blobMesh.position.set(2.2, 0, 0);
  } else {
    blobMesh.position.set(0, 0, -1);
    blobMesh.scale.set(0.7, 0.7, 0.7); // Scale down slightly on mobile so it doesn't crowd text
  }
  
  scene.add(blobMesh);

  // Event Listeners
  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll);

  // Start Loop
  animate();
}

function onMouseMove(event) {
  // Center coordinates around (0,0)
  mouseX = (event.clientX - windowHalfX) / 100;
  mouseY = (event.clientY - windowHalfY) / 100;
}

function onScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;
  scrollProgress = window.scrollY / maxScroll;
}

function onWindowResize() {
  // Prevent resize calculations if window dimensions haven't actually changed
  if (window.innerWidth === currentWidth && window.innerHeight === currentHeight) return;

  currentWidth = window.innerWidth;
  currentHeight = window.innerHeight;
  windowHalfX = currentWidth / 2;
  windowHalfY = currentHeight / 2;

  camera.aspect = currentWidth / currentHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(currentWidth, currentHeight);

  if (currentWidth > 991) {
    blobMesh.position.x = 2.2;
    blobMesh.scale.set(1.0, 1.0, 1.0);
  } else {
    blobMesh.position.x = 0;
    if (currentWidth < 768) {
      blobMesh.scale.set(0.7, 0.7, 0.7);
    } else {
      blobMesh.scale.set(1.0, 1.0, 1.0);
    }
  }
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Update blob uniform time for displacement
  if (blobMesh) {
    blobMesh.material.uniforms.uTime.value = time;
    
    // Slow self rotation
    blobMesh.rotation.y = time * 0.05;
    blobMesh.rotation.x = time * 0.03;

    // React to mouse movement
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Fluid parallax adjustments based on mouse & scroll
    let basePosX = (window.innerWidth > 991) ? 2.2 : 0;
    const isMobile = window.innerWidth < 768;
    const parallaxFactor = isMobile ? 0 : 0.25;
    
    // Scroll morphing: Blob moves left and shifts deep on scroll
    blobMesh.position.x = basePosX - (scrollProgress * (isMobile ? 2.0 : 4.5)) + (targetX * parallaxFactor);
    blobMesh.position.y = -targetY * parallaxFactor;
    blobMesh.position.z = -scrollProgress * 5.0;

    // Morph blob properties with scroll (gets more chaotic as scroll increases)
    blobMesh.material.uniforms.uNoiseFreq.value = 0.5 + scrollProgress * 0.5;
    blobMesh.material.uniforms.uNoiseAmp.value = 0.35 + scrollProgress * 0.2;
  }

  // Update particle positions (drift)
  if (particlesMesh) {
    particlesMesh.rotation.y = time * 0.015;
    particlesMesh.rotation.x = time * 0.008;

    // Subtle drift with mouse coords
    particlesMesh.position.x = targetX * 0.05;
    particlesMesh.position.y = -targetY * 0.05;
  }

  renderer.render(scene, camera);
}

// Trigger setup on DOM loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
