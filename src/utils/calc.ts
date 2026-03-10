export function sanitizeExpression(input: string) {
  const trimmed = input.replace(/\s+/g, "");
  const allowed = /^[0-9+\-*/^().,%a-zA-Z]*$/.test(trimmed);
  if (!allowed) return null;
  return trimmed;
}

export function evaluateExpression(expression: string) {
  let expr = expression;
  expr = expr.replace(/\bpi\b/gi, "Math.PI");
  expr = expr.replace(/\be\b/gi, "Math.E");
  expr = expr.replace(/\bln\b/gi, "Math.log");
  expr = expr.replace(/\blog\b/gi, "Math.log10");
  expr = expr.replace(/\bsqrt\b/gi, "Math.sqrt");
  expr = expr.replace(/\babs\b/gi, "Math.abs");
  expr = expr.replace(/\bsin\b/gi, "Math.sin");
  expr = expr.replace(/\bcos\b/gi, "Math.cos");
  expr = expr.replace(/\btan\b/gi, "Math.tan");
  expr = expr.replace(/\bpow\b/gi, "Math.pow");
  expr = expr.replace(/\^/g, "**");
  const fn = new Function(`return (${expr});`);
  const result = fn();
  if (typeof result !== "number" || Number.isNaN(result) || !Number.isFinite(result)) {
    throw new Error("结果无效");
  }
  return result;
}
