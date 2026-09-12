'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Character3DProps {
  height?: string;
  disciplineColor?: string;
}

export default function Character3DCanvas({ height = 'h-[280px] sm:h-[380px] lg:h-[460px]', disciplineColor }: Character3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const hVal = container.clientHeight || 460;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, hVal);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const aspect = width / hVal;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 1.4, 6.2);

    // Ambient & Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x13111c, 3.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    keyLight.position.set(2.5, 4.5, 3.5);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0xf59e0b, 4.5, 12);
    accentLight.position.set(0, 2.2, 1.8);
    scene.add(accentLight);

    const rimLight = new THREE.PointLight(0xa855f7, 3.8, 14);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    const groundLight = new THREE.PointLight(0xf59e0b, 2.0, 8);
    groundLight.position.set(0, -1.2, 0.5);
    scene.add(groundLight);

    // Root avatar group
    const avatarRoot = new THREE.Group();
    avatarRoot.position.set(0, -0.65, 0);
    scene.add(avatarRoot);

    // Materials
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x1c1924, roughness: 0.35, metalness: 0.75 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x2b2638, roughness: 0.25, metalness: 0.85 });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });
    const visorGlowMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const auraRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    // Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.22, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x14121a, roughness: 0.6, metalness: 0.4 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.11;
    avatarRoot.add(pedestal);

    const runeRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.02, 16, 64), auraRingMat);
    runeRing1.rotation.x = Math.PI / 2;
    runeRing1.position.y = 0.02;
    avatarRoot.add(runeRing1);

    const runeRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.015, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.5 })
    );
    runeRing2.rotation.x = Math.PI / 2;
    runeRing2.position.y = 0.03;
    avatarRoot.add(runeRing2);

    // Humanoid Avatar Body
    const bodyGroup = new THREE.Group();
    avatarRoot.add(bodyGroup);

    // Chest
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 1.05, 8);
    chestGeo.scale(1.15, 1.0, 0.85);
    const chest = new THREE.Mesh(chestGeo, armorMat);
    chest.position.y = 1.9;
    bodyGroup.add(chest);

    // Chest Emblem
    const emblemGeo = new THREE.OctahedronGeometry(0.18, 0);
    const emblemMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(0, 2.05, 0.42);
    emblem.rotation.z = Math.PI / 4;
    bodyGroup.add(emblem);

    // Waist & Belt
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.55, 8), obsidianMat);
    waist.position.y = 1.25;
    bodyGroup.add(waist);

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16), goldTrimMat);
    belt.position.y = 1.05;
    bodyGroup.add(belt);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.75, 0);
    bodyGroup.add(headGroup);

    const helmetGeo = new THREE.SphereGeometry(0.38, 24, 24);
    helmetGeo.scale(0.92, 1.15, 1.05);
    const helmet = new THREE.Mesh(helmetGeo, armorMat);
    headGroup.add(helmet);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.2), visorGlowMat);
    visor.position.set(0, 0.02, 0.35);
    headGroup.add(visor);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.14, 12, 24), obsidianMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, -0.28, 0);
    headGroup.add(collar);

    // Pauldrons
    const pauldronGeo = new THREE.BoxGeometry(0.38, 0.3, 0.55);
    pauldronGeo.scale(1.2, 1.0, 1.1);

    const leftShoulder = new THREE.Mesh(pauldronGeo, goldTrimMat);
    leftShoulder.position.set(-0.82, 2.25, 0);
    leftShoulder.rotation.z = -0.35;
    bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(pauldronGeo, goldTrimMat);
    rightShoulder.position.set(0.82, 2.25, 0);
    rightShoulder.rotation.z = 0.35;
    bodyGroup.add(rightShoulder);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.85, 12);
    const leftArm = new THREE.Mesh(armGeo, obsidianMat);
    leftArm.position.set(-0.76, 1.6, 0.05);
    leftArm.rotation.z = 0.12;
    leftArm.rotation.x = -0.15;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, obsidianMat);
    rightArm.position.set(0.76, 1.6, 0.05);
    rightArm.rotation.z = -0.12;
    rightArm.rotation.x = -0.15;
    bodyGroup.add(rightArm);

    // Gauntlets
    const bracerGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.45, 12);
    const leftBracer = new THREE.Mesh(bracerGeo, goldTrimMat);
    leftBracer.position.set(-0.8, 1.15, 0.15);
    bodyGroup.add(leftBracer);

    const rightBracer = new THREE.Mesh(bracerGeo, goldTrimMat);
    rightBracer.position.set(0.8, 1.15, 0.15);
    bodyGroup.add(rightBracer);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.05, 12);
    const leftLeg = new THREE.Mesh(legGeo, obsidianMat);
    leftLeg.position.set(-0.3, 0.55, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, obsidianMat);
    rightLeg.position.set(0.3, 0.55, 0);
    bodyGroup.add(rightLeg);

    // Halo & Floating Artifact
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.022, 16, 64), auraRingMat);
    halo.position.set(0, 3.2, -0.15);
    halo.rotation.x = Math.PI / 3.2;
    bodyGroup.add(halo);

    const artifactGeo = new THREE.IcosahedronGeometry(0.25, 0);
    const artifactMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.5,
    });
    const artifact = new THREE.Mesh(artifactGeo, artifactMat);
    artifact.position.set(1.1, 1.9, 0.6);
    bodyGroup.add(artifact);

    // Particles
    const pCount = 55;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pAngles: { angle: number; rad: number; y: number; speed: number }[] = [];

    for (let i = 0; i < pCount; i++) {
      const theta = (i / pCount) * Math.PI * 2;
      const rad = 0.8 + Math.random() * 1.1;
      const y = 0.2 + Math.random() * 3.0;
      pPos[i * 3] = Math.cos(theta) * rad;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = Math.sin(theta) * rad;
      pAngles.push({ angle: theta, rad, y, speed: 0.4 + Math.random() * 0.8 });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.085,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    avatarRoot.add(particleSystem);

    // Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotY = 0;
    let currentRotY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const handleMouseUp = () => {
      isDragging = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - prevMouseX;
        targetRotY += delta * 0.012;
        prevMouseX = e.clientX;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      bodyGroup.position.y = Math.sin(t * 1.8) * 0.035;
      headGroup.rotation.y = Math.sin(t * 0.8) * 0.08;
      emblem.rotation.y = t * 1.2;

      artifact.position.x = Math.cos(t * 1.2) * 1.15;
      artifact.position.z = Math.sin(t * 1.2) * 1.15;
      artifact.position.y = 1.9 + Math.sin(t * 2.2) * 0.12;
      artifact.rotation.x = t * 0.9;
      artifact.rotation.y = t * 1.1;

      halo.rotation.z = t * 0.25;
      runeRing1.rotation.z = -t * 0.15;
      runeRing2.rotation.z = t * 0.2;

      if (!isDragging) {
        targetRotY += 0.005;
      }
      currentRotY += (targetRotY - currentRotY) * 0.08;
      avatarRoot.rotation.y = currentRotY;

      const pArray = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const p = pAngles[i];
        p.angle += 0.015 * p.speed;
        p.y += 0.008 * p.speed;
        if (p.y > 3.4) p.y = 0.2;
        pArray[i * 3] = Math.cos(p.angle) * p.rad;
        pArray[i * 3 + 1] = p.y;
        pArray[i * 3 + 2] = Math.sin(p.angle) * p.rad;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full ${height} rounded-2xl mx-auto cursor-grab active:cursor-grabbing`}>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
