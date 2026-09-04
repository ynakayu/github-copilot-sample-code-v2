// 必要な要素を取得
const task_input = document.getElementById("task_input");
const add_button = document.getElementById("add_button");
const complete_button = document.getElementById("complete_button");
const delete_button = document.getElementById("delete_button");
const task_list = document.getElementById("task_list");

// チェック済みタスクの有無に応じて操作ボタンの表示を切り替える処理
const toggle_action_buttons_visibility = () => {
  const checked_count = task_list.querySelectorAll("li input[type='checkbox']:checked").length;
  const should_show = checked_count > 0;

  complete_button.style.display = should_show ? "inline-block" : "none";
  delete_button.style.display = should_show ? "inline-block" : "none";
};

// タスクをリストへ追加する処理
const add_task = () => {
  const task_text = task_input.value.trim();

  // 空文字は追加しない
  if (task_text === "") {
    return;
  }

  // リストアイテムを作成
  const list_item = document.createElement("li");

  // チェックボックスを作成して左端に配置
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  list_item.appendChild(checkbox);

  // タスクテキストを追加
  const task_label = document.createElement("span");
  task_label.textContent = task_text;
  // タスクテキストをクリック時に編集フォームを表示
  task_label.addEventListener("click", () => show_edit_form(task_label, list_item));
  task_label.style.cursor = "pointer";
  list_item.appendChild(task_label);

  task_list.appendChild(list_item);

  // 入力欄を空にして再入力しやすくする
  task_input.value = "";
  task_input.focus();
};

// 編集フォームを表示する処理
const show_edit_form = (task_label, list_item) => {
  // すでに編集中の場合は処理を中止
  if (list_item.querySelector(".edit_form")) {
    return;
  }

  // 元のテキストを保存
  const original_text = task_label.textContent;

  // 編集フォームのコンテナを作成
  const edit_form = document.createElement("div");
  edit_form.className = "edit_form";

  // 編集用のテキスト入力欄を作成
  const edit_input = document.createElement("input");
  edit_input.type = "text";
  edit_input.value = original_text;
  edit_form.appendChild(edit_input);

  // 編集ボタンを作成
  const save_button = document.createElement("button");
  save_button.type = "button";
  save_button.textContent = "編集";
  save_button.addEventListener("click", () => save_edited_task(edit_input, task_label, list_item, edit_form));
  edit_form.appendChild(save_button);

  // キャンセルボタンを作成
  const cancel_button = document.createElement("button");
  cancel_button.type = "button";
  cancel_button.textContent = "キャンセル";
  cancel_button.addEventListener("click", () => cancel_edit(list_item, edit_form));
  edit_form.appendChild(cancel_button);

  // 元のタスクラベルを非表示にして、フォームを追加
  task_label.style.display = "none";
  list_item.appendChild(edit_form);

  // 入力欄にフォーカスして、テキストを全選択
  edit_input.focus();
  edit_input.select();
};

// 編集を保存する処理
const save_edited_task = (edit_input, task_label, list_item, edit_form) => {
  const updated_text = edit_input.value.trim();

  // 空文字は保存しない
  if (updated_text === "") {
    return;
  }

  // タスクラベルを更新
  task_label.textContent = updated_text;

  // フォームを削除して、タスクラベルを表示
  list_item.removeChild(edit_form);
  task_label.style.display = "inline";
};

// 編集をキャンセルする処理
const cancel_edit = (list_item, edit_form) => {
  const task_label = list_item.querySelector("span");

  // フォームを削除して、タスクラベルを表示
  list_item.removeChild(edit_form);
  task_label.style.display = "inline";
};

// チェック済みタスクを削除する処理
const delete_checked_tasks = () => {
  // チェックされたリストアイテムを取得して削除
  const checked_items = task_list.querySelectorAll("li input[type='checkbox']:checked");
  checked_items.forEach((checkbox) => {
    task_list.removeChild(checkbox.parentElement);
  });

  // 削除後に操作ボタンの表示状態を更新
  toggle_action_buttons_visibility();
};

// 追加ボタンクリック時にタスクを追加
add_button.addEventListener("click", add_task);

// チェック済みタスクを完了状態にする処理
const mark_tasks_complete = () => {
  // チェックされたリストアイテムを取得して取り消し線を適用
  const checked_items = task_list.querySelectorAll("li input[type='checkbox']:checked");
  checked_items.forEach((checkbox) => {
    const list_item = checkbox.parentElement;
    const task_label = list_item.querySelector("span");
    // タスクラベルに取り消し線を適用
    task_label.style.textDecoration = "line-through";
  });
};

// チェックボックスの状態が変わったときに操作ボタンの表示を更新
task_list.addEventListener("change", (event) => {
  if (event.target.matches("input[type='checkbox']")) {
    toggle_action_buttons_visibility();
  }
});

// 完了ボタンクリック時にチェック済みタスクを完了状態にする
complete_button.addEventListener("click", mark_tasks_complete);

// 削除ボタンクリック時にチェック済みタスクを削除
delete_button.addEventListener("click", delete_checked_tasks);

// 初期表示時はチェック済みタスクがないため操作ボタンを非表示にする
toggle_action_buttons_visibility();