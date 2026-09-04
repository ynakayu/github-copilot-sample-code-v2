/** @jest-environment jsdom */

describe("todo-list.js", () => {
  const setup_dom = () => {
    document.body.innerHTML = `
      <button id="complete_button" type="button">完了</button>
      <button id="delete_button" type="button">削除</button>
      <input id="task_input" type="text">
      <button id="add_button" type="button">追加</button>
      <ul id="task_list"></ul>
    `;

    jest.resetModules();
    require("./todo-list.js");
  };

  const get_task_items = () => Array.from(document.querySelectorAll("#task_list li"));

  const add_task = (task_text) => {
    const task_input = document.getElementById("task_input");
    task_input.value = task_text;
    document.getElementById("add_button").click();
  };

  const change_checkbox = (checkbox, checked) => {
    checkbox.checked = checked;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  };

  beforeEach(() => {
    setup_dom();
  });

  describe("タスクの追加", () => {
    test("入力したタスクを追加し、前後の空白を除去する", () => {
      add_task("  牛乳を買う  ");

      const task_item = get_task_items()[0];
      expect(task_item.querySelector("span").textContent).toBe("牛乳を買う");
      expect(task_item.querySelector("input[type='checkbox']")).not.toBeNull();
      expect(document.getElementById("task_input").value).toBe("");
      expect(document.activeElement).toBe(document.getElementById("task_input"));
    });

    test("空文字または空白だけの入力は追加しない", () => {
      add_task("");
      add_task("   ");

      expect(get_task_items()).toHaveLength(0);
    });
  });

  describe("タスクの削除", () => {
    test("チェックした複数のタスクを削除する", () => {
      add_task("タスク1");
      add_task("タスク2");
      add_task("タスク3");

      const task_items = get_task_items();
      change_checkbox(task_items[0].querySelector("input"), true);
      change_checkbox(task_items[2].querySelector("input"), true);
      document.getElementById("delete_button").click();

      expect(get_task_items().map((item) => item.querySelector("span").textContent)).toEqual(["タスク2"]);
      expect(document.getElementById("delete_button").style.display).toBe("none");
      expect(document.getElementById("complete_button").style.display).toBe("none");
    });

    test("チェックしたタスクがない場合の削除は何もしない", () => {
      add_task("残すタスク");
      document.getElementById("delete_button").click();

      expect(get_task_items()).toHaveLength(1);
      expect(get_task_items()[0].querySelector("span").textContent).toBe("残すタスク");
    });
  });

  describe("タスクの編集", () => {
    test("タスク名を編集して保存する", () => {
      add_task("編集前");
      get_task_items()[0].querySelector("span").click();

      const edit_form = get_task_items()[0].querySelector(".edit_form");
      const edit_input = edit_form.querySelector("input");
      edit_input.value = "  編集後  ";
      edit_form.querySelector("button").click();

      expect(get_task_items()[0].querySelector("span").textContent).toBe("編集後");
      expect(get_task_items()[0].querySelector(".edit_form")).toBeNull();
      expect(get_task_items()[0].querySelector("span").style.display).toBe("inline");
    });

    test("編集をキャンセルすると元のタスク名を保持する", () => {
      add_task("元のタスク");
      const task_item = get_task_items()[0];
      task_item.querySelector("span").click();
      const edit_form = task_item.querySelector(".edit_form");
      edit_form.querySelector("input").value = "変更しない";
      edit_form.querySelectorAll("button")[1].click();

      expect(task_item.querySelector("span").textContent).toBe("元のタスク");
      expect(task_item.querySelector(".edit_form")).toBeNull();
    });

    test("空文字の編集内容は保存せず、編集状態を維持する", () => {
      add_task("編集前");
      const task_item = get_task_items()[0];
      task_item.querySelector("span").click();
      const edit_form = task_item.querySelector(".edit_form");
      edit_form.querySelector("input").value = "   ";
      edit_form.querySelector("button").click();

      expect(task_item.querySelector("span").textContent).toBe("編集前");
      expect(task_item.querySelector(".edit_form")).not.toBeNull();
    });
  });

  describe("タスクの完了状態と選択状態", () => {
    test("チェックしたタスクを完了状態にし、未チェックのタスクは変更しない", () => {
      add_task("完了するタスク");
      add_task("未完了のタスク");
      const task_items = get_task_items();
      change_checkbox(task_items[0].querySelector("input"), true);
      document.getElementById("complete_button").click();

      expect(task_items[0].querySelector("span").style.textDecoration).toBe("line-through");
      expect(task_items[1].querySelector("span").style.textDecoration).toBe("");
    });

    test("チェックを外すと操作ボタンを非表示にする", () => {
      add_task("選択状態を切り替えるタスク");
      const checkbox = get_task_items()[0].querySelector("input");
      change_checkbox(checkbox, true);
      expect(document.getElementById("complete_button").style.display).toBe("inline-block");
      expect(document.getElementById("delete_button").style.display).toBe("inline-block");

      change_checkbox(checkbox, false);

      expect(document.getElementById("complete_button").style.display).toBe("none");
      expect(document.getElementById("delete_button").style.display).toBe("none");
    });
  });
});
