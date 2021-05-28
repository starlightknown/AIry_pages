$(document).ready(function() {
  $("#div1").delay(1000).fadeIn(2500, function() {
    $("#div1").delay(2000).fadeOut(2500, function(mainMenu) {
      $("#div2").fadeIn(2000, function() {
        $("#hp").fadeIn(2000)
        $("#hc").delay(250).fadeIn(2000)
        $("#vm").delay(500).fadeIn(2000)
        $("#cs").delay(750).fadeIn(2000)
      })
    })
  });
});
$(".a").on("click", function(e) {
  $("#vm").fadeOut(2500)
  $("#cs").delay(250).fadeOut(2500)
  $("#hc").delay(500).fadeOut(2500)
  $("#hp").delay(750).fadeOut(2500)
  $("#div2").delay(1000).fadeOut(2500)
  if ($(e.target).is("#hp")) {
    $("#hp2").delay(3500).fadeIn(2000, function() {
      $("#hp2").delay(5000).fadeOut(2000, function() {
        $("#div2").fadeIn(2000, function() {
          $("#hp").fadeIn(2000)
          $("#hc").delay(250).fadeIn(2000)
          $("#vm").delay(500).fadeIn(2000)
          $("#cs").delay(750).fadeIn(2000)
        })
      })
    })
  }
  if ($(e.target).is("#hc")) {
    $("#hc2").delay(3500).fadeIn(2000, function() {
      $("#hc2").delay(5000).fadeOut(2000, function() {
        $("#div2").fadeIn(2000, function() {
          $("#hp").fadeIn(2000)
          $("#hc").delay(250).fadeIn(2000)
          $("#vm").delay(500).fadeIn(2000)
          $("#cs").delay(750).fadeIn(2000)
        })
      })
    })
  }
  if ($(e.target).is("#vm")) {
    $("#vm2").delay(3500).fadeIn(2000, function() {
      $("#vm2").delay(5000).fadeOut(2000, function() {
        $("#div2").fadeIn(2000, function() {
          $("#hp").fadeIn(2000)
          $("#hc").delay(250).fadeIn(2000)
          $("#vm").delay(500).fadeIn(2000)
          $("#cs").delay(750).fadeIn(2000)
        })
      })
    })
  }
  if ($(e.target).is("#cs")) {
    $("#cs2").delay(3500).fadeIn(2000, function() {
      $("#cs2").delay(2000).fadeOut(2000, function() {
        $("#csA").fadeIn(2000)
        $("#csB").delay(250).fadeIn(2000)
      })
    })
  }
  if ($(e.target).is("#csA")) {
    $("#csB").fadeOut(2000)
    $("#csA").delay(250).fadeOut(2000, function() {
      $("#div2").fadeIn(2000, function() {
        $("#hp").fadeIn(2000)
        $("#hc").delay(250).fadeIn(2000)
        $("#vm").delay(500).fadeIn(2000)
        $("#cs").delay(750).fadeIn(2000)
      })
    })
  }
  if ($(e.target).is("#csB")) {
    $("#csB").fadeOut(2000);
    $("#csA").delay(250).fadeOut(2000)
    $("#cs3").delay(3500).fadeIn(2000, function() {
      $("#cs3").delay(2000).fadeOut(2000, function() {
        $("#cs4").delay(3500).fadeIn(2000, function() {
          var audio = new Audio('https://dl.dropbox.com/s/bs640vy38tsvmk4/Hedwig%27s%20Theme.mp3');
          audio.play();
          $("#cs4").delay(3000).fadeOut(2000, function() {
            $("#div3").delay(3000).fadeIn(5000)
          })
        })
      })
    })
  }
});