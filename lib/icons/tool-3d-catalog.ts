/**
 * Complete procedural 3D icon specification catalog covering all 76 interactive tools
 * in TOOL_MAPPING plus all 11 discipline arenas.
 *
 * Palette is calibrated strictly to the Clinical Light editorial visual system
 * (#FAF9F6 paper, #FFFFFF surface, #161614 ink, architectural pigments — zero neon slop).
 */

export type Tool3DArchetype =
    | "crown_board"
    | "celestial_balance"
    | "winding_path"
    | "sudoku_matrix"
    | "patch_mosaic"
    | "merge_blocks"
    | "letter_weave"
    | "pinpoint_dart"
    | "word_ladder"
    | "tetromino_stack"
    | "chronometer"
    | "sound_wave"
    | "traffic_signal"
    | "flanker_arrows"
    | "peripheral_eye"
    | "whack_pedestal"
    | "memory_cubes"
    | "digit_keypad"
    | "color_prism"
    | "ishihara_disc"
    | "mental_cube"
    | "bullseye_target"
    | "keycap_cluster"
    | "parabola_graph"
    | "rhythm_lanes"
    | "duel_podiums"
    | "solar_orbit"
    | "laser_mirror"
    | "cannon_arc"
    | "torque_lever"
    | "study_cards";

export type FallbackLucideName =
    | "Crown"
    | "Sun"
    | "Route"
    | "Grid3X3"
    | "LayoutGrid"
    | "Layers"
    | "Compass"
    | "Target"
    | "ArrowUpDown"
    | "Zap"
    | "Clock"
    | "Volume2"
    | "Eye"
    | "Move"
    | "Brain"
    | "Hash"
    | "Palette"
    | "Keyboard"
    | "MousePointer2"
    | "Calculator"
    | "Type"
    | "Gamepad2"
    | "Atom"
    | "Orbit"
    | "Swords"
    | "BookOpenCheck"
    | "Sparkles"
    | "Crosshair"
    | "Scale"
    | "BookOpen"
    | "Activity";

export interface Tool3DIconSpec {
    id: string;
    archetype: Tool3DArchetype;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    visualLabel: string;
    fallbackLucide: FallbackLucideName;
}

const DEFAULT_SPEC: Tool3DIconSpec = {
    id: "default",
    archetype: "memory_cubes",
    primaryColor: "#1E40AF",
    secondaryColor: "#334155",
    accentColor: "#B45309",
    visualLabel: "Cognitive instrument",
    fallbackLucide: "Brain",
};

/**
 * Canonical catalog indexed by normalized tool slug or arena ID.
 * Every unique route in TOOL_MAPPING (76 tools) and all 11 SITE_CATEGORIES
 * resolve deterministically through resolveToolIconSpec().
 */
