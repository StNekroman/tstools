export namespace Strings {
  /**
   * @returns Suggested closest match from candidates, or `undefined` if no candidate is within a reasonable edit distance of the target.
   */
  export function closestMatch(target: string, candidates: readonly string[]): string | undefined {
    let best: string | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      const distance = damerauLevenshtein(target, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    }
    const threshold = Math.max(3, Math.floor(target.length / 2));
    return best !== undefined && bestDistance <= threshold ? best : undefined;
  }

  /**
   * Damerau–Levenshtein edit distance, Optimal String Alignment (restricted) variant:
   * the classic insert/delete/substitute operations plus adjacent-character transposition
   * (so `form`↔`from` is distance 1, not 2 — the most common typo class). OSA caps each
   * substring at one edit, which is sufficient for short field-path suggestions.
   * O(|a|·|b|) time and space.
   */
  export function damerauLevenshtein(a: string, b: string): number {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const dist: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
    for (let i = 0; i < rows; i++) dist[i][0] = i;
    for (let j = 0; j < cols; j++) dist[0][j] = j;
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dist[i][j] = Math.min(dist[i - 1][j] + 1, dist[i][j - 1] + 1, dist[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          dist[i][j] = Math.min(dist[i][j], dist[i - 2][j - 2] + 1);
        }
      }
    }
    return dist[a.length][b.length];
  }
}
