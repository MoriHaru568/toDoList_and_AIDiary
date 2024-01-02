$(document).ready(function () {
  var selectedDateCell = null;

  $("#calendar-cell").on("click", "#calendar-body td", function () {
    //年月日を取得
    var diaryMonthYear = $("#calendar-month-year").text().split(" ");
    var diaryYear = diaryMonthYear[1];
    var diaryMonth = diaryMonthYear[0].replace(/[^0-9]/g, "");
    var diaryDay = $(this).text();
    var formatted_date = `${diaryYear}-${diaryMonth
      .toString()
      .padStart(2, "0")}-${diaryDay.toString().padStart(2, "0")}`;
    // 以前に選択された日付がある場合、スタイルを解除
    if (selectedDateCell) {
      selectedDateCell.removeClass("selected-date");
    }
    // クリックされた日付セルに新しいスタイルを適用
    $(this).addClass("selected-date");
    // 選択された日付を更新
    selectedDateCell = $(this);
    data = {
      //form内inputの値、リクエスト(POST or GET),リクエスト先のURLを記述
      diary_year: diaryYear,
      diary_month: diaryMonth,
      diary_day: diaryDay,
      formatted_date: formatted_date,
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/diary/select_day",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      $("#chat-area").html(response);
    });
  });
  //送信ボタンの活性/非活性制御
  $("#diary-comment").on("input", function () {
    var diaryComment = $(this).val();
    var $submitbtn = $("#submit-btn");

    // タスク名が空でない場合、ボタンの色を変更
    if (diaryComment.trim() !== "") {
      $("#submit").addClass("active-button");
      $submitbtn.prop("disabled", false);
    } else {
      $("#submit").removeClass("active-button");
      $submitbtn.prop("disabled", true);
    }
  });
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

  //カレンダー作成
  generateCalendar();
  $("#submit-btn").on("click", function (event) {
    var diaryMonthYear = $("#calendar-month-year").text().split(" ");
    var diaryYear = diaryMonthYear[1];
    var diaryMonth = diaryMonthYear[0].replace(/[^0-9]/g, "");
    var diaryDay = $(".selected-date").text();
    console.log(diaryDay);
    var formatted_date = `${diaryYear}-${diaryMonth
      .toString()
      .padStart(2, "0")}-${diaryDay.toString().padStart(2, "0")}`;
    data = {
      //form内inputの値、リクエスト(POST or GET),リクエスト先のURLを記述
      diarycomment: $("#diary-comment").val(),
      diary_year: diaryYear,
      diary_month: diaryMonth,
      diary_day: diaryDay,
      formatted_date: formatted_date,
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/diary/chat",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      $("#chat-area").html(response);
      $("#diary-comment").val("");
      $("#submit-btn").removeClass("active-button");
      $("#add_task").prop("disabled", true);
    });
    event.preventDefault();
  });
  previousMonth();
  nextMonth();
});

let currentDate = new Date(); // currentDate をグローバル変数として宣言

function generateCalendar() {
  const calendarBody = $("#calendar-body")[0];
  const calendarMonthYear = $("#calendar-month-year")[0];
  calendarBody.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  calendarMonthYear.textContent = `${month + 1}月 ${year}`;
  let isMonthEnded = false; // 月の最終日までのセルが生成されたかどうかを追跡するフラグ
  let dateCounter = 1;
  for (let i = 0; i < 6; i++) {
    if (isMonthEnded) {
      break; // 月の最終日に到達したら処理を終了
    }
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstDay.getDay()) {
        // 前月の日付
        cell.textContent = "";
      } else if (dateCounter > lastDay.getDate()) {
        // 来月の日付
        cell.textContent = "";
      } else {
        cell.textContent = dateCounter;
        dateCounter++;
      }

      row.appendChild(cell);
      if (dateCounter > lastDay.getDate()) {
        isMonthEnded = true; // 月の最終日に到達したらフラグを立てる
      }
    }

    calendarBody.appendChild(row);
  }
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
}