export const TOOL_3D_CATALOG: Record<string, Tool3DIconSpec> = {
    // =========================================================================
    // 11 ARENA / CATEGORY EMBLEMS
    // =========================================================================
    puzzles: {
        id: "puzzles",
        archetype: "crown_board",
        primaryColor: "#4338CA",
        secondaryColor: "#E6E3DB",
        accentColor: "#B45309",
        visualLabel: "Logic board & crown",
        fallbackLucide: "Crown",
    },
    classics: {
        id: "classics",
        archetype: "tetromino_stack",
        primaryColor: "#1E40AF",
        secondaryColor: "#C2410C",
        accentColor: "#047857",
        visualLabel: "Interlocking classic blocks",
        fallbackLucide: "Gamepad2",
    },
    reflex: {
        id: "reflex",
        archetype: "chronometer",
        primaryColor: "#B45309",
        secondaryColor: "#1F2937",
        accentColor: "#DC2626",
        visualLabel: "Millisecond chronometer",
        fallbackLucide: "Zap",
    },
    memory: {
        id: "memory",
        archetype: "memory_cubes",
        primaryColor: "#5B21B6",
        secondaryColor: "#E6E3DB",
        accentColor: "#1E40AF",
        visualLabel: "Stepped memory blocks",
        fallbackLucide: "Brain",
    },
    speed: {
        id: "speed",
        archetype: "keycap_cluster",
        primaryColor: "#0F766E",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Mechanical input cluster",
        fallbackLucide: "Keyboard",
    },
    accuracy: {
        id: "accuracy",
        archetype: "bullseye_target",
        primaryColor: "#047857",
        secondaryColor: "#FAF9F6",
        accentColor: "#161614",
        visualLabel: "Precision optical target",
        fallbackLucide: "Target",
    },
    gaming: {
        id: "gaming",
        archetype: "rhythm_lanes",
        primaryColor: "#BE123C",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Dynamic reflex lanes",
        fallbackLucide: "Gamepad2",
    },
    productivity: {
        id: "productivity",
        archetype: "parabola_graph",
        primaryColor: "#0F766E",
        secondaryColor: "#334155",
        accentColor: "#1E40AF",
        visualLabel: "Function graph & instruments",
        fallbackLucide: "BookOpenCheck",
    },
    stem: {
        id: "stem",
        archetype: "torque_lever",
        primaryColor: "#3730A3",
        secondaryColor: "#475569",
        accentColor: "#B45309",
        visualLabel: "Balanced physics apparatus",
        fallbackLucide: "Atom",
    },
    "lab-3d": {
        id: "lab-3d",
        archetype: "solar_orbit",
        primaryColor: "#0369A1",
        secondaryColor: "#D97706",
        accentColor: "#1E40AF",
        visualLabel: "3D orbital space field",
        fallbackLucide: "Orbit",
    },
    multiplayer: {
        id: "multiplayer",
        archetype: "duel_podiums",
        primaryColor: "#C2410C",
        secondaryColor: "#1E40AF",
        accentColor: "#161614",
        visualLabel: "Head-to-head duel arena",
        fallbackLucide: "Swords",
    },

    // =========================================================================
    // MENSA LOGIC & WORD PUZZLES (9)
    // =========================================================================
    queens: {
        id: "queens",
        archetype: "crown_board",
        primaryColor: "#4338CA",
        secondaryColor: "#DDD6FE",
        accentColor: "#B45309",
        visualLabel: "Regal crown on region grid",
        fallbackLucide: "Crown",
    },
    tango: {
        id: "tango",
        archetype: "celestial_balance",
        primaryColor: "#D97706",
        secondaryColor: "#334155",
        accentColor: "#1E40AF",
        visualLabel: "Sun & crescent moon balance",
        fallbackLucide: "Sun",
    },
    zip: {
        id: "zip",
        archetype: "winding_path",
        primaryColor: "#047857",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Continuous numbered trail",
        fallbackLucide: "Route",
    },
    "mini-sudoku": {
        id: "mini-sudoku",
        archetype: "sudoku_matrix",
        primaryColor: "#6D28D9",
        secondaryColor: "#E2E8F0",
        accentColor: "#1E40AF",
        visualLabel: "6×6 shaded deduction matrix",
        fallbackLucide: "Grid3X3",
    },
    patches: {
        id: "patches",
        archetype: "patch_mosaic",
        primaryColor: "#0F766E",
        secondaryColor: "#C2410C",
        accentColor: "#1E40AF",
        visualLabel: "Partitioned area rectangles",
        fallbackLucide: "LayoutGrid",
    },
    sumbreak: {
        id: "sumbreak",
        archetype: "merge_blocks",
        primaryColor: "#BE123C",
        secondaryColor: "#D97706",
        accentColor: "#334155",
        visualLabel: "Ascending merged number blocks",
        fallbackLucide: "Layers",
    },
    wend: {
        id: "wend",
        archetype: "letter_weave",
        primaryColor: "#1D4ED8",
        secondaryColor: "#F3F1EB",
        accentColor: "#047857",
        visualLabel: "Interwoven letter tiles",
        fallbackLucide: "Compass",
    },
    pinpoint: {
        id: "pinpoint",
        archetype: "pinpoint_dart",
        primaryColor: "#7E22CE",
        secondaryColor: "#E2E8F0",
        accentColor: "#C2410C",
        visualLabel: "Pinpointed category rings",
        fallbackLucide: "Target",
    },
    crossclimb: {
        id: "crossclimb",
        archetype: "word_ladder",
        primaryColor: "#B45309",
        secondaryColor: "#334155",
        accentColor: "#047857",
        visualLabel: "Stepped trivia word ladder",
        fallbackLucide: "ArrowUpDown",
    },

    // =========================================================================
    // FLAGSHIP CLASSICS (3)
    // =========================================================================
    wordle: {
        id: "wordle",
        archetype: "letter_weave",
        primaryColor: "#15803D",
        secondaryColor: "#D97706",
        accentColor: "#334155",
        visualLabel: "Five-letter word tiles",
        fallbackLucide: "Type",
    },
    tetris: {
        id: "tetris",
        archetype: "tetromino_stack",
        primaryColor: "#1E40AF",
        secondaryColor: "#DC2626",
        accentColor: "#D97706",
        visualLabel: "Stacked SRS tetrominoes",
        fallbackLucide: "Grid3X3",
    },
    chess: {
        id: "chess",
        archetype: "crown_board",
        primaryColor: "#161614",
        secondaryColor: "#E6E3DB",
        accentColor: "#B45309",
        visualLabel: "Checkered board & monarch",
        fallbackLucide: "Crown",
    },

    // =========================================================================
    // REFLEX ARENA (13)
    // =========================================================================
    reaction: {
        id: "reaction",
        archetype: "chronometer",
        primaryColor: "#047857",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Visual trigger stopwatch",
        fallbackLucide: "Zap",
    },
    "time-perception": {
        id: "time-perception",
        archetype: "chronometer",
        primaryColor: "#1E40AF",
        secondaryColor: "#475569",
        accentColor: "#B45309",
        visualLabel: "Internal interval dial",
        fallbackLucide: "Clock",
    },
    "go-no-go": {
        id: "go-no-go",
        archetype: "traffic_signal",
        primaryColor: "#15803D",
        secondaryColor: "#1F2937",
        accentColor: "#DC2626",
        visualLabel: "Go / withhold signal lamp",
        fallbackLucide: "Target",
    },
    flanker: {
        id: "flanker",
        archetype: "flanker_arrows",
        primaryColor: "#1E40AF",
        secondaryColor: "#64748B",
        accentColor: "#C2410C",
        visualLabel: "Center vs flanking arrows",
        fallbackLucide: "Move",
    },
    "choice-reaction": {
        id: "choice-reaction",
        archetype: "traffic_signal",
        primaryColor: "#D97706",
        secondaryColor: "#334155",
        accentColor: "#1E40AF",
        visualLabel: "Multi-option signal bank",
        fallbackLucide: "LayoutGrid",
    },
    sound: {
        id: "sound",
        archetype: "sound_wave",
        primaryColor: "#0369A1",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Acoustic tone emitter",
        fallbackLucide: "Volume2",
    },
    "reflex-grid": {
        id: "reflex-grid",
        archetype: "sudoku_matrix",
        primaryColor: "#B45309",
        secondaryColor: "#E6E3DB",
        accentColor: "#DC2626",
        visualLabel: "Rapid-fire target grid",
        fallbackLucide: "Grid3X3",
    },
    peripheral: {
        id: "peripheral",
        archetype: "peripheral_eye",
        primaryColor: "#0F766E",
        secondaryColor: "#334155",
        accentColor: "#D97706",
        visualLabel: "Wide-field optical lens",
        fallbackLucide: "Eye",
    },
    direction: {
        id: "direction",
        archetype: "flanker_arrows",
        primaryColor: "#047857",
        secondaryColor: "#334155",
        accentColor: "#B45309",
        visualLabel: "Directional compass prisms",
        fallbackLucide: "Move",
    },
    "multi-stimulus": {
        id: "multi-stimulus",
        archetype: "study_cards",
        primaryColor: "#C2410C",
        secondaryColor: "#1E40AF",
        accentColor: "#047857",
        visualLabel: "Layered cue discrimination",
        fallbackLucide: "Activity",
    },
    "sequence-reaction": {
        id: "sequence-reaction",
        archetype: "winding_path",
        primaryColor: "#B45309",
        secondaryColor: "#334155",
        accentColor: "#1E40AF",
        visualLabel: "Ordered rapid tap nodes",
        fallbackLucide: "Zap",
    },
    "whack-a-mole": {
        id: "whack-a-mole",
        archetype: "whack_pedestal",
        primaryColor: "#C2410C",
        secondaryColor: "#475569",
        accentColor: "#047857",
        visualLabel: "Pop-up strike domes",
        fallbackLucide: "Target",
    },
    "color-switch": {
        id: "color-switch",
        archetype: "color_prism",
        primaryColor: "#BE123C",
        secondaryColor: "#1E40AF",
        accentColor: "#D97706",
        visualLabel: "Stroop ink shift prism",
        fallbackLucide: "Palette",
    },

    // =========================================================================
    // MEMORY ARENA (12)
    // =========================================================================
    "chimp-test": {
        id: "chimp-test",
        archetype: "memory_cubes",
        primaryColor: "#4338CA",
        secondaryColor: "#F3F1EB",
        accentColor: "#D97706",
        visualLabel: "Masked numeric span cubes",
        fallbackLucide: "Brain",
    },
    "verbal-memory": {
        id: "verbal-memory",
        archetype: "letter_weave",
        primaryColor: "#5B21B6",
        secondaryColor: "#F3F1EB",
        accentColor: "#0F766E",
        visualLabel: "Seen vs new word cards",
        fallbackLucide: "Type",
    },
    "n-back": {
        id: "n-back",
        archetype: "memory_cubes",
        primaryColor: "#1E40AF",
        secondaryColor: "#CBD5E1",
        accentColor: "#7C3AED",
        visualLabel: "N-step working memory stream",
        fallbackLucide: "Layers",
    },
    "object-tracking": {
        id: "object-tracking",
        archetype: "solar_orbit",
        primaryColor: "#5B21B6",
        secondaryColor: "#0F766E",
        accentColor: "#D97706",
        visualLabel: "Multi-object motion paths",
        fallbackLucide: "Eye",
    },
    sequence: {
        id: "sequence",
        archetype: "memory_cubes",
        primaryColor: "#6D28D9",
        secondaryColor: "#1F2937",
        accentColor: "#047857",
        visualLabel: "Illuminated sequence chain",
        fallbackLucide: "Zap",
    },
    number: {
        id: "number",
        archetype: "digit_keypad",
        primaryColor: "#1E40AF",
        secondaryColor: "#334155",
        accentColor: "#6D28D9",
        visualLabel: "Incremental digit keypad",
        fallbackLucide: "Hash",
    },
    visual: {
        id: "visual",
        archetype: "sudoku_matrix",
        primaryColor: "#5B21B6",
        secondaryColor: "#E6E3DB",
        accentColor: "#0F766E",
        visualLabel: "Spatial matrix recall grid",
        fallbackLucide: "Grid3X3",
    },
    color: {
        id: "color",
        archetype: "color_prism",
        primaryColor: "#7C3AED",
        secondaryColor: "#0F766E",
        accentColor: "#D97706",
        visualLabel: "Chromatic memory prism",
        fallbackLucide: "Palette",
    },
    shape: {
        id: "shape",
        archetype: "mental_cube",
        primaryColor: "#4338CA",
        secondaryColor: "#E6E3DB",
        accentColor: "#C2410C",
        visualLabel: "Geometric silhouette blocks",
        fallbackLucide: "Target",
    },
    symbol: {
        id: "symbol",
        archetype: "patch_mosaic",
        primaryColor: "#6D28D9",
        secondaryColor: "#334155",
        accentColor: "#B45309",
        visualLabel: "Abstract glyph tiles",
        fallbackLucide: "Eye",
    },
    "word-recall": {
        id: "word-recall",
        archetype: "study_cards",
        primaryColor: "#4338CA",
        secondaryColor: "#F3F1EB",
        accentColor: "#047857",
        visualLabel: "Vocabulary recall deck",
        fallbackLucide: "BookOpen",
    },
    "card-match": {
        id: "card-match",
        archetype: "study_cards",
        primaryColor: "#0F766E",
        secondaryColor: "#FAF9F6",
        accentColor: "#BE123C",
        visualLabel: "Paired memory card deck",
        fallbackLucide: "Activity",
    },

    // =========================================================================
    // SPEED ARENA (8)
    // =========================================================================
    cps: {
        id: "cps",
        archetype: "keycap_cluster",
        primaryColor: "#0369A1",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "High-frequency click switch",
        fallbackLucide: "MousePointer2",
    },
    "schulte-table": {
        id: "schulte-table",
        archetype: "sudoku_matrix",
        primaryColor: "#0F766E",
        secondaryColor: "#F3F1EB",
        accentColor: "#1E40AF",
        visualLabel: "5×5 visual scan table",
        fallbackLucide: "Grid3X3",
    },
    math: {
        id: "math",
        archetype: "parabola_graph",
        primaryColor: "#0369A1",
        secondaryColor: "#334155",
        accentColor: "#C2410C",
        visualLabel: "Rapid mental arithmetic",
        fallbackLucide: "Calculator",
    },
    typing: {
        id: "typing",
        archetype: "keycap_cluster",
        primaryColor: "#1E40AF",
        secondaryColor: "#E6E3DB",
        accentColor: "#0F766E",
        visualLabel: "Sculpted mechanical keycaps",
        fallbackLucide: "Keyboard",
    },
    word: {
        id: "word",
        archetype: "letter_weave",
        primaryColor: "#0F766E",
        secondaryColor: "#F3F1EB",
        accentColor: "#B45309",
        visualLabel: "Rapid word typing tiles",
        fallbackLucide: "Type",
    },
    "speed-grid": {
        id: "speed-grid",
        archetype: "sudoku_matrix",
        primaryColor: "#0369A1",
        secondaryColor: "#CBD5E1",
        accentColor: "#047857",
        visualLabel: "Fast-clear matrix cells",
        fallbackLucide: "Grid3X3",
    },
    "number-rush": {
        id: "number-rush",
        archetype: "merge_blocks",
        primaryColor: "#0369A1",
        secondaryColor: "#047857",
        accentColor: "#334155",
        visualLabel: "Ascending number rush blocks",
        fallbackLucide: "Hash",
    },
    "quick-sort": {
        id: "quick-sort",
        archetype: "flanker_arrows",
        primaryColor: "#0F766E",
        secondaryColor: "#334155",
        accentColor: "#C2410C",
        visualLabel: "Left / right sort splitter",
        fallbackLucide: "ArrowUpDown",
    },

    // =========================================================================
    // GAMING ARENA (7)
    // =========================================================================
    aim: {
        id: "aim",
        archetype: "bullseye_target",
        primaryColor: "#BE123C",
        secondaryColor: "#FAF9F6",
        accentColor: "#161614",
        visualLabel: "Precision aim bullseye",
        fallbackLucide: "Target",
    },
    rpg: {
        id: "rpg",
        archetype: "duel_podiums",
        primaryColor: "#BE123C",
        secondaryColor: "#334155",
        accentColor: "#D97706",
        visualLabel: "Directional combat shield",
        fallbackLucide: "Swords",
    },
    "target-tracking": {
        id: "target-tracking",
        archetype: "bullseye_target",
        primaryColor: "#C2410C",
        secondaryColor: "#E2E8F0",
        accentColor: "#1E40AF",
        visualLabel: "Smooth tracking reticle",
        fallbackLucide: "Crosshair",
    },
    "endless-dodge": {
        id: "endless-dodge",
        archetype: "rhythm_lanes",
        primaryColor: "#B91C1C",
        secondaryColor: "#1F2937",
        accentColor: "#0369A1",
        visualLabel: "Evasive obstacle corridor",
        fallbackLucide: "Zap",
    },
    "stroop-drop": {
        id: "stroop-drop",
        archetype: "rhythm_lanes",
        primaryColor: "#7C3AED",
        secondaryColor: "#1F2937",
        accentColor: "#047857",
        visualLabel: "Falling color-word lanes",
        fallbackLucide: "Brain",
    },
    "flick-shot": {
        id: "flick-shot",
        archetype: "pinpoint_dart",
        primaryColor: "#BE123C",
        secondaryColor: "#E2E8F0",
        accentColor: "#161614",
        visualLabel: "Center-to-edge flick pin",
        fallbackLucide: "Crosshair",
    },
    "rhythm-tap": {
        id: "rhythm-tap",
        archetype: "rhythm_lanes",
        primaryColor: "#BE123C",
        secondaryColor: "#334155",
        accentColor: "#D97706",
        visualLabel: "Beat timing track lanes",
        fallbackLucide: "Activity",
    },

    // =========================================================================
    // ACCURACY ARENA (8)
    // =========================================================================
    image: {
        id: "image",
        archetype: "peripheral_eye",
        primaryColor: "#047857",
        secondaryColor: "#1F2937",
        accentColor: "#1E40AF",
        visualLabel: "Visual recognition optics",
        fallbackLucide: "Eye",
    },
    data: {
        id: "data",
        archetype: "digit_keypad",
        primaryColor: "#047857",
        secondaryColor: "#334155",
        accentColor: "#B45309",
        visualLabel: "Code transcription keypad",
        fallbackLucide: "Keyboard",
    },
    "pattern-matching": {
        id: "pattern-matching",
        archetype: "patch_mosaic",
        primaryColor: "#047857",
        secondaryColor: "#1E40AF",
        accentColor: "#D97706",
        visualLabel: "Spatial matrix completion",
        fallbackLucide: "Grid3X3",
    },
    "precision-click": {
        id: "precision-click",
        archetype: "bullseye_target",
        primaryColor: "#047857",
        secondaryColor: "#F3F1EB",
        accentColor: "#C2410C",
        visualLabel: "Micro-target fine motor ring",
        fallbackLucide: "MousePointer2",
    },
    "angle-estimation": {
        id: "angle-estimation",
        archetype: "laser_mirror",
        primaryColor: "#047857",
        secondaryColor: "#334155",
        accentColor: "#1E40AF",
        visualLabel: "Protractor angle vectors",
        fallbackLucide: "Compass",
    },
    "color-match": {
        id: "color-match",
        archetype: "color_prism",
        primaryColor: "#047857",
        secondaryColor: "#1E40AF",
        accentColor: "#BE123C",
        visualLabel: "RGB swatch spectrum prism",
        fallbackLucide: "Palette",
    },
    "color-blindness": {
        id: "color-blindness",
        archetype: "ishihara_disc",
        primaryColor: "#047857",
        secondaryColor: "#C2410C",
        accentColor: "#D97706",
        visualLabel: "Ishihara chromatic dot plate",
        fallbackLucide: "Eye",
    },
    "mental-rotation": {
        id: "mental-rotation",
        archetype: "mental_cube",
        primaryColor: "#047857",
        secondaryColor: "#E6E3DB",
        accentColor: "#1E40AF",
        visualLabel: "3D rotated polycube figure",
        fallbackLucide: "Layers",
    },

    // =========================================================================
    // STEM & PHYSICS LAB (4)
    // =========================================================================
    "gravity-lab": {
        id: "gravity-lab",
        archetype: "solar_orbit",
        primaryColor: "#3730A3",
        secondaryColor: "#D97706",
        accentColor: "#0F766E",
        visualLabel: "Planetary free-fall & orbit",
        fallbackLucide: "Orbit",
    },
    "laser-reflection": {
        id: "laser-reflection",
        archetype: "laser_mirror",
        primaryColor: "#4338CA",
        secondaryColor: "#1F2937",
        accentColor: "#DC2626",
        visualLabel: "Optical mirror & laser beam",
        fallbackLucide: "Sparkles",
    },
    "projectile-cannon": {
        id: "projectile-cannon",
        archetype: "cannon_arc",
        primaryColor: "#3730A3",
        secondaryColor: "#475569",
        accentColor: "#C2410C",
        visualLabel: "Parabolic cannon trajectory",
        fallbackLucide: "Crosshair",
    },
    "torque-balance": {
        id: "torque-balance",
        archetype: "torque_lever",
        primaryColor: "#3730A3",
        secondaryColor: "#334155",
        accentColor: "#B45309",
        visualLabel: "Fulcrum & rotational lever",
        fallbackLucide: "Scale",
    },

    // =========================================================================
    // 3D INTERACTIVE LAB (2)
    // =========================================================================
    "solar-gravity-3d": {
        id: "solar-gravity-3d",
        archetype: "solar_orbit",
        primaryColor: "#0369A1",
        secondaryColor: "#D97706",
        accentColor: "#1E40AF",
        visualLabel: "3D spacetime orbital well",
        fallbackLucide: "Orbit",
    },
    "spatial-aim-3d": {
        id: "spatial-aim-3d",
        archetype: "bullseye_target",
        primaryColor: "#0369A1",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "Depth-plane 3D aim drones",
        fallbackLucide: "Crosshair",
    },

    // =========================================================================
    // 2-PLAYER BATTLE ARENA (3)
    // =========================================================================
    "reaction-duel-2p": {
        id: "reaction-duel-2p",
        archetype: "duel_podiums",
        primaryColor: "#C2410C",
        secondaryColor: "#1E40AF",
        accentColor: "#D97706",
        visualLabel: "2P split-screen reflex duel",
        fallbackLucide: "Zap",
    },
    "math-tug-of-war": {
        id: "math-tug-of-war",
        archetype: "torque_lever",
        primaryColor: "#C2410C",
        secondaryColor: "#1E40AF",
        accentColor: "#161614",
        visualLabel: "Head-to-head arithmetic tug",
        fallbackLucide: "Calculator",
    },
    "cannon-battle-2p": {
        id: "cannon-battle-2p",
        archetype: "cannon_arc",
        primaryColor: "#C2410C",
        secondaryColor: "#1E40AF",
        accentColor: "#B45309",
        visualLabel: "2P artillery trajectory duel",
        fallbackLucide: "Crosshair",
    },

    // =========================================================================
    // STUDENT & WORK PRODUCTIVITY SUITE (7)
    // =========================================================================
    "graphing-calculator": {
        id: "graphing-calculator",
        archetype: "parabola_graph",
        primaryColor: "#0F766E",
        secondaryColor: "#1F2937",
        accentColor: "#1E40AF",
        visualLabel: "Live y = f(x) curve plotter",
        fallbackLucide: "Calculator",
    },
    "unit-converter": {
        id: "unit-converter",
        archetype: "torque_lever",
        primaryColor: "#0F766E",
        secondaryColor: "#475569",
        accentColor: "#1E40AF",
        visualLabel: "SI unit conversion scale",
        fallbackLucide: "Scale",
    },
    "gpa-calculator": {
        id: "gpa-calculator",
        archetype: "word_ladder",
        primaryColor: "#0F766E",
        secondaryColor: "#1F2937",
        accentColor: "#B45309",
        visualLabel: "4.0 grade scale tracker",
        fallbackLucide: "BookOpenCheck",
    },
    flashcards: {
        id: "flashcards",
        archetype: "study_cards",
        primaryColor: "#0F766E",
        secondaryColor: "#FAF9F6",
        accentColor: "#1E40AF",
        visualLabel: "Spaced-repetition study deck",
        fallbackLucide: "Layers",
    },
    "speed-reading": {
        id: "speed-reading",
        archetype: "study_cards",
        primaryColor: "#1E40AF",
        secondaryColor: "#FAF9F6",
        accentColor: "#B45309",
        visualLabel: "RSVP paced reading sheets",
        fallbackLucide: "BookOpen",
    },
    "ten-key": {
        id: "ten-key",
        archetype: "digit_keypad",
        primaryColor: "#0F766E",
        secondaryColor: "#1F2937",
        accentColor: "#D97706",
        visualLabel: "10-key numeric pad keys",
        fallbackLucide: "Calculator",
    },
    "focus-sprint": {
        id: "focus-sprint",
        archetype: "chronometer",
        primaryColor: "#0F766E",
        secondaryColor: "#1F2937",
        accentColor: "#C2410C",
        visualLabel: "Deep-work Pomodoro dial",
        fallbackLucide: "Clock",
    },
};

