$(document).ready(function () {
  var $head = $('<h1>musicGen</h1>');
  var $key = $('<select id="keys"></select>');

  for (var i = 0; i < all.length; i++) {
    var option = $('<option value="' + all[i].note + '">' + all[i].note + '</option>');
    option.appendTo($key);
  };

  $key.val(song.key);
  $key.on('change', function() {
    var selectedKey = $key.find('option:selected').val();

    song.key = selectedKey;
    song.notes = notesInKey(selectedKey);

    if (!playing) {
      $info.html(defaultInfo(song.key, tempo))
    }
  });

  var $tempoButton = $('<button id="tempo">Set Tempo</button>');
  var $tempoIn = $('<input id="tempo" value=""></input>');
  $tempoIn.val(tempo);
  $tempoIn.on('keypress', function(event) {
    if (event.key == 'Enter') {
      tempoSet();
    }
  });

  $tempoButton.on('click', function() {
    tempoSet();
  });

  var tempoSet = function() {
    var chk = $tempoIn.val();

    if (chk >= 40 && chk <= 240) {
      tempo = $tempoIn.val();
      if (playing) {
        stop();
        play();
        currentChord = 0;
      } else {
        $info.html(defaultInfo(song.key, tempo))
      }
    } else {
      alert('Invalid tempo! Enter a number between 40 and 240.');
    }
  }

  var $button = $('<button id="button">Play!</button>');

  var defaultInfo = function (key, tempo) {
    return 'Press PLAY to hear a randomly generated song in the key of ' + key + ', with a tempo of ' + tempo + '.<br><br>';
  };

  var $info = $('<div id="info">' + defaultInfo(song.key, tempo) + '</div><br>');
  $info.css('height', '50px');

  var $songList = $('<br><div id="songList" style="padding: 10px"></div>');

  $head.appendTo(document.body);
  $info.appendTo(document.body);
  $key.appendTo(document.body);
  $tempoIn.appendTo(document.body);
  $tempoButton.appendTo(document.body);
  $button.appendTo(document.body);
  $songList.appendTo(document.body);

  $button.on('click', function() {
    if (playing) {
      reset();

      $button.html('Play!');
    } else {
      play();
    }
  });

  reset = function() {
    song = new Song();

    songs.push(song);

    $tempoIn.val(song.tempo);

    var $song = $('<div class="song" id="' + song.name + '" style="height: 10px; padding: 10px"></div>');

    $song.html(song.name);
    $song.on('click', function() {
      stop();
      for (var i = 0; i < songs.length; i++) {
        if (songs[i].name == this.id) {
          song = songs[i];
        }
      }
      $key.val(song.key);
      $tempoIn.val(song.tempo);
      tempo = song.tempo;
      play();
    });

    $song.appendTo($songList);

    stop();
  }

  play = function() {
    $button.html('Stop');

    console.log(song);
    $info.html('Playing ' + song.structure[currentSection] + ' in ' + song.name + ', in the key of ' + song.key + ' with a tempo of ' + tempo + '.<br><br>' + time.print());

    setTimeout(function() {
      time.reset();
      tempo = song.tempo;
      tick = 0;
      playing = true;

      var run = setInterval(function() {
        timeCount();
        playSong();

        $info.html('Playing ' + song.structure[currentSection] + ' in ' + song.name + ', in the key of ' + song.key + ' with a tempo of ' + tempo + '.<br><br>' + time.print());

        tick++;
      }, 60000/tempo/32);
    }, 1000);
  };

  stop = function() {
    playing = false;
    var highestIntervalId = setInterval(";");
    for (let i = 0 ; i < highestIntervalId ; i++) {
        clearInterval(i);
    };

    $info.html(defaultInfo(song.key, tempo));
    time.reset();
    tick = 0;
  };

  for (var i = 0; i < 3; i++) {
    reset();
  }
});
