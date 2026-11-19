export interface NumberTile {
  id: number;
  value: number;
  x: number; // percentage left
  y: number; // percentage top
  found: boolean;
  isDecoy: boolean;
}


export function generateTilePositions(count: number, decoysCount: number, width: number, fixedHeight?: number) {
  const total = count + decoysCount;
  const columns = Math.max(1, Math.floor((width - 24) / 64));
  const rows = Math.max(1, Math.ceil(total / columns));
  const height = fixedHeight ?? Math.max(440, rows * 64 + 24);
  const cellWidth = (width - 24) / columns;
  const cellHeight = (height - 24) / rows;
  const slots = Array.from({ length: columns * rows }, (_, i) => ({
    x: (12 + (i % columns + 0.5) * cellWidth) / width * 100,
    y: (12 + (Math.floor(i / columns) + 0.5) * cellHeight) / height * 100,
  }));
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const tiles: NumberTile[] = Array.from({ length: total }, (_, i) => ({
    id: i + 1, value: i >= count ? -99 : i + 1,
    ...slots[i], found: false, isDecoy: i >= count,
  }));
  return { tiles, height };
}

