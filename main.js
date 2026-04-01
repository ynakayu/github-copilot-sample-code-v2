"use strict";

// -----------------------------------------------
// DOM要素
// -----------------------------------------------
const left_textarea = document.getElementById("left_text");
const right_textarea = document.getElementById("right_text");
const compare_button = document.getElementById("compare_button");
const reset_button = document.getElementById("reset_button");
const message = document.getElementById("message");
const left_result = document.getElementById("left_result");
const right_result = document.getElementById("right_result");
const line_number_digits = 3;

// -----------------------------------------------
// 共通表示
// -----------------------------------------------
function set_message(text, type) {
  message.textContent = text;
  message.className = type;
}

function clear_results() {
  left_result.innerHTML = "";
  right_result.innerHTML = "";
}

function format_line_number(line_number) {
  return String(line_number).padStart(line_number_digits, "0");
}

function create_text_segments_element(segments) {
  const fragment = document.createDocumentFragment();

  segments.forEach((segment) => {
    const span = document.createElement("span");
    span.textContent = segment.text;

    if (segment.type === "removed") {
      span.className = "char_removed";
    }

    if (segment.type === "added") {
      span.className = "char_added";
    }

    fragment.appendChild(span);
  });

  return fragment;
}

function create_line_element(text, type, line_number, segments = null) {
  const line = document.createElement("div");
  line.className = `line ${type}`;

  const line_content = document.createElement("div");
  line_content.className = "line_content";

  const line_number_element = document.createElement("span");
  line_number_element.className = "line_number";
  line_number_element.textContent = line_number === "" ? "" : format_line_number(line_number);

  const line_text_element = document.createElement("span");
  line_text_element.className = "line_text";

  if (segments && segments.length > 0) {
    line_text_element.appendChild(create_text_segments_element(segments));
  } else {
    line_text_element.textContent = text;
  }

  line_content.appendChild(line_number_element);
  line_content.appendChild(line_text_element);
  line.appendChild(line_content);

  return line;
}

// -----------------------------------------------
// 入力処理
// -----------------------------------------------
function normalize_lines(text) {
  return text.replace(/\r\n/g, "\n").split("\n");
}

function validate_input(left_text, right_text) {
  if (left_text.trim() === "" || right_text.trim() === "") {
    set_message("2つのテキストを入力してください。", "error");
    return false;
  }
  return true;
}

// -----------------------------------------------
// 差分計算（LCSベース）
// -----------------------------------------------
function create_lcs_matrix(left_lines, right_lines) {
  const row_size = left_lines.length + 1;
  const col_size = right_lines.length + 1;
  const matrix = Array.from({ length: row_size }, () => Array(col_size).fill(0));

  for (let left_index = 1; left_index < row_size; left_index++) {
    for (let right_index = 1; right_index < col_size; right_index++) {
      if (left_lines[left_index - 1] === right_lines[right_index - 1]) {
        matrix[left_index][right_index] = matrix[left_index - 1][right_index - 1] + 1;
      } else {
        matrix[left_index][right_index] = Math.max(
          matrix[left_index - 1][right_index],
          matrix[left_index][right_index - 1]
        );
      }
    }
  }

  return matrix;
}

function backtrack_operations(left_lines, right_lines, matrix) {
  const operations = [];
  let left_index = left_lines.length;
  let right_index = right_lines.length;

  while (left_index > 0 || right_index > 0) {
    if (
      left_index > 0 &&
      right_index > 0 &&
      left_lines[left_index - 1] === right_lines[right_index - 1]
    ) {
      operations.push({
        type: "same",
        left_text: left_lines[left_index - 1],
        right_text: right_lines[right_index - 1]
      });
      left_index--;
      right_index--;
    } else if (
      right_index > 0 &&
      (left_index === 0 || matrix[left_index][right_index - 1] >= matrix[left_index - 1][right_index])
    ) {
      operations.push({
        type: "added",
        left_text: "",
        right_text: right_lines[right_index - 1]
      });
      right_index--;
    } else {
      operations.push({
        type: "removed",
        left_text: left_lines[left_index - 1],
        right_text: ""
      });
      left_index--;
    }
  }

  return operations.reverse();
}

function compute_diff_rows(left_text, right_text) {
  const left_lines = normalize_lines(left_text);
  const right_lines = normalize_lines(right_text);
  const lcs_matrix = create_lcs_matrix(left_lines, right_lines);
  return backtrack_operations(left_lines, right_lines, lcs_matrix);
}