/**
 * Aliases covering TOOL_MAPPING keys, route paths, and component short IDs.
 */
const ALIAS_MAP: Record<string, string> = {
    // TOOL_MAPPING canonical keys -> catalog IDs
    "sequence-memory": "sequence",
    "number-memory": "number",
    "visual-memory": "visual",
    "color-memory": "color",
    "shape-memory": "shape",
    "symbol-memory": "symbol",
    "reaction-time": "reaction",
    "sound-reaction": "sound",
    "grid-shot": "reflex-grid",
    "peripheral-vision": "peripheral",
    "directional-reflex": "direction",
    "cps-test": "cps",
    click: "cps",
    "speed-math": "math",
    "math-speed": "math",
    "typing-speed": "typing",
    "word-accuracy": "word",
    "word-speed": "word",
    words: "word",
    "grid-selection": "speed-grid",
    "grid-speed": "speed-grid",
    "aim-trainer": "aim",
    "rpg-reaction": "rpg",
    "image-recognition": "image",
    "data-entry": "data",
    "solar-gravity": "solar-gravity-3d",
    "spatial-aim": "spatial-aim-3d",
    "reaction-duel": "reaction-duel-2p",
    "cannon-battle": "cannon-battle-2p",
    "puzzle-queens": "queens",
    "puzzle-tango": "tango",
    "puzzle-zip": "zip",
    "puzzle-mini-sudoku": "mini-sudoku",
    "puzzle-patches": "patches",
    "puzzle-sumbreak": "sumbreak",
    "puzzle-wend": "wend",
    "puzzle-pinpoint": "pinpoint",
    "puzzle-crossclimb": "crossclimb",

    // Ambiguous short paths disambiguated by route prefix
    "/reflex/grid": "reflex-grid",
    "/speed/grid": "speed-grid",
    "/gaming/reaction": "rpg",
    "/reflex/reaction": "reaction",
    "/memory/color": "color",
    "/accuracy/color-match": "color-match",
    "/speed/click": "cps",
    "/speed/words": "word",
    "/accuracy/data": "data",
    "/accuracy/image-recognition": "image",
    "/lab-3d/solar-gravity": "solar-gravity-3d",
    "/lab-3d/spatial-aim": "spatial-aim-3d",
    "/multiplayer/reaction-duel": "reaction-duel-2p",
    "/multiplayer/cannon-battle": "cannon-battle-2p",
    grid: "reflex-grid",
};

