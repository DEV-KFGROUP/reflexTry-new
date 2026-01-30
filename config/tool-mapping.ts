// Mapping of tool IDs to their page paths
export const TOOL_MAPPING: Record<string, string> = {
    // Memory tools
    "sequence-memory": "/memory/sequence",
    "number-memory": "/memory/number",
    "visual-memory": "/memory/visual",
    "color-memory": "/memory/color",
    "shape-memory": "/memory/shape",
    "symbol-memory": "/memory/symbol",
    
    // Reflex tools
    "reaction-time": "/reflex/reaction",
    "sound-reaction": "/reflex/sound",
    "grid-shot": "/reflex/grid",
    "peripheral-vision": "/reflex/peripheral",
    "directional-reflex": "/reflex/direction",
    "multi-stimulus": "/reflex/multi-stimulus",
    "sequence-reaction": "/reflex/sequence-reaction",
    
    // Speed tools
    "cps-test": "/speed/click",
    "speed-math": "/speed/math",
    "typing-speed": "/speed/typing",
    "word-accuracy": "/speed/words",
    "grid-selection": "/speed/grid",
    
    // Gaming tools
    "aim-trainer": "/gaming/aim",
    "rpg-reaction": "/gaming/reaction",
    
    // Accuracy tools
    "image-recognition": "/accuracy/image-recognition",
    "data-entry": "/accuracy/data",
    "pattern-matching": "/accuracy/pattern-matching",
    "precision-click": "/accuracy/precision-click",
};