function create_char_lcs_matrix(left_text, right_text) {
  const row_size = left_text.length + 1;
  const col_size = right_text.length + 1;
  const matrix = Array.from({ length: row_size }, () => Array(col_size).fill(0));

  for (let left_index = 1; left_index < row_size; left_index++) {
    for (let right_index = 1; right_index < col_size; right_index++) {
      if (left_text[left_index - 1] === right_text[right_index - 1]) {
        matrix[left_index][right_index] = matrix[left_index - 1][right_index - 1] + 1;
      } else {
        matrix[left_index][right_index] = Math.max(
          matrix[left_index - 1][right_index],
          matrix[left_index][right_index - 1]
        );
      }
    }
  }

  return matrix;
}

function merge_segments(segments, type, text) {
  if (text === "") {
    return;
  }

  const last_segment = segments[segments.length - 1];
  if (last_segment && last_segment.type === type) {
    last_segment.text += text;
  } else {
    segments.push({ type, text });
  }
}

function compute_char_diff_segments(left_text, right_text) {
  const matrix = create_char_lcs_matrix(left_text, right_text);
  const operations = [];
  let left_index = left_text.length;
  let right_index = right_text.length;

  while (left_index > 0 || right_index > 0) {
    if (
      left_index > 0 &&
      right_index > 0 &&
      left_text[left_index - 1] === right_text[right_index - 1]
    ) {
      operations.push({ type: "same", char: left_text[left_index - 1] });
      left_index--;
      right_index--;
    } else if (
      right_index > 0 &&
      (left_index === 0 || matrix[left_index][right_index - 1] >= matrix[left_index - 1][right_index])
    ) {
      operations.push({ type: "added", char: right_text[right_index - 1] });
      right_index--;
    } else {
      operations.push({ type: "removed", char: left_text[left_index - 1] });
      left_index--;
    }
  }

  operations.reverse();

  const left_segments = [];
  const right_segments = [];

  operations.forEach((operation) => {
    if (operation.type === "same") {
      merge_segments(left_segments, "same", operation.char);
      merge_segments(right_segments, "same", operation.char);
    }

    if (operation.type === "removed") {
      merge_segments(left_segments, "removed", operation.char);
    }

    if (operation.type === "added") {
      merge_segments(right_segments, "added", operation.char);
    }
  });

  return { left_segments, right_segments };
}

// -----------------------------------------------
// 描画
// -----------------------------------------------
function render_diff_rows(rows) {
  clear_results();

  let has_diff = false;
  let left_line_number = 1;
  let right_line_number = 1;

  let row_index = 0;
  while (row_index < rows.length) {
    const row = rows[row_index];
    const next_row = rows[row_index + 1];

    // 連続する削除＋追加は置換とみなし、文字単位差分を表示する
    if (row.type === "removed" && next_row && next_row.type === "added") {
      const char_diff_segments = compute_char_diff_segments(row.left_text, next_row.right_text);

      left_result.appendChild(
        create_line_element(row.left_text, "removed", left_line_number, char_diff_segments.left_segments)
      );
      right_result.appendChild(
        create_line_element(next_row.right_text, "added", right_line_number, char_diff_segments.right_segments)
      );

      has_diff = true;
      left_line_number++;
      right_line_number++;
      row_index += 2;
      continue;
    }

    if (row.type === "same") {
      left_result.appendChild(create_line_element(row.left_text, "same", left_line_number));
      right_result.appendChild(create_line_element(row.right_text, "same", right_line_number));
      left_line_number++;
      right_line_number++;
    }

    if (row.type === "removed") {
      has_diff = true;
      left_result.appendChild(create_line_element(row.left_text, "removed", left_line_number));
      right_result.appendChild(create_line_element("", "empty", ""));
      left_line_number++;
    }

    if (row.type === "added") {
      has_diff = true;
      left_result.appendChild(create_line_element("", "empty", ""));
      right_result.appendChild(create_line_element(row.right_text, "added", right_line_number));
      right_line_number++;
    }

    row_index++;
  }

  if (has_diff) {
    set_message("差分があります。行単位と文字単位の差分を表示しています。", "info");
  } else {
    set_message("差分はありません。", "info");
  }
}

// -----------------------------------------------
// イベント処理
// -----------------------------------------------
function handle_compare() {
  const left_text = left_textarea.value;
  const right_text = right_textarea.value;

  if (!validate_input(left_text, right_text)) {
    clear_results();
    return;
  }

  const rows = compute_diff_rows(left_text, right_text);
  render_diff_rows(rows);
}

function handle_reset() {
  left_textarea.value = "";
  right_textarea.value = "";
  set_message("", "");
  clear_results();
}

compare_button.addEventListener("click", handle_compare);
reset_button.addEventListener("click", handle_reset);