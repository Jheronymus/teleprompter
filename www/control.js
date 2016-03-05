$(function () {
  var $speed = $('.speed');
  var $speedIndicator = $('.speed__indicator');
  var $play = $('.play');
  var $back = $('.back');
  var down = false;
  var speed = 0;

  setSpeed(0.5);

  function postEvent(body) {
    return fetch('events', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(function (response) {
        console.log('SUCCESS:', response);
      }, function (error) {
        console.log('FAILURE:', error);
      });
  }

  function updateSpeed(event) {
    var pct = event.clientX / $speed.outerWidth();

    setSpeed(pct);
  }

  function setSpeed(normal) {
    var left = normal * 100 + '%';

    $speedIndicator.css('left', left);
    speed = Math.pow(normal, 2);

    if (!$play.hasClass('paused')) {
      postEvent({ type: 'speed', speed: speed });
    }
  }

  $speed.mousedown(function (e) {
    e.preventDefault();

    updateSpeed(e);

    down = true;
  });

  $(document).mouseup(function (e) {
    e.preventDefault();

    down = false;
  })

  $(document).mousemove(function (e) {
    e.preventDefault();

    if (down) {
      updateSpeed(e);
    }
  });

  $speed.bind('touchstart', function (e) {
    e.preventDefault();

    updateSpeed(e.changedTouches[0]);
  });

  $speed.bind('touchmove', function (e) {
    e.preventDefault();

    updateSpeed(e.changedTouches[0]);
  });

  $play.click(function (e) {
    $play.toggleClass('paused');

    if ($play.hasClass('paused')) {
      postEvent({ type: 'speed', speed: 0 });
    } else {
      postEvent({ type: 'speed', speed: speed });
    }
  });

  $back.click(function (e) {
    postEvent({ type: 'position', y: 0 });
  });
});