"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PixelCompanion.module.css";

type Direction = "right" | "up" | "left" | "down";
type Mode = "idle" | "run" | "phone";

const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 32;
const FRAMES_PER_DIRECTION = 6;
const BASE_SCALE = 2;
const MOBILE_SCALE = 1.75;
const WALK_SPEED = 58;
const HURRY_SPEED = 88;
const TURN_PAUSE_MS = 110;
const IDLE_SETTLE_MS = 850;

const DIRECTION_OFFSET: Record<Direction, number> = {
  right: 0,
  up: 6,
  left: 12,
  down: 18,
};

type Point = {
  x: number;
  y: number;
};

type Target = {
  point: Point;
  resting: boolean;
  surfaceId?: string;
};

type SpriteState = {
  direction: Direction;
  frame: number;
  interfaceLayer: "behind" | "above";
  mode: Mode;
  resting: boolean;
  visible: boolean;
};

type Surface = {
  id: string;
  x1: number;
  x2: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function directionFromDelta(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }

  return dy >= 0 ? "down" : "up";
}

function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight,
  );
}

function getCompanionSize() {
  const scale = window.innerWidth <= 520 ? MOBILE_SCALE : BASE_SCALE;

  return {
    width: FRAME_WIDTH * scale,
    height: FRAME_HEIGHT * scale,
  };
}

function getContentRect() {
  return document.querySelector("main > div")?.getBoundingClientRect() ?? null;
}

function getPageTop(element: Element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function getGutterX(rect: DOMRect | null, companionWidth: number) {
  const viewportWidth = window.innerWidth;

  if (!rect) {
    return 16;
  }

  const leftGutter = rect.left;
  const rightGutter = viewportWidth - rect.right;
  const needsRoom = companionWidth + 14;

  if (leftGutter >= needsRoom) {
    return Math.max(10, rect.left - companionWidth - 10);
  }

  if (rightGutter >= needsRoom) {
    return Math.min(viewportWidth - companionWidth - 10, rect.right + 10);
  }

  return clamp(
    viewportWidth - companionWidth - 12,
    8,
    viewportWidth - companionWidth - 8,
  );
}

function topSurfaceY(element: Element, footOffset = 2) {
  return getPageTop(element) - getCompanionSize().height + footOffset;
}

function clampToPage(point: Point) {
  const companion = getCompanionSize();

  return {
    x: clamp(point.x, 6, window.innerWidth - companion.width - 6),
    y: clamp(point.y, 38, getDocumentHeight() - companion.height - 8),
  };
}

function getWalkableSurfaces(): Surface[] {
  const companion = getCompanionSize();
  const contentRect = getContentRect();
  const surfaces: Surface[] = [];
  const heroLinks = Array.from(
    document.querySelectorAll<HTMLElement>("main section:first-of-type a[href]"),
  );
  const firstHeroLink = heroLinks[0];
  const heroRow = firstHeroLink?.parentElement;

  if (heroRow) {
    const rect = heroRow.getBoundingClientRect();
    surfaces.push({
      id: "hero-actions",
      x1: clamp(rect.left - 4, 6, window.innerWidth - companion.width - 6),
      x2: clamp(rect.right + 4 - companion.width, 6, window.innerWidth - companion.width - 6),
      y: topSurfaceY(heroRow, 8),
    });
  }

  const tabBar = document.querySelector<HTMLElement>("main section:nth-of-type(2) button")?.parentElement;

  if (tabBar) {
    const rect = tabBar.getBoundingClientRect();
    surfaces.push({
      id: "experience-tabs",
      x1: clamp(rect.left + 6, 6, window.innerWidth - companion.width - 6),
      x2: clamp(rect.right - companion.width - 6, 6, window.innerWidth - companion.width - 6),
      y: topSurfaceY(tabBar, 2),
    });
  }

  const activityCard = document.querySelector<HTMLElement>(
    "main section a[aria-label='Open GitHub profile']",
  );

  if (activityCard) {
    const rect = activityCard.getBoundingClientRect();
    surfaces.push({
      id: "code-activity-top",
      x1: clamp(rect.left + 8, 6, window.innerWidth - companion.width - 6),
      x2: clamp(rect.right - companion.width - 8, 6, window.innerWidth - companion.width - 6),
      y: topSurfaceY(activityCard, 2),
    });
  }

  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      "main section .grid > .group, main section .grid > div",
    ),
  );

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const y = topSurfaceY(card, 2);
    const topX1 = rect.left + 8;
    const topX2 = rect.right - companion.width - 8;

    if (topX2 > topX1) {
      surfaces.push({
        id: `project-top-${index}`,
        x1: clamp(topX1, 6, window.innerWidth - companion.width - 6),
        x2: clamp(topX2, 6, window.innerWidth - companion.width - 6),
        y,
      });
    }
  });

  if (contentRect) {
    const laneX = getGutterX(contentRect, companion.width);
    surfaces.push({
      id: "section-lane",
      x1: laneX - 12,
      x2: laneX + 12,
      y: 0,
    });
  }

  return surfaces;
}

