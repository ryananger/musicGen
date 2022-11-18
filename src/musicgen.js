var base = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var tick = 0;
var tempo = Math.floor(Math.random() * 120) + 60;
var currentChord = 0;
var currentSection = 0;
var progLength = 4;
var playing = false;
var play, stop, reset;
var songs = [];
var toggleSongDiv;
var setSongDiv;
var rhythm = 'arpeggio2';
var rhythms = [
               'whole',
               'rocking',
               'arpeggio1',
               'quarter',
               'bubble',
               'tresillo',
               'tresillo8ths',
               'arpeggio2'
              ];

// var stereo = new Tone.StereoWidener(1);
// stereo.toDestination();

var piano = SampleLibrary.load({
  instruments: "piano"
});

piano.toDestination();
piano.volume.value = -12;

var cello = SampleLibrary.load({
  instruments: "cello"
});

cello.toDestination();
cello.volume.value = -16;

var celloOn = false;

var velocityOn = true;
var velocity = function(min) {
  if (!velocityOn) {
    return 1;
  }

  var min = min || 0.5;
  var val = min + (Math.random() * (1 - min));

  return val;
}

var buffers = [];

var time = {
  measure: 1,
  whole: 1,
  half: 1,
  quarter: 1,
  eighth: 1,
  sixteenth: 1,
  print: function() {
    var digit = '';

    if (time.sixteenth < 10) {
      digit = '0';
    }

    return time.measure + '.' + time.whole + '.' + time.quarter + '.' + time.eighth + '.' + digit + time.sixteenth;
  },
  reset: function() {
    for (var key in time) {
      if (key != 'print' && key != 'reset') {
        time[key] = 0;
      }
    };

    time.measure = 1;
  }
};

var onWhole, onQuarter, onEighth, onSixteenth;

// initializes array containing all possible notes
var allNotes = function() {
  all = [];

  for (var i = 0; i < base.length; i++) {
    var note = base[i];

    if (i !== 0 && i !== 3) {
      all.push({note: base[i] + 'b', position: all.length});
    }

    all.push({note: note, position: all.length});
  }

  all.forEach(function(entry) {
      var i = 1;
      var note = entry.note;

      var bufferPush = function(i) {
        if (i === 1 || i === 4) {
          buffers.push(new Tone.Buffer('./samples/piano/' + note + i + '.mp3', function(res) {
            console.log('bufferLoad >> piano ' + note, i);
          }))
        }

        if (i === 3) {
          buffers.push(new Tone.Buffer('./samples/cello/' + note + '1.mp3', function(res) {
            console.log('bufferLoad >> cello ' + note, 1);
          }))
        }

        if (i < 7) {
          bufferPush(i + 1);
        }
      }

      bufferPush(i);
    }
  )
}();

// returns notes in a given key (will later add color note functionality)
var notesInKey = function(key) {
  var notes = [];
  var rootIndex = function() {
    for (var i = 0; i < all.length; i++) {
      if (all[i].note === key) {
        return i;
      }
    }
  }();

  for (var i = 0; i < 12; i++) {
    if (i == 0 || i == 2 || i == 4 || i == 5 || i == 7 || i == 9 || i == 11) {
      if (rootIndex + i < 12) {
        notes.push({note: all[rootIndex + i].note, position: rootIndex + i})
      } else {
        notes.push({note: all[rootIndex + i - 12].note, position: rootIndex + i - 12});
      }
    }
  }

  return notes;
};

var song = new Song();

var playSong = function() {
  tempo = song.tempo;
  Tone.Transport.bpm.value = tempo;

  if (currentSection < song.structure.length) {
    var cur = song.structure[currentSection];

    if (song.structure[currentSection] == song.structure[currentSection - 1]) {
      var chk = rhythms.indexOf(song.rhythms[cur]);
      rhythm = chk + 1 < rhythms.length ? rhythms[chk + 1] : rhythms[0];
    } else {
      rhythm = song.rhythms[cur];
    }

    playSection(cur);

    if (time.measure % 2 == 0 && time.whole == 4 && time.sixteenth == 16 && onSixteenth) {
      currentSection++;
    }
  } else {
    currentSection = 0;
    stop();
    reset();
    play();
  }

}

var playSection = function(section) {
  //currentChord is chord index in progression array, cur is chord number to be played.
  var cur = song.progression[section][currentChord];

  var playCurrent = function() {
    if (playing) {
      var notesInCurrent = song.chords['c' + cur].notes;
      var temp = [];

      notesInCurrent.forEach(function(element) {
        temp.push(song.notes[element].position);
      });

      temp.sort(function(a, b) {
        return a - b;
      });

      playRhythm(cur, temp);
    } else {
      playing = true;
    }
  }

  playCurrent();
}

var octaveBass = function(note) {
  piano.triggerAttackRelease(note + '1', '1n');
  //piano.triggerAttackRelease(note + '3', '1n');
};

