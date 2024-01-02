$(document).ready(function () {
  //HOMEタブをクリック
  $("#home").on("click", function () {
    window.location.href = "/todolist/task";
  });
  $("#todolist").on("click", function () {
    window.location.href = "/todolist/task";
  });
  $("#diary").on("click", function () {
    window.location.href = "/diary";
  });
});