function findSurface(point: Point, surfaceId?: string) {
  const surfaces = getWalkableSurfaces();

  if (surfaceId) {
    return surfaces.find((surface) => surface.id === surfaceId) ?? null;
  }

  return (
    surfaces.find(
      (surface) =>
        surface.id !== "section-lane" &&
        Math.abs(point.y - surface.y) < 18 &&
        point.x >= surface.x1 - 24 &&
        point.x <= surface.x2 + 24,
    ) ?? null
  );
}

function findNearestSurface(point: Point) {
  const surfaces = getWalkableSurfaces().filter((surface) => surface.id !== "section-lane");

  let nearest: { surface: Surface; score: number } | null = null;

  for (const surface of surfaces) {
    const clampedX = clamp(point.x, surface.x1, surface.x2);
    const score = Math.abs(point.y - surface.y) + Math.abs(point.x - clampedX) * 0.45;

    if (!nearest || score < nearest.score) {
      nearest = { surface, score };
    }
  }

  return nearest && nearest.score < 120 ? nearest.surface : null;
}

function getSurfaceWanderTarget(): Target | null {
  const allSurfaces = getWalkableSurfaces().filter(
    (surface) => surface.id !== "section-lane" && surface.x2 - surface.x1 > 18,
  );
  const visibleSurfaces = allSurfaces.filter((surface) => {
    const viewportY = surface.y - window.scrollY;

    return viewportY > -110 && viewportY < window.innerHeight + 100;
  });
  const lowerSurfaces = allSurfaces.filter(
    (surface) => surface.y > getDocumentHeight() * 0.38,
  );

  if (allSurfaces.length === 0) {
    return null;
  }

  const roll = Math.random();
  const nonExperienceSurfaces = allSurfaces.filter(
    (surface) => surface.id !== "experience-tabs",
  );
  const lowerNonExperienceSurfaces = lowerSurfaces.filter(
    (surface) => surface.id !== "experience-tabs",
  );
  const visibleNonExperienceSurfaces = visibleSurfaces.filter(
    (surface) => surface.id !== "experience-tabs",
  );
  const pool = roll < 0.5 && visibleNonExperienceSurfaces.length > 0
    ? visibleNonExperienceSurfaces
    : roll < 0.82 && lowerNonExperienceSurfaces.length > 0
      ? lowerNonExperienceSurfaces
      : roll < 0.94 && nonExperienceSurfaces.length > 0
        ? nonExperienceSurfaces
        : roll < 0.98 && visibleSurfaces.length > 0
          ? visibleSurfaces
          : allSurfaces;
  const surface = pool[Math.floor(Math.random() * pool.length)];
  const travel = Math.max(surface.x2 - surface.x1, 1);

  return {
    point: clampToPage({
      x: surface.x1 + travel * (0.2 + Math.random() * 0.6),
      y: surface.y,
    }),
    resting: false,
    surfaceId: surface.id,
  };
}

