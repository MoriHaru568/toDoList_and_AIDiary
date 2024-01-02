$(document).ready(function () {
  //タブをクリック
  $(".nav-link").on("click", function (event) {
    var tabId = $(this).attr("id");
    $(this).addClass("active");
    // 他のタブからactiveクラスを削除
    $(".nav-link").not(this).removeClass("active");
    data = {
      //form内inputの値、リクエスト(POST or GET),リクエスト先のURLを記述
      selectedTabId: tabId,
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/todolist/task",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      $("#task_list").html(response);
    });
    event.preventDefault();
  });
  //送信ボタンをクリック
  $("#add_task").on("click", function (event) {
    var selectedTabId = $(".nav-link.active").attr("id");
    data = {
      //form内inputの値、リクエスト(POST or GET),リクエスト先のURLを記述
      taskName: $("#taskName").val(),
      taskContent: $("#taskContent").val(),
      category: selectedTabId,
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/todolist/task",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      $("#task_list").html(response);
      $("#taskName").val("");
      $("#taskContent").val("");
      $("#addIcon").removeClass("active-button");
      $("#add_task").prop("disabled", true);
    });
    event.preventDefault();
  });
  //削除ボタンをクリック
  $(".trashbutton").on("click", function (event) {
    var trashId = $(this).attr("id");
    var index = trashId.split("-")[1];
    var title = $("#task-" + index).text();
    var selectedTabId = $(".nav-link.active").attr("id");
    data = {
      //form内inputの値、リクエスト(POST or GET),リクエスト先のURLを記述
      taskName: title,
      category: selectedTabId,
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/todolist/delete_task",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      $("#task_list").html(response);
    });
    event.preventDefault();
  });

  // チェックボックス入力時の取り消し線
  $('input[type="checkbox"]').on("change", function () {
    var label = $(this).siblings("label");
    if ($(this).is(":checked")) {
      label.css("text-decoration", "line-through");
    } else {
      label.css("text-decoration", "none");
    }
  });

  $("#taskName").on("input", function () {
    var taskName = $(this).val();
    var $addTask = $("#add_task");

    // タスク名が空でない場合、ボタンの色を変更
    if (taskName.trim() !== "") {
      $("#addIcon").addClass("active-button");
      $addTask.prop("disabled", false);
    } else {
      $("#addIcon").removeClass("active-button");
      $addTask.prop("disabled", true);
    }
  });
});