/**
 * Resolves any tool slug, TOOL_MAPPING key, arena ID, or route path (e.g. "/reflex/reaction",
 * "/es/puzzles/queens", "aim-trainer", "puzzles") into its deterministic Tool3DIconSpec.
 */
export function resolveToolIconSpec(toolIdOrHref: string): Tool3DIconSpec {
    if (!toolIdOrHref) return DEFAULT_SPEC;

    const raw = toolIdOrHref.trim().toLowerCase();
    // Strip optional locale prefix (/es/..., /fr/..., etc.)
    const cleanedPath = raw.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

    // 1. Direct path alias match (handles /reflex/grid vs /speed/grid, /gaming/reaction vs /reflex/reaction)
    if (ALIAS_MAP[cleanedPath]) {
        const mapped = TOOL_3D_CATALOG[ALIAS_MAP[cleanedPath]];
        if (mapped) return mapped;
    }

    // 2. Direct catalog or alias match on raw key
    if (TOOL_3D_CATALOG[raw]) return TOOL_3D_CATALOG[raw];
    if (ALIAS_MAP[raw] && TOOL_3D_CATALOG[ALIAS_MAP[raw]]) {
        return TOOL_3D_CATALOG[ALIAS_MAP[raw]];
    }

    // 3. Extract last route segment for paths like "/puzzles/queens" or "/memory/n-back"
    const segments = cleanedPath.split("/").filter(Boolean);
    if (segments.length >= 2) {
        const pair = `/${segments[0]}/${segments[1]}`;
        if (ALIAS_MAP[pair] && TOOL_3D_CATALOG[ALIAS_MAP[pair]]) {
            return TOOL_3D_CATALOG[ALIAS_MAP[pair]];
        }
        const leaf = segments[segments.length - 1];
        if (TOOL_3D_CATALOG[leaf]) return TOOL_3D_CATALOG[leaf];
        if (ALIAS_MAP[leaf] && TOOL_3D_CATALOG[ALIAS_MAP[leaf]]) {
            return TOOL_3D_CATALOG[ALIAS_MAP[leaf]];
        }
        // Fallback to arena icon if leaf unknown
        if (TOOL_3D_CATALOG[segments[0]]) return TOOL_3D_CATALOG[segments[0]];
    } else if (segments.length === 1) {
        const single = segments[0];
        if (TOOL_3D_CATALOG[single]) return TOOL_3D_CATALOG[single];
        if (ALIAS_MAP[single] && TOOL_3D_CATALOG[ALIAS_MAP[single]]) {
            return TOOL_3D_CATALOG[ALIAS_MAP[single]];
        }
    }

    return DEFAULT_SPEC;
}
