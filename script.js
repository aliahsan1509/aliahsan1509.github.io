import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


/* =========================
   THREE.JS SCENE
========================= */

const canvas =
  document.getElementById("webgl");

const scene =
  new THREE.Scene();

scene.fog =
  new THREE.FogExp2(
    0x03040a,
    0.045
  );


/* =========================
   CAMERA
========================= */

const camera =
  new THREE.PerspectiveCamera(
    60,
    window.innerWidth /
    window.innerHeight,
    0.1,
    100
  );

camera.position.z = 6;


/* =========================
   RENDERER
========================= */

const renderer =
  new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


/* =========================
   LIGHT
========================= */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.7
  );

scene.add(
  ambientLight
);


const pointLight =
  new THREE.PointLight(
    0xffffff,
    4,
    15
  );

pointLight.position.set(
  2,
  3,
  5
);

scene.add(
  pointLight
);


/* =========================
   MAIN 3D OBJECT
========================= */

const geometry =
  new THREE.IcosahedronGeometry(
    1.45,
    2
  );

const material =
  new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.85,
    roughness: 0.18,
    wireframe: true
  });

const core =
  new THREE.Mesh(
    geometry,
    material
  );

core.position.set(
  2.15,
  0.2,
  0
);

scene.add(core);


/* =========================
   INNER SPHERE
========================= */

const innerGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    32
  );

const innerMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.13
  });

const inner =
  new THREE.Mesh(
    innerGeometry,
    innerMaterial
  );

core.add(inner);


/* =========================
   PARTICLES
========================= */

const particleCount =
  window.innerWidth < 600
    ? 900
    : 2200;

const positions =
  new Float32Array(
    particleCount * 3
  );


for (
  let i = 0;
  i < particleCount * 3;
  i += 3
) {

  positions[i] =
    (Math.random() - 0.5) * 30;

  positions[i + 1] =
    (Math.random() - 0.5) * 20;

  positions[i + 2] =
    (Math.random() - 0.5) * 20;

}


const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",

  new THREE.BufferAttribute(
    positions,
    3
  )
);


const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.025,
    transparent: true,
    opacity: 0.65
  });


const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(
  particles
);


/* =========================
   MOUSE
========================= */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;


window.addEventListener(
  "pointermove",
  (event) => {

    mouseX =
      event.clientX /
      window.innerWidth -
      0.5;

    mouseY =
      event.clientY /
      window.innerHeight -
      0.5;

  }
);


/* =========================
   ANIMATION
========================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const elapsed =
    clock.getElapsedTime();


  targetX +=
    (mouseX - targetX) *
    0.04;


  targetY +=
    (mouseY - targetY) *
    0.04;


  /* 3D CORE */

  core.rotation.x =
    elapsed * 0.16 +
    targetY * 0.7;

  core.rotation.y =
    elapsed * 0.22 +
    targetX * 0.9;


  core.position.y =
    0.2 +
    Math.sin(
      elapsed * 0.8
    ) * 0.22;


  core.position.x =
    2.15 +
    targetX * 0.5;


  /* INNER */

  inner.rotation.x =
    -elapsed * 0.25;

  inner.rotation.y =
    elapsed * 0.4;


  /* PARTICLES */

  particles.rotation.y =
    elapsed * 0.015;

  particles.rotation.x =
    targetY * 0.08;


  /* CAMERA */

  camera.position.x +=
    (
      targetX * 0.35 -
      camera.position.x
    ) * 0.025;


  camera.position.y +=
    (
      -targetY * 0.25 -
      camera.position.y
    ) * 0.025;


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);


/* =========================
   HEADER
========================= */

const header =
  document.getElementById(
    "header"
  );


window.addEventListener(
  "scroll",
  () => {

    if (
      window.scrollY > 50
    ) {

      header.classList.add(
        "scrolled"
      );

    } else {

      header.classList.remove(
        "scrolled"
      );

    }

  }
);


/* =========================
   SCROLL REVEAL
========================= */

const reveals =
  document.querySelectorAll(
    ".reveal"
  );


const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "active"
            );

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


reveals.forEach(
  (element) => {

    observer.observe(
      element
    );

  }
);


/* =========================
   3D CARD TILT
========================= */

const cards =
  document.querySelectorAll(
    ".tilt"
  );


cards.forEach(
  (card) => {

    card.addEventListener(
      "pointermove",
      (event) => {

        const rect =
          card.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left;


        const y =
          event.clientY -
          rect.top;


        const centerX =
          rect.width / 2;


        const centerY =
          rect.height / 2;


        const rotateX =
          (
            (y - centerY) /
            centerY
          ) * -5;


        const rotateY =
          (
            (x - centerX) /
            centerX
          ) * 5;


        card.style.transform =
          `
          perspective(800px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-4px)
          `;

      }
    );


    card.addEventListener(
      "pointerleave",
      () => {

        card.style.transform =
          "";

      }
    );

  }
);


/* =========================
   MOBILE MENU
========================= */

const menuBtn =
  document.getElementById(
    "menuBtn"
  );


menuBtn.addEventListener(
  "click",
  () => {

    const links =
      document.querySelector(
        ".nav-links"
      );


    if (
      links.style.display ===
      "flex"
    ) {

      links.style.display =
        "";

    } else {

      links.style.display =
        "flex";

      links.style.position =
        "absolute";

      links.style.top =
        "70px";

      links.style.right =
        "6%";

      links.style.flexDirection =
        "column";

      links.style.background =
        "rgba(3,4,10,.95)";

      links.style.padding =
        "20px";

      links.style.border =
        "1px solid rgba(255,255,255,.1)";

      links.style.borderRadius =
        "15px";

    }

  }
);
