class Song {
  constructor () {
    this.name = generateName();

    this.key = all[Math.floor(Math.random() * all.length)].note;
    this.notes = notesInKey(this.key);
    this.chords = {};
    this.first = -1;
    this.progression = {verse: '', chorus: '', bridge: ''};
    this.structure = ['verse', 'verse', 'chorus', 'verse', 'verse', 'chorus', 'chorus', 'bridge', 'chorus'];
    this.rhythms = {verse: '', chorus: '', bridge: ''};
    this.tempo = Math.floor(Math.random() * 120) + 60;
    this.getFirst = function() {
      var start = [];

      for (let i = 0; i < inputs.length; i++) {
        start.push(inputs[i][0]);
      }

      this.first = start[Math.floor(Math.random()*start.length)];
    }

    this.getFirst();

    for (var key in this.progression) {
      this.progression[key] = getProgression(this.first);
    }

    for (var key in this.rhythms) {
      this.rhythms[key] = rhythms[Math.floor(Math.random()*rhythms.length)];
    }

    for (var i = 1; i <= 7; i++) {
      var base = [0, 2, 4];
      this.chords['c' + i] = {
        notes: [i - 1 < 7 ? i - 1 : i - 8,
                i + 1 < 7 ? i + 1 : i - 6,
                i + 3 < 7 ? i + 3 : i - 4],
        play: function() {
          var notes = this.notes;
          for (let i = 0; i < notes.length; i++) {
            var chk = notes[i];
            var pos = song.notes[chk].audio;

            audio[pos].play();
          }
        }
      }
    }
  }
};