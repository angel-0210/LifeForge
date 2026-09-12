'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAvatarCustomization } from '@/context/AvatarCustomizationContext';
import { useCharacter } from '@/context/CharacterContext';
import {
  CharacterClass,
  WeaponType,
  HeadgearType,
  CLASS_VISUALS,
} from '@/lib/classVisuals';
import AvatarCustomizerModal from './AvatarCustomizerModal';

interface Character3DProps {
  height?: string;
  initialClass?: CharacterClass;
  showControls?: boolean;
}

export default function Character3DCanvas({
  height = 'h-[280px] sm:h-[380px] lg:h-[460px]',
  initialClass,
  showControls = true,
}: Character3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const customization = useAvatarCustomization();
  const { level } = useCharacter();

  // Active state determination (props take priority if passed)
  const activeClass = initialClass || customization.characterClass;
  const activeWeapon = customization.weapon;
  const activeHeadgear = customization.headgear;
  const activeAuraColor = customization.auraColor;
  const activeArmorTheme = customization.armorTheme;
  const actionState = customization.actionState;
  const isAutoRotating = customization.isAutoRotating;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // Check WebGL context
    try {
      const testCanvas = document.createElement('canvas');
      if (!window.WebGLRenderingContext || (!testCanvas.getContext('webgl') && !testCanvas.getContext('experimental-webgl'))) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 400;
    const heightVal = container.clientHeight || 460;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightVal);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Clear existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    const aspect = width / heightVal;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    const initialCamPos = new THREE.Vector3(0, 1.4, 6.2);
    camera.position.copy(initialCamPos);

    // 3. Class Visual Configuration
    const classConfig = CLASS_VISUALS[activeClass] || CLASS_VISUALS.warrior;
    const primaryColor = activeArmorTheme || classConfig.primaryColor;
    const auraColor = activeAuraColor || classConfig.auraParticleColor;
    const trimColor = classConfig.trimColor;
    const armorColor = classConfig.armorColor;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0x181824, 3.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(2.5, 5.0, 3.5);
    scene.add(keyLight);

    const classPointLight = new THREE.PointLight(primaryColor, 4.5, 12);
    classPointLight.position.set(0, 2.2, 1.8);
    scene.add(classPointLight);

    const rimLight = new THREE.PointLight(classConfig.secondaryColor, 3.8, 14);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    const groundLight = new THREE.PointLight(primaryColor, 2.2, 8);
    groundLight.position.set(0, -1.2, 0.5);
    scene.add(groundLight);

    // 5. Root Avatar Group
    const avatarRoot = new THREE.Group();
    avatarRoot.position.set(0, -0.65, 0);
    scene.add(avatarRoot);

    // 6. Materials
    const baseArmorMat = new THREE.MeshStandardMaterial({
      color: armorColor,
      roughness: 0.3,
      metalness: 0.8,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      roughness: 0.2,
      metalness: 0.9,
      emissive: primaryColor,
      emissiveIntensity: 0.3,
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
    });

    const auraRingMat = new THREE.MeshBasicMaterial({
      color: auraColor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    // 7. Pedestal & Ground Runes
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.85, 0.22, 32),
      new THREE.MeshStandardMaterial({ color: 0x111018, roughness: 0.6, metalness: 0.5 })
    );
    pedestal.position.y = -0.11;
    avatarRoot.add(pedestal);

    const runeRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.022, 16, 64), auraRingMat);
    runeRing1.rotation.x = Math.PI / 2;
    runeRing1.position.y = 0.02;
    avatarRoot.add(runeRing1);

    const runeRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.015, 16, 48),
      new THREE.MeshBasicMaterial({ color: classConfig.secondaryColor, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    );
    runeRing2.rotation.x = Math.PI / 2;
    runeRing2.position.y = 0.03;
    avatarRoot.add(runeRing2);

    // 8. Humanoid Body Group
    const bodyGroup = new THREE.Group();
    avatarRoot.add(bodyGroup);

    // Torso / Chest
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 1.05, 8);
    chestGeo.scale(1.15, 1.0, 0.85);
    const chest = new THREE.Mesh(chestGeo, baseArmorMat);
    chest.position.y = 1.9;
    bodyGroup.add(chest);

    // Chest Emblem / Core Reactor
    const emblemGeo = new THREE.OctahedronGeometry(0.18, 0);
    const emblem = new THREE.Mesh(emblemGeo, glowMat);
    emblem.position.set(0, 2.05, 0.42);
    emblem.rotation.z = Math.PI / 4;
    bodyGroup.add(emblem);

    // Belt
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16), trimMat);
    belt.position.y = 1.05;
    bodyGroup.add(belt);

    // Head & Headgear Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.75, 0);
    bodyGroup.add(headGroup);

    const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), baseArmorMat);
    headGroup.add(headBase);

    // Build Specific Headgear
    if (activeHeadgear === 'helm') {
      const helm = new THREE.Mesh(new THREE.SphereGeometry(0.39, 24, 24), trimMat);
      helm.scale.set(0.95, 1.15, 1.05);
      headGroup.add(helm);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.2), glowMat);
      visor.position.set(0, 0.02, 0.35);
      headGroup.add(visor);
    } else if (activeHeadgear === 'hood' || activeHeadgear === 'cowl') {
      const hood = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.75, 16), baseArmorMat);
      hood.position.set(0, 0.15, -0.05);
      hood.rotation.x = 0.2;
      headGroup.add(hood);

      const eyesGlow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.1), glowMat);
      eyesGlow.position.set(0, 0.02, 0.32);
      headGroup.add(eyesGlow);
    } else if (activeHeadgear === 'halo') {
      const haloMesh = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.025, 16, 48), auraRingMat);
      haloMesh.rotation.x = Math.PI / 2;
      haloMesh.position.set(0, 0.45, 0);
      headGroup.add(haloMesh);
    } else if (activeHeadgear === 'crown') {
      const crownMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.2, 8, 1, true), trimMat);
      crownMesh.position.set(0, 0.32, 0);
      headGroup.add(crownMesh);
    } else if (activeHeadgear === 'visor') {
      const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.22), glowMat);
      visorMesh.position.set(0, 0.05, 0.3);
      headGroup.add(visorMesh);
    } else if (activeHeadgear === 'horns') {
      const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 8), trimMat);
      horn1.position.set(-0.25, 0.4, 0.1);
      horn1.rotation.z = -0.4;
      headGroup.add(horn1);

      const horn2 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 8), trimMat);
      horn2.position.set(0.25, 0.4, 0.1);
      horn2.rotation.z = 0.4;
      headGroup.add(horn2);
    }

    // Pauldrons (Shoulder Armor)
    const pauldronGeo = new THREE.BoxGeometry(0.38, 0.3, 0.55);
    const leftShoulder = new THREE.Mesh(pauldronGeo, trimMat);
    leftShoulder.position.set(-0.82, 2.25, 0);
    leftShoulder.rotation.z = -0.35;
    bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(pauldronGeo, trimMat);
    rightShoulder.position.set(0.82, 2.25, 0);
    rightShoulder.rotation.z = 0.35;
    bodyGroup.add(rightShoulder);

    // Arms & Legs
    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.85, 12);
    const leftArm = new THREE.Mesh(armGeo, baseArmorMat);
    leftArm.position.set(-0.76, 1.6, 0.05);
    leftArm.rotation.z = 0.12;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, baseArmorMat);
    rightArm.position.set(0.76, 1.6, 0.05);
    rightArm.rotation.z = -0.12;
    bodyGroup.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.05, 12);
    const leftLeg = new THREE.Mesh(legGeo, baseArmorMat);
    leftLeg.position.set(-0.3, 0.55, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, baseArmorMat);
    rightLeg.position.set(0.3, 0.55, 0);
    bodyGroup.add(rightLeg);

    // 9. Weapon Construction Group
    const weaponGroup = new THREE.Group();
    bodyGroup.add(weaponGroup);

    if (activeWeapon === 'greatsword') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.04), trimMat);
      blade.position.set(0.85, 2.0, 0.3);
      blade.rotation.z = -0.25;
      weaponGroup.add(blade);
    } else if (activeWeapon === 'staff') {
      const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12), trimMat);
      staffShaft.position.set(0.9, 1.8, 0.2);
      weaponGroup.add(staffShaft);

      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), glowMat);
      orb.position.set(0.9, 2.95, 0.2);
      weaponGroup.add(orb);
    } else if (activeWeapon === 'daggers') {
      const d1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 8), glowMat);
      d1.position.set(-0.75, 1.2, 0.4);
      d1.rotation.x = Math.PI;
      weaponGroup.add(d1);

      const d2 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 8), glowMat);
      d2.position.set(0.75, 1.2, 0.4);
      d2.rotation.x = Math.PI;
      weaponGroup.add(d2);
    } else if (activeWeapon === 'shield_sword') {
      const shield = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.1), trimMat);
      shield.position.set(-0.85, 1.6, 0.35);
      weaponGroup.add(shield);

      const sword = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), glowMat);
      sword.position.set(0.8, 1.6, 0.2);
      weaponGroup.add(sword);
    } else if (activeWeapon === 'scythe') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 12), baseArmorMat);
      shaft.position.set(0.85, 1.8, 0);
      weaponGroup.add(shaft);

      const blade = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.04, 8, 24, Math.PI / 1.8), glowMat);
      blade.position.set(0.85, 2.9, 0.3);
      blade.rotation.y = Math.PI / 2;
      weaponGroup.add(blade);
    } else if (activeWeapon === 'cyber_blade' || activeWeapon === 'lute') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.05), glowMat);
      blade.position.set(0.85, 1.8, 0.3);
      blade.rotation.z = -0.3;
      weaponGroup.add(blade);
    }

    // 10. Particle System (Glowing Class Aura)
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleData: { angle: number; rad: number; y: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const rad = 0.8 + Math.random() * 1.2;
      const y = 0.2 + Math.random() * 3.2;
      particlePos[i * 3] = Math.cos(theta) * rad;
      particlePos[i * 3 + 1] = y;
      particlePos[i * 3 + 2] = Math.sin(theta) * rad;
      particleData.push({ angle: theta, rad, y, speed: 0.4 + Math.random() * 0.8 });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: auraColor,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    avatarRoot.add(particleSystem);

    // 11. Interactive Drag & Touch Orbit Controls
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

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const delta = e.touches[0].clientX - prevMouseX;
        targetRotY += delta * 0.012;
        prevMouseX = e.touches[0].clientX;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main Real-Time Render & Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Idle rhythm animation
      if (actionState === 'idle') {
        bodyGroup.position.y = Math.sin(t * 1.8) * 0.035;
        headGroup.rotation.y = Math.sin(t * 0.9) * 0.08;
        emblem.rotation.y = t * 1.2;
        weaponGroup.position.y = Math.sin(t * 2.2) * 0.04;

        runeRing1.rotation.z = -t * 0.15;
        runeRing2.rotation.z = t * 0.2;

        if (isAutoRotating && !isDragging) {
          targetRotY += 0.006;
        }
      } else if (actionState === 'dance') {
        // Dance animation: spinning rhythmic rotation, body bobbing & pulsing light
        bodyGroup.position.y = Math.abs(Math.sin(t * 6)) * 0.12;
        headGroup.rotation.y = Math.sin(t * 8) * 0.25;
        weaponGroup.rotation.z = t * 3.0;

        runeRing1.rotation.z = t * 1.5;
        runeRing2.rotation.z = -t * 2.0;

        targetRotY += 0.035; // Fast energetic spin
        classPointLight.intensity = 4.5 + Math.sin(t * 10) * 2.5;
      } else if (actionState === 'powerup') {
        // Power-Up animation: levitate up, explosive light flash & shockwave
        const powerPhase = Math.sin(t * 4);
        bodyGroup.position.y = 0.4 + powerPhase * 0.08;
        headGroup.rotation.x = -0.2;
        emblem.rotation.y = t * 5.0;

        classPointLight.intensity = 9.0 + Math.sin(t * 12) * 4.0;
        runeRing1.scale.setScalar(1.0 + Math.abs(Math.sin(t * 5)) * 0.4);

        if (!isDragging) {
          targetRotY += 0.015;
        }
      }

      // Smooth rotation interpolation
      currentRotY += (targetRotY - currentRotY) * 0.08;
      avatarRoot.rotation.y = currentRotY;

      // Particle physics update
      const pArray = particleSystem.geometry.attributes.position.array as Float32Array;
      const speedMultiplier = actionState === 'powerup' ? 2.8 : actionState === 'dance' ? 1.8 : 1.0;

      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        p.angle += 0.015 * p.speed * speedMultiplier;
        p.y += 0.008 * p.speed * speedMultiplier;
        if (p.y > 3.4) p.y = 0.2;
        pArray[i * 3] = Math.cos(p.angle) * p.rad;
        pArray[i * 3 + 1] = p.y;
        pArray[i * 3 + 2] = Math.sin(p.angle) * p.rad;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 13. Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeClass, activeWeapon, activeHeadgear, activeAuraColor, activeArmorTheme, actionState, isAutoRotating, level]);

  if (!webGlSupported) {
    return (
      <div className={`relative w-full ${height} rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col items-center justify-center p-space-md text-center`}>
        <span className="material-symbols-outlined text-[36px] text-tertiary">3d_rotation</span>
        <span className="font-headline-sm text-on-surface font-bold mt-2">Interactive 3D Stage</span>
        <span className="font-body-sm text-on-surface-variant max-w-xs mt-1">
          Class: <strong className="text-primary capitalize">{activeClass}</strong> • Lvl {level}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height} rounded-2xl mx-auto cursor-grab active:cursor-grabbing group overflow-hidden select-none`}>
      {/* Three.js Mounting Element */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Class Tag Overlay */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-space-xs">
        <span className="font-label-telemetry text-[10px] text-primary uppercase font-bold bg-surface-container-low/90 backdrop-blur-md px-space-sm py-1 rounded border border-primary/30 shadow-md">
          {activeClass.toUpperCase()} // LVL {level}
        </span>
      </div>

      {/* Interactive Action Control Overlay Bar */}
      {showControls && (
        <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-space-xs bg-surface-container-lowest/80 backdrop-blur-md p-space-xs rounded-xl border border-surface-container-high shadow-xl opacity-90 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            <button
              onClick={() => customization.triggerPowerUp()}
              className={`px-2.5 py-1 rounded font-label-telemetry text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                actionState === 'powerup'
                  ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
              }`}
              title="Trigger Power-Up Action"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>POWER UP</span>
            </button>

            <button
              onClick={() => customization.triggerDance()}
              className={`px-2.5 py-1 rounded font-label-telemetry text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                actionState === 'dance'
                  ? 'bg-secondary text-on-secondary shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
              }`}
              title="Trigger Dance Action"
            >
              <span className="material-symbols-outlined text-[14px]">music_note</span>
              <span>DANCE</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => customization.setIsAutoRotating(!isAutoRotating)}
              className={`p-1 rounded font-label-telemetry text-[10px] uppercase font-bold transition-all cursor-pointer ${
                isAutoRotating ? 'text-primary bg-primary/10' : 'text-outline hover:text-on-surface'
              }`}
              title="Toggle Auto-Rotation"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 rounded bg-tertiary-container/30 hover:bg-tertiary-container/60 text-tertiary border border-tertiary/30 font-label-telemetry text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              title="Open Customizer"
            >
              <span className="material-symbols-outlined text-[14px]">palette</span>
              <span>CUSTOMIZE</span>
            </button>
          </div>
        </div>
      )}

      {/* Avatar Customization Modal Drawer */}
      <AvatarCustomizerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