function getExperienceTabTarget(): Target | null {
  const surface = findSurface({ x: 0, y: 0 }, "experience-tabs");

  if (!surface) {
    return null;
  }

  return {
    point: clampToPage({
      x: surface.x1 + Math.max(12, (surface.x2 - surface.x1) * 0.18),
      y: surface.y,
    }),
    resting: false,
    surfaceId: surface.id,
  };
}

function getCodeActivityTarget(): Target | null {
  const surface = findSurface({ x: 0, y: 0 }, "code-activity-top");

  if (!surface) {
    return null;
  }

  return {
    point: clampToPage({
      x: surface.x1 + Math.max(10, (surface.x2 - surface.x1) * 0.65),
      y: surface.y,
    }),
    resting: false,
    surfaceId: surface.id,
  };
}

function getHeroPoint(): Target {
  const rect = getContentRect();
  const companion = getCompanionSize();
  const hero = document.querySelector("main section");
  const heroRect = hero?.getBoundingClientRect();
  const heroSurface = findSurface({ x: 0, y: 0 }, "hero-actions");

  if (heroSurface) {
    return {
      point: clampToPage({
        x: heroSurface.x1 + Math.max(10, (heroSurface.x2 - heroSurface.x1) * 0.5),
        y: heroSurface.y,
      }),
      resting: false,
      surfaceId: heroSurface.id,
    };
  }

  const y = hero && heroRect
    ? getPageTop(hero) + Math.min(heroRect.height * 0.5, 190)
    : window.scrollY + window.innerHeight * 0.32;

  return {
    point: clampToPage({
      x: getGutterX(rect, companion.width),
      y,
    }),
    resting: false,
    surfaceId: "section-lane",
  };
}

function getObservedProjectPoint(): Target | null {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      "main section .grid > .group, main section .grid > div",
    ),
  );
  const viewportCenter = window.innerHeight * 0.5;

  let best: { rect: DOMRect; element: HTMLElement; score: number } | null = null;

  for (const card of cards) {
    const rect = card.getBoundingClientRect();

    if (rect.bottom < 72 || rect.top > window.innerHeight - 72) {
      continue;
    }

    const score = Math.abs(rect.top + rect.height * 0.35 - viewportCenter);

    if (!best || score < best.score) {
      best = { rect, element: card, score };
    }
  }

  if (!best) {
    return null;
  }

  const cardIndex = cards.indexOf(best.element);
  const surfaceId = `project-top-${cardIndex}`;
  const surface = findSurface({ x: 0, y: 0 }, surfaceId);

  if (!surface) {
    return null;
  }

  return {
    point: clampToPage({
      x: surface.x1 + Math.max(8, (surface.x2 - surface.x1) * 0.35),
      y: surface.y,
    }),
    resting: false,
    surfaceId,
  };
}

function getSectionPoint(): Target {
  const companion = getCompanionSize();
  const contentRect = getContentRect();
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
  const viewportAnchor = window.innerHeight * 0.38;

  let active: HTMLElement | null = null;
  let activeRect: DOMRect | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      continue;
    }

    const score = Math.abs(rect.top - viewportAnchor);

    if (score < bestScore) {
      active = section;
      activeRect = rect;
      bestScore = score;
    }
  }

  const footer = document.querySelector("footer");
  const footerRect = footer?.getBoundingClientRect();

  if (footer && footerRect && footerRect.top < window.innerHeight - 110) {
    return {
      point: clampToPage({
        x: getGutterX(contentRect, companion.width),
        y: getPageTop(footer) - companion.height + 14,
      }),
      resting: true,
      surfaceId: "section-lane",
    };
  }

  if (!active || !activeRect) {
    return {
      ...getHeroPoint(),
      resting: false,
    };
  }

  if (active.querySelector("button")?.parentElement) {
    const tabTarget = getExperienceTabTarget();

    if (tabTarget) {
      return tabTarget;
    }
  }

  if (active.querySelector("a[aria-label='Open GitHub profile']")) {
    const activityTarget = getCodeActivityTarget();

    if (activityTarget) {
      return activityTarget;
    }
  }

  return {
    point: clampToPage({
      x: getGutterX(contentRect, companion.width),
      y: getPageTop(active) + 24,
    }),
    resting: false,
    surfaceId: "section-lane",
  };
}

