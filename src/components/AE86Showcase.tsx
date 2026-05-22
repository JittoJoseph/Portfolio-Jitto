"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/lib/sanity/types";
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

function useIsVisible<T extends HTMLElement>(rootMargin = "160px") {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;

    if (!element || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible };
}

function fitModelToStage(model: Object3D) {
  const bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = 3.6 / Math.max(size.x, size.y, size.z);

  model.scale.setScalar(scale);
  model.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
    -center.z * scale,
  );
}

function AE86Model() {
  const { scene } = useLoader(GLTFLoader, "/models/AE86.glb");

  const model = useMemo(() => {
    const instance = clone(scene) as Group;

    fitModelToStage(instance);

    instance.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (material instanceof MeshStandardMaterial) {
          material.envMapIntensity = 0.65;
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

  useEffect(() => {
    return () => controls.dispose();
  }, [controls]);

  useFrame(() => controls.update());

  return null;
}

function AE86Scene({ isActive }: { isActive: boolean }) {
  const rig = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!isActive || !rig.current) {
      return;
    }

    rig.current.rotation.y += delta * 0.16;
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#f4f4f5", "#18181b", 1.4]} />
      <directionalLight
        castShadow
        intensity={2.2}
        position={[-3.5, 5, 4.5]}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={4}
        shadow-bias={-0.0001}
      />
      <spotLight
        intensity={3.6}
        position={[4, 4, 3]}
        angle={0.45}
        penumbra={0.7}
        decay={1.4}
      />

      <group ref={rig}>
        <Suspense fallback={null}>
          <AE86Model />
        </Suspense>
      </group>

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
      >
        <circleGeometry args={[2.65, 64]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.25, 0.005, 0.18]}>
        <circleGeometry args={[1.45, 64]} />
        <meshBasicMaterial color="#030712" transparent opacity={0.32} />
      </mesh>

      <SmoothOrbitControls />
    </>
  );
}

export default function AE86Showcase({
  projects,
}: {
  projects: ProjectData[];
}) {
  const { ref, isVisible } = useIsVisible<HTMLElement>();
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <section id="projects" ref={ref} className="mb-24 scroll-mt-24">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-zinc-100">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2"
          >
            Projects
            <ArrowRightIcon className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300" />
          </Link>
        </h2>
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <p className="max-w-md text-sm text-zinc-400">
            Spin the AE86 and jump into the full archive when you are ready.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
          >
            View all projects
            <ArrowRightIcon className="h-4 w-4 text-zinc-500" />
          </Link>
        </div>

        <div className="relative h-[260px] sm:h-[320px] lg:h-[360px]">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            frameloop={isVisible ? "always" : "demand"}
            camera={{ position: [4.2, 2.35, 5.2], fov: 36, near: 0.1, far: 60 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
          >
            <AE86Scene isActive={isVisible} />
          </Canvas>
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Featured projects
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

useLoader.preload(GLTFLoader, "/models/AE86.glb");
