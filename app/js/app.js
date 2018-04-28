(function ($) {
  //code here 
  var move_left,
    move_right,
    move_top,
    move_bottom,
    $road = $('.road'),
    $car = $('#hero'),
    $opp1 = $('#opp1'),
    $opp2 = $('#opp2'),
    $opp3 = $('#opp3'),
    $opp4 = $('#opp4'),
    game_over = false,
    $tyre = $('.tyre').first(),
    $audioPlayer = $('#audioPlayer')
    ;

  // sound variables
  var sounds = {
    start: './app/sounds/start.mp3',
    running: './app/sounds/running.MP3',
    gameOver: './app/sounds/game_over.mp3'
  }
  var the_loop;

  var speed = 2;
  var score = 1;
  var car_speed = 5;
  var line_speed = 5;

$('.js-btn-start').on('click', function() {
  $('.start-div').fadeOut();
  playAudio(sounds.start);
  setTimeout(start_game, 4500);
});

$('.js-btn-restart').on('click', function() {
  $('.restart-div').fadeOut();
  setTimeout(restart_game, 300);
})

function start_game() {

  playAudio(sounds.running);

  $(document).on('keydown', function (e) {
    if (!game_over) {
      if (e.keyCode == 37 && !move_left) {
        move_left = requestAnimationFrame(left);
      } else if (e.keyCode == 38 && !move_top) {
        move_top = requestAnimationFrame(top);
      } else if (e.keyCode == 39 && !move_right) {
        move_right = requestAnimationFrame(right);
      } else if (e.keyCode == 40 && !move_bottom) {
        move_bottom = requestAnimationFrame(bottom)
      }
    }
  });

  $(document).on('keyup', function (e) {
    if (!game_over) {
      if (e.keyCode == 37) {
        cancelAnimationFrame(move_left);
        move_left = false;
      } else if (e.keyCode == 38) {
        cancelAnimationFrame(move_top);
        move_top = false;
      } else if (e.keyCode == 39) {
        cancelAnimationFrame(move_right);
        move_right = false;
      } else if (e.keyCode == 40) {
        cancelAnimationFrame(move_bottom);
        move_bottom = false;
      }
    }
  });


  the_loop = requestAnimationFrame(loop);

}

  

  function left() {
    if (!game_over && ((parseInt($car.css('left')) - $tyre.width() ) > 5)) {
      $car.css({ 'left': parseInt($car.css('left')) - car_speed });
      move_left = requestAnimationFrame(left)
    }    
  }

  function right() {
    if (!game_over && ((parseInt($car.css('left')) + $tyre.width()) < $road.width() - $car.width() - 5)) {
      $car.css({ 'left': parseInt($car.css('left')) + car_speed });
      move_right = requestAnimationFrame(right)
    }
  }

  function bottom() {
    if (!game_over && (parseInt($car.css('top')) < $road.height() - $car.height() - 5)) {
      $car.css({ 'top': parseInt($car.css('top')) + car_speed });
      move_bottom = requestAnimationFrame(bottom);
    }
  }
  function top() {
    if (!game_over && (parseInt($car.css('top')) > $road.height() / 3)) {
      $car.css({ 'top': parseInt($car.css('top')) - car_speed });
      move_top = requestAnimationFrame(top);
    }
  }


  function loop() {

    if (collision($car, $opp1) || collision($car, $opp2) || collision($car, $opp3) || collision($car, $opp4)) {
      // console.log('game over');
      stop_game();
      return;
    }

    // score multiplier
    score++;

    if(score % 10 == 0) {
      $('.score').text( parseInt( $('.score').text()) + 1 );
    }

    if (score % 1000 == 0) {
      speed++;
      line_speed++;
    }

    if(score % 2000 == 0) {
      car_speed++;
    }

    line_drop($('#line1'));
    line_drop($('#line2'));
    line_drop($('#line3'));

    car_drop($('#opp1'));
    car_drop($('#opp2'));
    car_drop($('#opp3'));
    car_drop($('#opp4'));

    the_loop = requestAnimationFrame(loop);
  }

  function car_drop(car) {
    var current_car_top = parseInt( car.css('top') );
    if(current_car_top > $road.height()) {
      current_car_top = -200;
      var car_left = parseInt (Math.random() * ($road.width() - $car.width()) );
      console.log(car_left)
      car.css('left', car_left);
    }
    car.css('top', current_car_top + speed);
  }

  function line_drop(line) {
    var current_line_top = parseInt(line.css('top'));
    if (current_line_top > $road.height()) {
      current_line_top = -300;
    }
    line.css('top', current_line_top + line_speed);
  }

  function stop_game() {
    game_over = true;
    cancelAnimationFrame(the_loop);
    cancelAnimationFrame(move_left);
    cancelAnimationFrame(move_right);
    cancelAnimationFrame(move_top);
    cancelAnimationFrame(move_bottom);

    // restart pop up
    $('.restart-div').show();
    $('.js-score-display').html("Score: " + $('.score').html())
    playAudio(sounds.gameOver);
    blink($('.gameover'));
  }

  function restart_game() {
    game_over = false;
    $('.score').html('1');

    // setup
    $opp1.css('top', '10%');
    $opp2.css('top', '35%');
    $opp3.css('top', '50%');
    $opp4.css('top', '-20%');
    $car.css({'top': '90%', left: '40%'})
    

    speed = 2;
    score = 1;
    car_speed = 5;
    line_speed = 5;

    playAudio(sounds.start);
    setTimeout(start_game, 4500);
  }

  function playAudio(src) {
    if(src == sounds.running) {
      $audioPlayer.attr('loop', '');  
    } else {
      $audioPlayer.removeAttr('loop');  
    }
    $audioPlayer.attr('src', src);
  }

  // blink fubction
  function blink(target) {
    $('.gameover').fadeOut(1000);
    $('.gameover').fadeIn(1000);
    // blink();
  }
  setInterval(blink, 2000);


  // Collision function
  function collision($obj1, $obj2) {
    var x1 = $obj1.offset().left;
    var y1 = $obj1.offset().top;
    var h1 = $obj1.outerHeight(true);
    var w1 = $obj1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = w1 + x1;

    var x2 = $obj2.offset().left;
    var y2 = $obj2.offset().top;
    var h2 = $obj2.outerHeight(true);
    var w2 = $obj2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = w2 + x2;
    
    // detect collition

    if (b1 < y2 || y1 > b2 ||  r1 < x2 ||x1 > r2) {
      return false;
    }
    return true;
  }
  $(window).on('load', function() {
    $('.loader').hide()
  })
})(jQuery)