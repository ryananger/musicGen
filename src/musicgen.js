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
var rhythms = ['whole',
               'rocking',
               'arpeggio1',
               'quarter',
               'bubble',
               'tresillo',
               'tresillo8ths',
               'arpeggio2'];

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
    all.push({note: base[i], position: all.length});
    if (i !== 2 && i !== 6) {
      all.push({note: base[i] + '#', position: all.length});
    }
  }
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
        notes.push({note: all[rootIndex + i].note, audio: rootIndex + i})
      } else {
        notes.push({note: all[rootIndex + i - 12].note, audio: rootIndex + i - 12});
      }
    }
  }

  return notes;
};

var song = new Song();

var playSong = function() {
  tempo = song.tempo;

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
        temp.push(song.notes[element].audio);
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

var playRhythm = function(num, notesInChord) {
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
            audio[notesInChord[1]].play();
            audio[notesInChord[2]].play();
            break;
          case 2:
          case 4:
          case 6:
          case 8:
            audio[notesInChord[0]].play();
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
            audio[notesInChord[0]].play();
            audio[notesInChord[1]].play();
            audio[notesInChord[2]].play();
            break;
          case 2:
            audio[notesInChord[0]].play();
            break;
          case 5:
            audio[notesInChord[0]].play();
            break;
          case 4:
          case 7:
            audio[notesInChord[1]].play();
            audio[notesInChord[2]].play();
            break;
          case 8:
            audio[notesInChord[1]].play();
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
        audio[notesInChord[0]].play();

        switch (time.eighth) {
          case 1:
          case 4:
          case 7:
            audio[notesInChord[1]].play();
            audio[notesInChord[2]].play();
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
            audio[notesInChord[1]].play();
            audio[notesInChord[2]].play();
          case 5:
            audio[notesInChord[0]].play();
            break;
          case 2:
          case 4:
          case 6:
          case 8:
            audio[notesInChord[1]].play();
            break;
          case 3:
          case 7:
            audio[notesInChord[2]].play();
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
            audio[notesInChord[0]].play();
            audio[notesInChord[2]].play();
            break;
          case 2:
          case 5:
          case 8:
            audio[notesInChord[1]].play();
            break;
          case 3:
          case 6:
            audio[notesInChord[2]].play();
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

var playScale = function() {
  if (playing) {
    playing = false;
  }

  setTimeout(function() {
    audio[song.notes[0].audio].play();
  }, 0)

  setTimeout(function() {
    audio[song.notes[1].audio].play();
  }, 250)

  setTimeout(function() {
    audio[song.notes[2].audio].play();
  }, 500)

  setTimeout(function() {
    audio[song.notes[3].audio].play();
  }, 750)

  setTimeout(function() {
    audio[song.notes[4].audio].play();
  }, 1000)

  setTimeout(function() {
    audio[song.notes[5].audio].play();
  }, 1250)

  setTimeout(function() {
    audio[song.notes[6].audio].play();
  }, 1500)

  setTimeout(function() {
    audio[song.notes[0].audio].play();
  }, 1750)

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