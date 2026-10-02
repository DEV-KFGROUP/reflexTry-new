// Mapping of tool IDs to their page paths
export const TOOL_MAPPING: Record<string, string> = {
    // Memory tools
    "sequence-memory": "/memory/sequence",
    "number-memory": "/memory/number",
    "visual-memory": "/memory/visual",
    "color-memory": "/memory/color",
    "shape-memory": "/memory/shape",
    "symbol-memory": "/memory/symbol",
    "word-recall": "/memory/word-recall",
    "card-match": "/memory/card-match",
    "chimp-test": "/memory/chimp-test",
    "verbal-memory": "/memory/verbal-memory",
    "object-tracking": "/memory/object-tracking",
    "n-back": "/memory/n-back",

    // Reflex tools
    "reaction-time": "/reflex/reaction",
    "sound-reaction": "/reflex/sound",
    "grid-shot": "/reflex/grid",
    "peripheral-vision": "/reflex/peripheral",
    "directional-reflex": "/reflex/direction",
    "multi-stimulus": "/reflex/multi-stimulus",
    "sequence-reaction": "/reflex/sequence-reaction",
    "whack-a-mole": "/reflex/whack-a-mole",
    "color-switch": "/reflex/color-switch",
    "time-perception": "/reflex/time-perception",
    "go-no-go": "/reflex/go-no-go",
    "flanker": "/reflex/flanker",
    "choice-reaction": "/reflex/choice-reaction",

    // Speed tools
    "cps-test": "/speed/click",
    "speed-math": "/speed/math",
    "math-speed": "/speed/math",
    "typing-speed": "/speed/typing",
    "word-accuracy": "/speed/words",
    "word-speed": "/speed/words",
    "grid-selection": "/speed/grid",
    "grid-speed": "/speed/grid",
    "number-rush": "/speed/number-rush",
    "quick-sort": "/speed/quick-sort",
    "schulte-table": "/speed/schulte-table",

    // Gaming tools
    "aim-trainer": "/gaming/aim",
    "rpg-reaction": "/gaming/reaction",
    "endless-dodge": "/gaming/endless-dodge",
    "stroop-drop": "/gaming/stroop-drop",
    "target-tracking": "/gaming/target-tracking",
    "flick-shot": "/gaming/flick-shot",
    "rhythm-tap": "/gaming/rhythm-tap",

    // Accuracy tools
    "image-recognition": "/accuracy/image-recognition",
    "data-entry": "/accuracy/data",
    "pattern-matching": "/accuracy/pattern-matching",
    "precision-click": "/accuracy/precision-click",
    "angle-estimation": "/accuracy/angle-estimation",
    "color-match": "/accuracy/color-match",
    "color-blindness": "/accuracy/color-blindness",
    "mental-rotation": "/accuracy/mental-rotation",
};

/** Aliases map to the same game; count published paths only. */
export const TOOL_COUNT = new Set(Object.values(TOOL_MAPPING)).size;
