var audio = [];

for (var i = 0; i < all.length; i++) {
  var note = document.createElement('audio');
  note.src = 'notes/' + all[i].position + '.mp3';

  note.play = function() {
    var dummy = document.createElement('audio');
    dummy.src = this.src;
    dummy.load();
    dummy.play();
    dummy.remove();
  }

  audio.push(note);
}