// 必要な要素を取得
const task_input = document.getElementById("task_input");
const add_button = document.getElementById("add_button");
const task_list = document.getElementById("task_list");

// タスクをリストへ追加する処理
const add_task = () => {
	const task_text = task_input.value.trim();

	// 空文字は追加しない
	if (task_text === "") {
		return;
	}

	const list_item = document.createElement("li");
	list_item.textContent = task_text;
	task_list.appendChild(list_item);

	// 入力欄を空にして再入力しやすくする
	task_input.value = "";
	task_input.focus();
};

// 追加ボタンクリック時にタスクを追加
add_button.addEventListener("click", add_task);