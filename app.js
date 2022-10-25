$(document).ready(function () {
  var $head = $('<h1>musicGen</h1>');
  var $key = $('<select id="keys"></select>');

  for (let i = 0; i < all.length; i++) {
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

  $head.appendTo(document.body);
  $info.appendTo(document.body);
  $key.appendTo(document.body);
  $tempoIn.appendTo(document.body);
  $tempoButton.appendTo(document.body);
  $button.appendTo(document.body);

  $button.on('click', function() {
    if (playing) {
      stop();

      $info.html(defaultInfo(song.key, tempo));
      playing = false;

      $button.html('Play!');
    } else {
      tempo = $tempoIn.val();
      currentChord = 0;
      currentSection = 0;
      song.first = -1;
      song.rhythms = {verse: '', chorus: '', bridge: ''};

      song.progression.verse = getProgression();
      song.progression.chorus = getProgression();
      song.progression.bridge = getProgression();
      playing = true;
      play();

      console.log(song);
      $button.html('Stop');
    }
  });

  var play = function() {
    setTimeout(function() {
      time.reset();

      var run = setInterval(function() {
        timeCount();
        playSong();

        var section = song.structure[currentSection];
        $info.html('Playing the ' + section + ' progression (' + song.progression[section] + '), in the key of ' + song.key + ' with a tempo of ' + tempo + '.<br><br>' + time.print());

        tick++;
      }, 60000/tempo/32);
    }, 1000);
  };

  var stop = function() {
    var highestIntervalId = setInterval(";");
    for (let i = 0 ; i < highestIntervalId ; i++) {
        clearInterval(i);
    };

    tick = 0;
  };
});