function getHoverPoint(target: Element): Target {
  const companion = getCompanionSize();
  const rect = target.getBoundingClientRect();
  const pageTop = getPageTop(target);
  const above = rect.top > companion.height + 10;
  const y = above ? pageTop - companion.height + 4 : pageTop + rect.height + 6;
  const heroSurface = findSurface({ x: rect.left, y }, "hero-actions");
  const tabsSurface = findSurface({ x: rect.left, y }, "experience-tabs");
  const surface = heroSurface && rect.top < window.innerHeight * 0.45
    ? heroSurface
    : tabsSurface ?? findNearestSurface({ x: rect.left, y });

  return {
    point: clampToPage({
      x: rect.left + rect.width * 0.5 - companion.width * 0.5,
      y: surface?.y ?? y,
    }),
    resting: false,
    surfaceId: surface?.id,
  };
}

function buildWalkingPath(from: Point, to: Point, targetSurfaceId?: string) {
  const laneX = getGutterX(getContentRect(), getCompanionSize().width);
  const current = clampToPage(from);
  const target = clampToPage(to);
  const currentSurface = findSurface(current);
  const targetSurface = targetSurfaceId === "section-lane"
    ? null
    : findSurface(target, targetSurfaceId);
  const points: Point[] = [];
  const currentOnLane = Math.abs(current.x - laneX) < 16;
  const targetOnLane = Math.abs(target.x - laneX) < 16;

  if (currentSurface && targetSurface && currentSurface.id === targetSurface.id) {
    points.push(clampToPage({
      x: clamp(target.x, targetSurface.x1, targetSurface.x2),
      y: targetSurface.y,
    }));

    return prunePath(current, points);
  }

  if (currentSurface) {
    points.push(clampToPage({
      x: clamp(laneX, currentSurface.x1, currentSurface.x2),
      y: currentSurface.y,
    }));
    points.push(clampToPage({ x: laneX, y: currentSurface.y }));
  } else if (!currentOnLane) {
    points.push(clampToPage({ x: laneX, y: current.y }));
  }

  const verticalTargetY = targetSurface?.y ?? target.y;

  if (!targetOnLane || Math.abs(current.y - verticalTargetY) > 2) {
    points.push(clampToPage({ x: laneX, y: verticalTargetY }));
  }

  if (targetSurface) {
    points.push(clampToPage({
      x: clamp(target.x, targetSurface.x1, targetSurface.x2),
      y: targetSurface.y,
    }));
  } else if (targetOnLane) {
    points.push(target);
  }

  return prunePath(current, points);
}

function buildEntrancePath(from: Point, to: Point) {
  return prunePath(clampToPage(from), [clampToPage(to)]);
}

function prunePath(from: Point, points: Point[]) {
  const pruned: Point[] = [];
  let previous = from;

  for (const point of points) {
    if (distance(previous, point) > 2) {
      pruned.push(point);
      previous = point;
    }
  }

  return pruned;
}

function pathDistance(from: Point, path: Point[]) {
  let total = 0;
  let previous = from;

  for (const point of path) {
    total += distance(previous, point);
    previous = point;
  }

  return total;
}

