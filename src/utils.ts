export const getCirclePos = (props: {
  r: number;
  x: number;
  y: number;
  deg: number;
}) => {
  const PI = Math.PI;
  const { x, y, r, deg } = props;
  const rx = Math.cos((PI / 180) * deg) * r + x;
  const ry = Math.sin((PI / 180) * deg) * r + y;
  return [rx, ry];
};

export const degressToRads = (_deg: number) => {
  const deg = _deg - 90;
  return (deg * Math.PI) / 180;
};

type Point = {
  x: number;
  y: number;
  w: number;
  h: number;
};
export function isRectIntersect(a: Point, b: Point) {
  const a_min_x = a.x;
  const a_min_y = a.y;
  const a_max_x = a.x + a.w;
  const a_max_y = a.y + a.h;

  const b_min_x = b.x;
  const b_min_y = b.y;
  const b_max_x = b.x + b.w;
  const b_max_y = b.y + b.h;

  return (
    a_min_x <= b_max_x &&
    a_max_x >= b_min_x &&
    a_min_y <= b_max_y &&
    a_max_y >= b_min_y
  );
}
export const isPassRect = (p: Point, x: number, y: number, deg: number) => {
  if (deg > 89 && deg < 91) {
    if (x >= p.x && x <= p.x + p.w) return true;
    return false;
  }
  const k = -Math.tan(degressToRads(90 - deg));
  const b = y - k * x;
  const p1 = p.y - k * p.x - b;
  const p2 = p.y - k * (p.x + p.w) - b;
  const p3 = p.y + p.h - k * p.x - b;
  const p4 = p.y + p.h - k * (p.x + p.w) - b;
  const res1 = p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0;
  const res2 = p1 < 0 && p2 < 0 && p3 < 0 && p4 < 0;
  if (res1 || res2) {
    return false;
  }
  return true;
};
