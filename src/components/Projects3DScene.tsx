"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";

function fitModelToStage(model: Object3D) {
  const bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = 2.6 / Math.max(size.x, size.y, size.z);

  model.scale.setScalar(scale);
  model.position.set(
    -center.x * scale,
    -center.y * scale,
    -center.z * scale,
  );
}

function Model({ path }: { path: string }) {
  const { scene } = useLoader(GLTFLoader, path);

  const model = useMemo(() => {
    const instance = clone(scene) as Group;
    fitModelToStage(instance);

    instance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (material instanceof MeshStandardMaterial) {
          material.envMapIntensity = 0.6;
          material.roughness = Math.max(material.roughness, 0.42);
        }
      }
    });

    return instance;
  }, [scene]);

  return <primitive object={model} rotation={[0, -0.35, 0]} />;
}

function SmoothOrbitControls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enableDamping = true;
    instance.enablePan = false;
    instance.enableZoom = false;
    instance.minPolarAngle = Math.PI / 2.5;
    instance.maxPolarAngle = Math.PI / 2.5;
    instance.rotateSpeed = 0.45;
    return instance;
  }, [camera, gl.domElement]);

  // OrbitControls captures touch pointers, which suppresses browser scroll
  // even with touch-action: pan-y. Release capture so the browser can scroll.
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    const handler = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        try { el.releasePointerCapture(e.pointerId); } catch {}
      }
    };
    el.addEventListener("pointerdown", handler);
    return () => el.removeEventListener("pointerdown", handler);
  }, [gl.domElement]);

  useEffect(() => () => controls.dispose(), [controls]);
  useFrame(() => controls.update());
  return null;
}

function Scene({ isActive }: { isActive: boolean }) {
  const rig = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!isActive || !rig.current) return;
    rig.current.rotation.y += delta * 0.16;
  });

  return (
    <>
      {/* Base ambient */}

      <hemisphereLight args={["#e4e4e7", "#18181b", 1.2]} />

      {/* Primary key light */}
      <directionalLight
        intensity={1.8}
        position={[-3.5, 5, 4.5]}
      />


      <group ref={rig} position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Model path="/models/earth.glb" />
        </Suspense>
      </group>

      <SmoothOrbitControls />
    </>
  );
}

export default function Projects3DScene({ isVisible }: { isVisible: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={isVisible ? "always" : "demand"}
      camera={{
        position: [3.8, 2.1, 4.8],
        fov: 32,
        near: 0.1,
        far: 60,
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ overflow: "visible" }}
    >
      <Scene isActive={isVisible} />
    </Canvas>
  );
}
