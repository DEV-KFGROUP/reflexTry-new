const fs = require('fs');

const path = 'app/HomeClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const descs = {
  // Memory
  "sequence": "Memorize and repeat the expanding pattern of flashes.",
  "chimp-test": "Recall numbers in exact order after they are hidden.",
  "verbal-memory": "Identify if you've seen the current word before.",
  "object-tracking": "Keep your eyes locked on the moving targets.",
  "number": "How many digits can you hold before your memory drops them?",
  "visual": "Remember the exact layout of the highlighted tiles.",
  "color": "Memorize and reproduce the exact sequence of colors.",
  "shape": "Differentiate and recall complex geometric shapes.",
  "symbol": "Remember a growing sequence of abstract symbols.",
  "word-recall": "Memorize a list of words and recall them later.",
  "card-match": "Find the matching pairs hidden behind the cards.",

  // Reflex
  "reaction": "Click the instant the screen turns green.",
  "time-perception": "Estimate the exact duration of a hidden timer.",
  "sound": "React as fast as possible to a sudden audio cue.",
  "grid": "Click the randomly appearing targets instantly.",
  "peripheral": "Spot and react to targets outside your direct focus.",
  "direction": "Swipe or press the arrow matching the visual cue.",
  "multi-stimulus": "Process conflicting signals and react correctly.",
  "sequence-reaction": "Quickly click targets in the specified order.",
  "whack-a-mole": "Smash the targets before they disappear.",
  "color-switch": "React instantly when the target changes color.",

  // Speed
  "cps": "Test your raw clicks-per-second velocity.",
  "math": "Solve basic arithmetic equations rapidly.",
  "typing": "Type the provided text as fast as possible.",
  "word": "Unscramble words with extreme speed.",
  // "grid" is shared but wait, speed grid vs reflex grid.
  // Actually they are under different categories but the keys are just "id".
  // Let's modify regex to add desc inline properly!
};

// We can just regex replace each tool object:
// { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium" }
// -> { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium", desc: "..." }

// A more robust way:
content = content.replace(/\{ id: "([^"]+)", href: "\/([^/]+)\/[^"]+", icon: [^,]+, difficulty: "([^"]+)" \}/g, (match, id, category) => {
    let desc = "Challenge yourself and improve your skills.";
    if (category === "memory") {
        if (id === "sequence") desc = "Memorize and repeat the expanding pattern of flashes.";
        if (id === "chimp-test") desc = "Recall numbers in exact order after they are hidden.";
        if (id === "verbal-memory") desc = "Identify if you've seen the current word before.";
        if (id === "object-tracking") desc = "Keep your eyes locked on the moving targets.";
        if (id === "number") desc = "How many digits can you hold before your memory drops them?";
        if (id === "visual") desc = "Remember the exact layout of the highlighted tiles.";
        if (id === "color") desc = "Memorize and reproduce the exact sequence of colors.";
        if (id === "shape") desc = "Differentiate and recall complex geometric shapes.";
        if (id === "symbol") desc = "Remember a growing sequence of abstract symbols.";
        if (id === "word-recall") desc = "Memorize a list of words and recall them later.";
        if (id === "card-match") desc = "Find the matching pairs hidden behind the cards.";
    }
    if (category === "reflex") {
        if (id === "reaction") desc = "Click the exact millisecond the screen turns green.";
        if (id === "time-perception") desc = "Estimate the exact duration of a hidden timer.";
        if (id === "sound") desc = "React as fast as possible to a sudden audio cue.";
        if (id === "grid") desc = "Click the randomly appearing targets instantly.";
        if (id === "peripheral") desc = "Spot and react to targets outside your direct focus.";
        if (id === "direction") desc = "Swipe or press the arrow matching the visual cue.";
        if (id === "multi-stimulus") desc = "Process conflicting signals and react correctly.";
        if (id === "sequence-reaction") desc = "Quickly click targets in the specified order.";
        if (id === "whack-a-mole") desc = "Smash the targets before they disappear.";
        if (id === "color-switch") desc = "React instantly when the target changes color.";
    }
    if (category === "speed") {
        if (id === "cps") desc = "Test your raw clicks-per-second velocity.";
        if (id === "math") desc = "Solve basic arithmetic equations rapidly.";
        if (id === "typing") desc = "Type the provided text as fast as possible.";
        if (id === "word") desc = "Unscramble words with extreme speed.";
        if (id === "grid") desc = "Clear the entire grid of targets quickly.";
        if (id === "number-rush") desc = "Click the numbers in ascending order fast.";
        if (id === "quick-sort") desc = "Categorize items left or right with max speed.";
    }
    if (category === "gaming") {
        if (id === "aim") desc = "Track and click moving targets to improve FPS aim.";
        if (id === "reaction") desc = "React to unexpected threats in combat scenarios.";
        if (id === "target-tracking") desc = "Keep your crosshair locked onto evasive targets.";
        if (id === "endless-dodge") desc = "Avoid incoming obstacles for as long as possible.";
        if (id === "stroop-drop") desc = "Overcome cognitive interference under time pressure.";
        if (id === "flick-shot") desc = "Snap your crosshair to targets instantly.";
        if (id === "rhythm-tap") desc = "Hit the notes precisely on the beat.";
    }
    if (category === "accuracy") {
        if (id === "image") desc = "Quickly spot the differences or hidden objects.";
        if (id === "color-blindness") desc = "Identify numbers hidden within Ishihara plates.";
        if (id === "mental-rotation") desc = "Determine if 3D shapes match when rotated.";
        if (id === "data") desc = "Enter complex alphanumeric sequences flawlessly.";
        if (id === "pattern-matching") desc = "Identify the correct missing piece of the pattern.";
        if (id === "precision-click") desc = "Click tiny targets with pixel-perfect accuracy.";
        if (id === "angle-estimation") desc = "Visually estimate the exact degree of an angle.";
        if (id === "color-match") desc = "Adjust RGB sliders to recreate the target hue.";
    }

    return match.replace("}", `, desc: "${desc}" }`);
});

// Update the rendering JSX
content = content.replace(
    'Challenge yourself in the {tool.id.replace(/-/g, " ")} arena and improve your skills.',
    '{tool.desc}'
);

fs.writeFileSync(path, content);
console.log("Updated HomeClient.tsx successfully.");
