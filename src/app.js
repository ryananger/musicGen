$(document).ready(function () {
  var $head = $('<h1>musicGen</h1>');

  // key select
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

  // tempo set
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

  // button
  var $button = $('<button id="button">Play!</button>');

  $button.on('click', function() {
    if (playing) {
      stop();
      reset();

      $button.html('Play!');
    } else {
      play();
    }
  });

  // info
  var defaultInfo = function (key, tempo) {
    return 'Press PLAY to hear a randomly generated song in the key of ' + key + ', with a tempo of ' + tempo + '.<br><br>';
  };

  var $info = $('<div id="info">' + defaultInfo(song.key, tempo) + '</div><br>');
  $info.css('height', '50px');

  var updateInfo = function() {
    $info.html('Playing ' + song.structure[currentSection] + ' in ' + song.name + ', in the key of ' + song.key + ' with a tempo of ' + tempo + '.<br><br>' + time.print());
  }

  var $currentSong = $('<div id="currentSong" style="height: 100px; display: block"></div>');

  setSongDiv = function(song) {
    $currentSong.html('<br><h2 style="margin: 0px">' + song.name +
                      '</h2><p style="margin: 4px">Key: ' + song.key + '\xa0 \xa0' + 'Tempo: ' + song.tempo +
                      '\xa0 \xa0 Verse: ' + song.progression.verse + '\xa0 \xa0 Chorus: ' + song.progression.chorus + '\xa0 \xa0 Bridge: ' + song.progression.bridge)
  };

  toggleSongDiv = function() {
    if (playing === false) {
      $currentSong.html('');
    } else if (playing === true) {
      setSongDiv(song);
    }
  };

  // songList
  var $songList = $('<br><div id="songList" style="padding: 10px; max-height: 400px"></div>');

  var songDiv = function() {
    var $song = $('<div class="song" id="' + song.name + '" style="height: 10px; padding: 10px"></div>');

    $song.html(song.name);
    $song.on('click', function() {
      stop();
      for (var i = 0; i < songs.length; i++) {
        if (songs[i].name == this.id) {
          song = songs[i];
        }
      }
      reset(song);
      play();
    });

    $song.appendTo($songList);
  };

  $head.appendTo(document.body);
  $info.appendTo(document.body);
  $currentSong.appendTo(document.body);
  $key.appendTo(document.body);
  $tempoIn.appendTo(document.body);
  $tempoButton.appendTo(document.body);
  $button.appendTo(document.body);
  $songList.appendTo(document.body);

  // reset
  reset = function(input) {
    song = input || new Song();

    if (!input) {
      songs.push(song);
      songDiv();
    }

    currentChord = 0;
    currentSection = 0;
    $tempoIn.val(song.tempo);
    tempo = song.tempo;
    $key.val(song.key);
  };

  // play
  play = function() {
    setTimeout(function() {
      time.reset();
      tempo = song.tempo;
      tick = 0;
      playing = true;
      toggleSongDiv();

      var run = setInterval(function() {
        timeCount();
        playSong();
        updateInfo();

        tick++;
      }, 60000/tempo/32);
    }, 2000);

    $button.html('Stop');
    $info.html('Playing ' + song.name + '.<br><br>' + time.print());

    console.log(song);
  };

  // stop
  stop = function() {
    var highestIntervalId = setInterval(";");
    for (let i = 0 ; i < highestIntervalId ; i++) {
        clearInterval(i);
    };

    playing = false;

    $info.html(defaultInfo(song.key, tempo));
    toggleSongDiv();
    time.reset();
    tick = 0;
  };

  for (var i = 0; i < 10; i++) {
    reset();
  }
});
