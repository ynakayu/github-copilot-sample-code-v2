// 必要な要素を取得
const task_input = document.getElementById("task_input");
const add_button = document.getElementById("add_button");
const delete_button = document.getElementById("delete_button");
const task_list = document.getElementById("task_list");

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
  list_item.appendChild(task_label);

  task_list.appendChild(list_item);

  // 入力欄を空にして再入力しやすくする
  task_input.value = "";
  task_input.focus();
};

// チェック済みタスクを削除する処理
const delete_checked_tasks = () => {
  // チェックされたリストアイテムを取得して削除
  const checked_items = task_list.querySelectorAll("li input[type='checkbox']:checked");
  checked_items.forEach((checkbox) => {
    task_list.removeChild(checkbox.parentElement);
  });
};

// 追加ボタンクリック時にタスクを追加
add_button.addEventListener("click", add_task);

// 削除ボタンクリック時にチェック済みタスクを削除
delete_button.addEventListener("click", delete_checked_tasks);