"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw, Share2, Check, Flame, Trophy, Delete } from "lucide-react";

const WORDS = [
    "ABOUT", "ABOVE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN", "AGENT",
    "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE", "ALONG",
    "ALTER", "AMBER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APPLE", "APPLY", "ARENA", "ARGUE",
    "ARISE", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD", "AWARE", "BADGE",
    "BAKER", "BASIC", "BASIN", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEING", "BENCH", "BIRTH",
    "BLACK", "BLADE", "BLAME", "BLANK", "BLAST", "BLAZE", "BLEND", "BLESS", "BLIND", "BLOCK",
    "BLOOM", "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BRAVE", "BREAD", "BREAK",
    "BREED", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BRUSH", "BUILD",
    "BUILT", "BURST", "CABIN", "CABLE", "CAMEL", "CANAL", "CANDY", "CARGO", "CARRY", "CATCH",
    "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHAMP", "CHARM", "CHART", "CHASE", "CHEAP", "CHECK",
    "CHEEK", "CHESS", "CHEST", "CHIEF", "CHILD", "CHILL", "CHINA", "CHORD", "CIVIC", "CLAIM",
    "CLASH", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLOCK", "CLOSE",
    "CLOTH", "CLOUD", "COACH", "COAST", "COLOR", "COMET", "COMIC", "CORAL", "COUCH", "COUGH",
    "COULD", "COUNT", "COURT", "COVER", "CRACK", "CRAFT", "CRANE", "CRASH", "CRATE", "CRAZY",
    "CREAM", "CREEK", "CREST", "CRIME", "CRISP", "CROSS", "CROWD", "CROWN", "CRUSH", "CURVE",
    "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEBUT", "DECAY", "DELAY", "DELTA", "DENSE",
    "DEPOT", "DEPTH", "DERBY", "DIGIT", "DINER", "DIRTY", "DITCH", "DIVER", "DODGE", "DONOR",
    "DOUBT", "DOUGH", "DOZEN", "DRAFT", "DRAIN", "DRAMA", "DRANK", "DRAWN", "DREAM", "DRESS",
    "DRIFT", "DRILL", "DRINK", "DRIVE", "DRONE", "DROWN", "EAGER", "EAGLE", "EARLY", "EARTH",
    "EIGHT", "ELBOW", "ELDER", "ELECT", "ELITE", "EMBER", "EMPTY", "ENEMY", "ENJOY", "ENTER",
    "ENTRY", "EQUAL", "EQUIP", "ERASE", "ERROR", "EVENT", "EVERY", "EXACT", "EXAMS", "EXCEL",
    "EXIST", "EXTRA", "FABLE", "FAITH", "FALSE", "FANCY", "FAULT", "FAVOR", "FEAST", "FENCE",
    "FERRY", "FETCH", "FEVER", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST",
    "FIXED", "FLAME", "FLANK", "FLASH", "FLASK", "FLEET", "FLESH", "FLINT", "FLOAT", "FLOCK",
    "FLOOD", "FLOOR", "FLORA", "FLOUR", "FLUID", "FLUSH", "FLUTE", "FOCAL", "FOCUS", "FOGGY",
    "FORCE", "FORGE", "FORTH", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT",
    "FROST", "FRUIT", "FULLY", "FUNNY", "GAMMA", "GAUGE", "GENRE", "GHOST", "GIANT", "GIVEN",
    "GLADE", "GLAND", "GLARE", "GLASS", "GLEAM", "GLIDE", "GLOBE", "GLOOM", "GLORY", "GLOSS",
    "GLOVE", "GLYPH", "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAPE", "GRAPH", "GRASP",
    "GRASS", "GRATE", "GRAVE", "GRAVY", "GREAT", "GREED", "GREEN", "GREET", "GRIEF", "GRILL",
    "GRIND", "GRIPE", "GROAN", "GROOM", "GROSS", "GROUP", "GROVE", "GROWL", "GROWN", "GUARD",
    "GUESS", "GUEST", "GUIDE", "GUILD", "GUILT", "HABIT", "HARDY", "HARSH", "HASTE", "HAUNT",
    "HAVEN", "HEART", "HEATH", "HEAVE", "HEAVY", "HEDGE", "HEIST", "HELIX", "HELLO", "HENCE",
    "HERON", "HINGE", "HOBBY", "HOIST", "HOMER", "HONEY", "HONOR", "HORSE", "HOTEL", "HOUND",
    "HOUSE", "HOVER", "HUMAN", "HUMID", "HUMOR", "HUSKY", "IDEAL", "IMAGE", "IMPLY", "INDEX",
    "INDIE", "INERT", "INFER", "INGOT", "INLET", "INNER", "INPUT", "IRONY", "ISSUE", "IVORY",
    "JAUNT", "JELLY", "JEWEL", "JOINT", "JOKER", "JOLLY", "JOUST", "JUDGE", "JUICE", "JUICY",
    "JUMBO", "KAYAK", "KEBAB", "KHAKI", "KIOSK", "KNACK", "KNAVE", "KNEAD", "KNEEL", "KNELT",
    "KNIFE", "KNOCK", "KNOLL", "KNOWN", "KOALA", "LABEL", "LABOR", "LADEN", "LADLE", "LANCE",
    "LAPEL", "LAPSE", "LARGE", "LARVA", "LASER", "LASSO", "LATCH", "LATER", "LATHE", "LATTE",
    "LAUGH", "LAYER", "LEACH", "LEAFY", "LEAKY", "LEANT", "LEAPT", "LEARN", "LEASE", "LEASH",
    "LEAST", "LEAVE", "LEDGE", "LEECH", "LEGAL", "LEMON", "LEMUR", "LEVEL", "LEVER", "LIBEL",
    "LIGHT", "LIKEN", "LILAC", "LIMBO", "LIMIT", "LINEN", "LINER", "LINGO", "LINKS", "LIONS",
    "LIVER", "LIVID", "LLAMA", "LOBBY", "LOCAL", "LOCUS", "LODGE", "LOFTY", "LOGIC", "LOGIN",
    "LOOSE", "LORRY", "LOSER", "LOTUS", "LOUSE", "LOVER", "LOWER", "LOYAL", "LUCID", "LUCKY",
    "LUMEN", "LUNAR", "LUNCH", "LUNGE", "LUPUS", "LURCH", "LURID", "LUSTY", "LYING", "LYMPH",
    "LYRIC", "MACAW", "MACRO", "MADAM", "MADLY", "MAFIA", "MAGIC", "MAGMA", "MAIZE", "MAJOR",
    "MAKER", "MAMBO", "MANGO", "MANIA", "MANIC", "MANOR", "MAPLE", "MARCH", "MARRY", "MARSH",
    "MASON", "MATCH", "MATTE", "MAUVE", "MAXIM", "MAYBE", "MAYOR", "MEALY", "MEANT", "MEATY",
    "MECCA", "MEDAL", "MEDIA", "MEDIC", "MELEE", "MELON", "MERCY", "MERGE", "MERIT", "MERRY",
    "METAL", "METER", "METRO", "MICRO", "MIDGE", "MIDST", "MIGHT", "MILKY", "MIMIC", "MINCE",
    "MINER", "MINIM", "MINOR", "MINTY", "MINUS", "MIRTH", "MISER", "MISSY", "MOCHA", "MODAL",
    "MODEL", "MODEM", "MOGUL", "MOIST", "MOLAR", "MOLDY", "MONEY", "MONTH", "MOODY", "MOOSE",
    "MORAL", "MORON", "MORPH", "MOSSY", "MOTEL", "MOTIF", "MOTOR", "MOTTO", "MOULT", "MOUND",
    "MOUNT", "MOURN", "MOUSE", "MOUTH", "MOVER", "MOVIE", "MOWER", "MUCKY", "MUCUS", "MUDDY",
    "MULCH", "MUMMY", "MUNCH", "MURAL", "MURKY", "MUSHY", "MUSIC", "MUSKY", "MUSTY", "MYRRH",
    "NADIR", "NAIVE", "NANNY", "NASAL", "NASTY", "NATAL", "NAVAL", "NAVEL", "NEEDY", "NEIGH",
    "NERDY", "NERVE", "NEVER", "NEWER", "NEWLY", "NICER", "NICHE", "NIECE", "NIGHT", "NINJA",
    "NINNY", "NINTH", "NOBLE", "NOBLY", "NOISE", "NOISY", "NOMAD", "NOOSE", "NORTH", "NOSEY",
    "NOTCH", "NOVEL", "NUDGE", "NURSE", "NUTTY", "NYLON", "NYMPH", "OAKEN", "OBESE", "OCCUR",
    "OCEAN", "OCTAL", "OCTET", "ODDER", "ODDLY", "OFFAL", "OFFER", "OFTEN", "OLDEN", "OLDER",
    "OLIVE", "OMBRE", "OMEGA", "ONION", "ONSET", "OPERA", "OPINE", "OPIUM", "OPTIC", "ORBIT",
    "ORDER", "ORGAN", "OTHER", "OTTER", "OUGHT", "OUNCE", "OUTDO", "OUTER", "OUTGO", "OVARY",
    "OVATE", "OVERT", "OVINE", "OVOID", "OWING", "OWNER", "OXIDE", "OZONE", "PADDY", "PAGAN",
    "PAINT", "PALER", "PALSY", "PANEL", "PANIC", "PANSY", "PAPAL", "PAPER", "PARER", "PARKA",
    "PARRY", "PARSE", "PARTY", "PASTA", "PASTE", "PASTY", "PATCH", "PATIO", "PATSY", "PATTY",
    "PAUSE", "PAYEE", "PAYER", "PEACE", "PEACH", "PEARL", "PECAN", "PEDAL", "PENAL", "PENCE",
    "PENNE", "PENNY", "PERCH", "PERIL", "PERKY", "PESKY", "PESTO", "PETAL", "PETTY", "PHASE",
    "PHONE", "PHONY", "PHOTO", "PIANO", "PICKY", "PIECE", "PIETY", "PIGGY", "PILOT", "PINCH",
    "PINEY", "PINKY", "PINTO", "PIPER", "PIQUE", "PITCH", "PITHY", "PIVOT", "PIXEL", "PIXIE",
    "PIZZA", "PLACE", "PLAID", "PLAIN", "PLAIT", "PLANE", "PLANK", "PLANT", "PLATE", "PLAZA",
    "PLEAD", "PLEAT", "PLIED", "PLIER", "PLUCK", "PLUMB", "PLUME", "PLUMP", "PLUNK", "PLUSH",
    "POESY", "POINT", "POISE", "POKER", "POLAR", "POLKA", "POLYP", "POOCH", "POPPY", "PORCH",
    "POSER", "POSIT", "POSSE", "POUCH", "POUND", "POUTY", "POWER", "PRANK", "PRAWN", "PREEN",
    "PRESS", "PRICE", "PRICK", "PRIDE", "PRIED", "PRIME", "PRIMO", "PRINT", "PRIOR", "PRISM",
    "PRIVY", "PRIZE", "PROBE", "PRONE", "PRONG", "PROOF", "PROSE", "PROUD", "PROVE", "PROWL",
    "PROXY", "PRUDE", "PRUNE", "PSALM", "PUBIC", "PUDGY", "PUFFY", "PULPY", "PULSE", "PUNCH",
    "PUPAL", "PUPIL", "PUPPY", "PUREE", "PURER", "PURGE", "PURSE", "PUSHY", "PUTTY", "PYGMY",
    "QUACK", "QUAIL", "QUAKE", "QUALM", "QUARK", "QUART", "QUASH", "QUASI", "QUEEN", "QUEER",
    "QUELL", "QUERY", "QUEST", "QUEUE", "QUICK", "QUIET", "QUILL", "QUILT", "QUIRK", "QUITE",
    "QUOTA", "QUOTE", "QUOTH", "RABBI", "RABID", "RACER", "RADAR", "RADII", "RADIO", "RAINY",
    "RAISE", "RAJAH", "RALLY", "RALPH", "RAMEN", "RANCH", "RANDY", "RANGE", "RAPID", "RARER",
    "RASPY", "RATIO", "RATTY", "RAVEN", "RAYON", "RAZOR", "REACH", "REACT", "READY", "REALM",
    "REARM", "REBAR", "REBEL", "REBUS", "REBUT", "RECAP", "RECUR", "RECUT", "REEDY", "REFER",
    "REFIT", "REGAL", "REHAB", "REIGN", "RELAX", "RELAY", "RELIC", "REMIT", "RENAL", "RENEW",
    "REPAY", "REPEL", "REPLY", "RERUN", "RESET", "RESIN", "RETCH", "RETRO", "RETRY", "REUSE",
    "REVEL", "REVUE", "RHINO", "RHYME", "RIDER", "RIDGE", "RIFLE", "RIGHT", "RIGID", "RIGOR",
    "RINSE", "RIPEN", "RIPER", "RISEN", "RISER", "RISKY", "RIVAL", "RIVER", "RIVET", "ROACH",
    "ROAST", "ROBIN", "ROBOT", "ROCKY", "RODEO", "ROGER", "ROGUE", "ROOMY", "ROOST", "ROTOR",
    "ROUGE", "ROUGH", "ROUND", "ROUSE", "ROUTE", "ROVER", "ROWDY", "ROWER", "ROYAL", "RUDDY",
    "RUDER", "RUGBY", "RULER", "RUMBA", "RUMOR", "RUPEE", "RURAL", "RUSTY", "SADLY", "SAFER",
    "SAINT", "SALAD", "SALLY", "SALON", "SALSA", "SALTY", "SALVE", "SALVO", "SANDY", "SANER",
    "SAPPY", "SASSY", "SATIN", "SATYR", "SAUCE", "SAUCY", "SAUNA", "SAUTE", "SAVOR", "SAVOY",
    "SAVVY", "SCALD", "SCALE", "SCALP", "SCALY", "SCAMP", "SCANT", "SCARE", "SCARF", "SCARY",
    "SCENE", "SCENT", "SCION", "SCOFF", "SCOLD", "SCONE", "SCOOP", "SCOPE", "SCORE", "SCORN",
    "SCOUR", "SCOUT", "SCOWL", "SCRAM", "SCRAP", "SCREE", "SCREW", "SCRUB", "SCRUM", "SCUBA",
    "SEDAN", "SEEDY", "SEGUE", "SEIZE", "SEMEN", "SENSE", "SEPIA", "SERIF", "SERUM", "SERVE",
    "SETUP", "SEVEN", "SEVER", "SEWER", "SHACK", "SHADE", "SHADY", "SHAFT", "SHAKE", "SHAKY",
    "SHALE", "SHALL", "SHALT", "SHAME", "SHANK", "SHAPE", "SHARD", "SHARE", "SHARK", "SHARP",
    "SHAVE", "SHAWL", "SHEAR", "SHEEN", "SHEEP", "SHEER", "SHEET", "SHEIK", "SHELF", "SHELL",
    "SHIED", "SHIFT", "SHINE", "SHINY", "SHIRE", "SHIRK", "SHIRT", "SHOAL", "SHOCK", "SHONE",
    "SHOOK", "SHOOT", "SHORE", "SHORN", "SHORT", "SHOUT", "SHOVE", "SHOWN", "SHOWY", "SHREW",
    "SHRUB", "SHRUG", "SHUCK", "SHUNT", "SHUSH", "SHYLY", "SIEGE", "SIEVE", "SIGHT", "SIGMA",
    "SILKY", "SILLY", "SINCE", "SINEW", "SINGE", "SIREN", "SISSY", "SIXTH", "SIXTY", "SKATE",
    "SKIER", "SKIFF", "SKILL", "SKIMP", "SKIRT", "SKULK", "SKULL", "SKUNK", "SLACK", "SLAIN",
    "SLANG", "SLANT", "SLASH", "SLATE", "SLAVE", "SLEEK", "SLEEP", "SLEET", "SLEPT", "SLICE",
    "SLICK", "SLIDE", "SLIME", "SLIMY", "SLING", "SLINK", "SLOOP", "SLOPE", "SLOSH", "SLOTH",
    "SLUMP", "SLUNG", "SLUNK", "SLURP", "SLUSH", "SLYLY", "SMACK", "SMALL", "SMART", "SMASH",
    "SMEAR", "SMELL", "SMELT", "SMILE", "SMIRK", "SMITE", "SMITH", "SMOCK", "SMOKE", "SMOKY",
    "SMOTE", "SNACK", "SNAIL", "SNAKE", "SNAKY", "SNARE", "SNARL", "SNEAK", "SNEER", "SNIDE",
    "SNIFF", "SNIPE", "SNOOP", "SNORE", "SNORT", "SNOUT", "SNOWY", "SNUCK", "SNUFF", "SOAPY",
    "SOBER", "SOGGY", "SOLAR", "SOLID", "SOLVE", "SONAR", "SONIC", "SOOTH", "SOOTY", "SORRY",
    "SOUND", "SOUTH", "SOWER", "SPACE", "SPADE", "SPANK", "SPARE", "SPARK", "SPASM", "SPAWN",
    "SPEAK", "SPEAR", "SPECK", "SPEED", "SPELL", "SPELT", "SPEND", "SPENT", "SPERM", "SPICE",
    "SPICY", "SPIED", "SPIEL", "SPIKE", "SPIKY", "SPILL", "SPILT", "SPINE", "SPINY", "SPIRE",
    "SPITE", "SPLAT", "SPLIT", "SPOIL", "SPOKE", "SPOOF", "SPOOK", "SPOOL", "SPOON", "SPORE",
    "SPORT", "SPOUT", "SPRAY", "SPREE", "SPRIG", "SPUNK", "SPURN", "SPURT", "SQUAD", "SQUAT",
    "SQUIB", "STACK", "STAFF", "STAGE", "STAID", "STAIN", "STAIR", "STAKE", "STALE", "STALK",
    "STALL", "STAMP", "STAND", "STANK", "STARE", "STARK", "START", "STASH", "STATE", "STAVE",
    "STEAD", "STEAK", "STEAL", "STEAM", "STEED", "STEEL", "STEEP", "STEER", "STEIN", "STERN",
    "STICK", "STIFF", "STILL", "STILT", "STING", "STINK", "STINT", "STOCK", "STOIC", "STOKE",
    "STOLE", "STOMP", "STONE", "STONY", "STOOD", "STOOL", "STOOP", "STORE", "STORK", "STORM",
    "STORY", "STOUT", "STOVE", "STRAP", "STRAW", "STRAY", "STRIP", "STRUT", "STUCK", "STUDY",
    "STUFF", "STUMP", "STUNG", "STUNK", "STUNT", "STYLE", "SUAVE", "SUGAR", "SUING", "SUITE",
    "SULKY", "SULLY", "SUMAC", "SUNNY", "SUPER", "SURER", "SURGE", "SURLY", "SUSHI", "SWAMI",
    "SWAMP", "SWARM", "SWASH", "SWATH", "SWEAR", "SWEAT", "SWEEP", "SWEET", "SWELL", "SWEPT",
    "SWIFT", "SWILL", "SWINE", "SWING", "SWIRL", "SWISH", "SWOON", "SWOOP", "SWORD", "SWORE",
    "SWORN", "SWUNG", "SYNOD", "SYRUP", "TABBY", "TABLE", "TABOO", "TACIT", "TACKY", "TAFFY",
    "TAINT", "TAKEN", "TAKER", "TALLY", "TALON", "TAMER", "TANGO", "TANGY", "TAPER", "TAPIR",
    "TARDY", "TAROT", "TASTE", "TASTY", "TATTY", "TAUNT", "TAWNY", "TEACH", "TEARY", "TEASE",
    "TEDDY", "TEETH", "TEMPO", "TENET", "TENOR", "TENSE", "TENTH", "TEPEE", "TEPID", "TERRA",
    "TERSE", "TESTY", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THETA", "THICK",
    "THIEF", "THIGH", "THING", "THINK", "THIRD", "THONG", "THORN", "THOSE", "THREE", "THREW",
    "THROB", "THROW", "THRUM", "THUMB", "THUMP", "THYME", "TIARA", "TIBIA", "TIDAL", "TIGER",
    "TIGHT", "TILDE", "TIMER", "TIMID", "TIPSY", "TITAN", "TITHE", "TITLE", "TOAST", "TODAY",
    "TODDY", "TOKEN", "TONAL", "TONGA", "TONIC", "TOOTH", "TOPAZ", "TOPIC", "TORCH", "TORSO",
    "TORUS", "TOTAL", "TOTEM", "TOUCH", "TOUGH", "TOWEL", "TOWER", "TOXIC", "TOXIN", "TRACE",
    "TRACK", "TRACT", "TRADE", "TRAIL", "TRAIN", "TRAIT", "TRAMP", "TRASH", "TRAWL", "TREAD",
    "TREAT", "TREND", "TRIAD", "TRIAL", "TRIBE", "TRICE", "TRICK", "TRIED", "TRIPE", "TRITE",
    "TROLL", "TROOP", "TROPE", "TROUT", "TROVE", "TRUCE", "TRUCK", "TRUER", "TRULY", "TRUMP",
    "TRUNK", "TRUSS", "TRUST", "TRUTH", "TRYST", "TUBAL", "TUBER", "TULIP", "TULLE", "TUMOR",
    "TUNIC", "TURBO", "TUTOR", "TWANG", "TWEAK", "TWEED", "TWEET", "TWICE", "TWINE", "TWIRL",
    "TWIST", "TWIXT", "TYING", "UDDER", "ULCER", "ULTRA", "UMBRA", "UNCLE", "UNCUT", "UNDER",
    "UNDID", "UNDUE", "UNFED", "UNFIT", "UNIFY", "UNION", "UNITE", "UNITY", "UNLIT", "UNMET",
    "UNSET", "UNTIE", "UNTIL", "UNWED", "UNZIP", "UPPER", "UPSET", "URBAN", "URINE", "USAGE",
    "USHER", "USING", "USUAL", "USURP", "UTILE", "UTTER", "VAGUE", "VALET", "VALID", "VALOR",
    "VALUE", "VALVE", "VAPID", "VAPOR", "VAULT", "VAUNT", "VEGAN", "VENOM", "VENUE", "VERGE",
    "VERSE", "VERSO", "VERVE", "VICAR", "VIDEO", "VIGIL", "VIGOR", "VILLA", "VINYL", "VIOLA",
    "VIPER", "VIRAL", "VIRUS", "VISIT", "VISOR", "VISTA", "VITAL", "VIVID", "VIXEN", "VOCAL",
    "VODKA", "VOGUE", "VOICE", "VOILA", "VOMIT", "VOTER", "VOUCH", "VOWEL", "VYING", "WACKY",
    "WAFER", "WAGER", "WAGON", "WAIST", "WAIVE", "WALTZ", "WARTY", "WASTE", "WATCH", "WATER",
    "WAVER", "WAXEN", "WEARY", "WEAVE", "WEDGE", "WEEDY", "WEIGH", "WEIRD", "WELCH", "WELSH",
    "WENCH", "WHACK", "WHALE", "WHARF", "WHEAT", "WHEEL", "WHELP", "WHERE", "WHICH", "WHIFF",
    "WHILE", "WHINE", "WHINY", "WHIRL", "WHISK", "WHITE", "WHOLE", "WHOOP", "WHOSE", "WIDEN",
    "WIDER", "WIDOW", "WIDTH", "WIELD", "WIGHT", "WILLY", "WIMPY", "WINCE", "WINCH", "WINDY",
    "WISER", "WISPY", "WITCH", "WITTY", "WOKEN", "WOMAN", "WOMEN", "WOODY", "WOOER", "WOOLY",
    "WOOZY", "WORDY", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WOVEN",
    "WRACK", "WRATH", "WREAK", "WRECK", "WREST", "WRING", "WRIST", "WRITE", "WRONG", "WROTE",
    "WRUNG", "WRYLY", "YACHT", "YEARN", "YEAST", "YIELD", "YOUNG", "YOUTH", "ZEBRA", "ZESTY",
    "ZONAL",
];

