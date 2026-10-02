/**
 * Mathematical validation for magic squares.
 * Works for any NxN grid — not hardcoded to a single solution.
 */

/**
 * Check if a completed board is a valid magic square.
 * @param {(number|null)[]} board  – flat array of length N*N
 * @param {number} size            – grid dimension (3 or 4)
 * @param {number} target          – required magic sum (15 or 34)
 * @returns {boolean}
 */
export function isMagicSquare(board, size, target) {
  // Every cell must be filled
  if (board.some((v) => v === null || v === undefined)) return false;

  // Must contain exactly the numbers 1..N²
  const expected = new Set(Array.from({ length: size * size }, (_, i) => i + 1));
  const actual = new Set(board);
  if (actual.size !== expected.size) return false;
  for (const n of expected) {
    if (!actual.has(n)) return false;
  }

  // Check rows
  for (let r = 0; r < size; r++) {
    let sum = 0;
    for (let c = 0; c < size; c++) sum += board[r * size + c];
    if (sum !== target) return false;
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    let sum = 0;
    for (let r = 0; r < size; r++) sum += board[r * size + c];
    if (sum !== target) return false;
  }

  // Main diagonal
  let diag1 = 0;
  for (let i = 0; i < size; i++) diag1 += board[i * size + i];
  if (diag1 !== target) return false;

  // Anti-diagonal
  let diag2 = 0;
  for (let i = 0; i < size; i++) diag2 += board[i * size + (size - 1 - i)];
  if (diag2 !== target) return false;

  return true;
}

/**
 * Compute live line status for feedback while the player places tiles.
 * Returns which rows, columns, and diagonals are complete and correct.
 */
export function getLineStatus(board, size, target) {
  const rows = [];
  const cols = [];
  let mainDiag = false;
  let antiDiag = false;

  // Rows
  for (let r = 0; r < size; r++) {
    let sum = 0;
    let filled = true;
    for (let c = 0; c < size; c++) {
      const v = board[r * size + c];
      if (v === null || v === undefined) { filled = false; break; }
      sum += v;
    }
    rows.push(filled && sum === target);
  }

  // Columns
  for (let c = 0; c < size; c++) {
    let sum = 0;
    let filled = true;
    for (let r = 0; r < size; r++) {
      const v = board[r * size + c];
      if (v === null || v === undefined) { filled = false; break; }
      sum += v;
    }
    cols.push(filled && sum === target);
  }

  // Main diagonal
  {
    let sum = 0;
    let filled = true;
    for (let i = 0; i < size; i++) {
      const v = board[i * size + i];
      if (v === null || v === undefined) { filled = false; break; }
      sum += v;
    }
    mainDiag = filled && sum === target;
  }

  // Anti-diagonal
  {
    let sum = 0;
    let filled = true;
    for (let i = 0; i < size; i++) {
      const v = board[i * size + (size - 1 - i)];
      if (v === null || v === undefined) { filled = false; break; }
      sum += v;
    }
    antiDiag = filled && sum === target;
  }

  return { rows, cols, mainDiag, antiDiag };
}
