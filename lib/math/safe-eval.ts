/**
 * Pure, zero-eval recursive-descent mathematical expression parser & evaluator.
 * Replaces `new Function(...)` in GraphingCalculatorTool to eliminate dynamic code
 * execution risks and compile each plotted expression once per canvas frame.
 */

type TokenType = "number" | "ident" | "op" | "lparen" | "rparen" | "comma";

interface Token {
  type: TokenType;
  value: string;
}

type AstNode =
  | { kind: "number"; value: number }
  | { kind: "var"; name: string }
  | { kind: "unary"; op: "+" | "-"; arg: AstNode }
  | { kind: "binary"; op: "+" | "-" | "*" | "/" | "^"; left: AstNode; right: AstNode }
  | { kind: "call"; name: string; args: AstNode[] };

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
};

const KNOWN_FUNCTIONS = new Set([
  "abs",
  "sqrt",
  "cbrt",
  "log",
  "ln",
  "exp",
  "floor",
  "ceil",
  "round",
  "pow",
  "min",
  "max",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
]);

const MAX_EXPR_LENGTH = 256;
const MAX_AST_DEPTH = 48;

function tokenize(raw: string): Token[] | null {
  if (!raw || raw.length > MAX_EXPR_LENGTH) return null;

  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/π/g, "pi")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\*\*/g, "^");

  if (!cleaned) return null;

  const rawTokens: Token[] = [];
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if ((ch >= "0" && ch <= "9") || (ch === "." && cleaned[i + 1] >= "0" && cleaned[i + 1] <= "9")) {
      const start = i;
      let dots = 0;
      while (i < cleaned.length && ((cleaned[i] >= "0" && cleaned[i] <= "9") || cleaned[i] === ".")) {
        if (cleaned[i] === ".") dots++;
        if (dots > 1) return null;
        i++;
      }
      if (i < cleaned.length && cleaned[i] === "e") {
        const next = cleaned[i + 1];
        const next2 = cleaned[i + 2];
        if (
          (next >= "0" && next <= "9") ||
          ((next === "+" || next === "-") && next2 >= "0" && next2 <= "9")
        ) {
          i++;
          if (cleaned[i] === "+" || cleaned[i] === "-") i++;
          while (i < cleaned.length && cleaned[i] >= "0" && cleaned[i] <= "9") i++;
        }
      }
      rawTokens.push({ type: "number", value: cleaned.slice(start, i) });
      continue;
    }

    if (ch >= "a" && ch <= "z") {
      const start = i;
      while (i < cleaned.length && cleaned[i] >= "a" && cleaned[i] <= "z") i++;
      rawTokens.push({ type: "ident", value: cleaned.slice(start, i) });
      continue;
    }

    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^") {
      rawTokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    if (ch === "(") {
      rawTokens.push({ type: "lparen", value: ch });
      i++;
      continue;
    }

    if (ch === ")") {
      rawTokens.push({ type: "rparen", value: ch });
      i++;
      continue;
    }

    if (ch === ",") {
      rawTokens.push({ type: "comma", value: ch });
      i++;
      continue;
    }

    return null;
  }

  // Insert implicit multiplication: 2x -> 2*x, 2(x+1) -> 2*(x+1), (x)(y) -> (x)*(y), 2sin(x) -> 2*sin(x)
  const tokens: Token[] = [];
  for (let idx = 0; idx < rawTokens.length; idx++) {
    const cur = rawTokens[idx];
    const prev = tokens[tokens.length - 1];
    if (prev) {
      const prevEndsValue =
        prev.type === "number" ||
        prev.type === "rparen" ||
        (prev.type === "ident" && !KNOWN_FUNCTIONS.has(prev.value));
      const curStartsValue =
        cur.type === "number" || cur.type === "ident" || cur.type === "lparen";
      if (prevEndsValue && curStartsValue) {
        tokens.push({ type: "op", value: "*" });
      }
    }
    tokens.push(cur);
  }

  return tokens;
}