type TileState = "empty" | "filled" | "correct" | "present" | "absent";

function evaluateGuess(guess: string, target: string): TileState[] {
    const res: TileState[] = ["absent", "absent", "absent", "absent", "absent"];
    const targetCounts: Record<string, number> = {};
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            res[i] = "correct";
        } else {
            targetCounts[target[i]] = (targetCounts[target[i]] || 0) + 1;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (res[i] === "correct") continue;
        const ch = guess[i];
        if (targetCounts[ch] && targetCounts[ch] > 0) {
            res[i] = "present";
            targetCounts[ch] -= 1;
        }
    }
    return res;
}

function getDailyWord(): { word: string; dayNum: number } {
    const epoch = new Date(2025, 0, 1).getTime();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayNum = Math.max(1, Math.floor((today - epoch) / 86400000) + 1);
    return { word: WORDS[(dayNum * 73) % WORDS.length], dayNum };
}

const KEY_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

const STATS_KEY = "reflextry_wordle_stats_v1";

export default function WordleGame() {
    const daily = useMemo(() => getDailyWord(), []);
    const [mode, setMode] = useState<"daily" | "unlimited">("daily");
    const [solution, setSolution] = useState(daily.word);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [current, setCurrent] = useState("");
    const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
    const [toast, setToast] = useState("");
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0, maxStreak: 0 });

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STATS_KEY);
            if (raw) setStats(JSON.parse(raw));
        } catch {
            // ignore
        }
    }, []);

    const showNotice = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast((prev) => (prev === msg ? "" : prev)), 1800);
    }, []);

    const startNewUnlimited = useCallback(() => {
        const next = WORDS[Math.floor(Math.random() * WORDS.length)];
        setMode("unlimited");
        setSolution(next);
        setGuesses([]);
        setCurrent("");
        setStatus("playing");
        setToast("");
    }, []);

    const switchToDaily = useCallback(() => {
        setMode("daily");
        setSolution(daily.word);
        setGuesses([]);
        setCurrent("");
        setStatus("playing");
        setToast("");
    }, [daily.word]);

    const recordResult = useCallback((won: boolean) => {
        setStats((prev) => {
            const next = {
                played: prev.played + 1,
                wins: prev.wins + (won ? 1 : 0),
                streak: won ? prev.streak + 1 : 0,
                maxStreak: won ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
            };
            try {
                localStorage.setItem(STATS_KEY, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    const submitGuess = useCallback(() => {
        if (status !== "playing") return;
        if (current.length < 5) {
            showNotice("Not enough letters — enter a 5-letter word.");
            return;
        }
        const nextGuesses = [...guesses, current];
        setGuesses(nextGuesses);
        setCurrent("");

        if (current === solution) {
            setStatus("won");
            recordResult(true);
            const praise = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
            showNotice(praise[Math.min(nextGuesses.length - 1, 5)]);
        } else if (nextGuesses.length >= 6) {
            setStatus("lost");
            recordResult(false);
            showNotice(`Word was ${solution}`);
        }
    }, [status, current, guesses, solution, recordResult, showNotice]);

    const handleKey = useCallback(
        (key: string) => {
            if (status !== "playing") return;
            if (key === "ENTER") {
                submitGuess();
            } else if (key === "BACK") {
                setCurrent((prev) => prev.slice(0, -1));
            } else if (/^[A-Z]$/.test(key) && current.length < 5) {
                setCurrent((prev) => prev + key);
            }
        },
        [status, current.length, submitGuess]
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === "Enter") {
                e.preventDefault();
                handleKey("ENTER");
            } else if (e.key === "Backspace") {
                handleKey("BACK");
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                handleKey(e.key.toUpperCase());
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleKey]);

    // Compute best color per keyboard letter
    const keyStates = useMemo(() => {
        const map: Record<string, TileState> = {};
        const rank: Record<TileState, number> = { empty: 0, filled: 1, absent: 2, present: 3, correct: 4 };
        guesses.forEach((g) => {
            const evals = evaluateGuess(g, solution);
            for (let i = 0; i < 5; i++) {
                const ch = g[i];
                if (!map[ch] || rank[evals[i]] > rank[map[ch]]) {
                    map[ch] = evals[i];
                }
            }
        });
        return map;
    }, [guesses, solution]);

    const copyShareGrid = () => {
        const rows = guesses.map((g) =>
            evaluateGuess(g, solution)
                .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛"))
                .join("")
        );
        const header =
            mode === "daily"
                ? `Reflextry Wordle #${daily.dayNum} ${status === "won" ? guesses.length : "X"}/6`
                : `Reflextry Wordle Practice ${status === "won" ? guesses.length : "X"}/6`;
        navigator.clipboard?.writeText(`${header}\n\n${rows.join("\n")}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const tileStyle = (state: TileState) => {
        switch (state) {
            case "correct":
                return "bg-emerald-600 border-emerald-600 text-white";
            case "present":
                return "bg-amber-500 border-amber-500 text-white";
            case "absent":
                return "bg-slate-600 border-slate-600 text-white";
            case "filled":
                return "bg-white border-slate-800 text-[#161614] scale-[1.03]";
            default:
                return "bg-white border-[#D8D4C9] text-[#161614]";
        }
    };

    const keyStyle = (k: string) => {
        const s = keyStates[k];
        if (s === "correct") return "bg-emerald-600 text-white border-emerald-600";
        if (s === "present") return "bg-amber-500 text-white border-amber-500";
        if (s === "absent") return "bg-slate-600 text-white border-slate-600";
        return "bg-slate-200/90 hover:bg-slate-300 text-[#161614] border-[#D8D4C9]";
    };

    return (
        <div
            data-capture-keys={status === "playing" ? "r,s,h" : undefined}
            className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-5"
        >
            {/* Top Mode & Stats Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE4]">
                <div className="flex items-center gap-1 p-1 bg-[#F3F1EB] rounded-lg">
                    <button
                        type="button"
                        onClick={switchToDaily}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                            mode === "daily" ? "bg-white text-[#161614] shadow-xs" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        Daily #{daily.dayNum}
                    </button>
                    <button
                        type="button"
                        onClick={startNewUnlimited}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                            mode === "unlimited" ? "bg-white text-[#161614] shadow-xs" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        Unlimited Practice
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#57554E] tabular-nums">
                    <span className="inline-flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                        <span>
                            {stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0}% Win
                        </span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                        <span>Streak {stats.streak}</span>
                    </span>
                </div>
            </div>

            {/* Toast feedback */}
            <div className="h-6 flex items-center justify-center">
                {toast && (
                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                        {toast}
                    </span>
                )}
            </div>

            {/* 6x5 Wordle Board */}
            <div className="max-w-[330px] mx-auto grid grid-rows-6 gap-2">
                {Array.from({ length: 6 }).map((_, r) => {
                    const isSubmitted = r < guesses.length;
                    const isCurrentRow = r === guesses.length && status === "playing";
                    const word = isSubmitted ? guesses[r] : isCurrentRow ? current : "";
                    const evals = isSubmitted ? evaluateGuess(word, solution) : null;

                    return (
                        <div key={r} className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((__, c) => {
                                const ch = word[c] || "";
                                const state: TileState = evals ? evals[c] : ch ? "filled" : "empty";
                                return (
                                    <div
                                        key={c}
                                        className={`aspect-square w-full border-2 rounded-xl flex items-center justify-center text-2xl font-extrabold select-none transition-all duration-150 ${tileStyle(state)}`}
                                    >
                                        {ch}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* End-of-Round Action Bar */}
            {status !== "playing" && (
                <div className="max-w-md mx-auto bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold text-[#161614]">
                            {status === "won" ? `Solved in ${guesses.length}/6!` : `Answer: ${solution}`}
                        </p>
                        <p className="text-xs text-[#57554E]">
                            {status === "won" ? "Share your pattern or play another unlimited word." : "Try another word to rebuild your streak."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={copyShareGrid}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8D4C9] bg-white hover:bg-[#F3F1EB] text-xs font-semibold text-[#161614] cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> : <Share2 className="w-3.5 h-3.5" aria-hidden="true" />}
                            <span>{copied ? "Copied" : "Share"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={startNewUnlimited}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>New Word</span>
                        </button>
                    </div>
                </div>
            )}

            {/* On-Screen QWERTY Keyboard */}
            <div className="max-w-xl mx-auto space-y-1.5 pt-2 select-none">
                {KEY_ROWS.map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-center gap-1.5">
                        {row.map((k) => {
                            const isWide = k === "ENTER" || k === "BACK";
                            return (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => handleKey(k)}
                                    className={`${isWide ? "px-2.5 sm:px-3.5 text-xs" : "flex-1 max-w-[44px] text-sm"} h-12 rounded-lg border font-bold flex items-center justify-center transition-colors cursor-pointer ${keyStyle(k)}`}
                                >
                                    {k === "BACK" ? <Delete className="w-4 h-4" aria-hidden="true" /> : k}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
