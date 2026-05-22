"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  const scale = 3.8 / Math.max(size.x, size.y, size.z);

  model.scale.setScalar(scale);
  model.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
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
    instance.minPolarAngle = Math.PI / 3.6;
    instance.maxPolarAngle = Math.PI / 2.15;
    instance.rotateSpeed = 0.45;
    return instance;
  }, [camera, gl.domElement]);

  useEffect(() => () => controls.dispose(), [controls]);
  useFrame(() => controls.update());
  return null;
}

function Scene({
  isActive,
  modelPath,
}: {
  isActive: boolean;
  modelPath: string;
}) {
  const rig = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!isActive || !rig.current) return;
    rig.current.rotation.y += delta * 0.16;
  });

  return (
    <>
      {/* Base ambient */}
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#e4e4e7", "#18181b", 1.2]} />

      {/* Primary key light */}
      <directionalLight
        intensity={2.4}
        position={[-3.5, 5, 4.5]}
      />

      {/* Fill light */}
      <spotLight
        intensity={3.2}
        position={[4, 4, 3]}
        angle={0.45}
        penumbra={0.7}
        decay={1.4}
      />

      {/* Rim light */}
      <spotLight
        intensity={0.8}
        position={[-2, 3, -4]}
        angle={0.5}
        penumbra={1}
        decay={2}
        color="#a1a1aa"
      />

      <group ref={rig} position={[0, -0.4, 0]}>
        <Suspense fallback={null}>
          <Model path={modelPath} />
        </Suspense>
      </group>

      <SmoothOrbitControls />
    </>
  );
}

export default function Projects3DScene({ isVisible }: { isVisible: boolean }) {
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    const MODELS = [
      "/models/AE86.glb",
      "/models/toyota_ae86.glb",
      "/models/satellite.glb",
    ];
    setModelPath(MODELS[Math.floor(Math.random() * MODELS.length)]);
  }, []);

  if (!modelPath) return null;

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
      <Scene isActive={isVisible} modelPath={modelPath} />
    </Canvas>
  );
}
