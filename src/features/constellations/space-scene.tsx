"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { jeanEdges, jeanNodes, lionPaths, memoryNodeIndices } from "./jean-art";

const vertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`;
const nebulaFragment = `
  varying vec2 vUv; uniform float time; uniform float aspect;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
  float fbm(vec2 p){ float v=0.; float a=.5; for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+4.7;a*=.5;}return v; }
  void main(){
    vec2 p=vec2(vUv.x*aspect,vUv.y)*3.;
    vec2 q=vec2(fbm(p+time*.014),fbm(p+vec2(5.2,1.3)-time*.011));
    float cloud=fbm(p+q*3.+vec2(0.,time*.009));
    float wisps=pow(fbm(p*2.+q*4.),3.);
    float band=exp(-pow((vUv.x-.52)*1.8+(vUv.y-.45)*.6,2.)*2.);
    vec3 color=vec3(.003,.016,.022)+vec3(.005,.105,.077)*cloud;
    color+=vec3(.008,.23,.19)*pow(cloud,3.)*band;
    color+=vec3(.015,.24,.23)*wisps*band;
    color+=vec3(.0,.07,.065)*pow(1.-vUv.y,3.);
    color*=.65+.35*sin(vUv.x*3.14159);
    gl_FragColor=vec4(color,1.);
  }`;

function flareTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const glow = context.createRadialGradient(128, 128, 0, 128, 128, 125);
  glow.addColorStop(0, "rgba(240,255,255,1)");
  glow.addColorStop(0.09, "rgba(230,255,250,1)");
  glow.addColorStop(0.22, "rgba(90,255,220,.75)");
  glow.addColorStop(0.4, "rgba(20,220,176,.12)");
  glow.addColorStop(1, "rgba(0,100,90,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) {
    context.save();
    context.translate(128, 128);
    context.rotate((i * Math.PI) / 4);
    const ray = context.createLinearGradient(0, 0, 112, 0);
    ray.addColorStop(0, "rgba(235,255,255,.95)");
    ray.addColorStop(1, "rgba(75,200,255,0)");
    context.fillStyle = ray;
    context.beginPath();
    context.moveTo(0, -3);
    context.lineTo(i % 2 ? 65 : 120, 0);
    context.lineTo(0, 3);
    context.fill();
    context.restore();
  }
  return new THREE.CanvasTexture(canvas);
}

export function SpaceScene({
  motion,
  viewed,
  constellation = false,
}: {
  motion: boolean;
  viewed: string[];
  constellation?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef({ motion, viewed });
  useEffect(() => {
    current.current = { motion, viewed };
  }, [motion, viewed]);

  useEffect(() => {
    const container = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: constellation,
        antialias: true,
        // Retain the last frame for paused views and DOM recomposites.
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
    } catch {
      container.dataset.state = "fallback";
      return;
    }
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, constellation ? 1.5 : 1),
    );
    renderer.setClearColor(0x001410, constellation ? 0 : 1);
    container.appendChild(renderer.domElement);
    container.dataset.state = "ready";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.z = 850;
    const group = new THREE.Group();
    scene.add(group);
    const disposables: { dispose: () => void }[] = [];
    const texture = flareTexture();
    disposables.push(texture);
    const stars: THREE.Sprite[] = [];
    let cloud: THREE.ShaderMaterial | undefined;
    let particles: THREE.Points | undefined;
    const vector = new THREE.Vector3();

    if (constellation) {
      const parsed = new SVGLoader().parse(
        `<svg xmlns="http://www.w3.org/2000/svg">${lionPaths.map((d) => `<path d="${d}" fill="none" stroke="#36bda1"/>`).join("")}</svg>`,
      );
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x37c5a7,
        transparent: true,
        opacity: 0.44,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(lineMaterial);
      for (const path of parsed.paths)
        for (const subpath of path.subPaths) {
          const geometry = new THREE.BufferGeometry().setFromPoints(
            subpath
              .getPoints(80)
              .map((p) => new THREE.Vector3(p.x - 300, 350 - p.y, -8)),
          );
          group.add(new THREE.Line(geometry, lineMaterial));
          disposables.push(geometry);
        }
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x9bffe1,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      disposables.push(connectionMaterial);
      for (const [a, b] of jeanEdges) {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          [a, b].map(
            (i) =>
              new THREE.Vector3(
                jeanNodes[i][0] - 300,
                350 - jeanNodes[i][1],
                0,
              ),
          ),
        );
        group.add(new THREE.Line(geometry, connectionMaterial));
        disposables.push(geometry);
      }
      for (const [x, y] of jeanNodes) {
        const material = new THREE.SpriteMaterial({
          map: texture,
          color: 0xc3ffed,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const star = new THREE.Sprite(material);
        star.position.set(x - 300, 350 - y, 2);
        star.scale.setScalar(128);
        group.add(star);
        stars.push(star);
        disposables.push(material);
      }
    } else {
      cloud = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: nebulaFragment,
        uniforms: { time: { value: 0 }, aspect: { value: 1 } },
        depthTest: false,
        depthWrite: false,
      });
      const plane = new THREE.PlaneGeometry(2, 2);
      const backdrop = new THREE.Mesh(plane, cloud);
      backdrop.frustumCulled = false;
      backdrop.renderOrder = -1;
      scene.add(backdrop);
      disposables.push(plane, cloud);
      const positions = [];
      const sizes = [];
      // Seeded placement stays stable across reloads and React remounts.
      let seed = 731;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let i = 0; i < 1700; i++) {
        positions.push(
          (random() - 0.5) * 2200,
          (random() - 0.5) * 1700,
          -random() * 850,
        );
        sizes.push(random() * 3.8 + 1.1);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `attribute float size; uniform float time; varying float alpha; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); alpha=.35+.3*sin(position.x+time*.55); gl_PointSize=min(5.,size*850./-p.z); gl_Position=projectionMatrix*p; }`,
        fragmentShader: `varying float alpha; void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.08,d);gl_FragColor=vec4(.48,.88,.79,a*alpha);}`,
      });
      particles = new THREE.Points(geometry, material);
      group.add(particles);
      disposables.push(geometry, material);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1,
      height = 1,
      time = 0,
      last = 0;
    let pointerX = 0,
      pointerY = 0;
    let previousFrameKey = "";
    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = constellation
        ? Math.max(950, 740 / camera.aspect)
        : 850;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      previousFrameKey = "";
      if (cloud) cloud.uniforms.aspect.value = camera.aspect;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const pointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    const onLoss = (event: Event) => {
      event.preventDefault();
      container.dataset.state = "fallback";
      renderer.setAnimationLoop(null);
    };
    renderer.domElement.addEventListener("webglcontextlost", onLoss);
    renderer.setAnimationLoop((now) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;
      const animate = current.current.motion && !reduced.matches;
      const frameKey = `${animate}:${current.current.viewed.join(",")}:${width}:${height}`;
      container.dataset.motion = animate ? "running" : "paused";
      // A paused sky renders again only for resize/progress changes, saving GPU work.
      if (!animate && frameKey === previousFrameKey) return;
      previousFrameKey = frameKey;
      if (animate) time += delta;
      if (cloud) cloud.uniforms.time.value = time;
      if (particles) {
        (particles.material as THREE.ShaderMaterial).uniforms.time.value = time;
        group.rotation.z = Math.sin(time * 0.025) * 0.025;
      }
      if (animate) {
        group.rotation.x += (pointerY * 0.045 - group.rotation.x) * 0.035;
        group.rotation.y += (pointerX * 0.065 - group.rotation.y) * 0.035;
      }
      if (constellation) {
        stars.forEach((star, i) => {
          const memoryIndex = memoryNodeIndices.indexOf(i);
          const visited = current.current.viewed.includes(
            `year-1-memory-${memoryIndex + 1}`,
          );
          star.scale.setScalar(
            (visited ? 148 : 125) * (1 + Math.sin(time * 0.9 + i) * 0.07),
          );
        });
        group.updateMatrixWorld();
        memoryNodeIndices.forEach((node, i) => {
          const button = container.parentElement?.querySelector<HTMLElement>(
            `[data-memory-index="${i}"]`,
          );
          if (!button) return;
          stars[node].getWorldPosition(vector);
          vector.project(camera);
          button.style.left = `${(vector.x * 0.5 + 0.5) * width}px`;
          button.style.top = `${(-vector.y * 0.5 + 0.5) * height}px`;
        });
      }
      renderer.render(scene, camera);
    });
    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener("pointermove", pointer);
      renderer.domElement.removeEventListener("webglcontextlost", onLoss);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [constellation]);

  return (
    <div
      ref={host}
      className={constellation ? "three-constellation" : "three-sky"}
      data-state="loading"
      aria-hidden="true"
    />
  );
}