var playRhythm = function(num, notesInChord) {
  var notes = notesInChord.map(function(note) {
    return all[note].note;
  });

  var root = song.notes[num - 1].note;

  if (onWhole) {
    console.log(root, num, notes)

    if (rhythm !== 'whole') {
      octaveBass(root);
    }

    if (celloOn) {
      cello.triggerAttackRelease(root + '1', '1n');
    }
  }

  switch (rhythm) {
    case 'whole':
      if (onWhole) {
        song.chords['c' + num].play();

        currentChord++;
        if (currentChord >= progLength) {
          currentChord = 0;
        }
      }
      break;
    case 'quarter':
      if (onQuarter) {
        song.chords['c' + num].play();

        if (time.quarter == 4) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
    case 'rocking':
      if (onEighth) {
        switch (time.eighth) {
          case 1:
          case 3:
          case 5:
          case 7:
            piano.triggerAttackRelease(notes[1] + '4', '2n', '+' + (Math.random() * 0.01), velocity());
            piano.triggerAttackRelease(notes[2] + '4', '2n', '+' + (Math.random() * 0.01), velocity());
            break;
          case 2:
          case 4:
          case 6:
          case 8:
            piano.triggerAttackRelease(notes[0] + '4', '2n', '+' + (Math.random() * 0.01), velocity());
            break;
        }

        if (time.eighth == 8) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
    case 'bubble':
      if (onEighth) {
        switch (time.eighth) {
          case 1:
            piano.triggerAttackRelease(notes[0] + '4', '1n', '+' + (Math.random() * 0.02), velocity());
            piano.triggerAttackRelease(notes[1] + '4', '1n', '+' + (Math.random() * 0.02), velocity());
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.02), velocity());
            break;
          case 2:
            piano.triggerAttackRelease(notes[0] + '4', '2n', '+' + (Math.random() * 0.02), velocity());
            break;
          case 5:
            piano.triggerAttackRelease(notes[0] + '4', '2n', '+' + (Math.random() * 0.02), velocity());
            break;
          case 4:
          case 7:
            piano.triggerAttackRelease(notes[1] + '4', '2n', '+' + (Math.random() * 0.02), velocity());
            piano.triggerAttackRelease(notes[2] + '4', '2n', '+' + (Math.random() * 0.02), velocity());
            break;
          case 8:
            piano.triggerAttackRelease(notes[1] + '4', '2n', '+' + (Math.random() * 0.02), velocity());
            break;
        }

        if (time.eighth == 8) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
    case 'tresillo':
      if (onEighth) {
        if (time.eighth == 1 || time.eighth == 4 || time.eighth == 7) {
          song.chords['c' + num].play();

          if (time.eighth == 7) {
            currentChord++;
            if (currentChord >= progLength) {
              currentChord = 0;
            }
          }
        }
      }
      break;
    case 'tresillo8ths':
      if (onEighth) {
        piano.triggerAttackRelease(notes[0] + '4', '4n', '+' + (Math.random() * 0.01), velocity(0.3));

        switch (time.eighth) {
          case 1:
          case 4:
          case 7:
            piano.triggerAttackRelease(notes[1] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.8));
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.8));
            break;
        }

        if (time.eighth == 8) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
    case 'arpeggio1':
      if (onEighth) {
        switch (time.eighth) {
          case 1:
            piano.triggerAttackRelease(notes[1] + '4', '1n', '+' + (Math.random() * 0.01), velocity(0.2));
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.01), velocity(0.2));
          case 5:
            piano.triggerAttackRelease(notes[0] + '4', '1n', '+' + (Math.random() * 0.01), velocity(0.2));
            break;
          case 2:
          case 4:
          case 6:
          case 8:
            piano.triggerAttackRelease(notes[1] + '4', '1n', '+' + (Math.random() * 0.01), velocity(0.2));
            break;
          case 3:
          case 7:
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.01), velocity(0.2));
            break;
        }

        if (time.eighth == 8) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
    case 'arpeggio2':
      if (onEighth) {
        switch (time.eighth) {
          case 1:
          case 4:
          case 7:
            piano.triggerAttackRelease(notes[0] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.2));
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.2));
            break;
          case 2:
          case 5:
          case 8:
            piano.triggerAttackRelease(notes[1] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.2));
            break;
          case 3:
          case 6:
            piano.triggerAttackRelease(notes[2] + '4', '1n', '+' + (Math.random() * 0.02), velocity(0.2));
            break;
        }

        if (time.eighth == 8) {
          currentChord++;
          if (currentChord >= progLength) {
            currentChord = 0;
          }
        }
      }
      break;
  }
}

var timeCount = function() {
  if (tick == 0 || tick % 128 == 0) {
    onWhole = true;
    time.whole++;
    if (time.whole > 4) {
      time.whole = 1;
      time.measure++;
    }
  } else {
    onWhole = false;
  }

  if (tick % 64 == 0) {
    time.half++;
    if (time.half > 2) {
      time.half = 1;
    }
  }

  if (tick % 32 == 0) {
    onQuarter = true;
    time.quarter++;
    if (time.quarter > 4) {
      time.quarter = 1;
    }
  } else {
    onQuarter = false;
  }

  if (tick % 16 == 0) {
    onEighth = true;
    time.eighth++;
    if (time.eighth > 8) {
      time.eighth = 1;
    }
  } else {
    onEighth = false;
  }

  if (tick % 8 == 0) {
    onSixteenth = true;
    time.sixteenth++;
    if (time.sixteenth > 16) {
      time.sixteenth = 1;
    }
  } else {
    onSixteenth = false;
  }
};