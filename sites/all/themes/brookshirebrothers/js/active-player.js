$( document ).ready(function() {
  removeSelected();
  $("#player-window-bg iframe").attr("src", $.trim($(".views-row-1 .views-field-field-webisode-embed-code").html()) + "?autoplay=0");
  $(".views-row-1").addClass("selected");

  $(".webisodes-list .views-row a").on("click", function () {
    removeSelected();
    var ref = $(this);
    $("#player-window-bg iframe").attr("src", $.trim($(this).parent().find(".views-field-field-webisode-embed-code").html()) + "?autoplay=1");
    ref.parent().addClass("selected");
  });

  $("a.overlay-link").hover(function () {
    $(this).parent().addClass("hover");
  }, function () {
    $(this).parent().removeClass("hover");
  });

});

(function ($) {
  $(document).ajaxComplete(function () {
    removeSelected();
    $("#player-window-bg iframe").attr("src", $.trim($(".views-row-1 .views-field-field-webisode-embed-code").html()) + "?autoplay=1");
    $(".views-row-1").addClass("selected");
  });

  $(document).on("click", ".webisodes-list .views-row a", function () {
    removeSelected();
    var ref = $(this);
    $("#player-window-bg iframe").attr("src", $.trim($(this).parent().find(".views-field-field-webisode-embed-code").html()) + "?autoplay=1");
    ref.parent().addClass("selected");
  });

  $(document).on({
    mouseenter: function () {
      $(this).parent().addClass("hover");
    },
    mouseleave: function () {
      $(this).parent().removeClass("hover");
    }
  }, "a.overlay-link");

}(jQuery));

function removeSelected() {
  $(".view-content .views-row").removeClass("selected");
}