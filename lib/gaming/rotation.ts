export type Point3 = readonly [number, number, number];

function normalized(points: readonly Point3[]) {
  const min = [0, 1, 2].map(axis => Math.min(...points.map(point => point[axis])));
  return points.map(point => point.map((value, axis) => value - min[axis]).join(",")).sort().join(";");
}

/** Compare voxel objects under the 24 proper cube rotations, never reflections. */
export function rotationEquivalent(a: readonly Point3[], b: readonly Point3[]) {
  if (a.length !== b.length) return false;
  if (!a.length) return true;
  const target = normalized(b);
  const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  for (const axes of permutations) {
    const inversions = axes.reduce((sum, value, i) => sum + axes.slice(i + 1).filter(next => next < value).length, 0);
    const parity = inversions % 2 ? -1 : 1;
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      if (parity * x * y * z !== 1) continue;
      const signs = [x, y, z];
      const rotated = a.map(point => axes.map((axis, i) => point[axis] * signs[i]) as [number, number, number]);
      if (normalized(rotated) === target) return true;
    }
  }
  return false;
}
