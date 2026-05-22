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
    if (!element || !("IntersectionObserver" in window)) return;

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
  const scale = 3.8 / Math.max(size.x, size.y, size.z);

  model.scale.setScalar(scale);
  model.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
    -center.z * scale,
  );
}

function AE86Model({ path }: { path: string }) {
  const { scene } = useLoader(GLTFLoader, path);

  const model = useMemo(() => {
    const instance = clone(scene) as Group;
    fitModelToStage(instance);

    instance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

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

function AE86Scene({
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
      {/* Base ambient — keeps the car readable without blowing out highlights */}
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#e4e4e7", "#18181b", 1.2]} />

      {/* Primary key light — front-left, casts crisp shadows */}
      <directionalLight
        castShadow
        intensity={2.4}
        position={[-3.5, 5, 4.5]}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={6}
        shadow-bias={-0.0001}
      />

      {/* Fill light — right side, softer */}
      <spotLight
        intensity={3.2}
        position={[4, 4, 3]}
        angle={0.45}
        penumbra={0.7}
        decay={1.4}
      />

      {/* Rim light — subtle cool edge highlight from behind */}
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
          <AE86Model path={modelPath} />
        </Suspense>
      </group>

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
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    const MODELS = [
      "/models/AE86.glb",
      "/models/toyota_ae86.glb",
      "/models/satellite.glb",
    ];
    setModelPath(MODELS[Math.floor(Math.random() * MODELS.length)]);
  }, []);

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <section
      id="projects"
      ref={ref}
      className="mb-16 mt-8 scroll-mt-24 md:mt-6"
    >
      {/*
       * Hero row — text + car side by side.
       * overflow-visible on the wrapper lets the atmospheric glow
       * and canvas bleed softly outside the max-w-2xl boundary.
       */}
      <div className="relative overflow-visible">
        {/*
         * Full-bleed atmospheric backdrop — sits behind everything,
         * centered on the car (right side). Overflows the container
         * naturally with no visible edge.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            // Fade outer edge to the exact page background color — no harsh transparency edge
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 40%, #09090b 70%)",
          }}
        />

        <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-[1fr_1.15fr] md:gap-0 md:items-center">
          {/* ── Left: heading / description / CTA ── */}
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h2 className="text-2xl font-semibold text-zinc-100">Projects</h2>
            <p className="max-w-[260px] text-sm leading-relaxed text-zinc-400 md:max-w-[220px]">
              A collection of things I&apos;ve built and shipped.
            </p>
            <Link
              href="/projects"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
            >
              Explore all projects
              <ArrowRightIcon className="h-4 w-4 text-zinc-500" />
            </Link>
          </div>

          {/* ── Right: AE86 canvas ── */}
          <div className="relative overflow-visible">
            {/* Canvas */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[240px] lg:h-[280px]">
              <Canvas
                shadows
                dpr={[1, 1.5]}
                frameloop={isVisible ? "always" : "demand"}
                camera={{
                  // Tighter FOV + closer → car fills the frame
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
                {modelPath && (
                  <AE86Scene isActive={isVisible} modelPath={modelPath} />
                )}
              </Canvas>
            </div>

            {/*
             * Ground-reflection glow — feathered ellipse sits
             * beneath the car, fades completely to transparent.
             */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-14 w-4/5 -translate-x-1/2"
              style={{
                // Fade to the actual page background — never to 'transparent'
                // which the browser renders as transparent-black, not the bg color
                background:
                  "radial-gradient(ellipse at 50% 10%, rgba(180,180,195,0.06) 0%, #09090b 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Featured projects ── */}
      <div className="mt-12 md:mt-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Featured projects
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
          >
            View all projects
            <ArrowRightIcon className="h-3.5 w-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300" />
          </Link>
        </div>

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
useLoader.preload(GLTFLoader, "/models/toyota_ae86.glb");
useLoader.preload(GLTFLoader, "/models/satellite.glb");
