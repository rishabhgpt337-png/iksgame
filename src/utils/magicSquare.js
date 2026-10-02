/**
 * Mathematical validation for magic squares.
 * Provides granular row, column, and diagonal checking with live sum calculation.
 */

/**
 * Calculate row sum and completion status.
 * @param {(number|null)[]} board
 * @param {number} size
 * @param {number} rowIndex
 */
export function calculateRowSum(board, size, rowIndex) {
  const cells = [];
  let sum = 0;
  let isFilled = true;

  for (let c = 0; c < size; c++) {
    const idx = rowIndex * size + c;
    cells.push(idx);
    const val = board[idx];
    if (val === null || val === undefined) {
      isFilled = false;
    } else {
      sum += val;
    }
  }

  return {
    type: 'row',
    id: `row-${rowIndex}`,
    index: rowIndex,
    cells,
    sum,
    isFilled,
  };
}

/**
 * Calculate column sum and completion status.
 * @param {(number|null)[]} board
 * @param {number} size
 * @param {number} colIndex
 */
export function calculateColumnSum(board, size, colIndex) {
  const cells = [];
  let sum = 0;
  let isFilled = true;

  for (let r = 0; r < size; r++) {
    const idx = r * size + colIndex;
    cells.push(idx);
    const val = board[idx];
    if (val === null || val === undefined) {
      isFilled = false;
    } else {
      sum += val;
    }
  }

  return {
    type: 'col',
    id: `col-${colIndex}`,
    index: colIndex,
    cells,
    sum,
    isFilled,
  };
}

/**
 * Calculate diagonal sum and completion status.
 * @param {(number|null)[]} board
 * @param {number} size
 * @param {'main'|'anti'} diagType
 */
export function calculateDiagonalSum(board, size, diagType) {
  const cells = [];
  let sum = 0;
  let isFilled = true;

  for (let i = 0; i < size; i++) {
    const idx = diagType === 'main' ? i * size + i : i * size + (size - 1 - i);
    cells.push(idx);
    const val = board[idx];
    if (val === null || val === undefined) {
      isFilled = false;
    } else {
      sum += val;
    }
  }

  return {
    type: 'diag',
    id: `diag-${diagType}`,
    name: diagType,
    label: diagType === 'main' ? 'Main Diagonal ↘' : 'Anti Diagonal ↙',
    cells,
    sum,
    isFilled,
  };
}

/**
 * Check single line against target sum.
 */
export function checkLine(line, target) {
  const isComplete = line.isFilled;
  const isCorrect = isComplete && line.sum === target;
  const isWrong = isComplete && line.sum !== target;

  return {
    ...line,
    target,
    isComplete,
    isCorrect,
    isWrong,
  };
}

/**
 * Check all rows, columns, and diagonals of the board.
 * Returns detailed status for every line, along with lists of valid and invalid lines.
 * @param {(number|null)[]} board
 * @param {number} size
 * @param {number} target
 */
export function checkCompletedLines(board, size, target) {
  const rows = [];
  const cols = [];
  const validLines = [];
  const invalidLines = [];

  // Check all rows
  for (let r = 0; r < size; r++) {
    const raw = calculateRowSum(board, size, r);
    const checked = checkLine(raw, target);
    rows.push(checked);
    if (checked.isCorrect) validLines.push(checked);
    if (checked.isWrong) invalidLines.push(checked);
  }

  // Check all cols
  for (let c = 0; c < size; c++) {
    const raw = calculateColumnSum(board, size, c);
    const checked = checkLine(raw, target);
    cols.push(checked);
    if (checked.isCorrect) validLines.push(checked);
    if (checked.isWrong) invalidLines.push(checked);
  }

  // Main diagonal
  const mainRaw = calculateDiagonalSum(board, size, 'main');
  const mainDiag = checkLine(mainRaw, target);
  if (mainDiag.isCorrect) validLines.push(mainDiag);
  if (mainDiag.isWrong) invalidLines.push(mainDiag);

  // Anti diagonal
  const antiRaw = calculateDiagonalSum(board, size, 'anti');
  const antiDiag = checkLine(antiRaw, target);
  if (antiDiag.isCorrect) validLines.push(antiDiag);
  if (antiDiag.isWrong) invalidLines.push(antiDiag);

  return {
    rows,
    cols,
    mainDiag,
    antiDiag,
    validLines,
    invalidLines,
  };
}

/**
 * Intelligently determine which cell indices should be cleared/reset for an invalid line.
 * Preserves cells that are part of already-correct lines.
 *
 * @param {object} invalidLine
 * @param {(number|null)[]} board
 * @param {number[]} placementHistory - array of cell indices ordered from oldest to newest placement
 * @param {object[]} validLines - list of currently valid line objects
 * @returns {number[]} array of cell indices to reset
 */
export function getResetCellsForInvalidLine(invalidLine, board, placementHistory, validLines) {
  // Set of cells that are part of any valid line
  const protectedCells = new Set();
  for (const vLine of validLines) {
    for (const cellIdx of vLine.cells) {
      protectedCells.add(cellIdx);
    }
  }

  // Unprotected cells in the invalid line
  const candidates = invalidLine.cells.filter((idx) => !protectedCells.has(idx) && board[idx] !== null);

  // If there are candidates that don't break valid lines, reset all of them
  if (candidates.length > 0) {
    return candidates;
  }

  // If ALL cells in this line intersect with other valid lines (extremely rare),
  // reset only the most recently placed cell among the line's cells
  const lineHistory = placementHistory.filter((idx) => invalidLine.cells.includes(idx));
  if (lineHistory.length > 0) {
    return [lineHistory[lineHistory.length - 1]];
  }

  return invalidLine.cells;
}

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

  const { rows, cols, mainDiag, antiDiag } = checkCompletedLines(board, size, target);

  // All rows must be correct
  if (rows.some((r) => !r.isCorrect)) return false;
  // All cols must be correct
  if (cols.some((c) => !c.isCorrect)) return false;
  // Both diags must be correct
  if (!mainDiag.isCorrect || !antiDiag.isCorrect) return false;

  return true;
}
