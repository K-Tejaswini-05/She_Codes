let startRoom = null;

/* ===== CORRIDOR DEFINITIONS ===== */
const corridors = {
  LEFT: 345,
  RIGHT: 655,
  JUNCTIONS: [237, 355, 795]
};

/* ===== GET CENTER OF A ROOM ===== */
function getCenter(rect) {
  const x = +rect.getAttribute("x");
  const y = +rect.getAttribute("y");
  const w = +rect.getAttribute("width");
  const h = +rect.getAttribute("height");
  return { x: x + w / 2, y: y + h / 2 };
}

/* ===== FIND NEAREST HORIZONTAL CORRIDOR ===== */
function nearestY(y) {
  return corridors.JUNCTIONS.reduce((a, b) =>
    Math.abs(b - y) < Math.abs(a - y) ? b : a
  );
}

/* ===== SNAP ROOM TO CORRIDOR ===== */
function snap(rect, center) {
  const x = +rect.getAttribute("x");
  const w = +rect.getAttribute("width");

  if (x + w < corridors.LEFT) {
    return { x: corridors.LEFT, y: center.y };
  }
  if (x > corridors.RIGHT) {
    return { x: corridors.RIGHT, y: center.y };
  }
  return { x: center.x, y: nearestY(center.y) };
}

/* ===== BUILD WALKING PATH ===== */
function buildPath(fromRect, toRect) {
  const A = getCenter(fromRect);
  const B = getCenter(toRect);

  const aSnap = snap(fromRect, A);
  const bSnap = snap(toRect, B);
  const midY = nearestY((aSnap.y + bSnap.y) / 2);

  return [
    A,
    aSnap,
    { x: aSnap.x, y: midY },
    { x: bSnap.x, y: midY },
    bSnap,
    B
  ];
}

/* ===== DRAW PATH ===== */
function drawPath(points) {
  const svg = document.querySelector("svg");

  // remove old paths
  svg.querySelectorAll(".path").forEach(p => p.remove());

  for (let i = 0; i < points.length - 1; i++) {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", points[i].x);
    l.setAttribute("y1", points[i].y);
    l.setAttribute("x2", points[i + 1].x);
    l.setAttribute("y2", points[i + 1].y);
    l.setAttribute("class", "path");
    svg.appendChild(l);
  }
}

/* ===== CLICK HANDLER ===== */
document.addEventListener("click", e => {
  if (!e.target.classList.contains("room")) return;

  // FIRST CLICK
  if (!startRoom) {
    startRoom = e.target;
    e.target.style.fill = "#86efac"; // highlight
    return;
  }

  // SECOND CLICK
  const endRoom = e.target;
  drawPath(buildPath(startRoom, endRoom));

  // reset colors
  document.querySelectorAll(".room").forEach(r => {
    r.style.fill = "#fde68a";
  });

  startRoom = null;
});