class Parser {
  private pos = 0;
  private depth = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): AstNode | null {
    const node = this.parseAddSub();
    if (!node || this.pos !== this.tokens.length) return null;
    return node;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private parseAddSub(): AstNode | null {
    let left = this.parseMulDiv();
    if (!left) return null;
    while (this.peek()?.type === "op" && (this.peek()!.value === "+" || this.peek()!.value === "-")) {
      const op = this.consume().value as "+" | "-";
      const right = this.parseMulDiv();
      if (!right) return null;
      left = { kind: "binary", op, left, right };
    }
    return left;
  }

  private parseMulDiv(): AstNode | null {
    let left = this.parsePower();
    if (!left) return null;
    while (this.peek()?.type === "op" && (this.peek()!.value === "*" || this.peek()!.value === "/")) {
      const op = this.consume().value as "*" | "/";
      const right = this.parsePower();
      if (!right) return null;
      left = { kind: "binary", op, left, right };
    }
    return left;
  }

  private parsePower(): AstNode | null {
    const base = this.parseUnary();
    if (!base) return null;
    if (this.peek()?.type === "op" && this.peek()!.value === "^") {
      this.consume();
      const exponent = this.parsePower();
      if (!exponent) return null;
      return { kind: "binary", op: "^", left: base, right: exponent };
    }
    return base;
  }

  private parseUnary(): AstNode | null {
    if (this.depth > MAX_AST_DEPTH) return null;
    if (this.peek()?.type === "op" && (this.peek()!.value === "+" || this.peek()!.value === "-")) {
      const op = this.consume().value as "+" | "-";
      this.depth++;
      const arg = this.parseUnary();
      this.depth--;
      if (!arg) return null;
      return { kind: "unary", op, arg };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): AstNode | null {
    const tok = this.peek();
    if (!tok) return null;

    if (tok.type === "number") {
      this.consume();
      const num = Number(tok.value);
      return Number.isFinite(num) ? { kind: "number", value: num } : null;
    }

    if (tok.type === "ident") {
      this.consume();
      if (KNOWN_FUNCTIONS.has(tok.value)) {
        if (this.peek()?.type !== "lparen") return null;
        this.consume();
        const args: AstNode[] = [];
        if (this.peek()?.type !== "rparen") {
          while (true) {
            this.depth++;
            const arg = this.parseAddSub();
            this.depth--;
            if (!arg) return null;
            args.push(arg);
            if (this.peek()?.type === "comma") {
              this.consume();
              continue;
            }
            break;
          }
        }
        if (this.peek()?.type !== "rparen") return null;
        this.consume();
        if (args.length === 0 || args.length > 2) return null;
        return { kind: "call", name: tok.value, args };
      }

      if (tok.value === "x" || tok.value in CONSTANTS) {
        return { kind: "var", name: tok.value };
      }
      return null;
    }

    if (tok.type === "lparen") {
      this.consume();
      this.depth++;
      const inner = this.parseAddSub();
      this.depth--;
      if (!inner || this.peek()?.type !== "rparen") return null;
      this.consume();
      return inner;
    }

    return null;
  }
}

function evalAst(node: AstNode, xVal: number, trigFactor: number): number {
  switch (node.kind) {
    case "number":
      return node.value;
    case "var":
      return node.name === "x" ? xVal : CONSTANTS[node.name];
    case "unary": {
      const v = evalAst(node.arg, xVal, trigFactor);
      return node.op === "-" ? -v : v;
    }
    case "binary": {
      const l = evalAst(node.left, xVal, trigFactor);
      const r = evalAst(node.right, xVal, trigFactor);
      switch (node.op) {
        case "+":
          return l + r;
        case "-":
          return l - r;
        case "*":
          return l * r;
        case "/":
          return l / r;
        case "^":
          return Math.pow(l, r);
      }
    }
    case "call": {
      const a0 = evalAst(node.args[0], xVal, trigFactor);
      const a1 = node.args.length > 1 ? evalAst(node.args[1], xVal, trigFactor) : NaN;
      switch (node.name) {
        case "abs":
          return Math.abs(a0);
        case "sqrt":
          return Math.sqrt(a0);
        case "cbrt":
          return Math.cbrt(a0);
        case "log":
          return Math.log10(a0);
        case "ln":
          return Math.log(a0);
        case "exp":
          return Math.exp(a0);
        case "floor":
          return Math.floor(a0);
        case "ceil":
          return Math.ceil(a0);
        case "round":
          return Math.round(a0);
        case "pow":
          return node.args.length === 2 ? Math.pow(a0, a1) : NaN;
        case "min":
          return node.args.length === 2 ? Math.min(a0, a1) : a0;
        case "max":
          return node.args.length === 2 ? Math.max(a0, a1) : a0;
        case "sin":
          return Math.sin(a0 * trigFactor);
        case "cos":
          return Math.cos(a0 * trigFactor);
        case "tan":
          return Math.tan(a0 * trigFactor);
        case "asin":
          return Math.asin(a0) / trigFactor;
        case "acos":
          return Math.acos(a0) / trigFactor;
        case "atan":
          return Math.atan(a0) / trigFactor;
        default:
          return NaN;
      }
    }
  }
}

export type CompiledMathFn = (xVal?: number) => number;

export function compileMathExpression(raw: string, useDeg = false): CompiledMathFn | null {
  const tokens = tokenize(raw);
  if (!tokens) return null;
  const ast = new Parser(tokens).parse();
  if (!ast) return null;
  const trigFactor = useDeg ? Math.PI / 180 : 1;

  return (xVal = 0) => {
    const res = evalAst(ast, xVal, trigFactor);
    return typeof res === "number" && Number.isFinite(res) ? res : NaN;
  };
}

export function safeEvalMath(raw: string, xVal = 0, useDeg = false): number {
  const fn = compileMathExpression(raw, useDeg);
  return fn ? fn(xVal) : NaN;
}