export default function PixelCompanion() {
  const layerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Point>({ x: -48, y: 160 });
  const pathRef = useRef<Point[]>([]);
  const finalTargetRef = useRef<Point>({ x: -48, y: 160 });
  const holdUntilRef = useRef(0);
  const hoverCooldownUntilRef = useRef(0);
  const idleSettleAtRef = useRef<number | null>(null);
  const entranceTargetRef = useRef<Point | null>(null);
  const pauseUntilRef = useRef(0);
  const playingPhoneAnimUntilRef = useRef(0);
  const bobHoveredRef = useRef(false);
  const restingRef = useRef(false);
  const wasMovingRef = useRef(false);
  const lastMoveTickRef = useRef(0);
  const lastSpriteTickRef = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const directionRef = useRef<Direction>("right");
  const readableDirectionRef = useRef<Direction>("down");
  const animationFrameRef = useRef<number | null>(null);
  const [sprite, setSprite] = useState<SpriteState>({
    direction: "right",
    frame: 0,
    interfaceLayer: "behind",
    mode: "idle",
    resting: false,
    visible: false,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const initialTarget = getExperienceTabTarget() ?? getHeroPoint();
    const initialPoint = initialTarget.point;
    const entrancePoint = clampToPage({
      x: initialPoint.x,
      y: initialPoint.y + 46,
    });

    positionRef.current = entrancePoint;
    finalTargetRef.current = entrancePoint;
    entranceTargetRef.current = initialPoint;

    const updateLayerHeight = () => {
      if (layerRef.current) {
        layerRef.current.style.height = `${getDocumentHeight()}px`;
      }
    };

    const applyTransform = (point: Point) => {
      if (!spriteRef.current) {
        return;
      }

      spriteRef.current.style.transform = `translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0)`;
    };

    const setTarget = (target: Target, holdFor = 0) => {
      const next = clampToPage(target.point);

      if (distance(finalTargetRef.current, next) < 10 && restingRef.current === target.resting) {
        return;
      }

      finalTargetRef.current = next;
      restingRef.current = target.resting;
      idleSettleAtRef.current = null;
      pathRef.current = buildWalkingPath(positionRef.current, next, target.surfaceId);

      const firstWaypoint = pathRef.current[0];

      if (firstWaypoint) {
        const firstDirection = directionFromDelta(
          firstWaypoint.x - positionRef.current.x,
          firstWaypoint.y - positionRef.current.y,
        );

        if (firstDirection !== directionRef.current) {
          pauseUntilRef.current = performance.now() + TURN_PAUSE_MS;
        }
      }

      if (holdFor > 0) {
        holdUntilRef.current = performance.now() + holdFor;
      }
    };

    const startEntrance = () => {
      finalTargetRef.current = initialPoint;
      restingRef.current = false;
      idleSettleAtRef.current = null;
      pathRef.current = buildEntrancePath(positionRef.current, initialPoint);
      pauseUntilRef.current = performance.now() + 90;
    };

    const settleNearPageStructure = () => {
      if (performance.now() < holdUntilRef.current) {
        return;
      }

      const surfaceTarget = getSurfaceWanderTarget();

      if (surfaceTarget && Math.random() < 0.7) {
        setTarget(surfaceTarget);
        return;
      }

      const projectPoint = getObservedProjectPoint();

      if (projectPoint && Math.random() > 0.35) {
        setTarget(projectPoint);
        return;
      }

      setTarget(getSectionPoint());
    };

    const updateSprite = (time: number, moving: boolean, direction: Direction, forcedMode?: Mode) => {
      const mode: Mode = forcedMode || (moving ? "run" : "idle");
      const interval = mode === "phone" ? 160 : moving ? 115 : restingRef.current ? 360 : 230;
      const framesCount = mode === "phone" ? 17 : FRAMES_PER_DIRECTION;

      if (time - lastSpriteTickRef.current < interval) {
        return;
      }

      lastSpriteTickRef.current = time;
      frameRef.current = (frameRef.current + 1) % framesCount;
      const shouldSettleForward = !moving &&
        idleSettleAtRef.current !== null &&
        time >= idleSettleAtRef.current;
      const displayDirection = shouldSettleForward
        ? "down"
        : !moving && direction === "up"
          ? readableDirectionRef.current
          : direction;

      directionRef.current = direction;

      if (displayDirection !== "up") {
        readableDirectionRef.current = displayDirection;
      }

      setSprite((current) => ({
        ...current,
        direction: displayDirection,
        frame: frameRef.current,
        mode,
        resting: restingRef.current,
        visible: true,
      }));
    };

    updateLayerHeight();

    if (prefersReducedMotion) {
      positionRef.current = initialPoint;
      finalTargetRef.current = initialPoint;
      applyTransform(initialPoint);

      const reducedMotionDelay = window.setTimeout(() => {
        setSprite({
          direction: "down",
          frame: 0,
          interfaceLayer: "above",
          mode: "idle",
          resting: false,
          visible: true,
        });
      }, 0);

      return () => {
        window.clearTimeout(reducedMotionDelay);
      };
    }

    applyTransform(positionRef.current);

    const loop = (time: number) => {
      const elapsed = lastMoveTickRef.current
        ? Math.min((time - lastMoveTickRef.current) / 1000, 0.05)
        : 0;
      lastMoveTickRef.current = time;

      let moving = false;
      let direction = restingRef.current ? "down" : directionRef.current;
      const nextWaypoint = pathRef.current[0];

      if (bobHoveredRef.current) {
        updateSprite(time, false, "down", "idle");
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (time < playingPhoneAnimUntilRef.current) {
        updateSprite(time, false, "down", "phone");
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (time < pauseUntilRef.current) {
        updateSprite(time, false, direction);
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (nextWaypoint && elapsed > 0) {
        const current = positionRef.current;
        const dx = nextWaypoint.x - current.x;
        const dy = nextWaypoint.y - current.y;
        const remaining = distance(current, nextWaypoint);
        const viewportDistance = Math.abs(current.y - window.scrollY - window.innerHeight * 0.48);
        const routeDistance = remaining + pathDistance(nextWaypoint, pathRef.current.slice(1));
        const distanceBoost = clamp(routeDistance / 420, 0, 1) * 24;
        const speed = viewportDistance > window.innerHeight * 1.2
          ? HURRY_SPEED
          : WALK_SPEED + distanceBoost;
        const step = speed * elapsed;

        direction = directionFromDelta(dx, dy);
        moving = true;

        if (remaining <= step) {
          positionRef.current = nextWaypoint;
          pathRef.current = pathRef.current.slice(1);

          if (
            entranceTargetRef.current &&
            distance(nextWaypoint, entranceTargetRef.current) < 2
          ) {
            entranceTargetRef.current = null;
            setSprite((currentSprite) => ({
              ...currentSprite,
              interfaceLayer: "above",
            }));
          }

          const followingWaypoint = pathRef.current[0];

          if (followingWaypoint) {
            const nextDirection = directionFromDelta(
              followingWaypoint.x - nextWaypoint.x,
              followingWaypoint.y - nextWaypoint.y,
            );

            if (nextDirection !== direction) {
              pauseUntilRef.current = time + TURN_PAUSE_MS;
            }
          }
        } else {
          positionRef.current = {
            x: current.x + (dx / remaining) * step,
            y: current.y + (dy / remaining) * step,
          };
        }

        applyTransform(positionRef.current);
      }

      if (moving) {
        wasMovingRef.current = true;
      } else if (wasMovingRef.current) {
        wasMovingRef.current = false;
        idleSettleAtRef.current = time + IDLE_SETTLE_MS;
      }

      updateSprite(time, moving, direction);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const companion = getCompanionSize();
      const pointer = {
        x: event.clientX,
        y: event.clientY + window.scrollY,
      };
      const bounds = {
        left: positionRef.current.x,
        right: positionRef.current.x + companion.width,
        top: positionRef.current.y,
        bottom: positionRef.current.y + companion.height,
      };
      const inside = pointer.x >= bounds.left &&
        pointer.x <= bounds.right &&
        pointer.y >= bounds.top &&
        pointer.y <= bounds.bottom;

      if (!inside) {
        if (bobHoveredRef.current) {
          bobHoveredRef.current = false;
          playingPhoneAnimUntilRef.current = performance.now() + (17 * 160);
          frameRef.current = -1; // -1 because updateSprite immediately increments it
          lastSpriteTickRef.current = 0;
        }
        return;
      }

      if (bobHoveredRef.current) {
        return;
      }

      bobHoveredRef.current = true;
      playingPhoneAnimUntilRef.current = 0;
      idleSettleAtRef.current = null;
      directionRef.current = "down";
      readableDirectionRef.current = "down";
      setSprite((current) => ({
        ...current,
        direction: "down",
        mode: "idle",
        resting: restingRef.current,
        visible: true,
      }));
    };

    const onScroll = () => {
      updateLayerHeight();

      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(settleNearPageStructure, 220);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const interactive = target.closest(
        "a[aria-label], a[href^='mailto:'], a[href*='linkedin'], a[href*='github'], a[href*='x.com'], button",
      );

      if (!interactive) {
        return;
      }

      const now = performance.now();

      if (now < hoverCooldownUntilRef.current) {
        return;
      }

      const hoverTarget = getHoverPoint(interactive);

      if (distance(positionRef.current, hoverTarget.point) > 500 || Math.random() < 0.08) {
        return;
      }

      hoverCooldownUntilRef.current = now + 2600;
      setTarget(hoverTarget, 1200);
    };

    const onResize = () => {
      updateLayerHeight();
      setTarget(getExperienceTabTarget() ?? getHeroPoint());
    };

    const idleNudge = window.setInterval(() => {
      if (performance.now() < holdUntilRef.current) {
        return;
      }

      if (Math.random() < 0.36) {
        const surfaceTarget = getSurfaceWanderTarget();
        const nextTarget = surfaceTarget && Math.random() < 0.68
          ? surfaceTarget
          : Math.random() < 0.22
            ? getHeroPoint()
            : getSectionPoint();
        setTarget(nextTarget);
      }
    }, 9500);

    const entranceDelay = window.setTimeout(() => {
      setSprite((current) => ({ ...current, visible: true }));
      startEntrance();
    }, 260);

    const structureDelay = window.setTimeout(settleNearPageStructure, 2100);

    animationFrameRef.current = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.clearInterval(idleNudge);
      window.clearTimeout(entranceDelay);
      window.clearTimeout(structureDelay);

      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  let displayFrame = sprite.frame;
  if (sprite.mode === "phone") {
    displayFrame = sprite.frame < 9 ? sprite.frame : 16 - sprite.frame;
  }
  const frameIndex = sprite.mode === "phone" ? displayFrame : DIRECTION_OFFSET[sprite.direction] + sprite.frame;

  return (
    <div
      ref={layerRef}
      className={[
        styles.layer,
        sprite.interfaceLayer === "behind"
          ? styles.behindInterfaceLayer
          : styles.aboveInterfaceLayer,
      ].join(" ")}
      aria-hidden="true"
    >
      <div
        ref={spriteRef}
        className={[
          styles.sprite,
          sprite.visible ? styles.visible : "",
          sprite.mode === "run" ? styles.running : "",
          sprite.resting ? styles.resting : "",
        ].join(" ")}
      >
        <div
          className={[
            styles.sheet,
            styles.idleSheet,
            sprite.mode === "idle" ? styles.activeSheet : "",
          ].join(" ")}
          style={{
            backgroundPosition: `-${frameIndex * FRAME_WIDTH}px 0px`,
          }}
        />
        <div
          className={[
            styles.sheet,
            styles.runSheet,
            sprite.mode === "run" ? styles.activeSheet : "",
          ].join(" ")}
          style={{
            backgroundPosition: `-${frameIndex * FRAME_WIDTH}px 0px`,
          }}
        />
        <div
          className={[
            styles.sheet,
            styles.phoneSheet,
            sprite.mode === "phone" ? styles.activeSheet : "",
          ].join(" ")}
          style={{
            backgroundPosition: `-${frameIndex * FRAME_WIDTH}px 0px`,
          }}
        />
      </div>
    </div>
  );
}
