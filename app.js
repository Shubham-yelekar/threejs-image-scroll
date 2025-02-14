import { slides } from "./data.js";

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// window.addEventListener("scroll", () => {
//   const scrollY = window.scrollY || window.pageYOffset;
//   uniforms.scrollOffset.value = scrollY * 0.0001; // Scale it for smooth effect
// });

// let scrollTarget = 0;
// window.addEventListener("scroll", () => {
//   scrollTarget = window.scrollY * 0.0001;
// });

// gsap.ticker.add(() => {
//   uniforms.scrollOffset.value = gsap.utils.interpolate(
//     uniforms.scrollOffset.value,
//     scrollTarget,
//     0.1 // Smooth factor
//   );
// });

// const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.PlaneGeometry(2, 2);
// const uniforms = {
//   iTime: { value: 0 },
//   iResolution: {
//     value: new THREE.Vector2(window.innerWidth, window.innerHeight),
//   },
//   scrollOffset: { value: 0 },
// };

// const gl = renderer.getContext();
// function checkShader(shader) {
//   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//     console.error("Shader Compilation Error:", gl.getShaderInfoLog(shader));
//   }
// }
// function checkProgram(program) {
//   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//     console.error("Program Linking Error:", gl.getProgramInfoLog(program));
//   }
// }

// const material = new THREE.ShaderMaterial({
//   uniforms: uniforms,
//   vertexShader: document.getElementById("vertexShader").textContent,
//   fragmentShader: document.getElementById("fragmentShader").textContent,
// });

// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// let lastTime = 0;
// function animateTunnel(time) {
//   const deltaTime = time - lastTime;
//   lastTime = time;
//   uniforms.iTime.value += deltaTime * 0.0;
//   renderer.render(scene, camera);
//   requestAnimationFrame(animateTunnel);
// }

// animateTunnel(0);

// window.addEventListener("resize", () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   renderer.setSize(width, height);
//   uniforms.iResolution.value.set(width, height);
// });

gsap.registerPlugin(ScrollTrigger);
const totalSlides = 35;
const zStep = 500;
const initialZ = -zStep * (totalSlides + 5);
const scrollFactor = 0.2; // Adjust this for scroll speed

document.querySelector(".container").style.height = `${
  totalSlides * zStep * scrollFactor + 200
}px`;

function generateSlides() {
  const slider = document.querySelector(".slider");
  slider.innerHTML = "";

  for (let i = 1; i <= totalSlides; i++) {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.id = `slide-${i}`;

    const slideImg = document.createElement("div");
    slideImg.className = "slide-img";

    const img = document.createElement("img");
    img.src = `./assets/image-${(i % 8) + 1}.jpg`;
    img.alt = "";
    const slideCopy = document.createElement("div");
    slideCopy.className = "slide-copy";
    // slideCopy.innerHTML = `<p>${slides[(i % 8) - 1].title}</p><p>${
    //   slides[i - 1].id
    // }</p>`;

    slideImg.appendChild(img);
    slide.appendChild(slideImg);
    // slide.appendChild(slideCopy);
    slider.appendChild(slide);

    const zPosition = initialZ + (i - 1) * zStep;
    let xPosition, yPosition;
    if (i % 4 === 0) {
      xPosition = "76%";
      yPosition = "50%";
      slide.style.transformOrigin = "left"; //fourth
    } else if (i % 4 === 1) {
      xPosition = "50%";
      yPosition = "10%";
      slide.style.transformOrigin = "top"; //first
    } else if (i % 4 === 2) {
      xPosition = "24%";
      yPosition = "50%";
      slide.style.transformOrigin = "right"; //secound
    } else {
      xPosition = "50%";
      yPosition = "90%";
      slide.style.transformOrigin = "bottom"; //third
    }

    const opacity = i === totalSlides + 1 ? 1 : i === totalSlides - 1 ? 0 : 0;

    gsap.set(slide, {
      top: yPosition,
      left: xPosition,
      xPercent: -50,
      yPercent: -50,
      z: zPosition,
      opacity: opacity,
    });
  }
}
window.addEventListener("load", function () {
  generateSlides();

  const slides = gsap.utils.toArray(".slide");

  function getInitialTranslateZ(slide) {
    return gsap.getProperty(slide, "z");
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  ScrollTrigger.create({
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
  });
  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);
    ScrollTrigger.create({
      trigger: ".container",
      start: " top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 40000;
        const currentZ = initialZ + zIncrement;
        let opacity;

        let rotationY = gsap.utils.mapRange(-1000, 1000, 0, 80, currentZ);
        rotationY = gsap.utils.clamp(0, 80, rotationY);

        if (currentZ >= -2500) {
          opacity = mapRange(currentZ, -2500, 0, 0, 1);
        } else {
          opacity = mapRange(currentZ, -5500, -2500, 0, 0);
        }
        let indexNew = index + 1;
        let rotate = null;
        if (indexNew % 4 === 0) {
          rotate = `rotate3d(0, 1, 0, -${rotationY}deg)`;
        } else if (indexNew % 4 === 1) {
          rotate = `rotate3d(1, 0, 0, -${rotationY}deg)`;
        } else if (indexNew % 4 === 2) {
          rotate = `rotate3d(0, 1, 0, ${rotationY}deg)`;
        } else {
          rotate = `rotate3d(1, 0, 0, ${rotationY}deg)`;
        }

        slide.style.opacity = opacity;
        // slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px) ${
        //   index % 2 === 0
        //     ? `rotate3d(1, 0, 0, -${rotationY}deg)`
        //     : `rotate3d(1, 0, 0, ${rotationY}deg)`
        // }`;
        slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px) ${rotate}`;
      },
    });
  });
});
