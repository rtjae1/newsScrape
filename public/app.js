$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    var newDiv = $("<div>")
      .addClass("article")
      .append(
        $("<p>")
          .attr("data-id", data[i]._id)
          .text(data[i].title)
          .addClass("title"),
        $("<p>")
          .attr("data-id", data[i]._id)
          .text(data[i].summary)
          .addClass("summary"),
        $("<a>")
          .attr("href", data[i].link)
          .text(data[i].link)
          .addClass("link"),
        $("<img>")
          .attr("src", data[i].image)
          .addClass("image"),
        $("<br /><br />")
      );

    $("#articles").append(newDiv);
  }
});

$(document).on("click", "p", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#comments").append("<h2>" + data.title + "</h2>");
    $("#comments").append("<input id='titleinput' name='title'>");
    $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#comments").append(
      "<button data-id='" +
        data._id +
        "' id='savecomment'>Save Comment</button>"
    );

    if (data.comment) {
      console.log(data.comment.title);
      console.log(data.comment.body);
      $("#titleinput").val(data.comment.title);
      $("#bodyinput").val(data.comment.body);
    }
  });
});

$(document).on("click", "#savecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
