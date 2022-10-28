// Inputs are chorus chord progressions from 9 of the top 10 songs of all time according to wikipedia.
var inputs = [
  '1256',
  '1415',
  '2615',
  '2525',
  '1564',
  '6511',
  '5611',
  '1514',
  '6245',
  '1313',
  '1625',
  '5163',
  '4565',
  '4564',
  '6141',
  '4511',
  '4515',
  '2125',
  '1645',
  '4655',
  '6215',
  '6415',
  '1564',
  '6543',

  // my inputs
  '2234',
  '3424',
  '1352',
  '1532'
];

inputs.sort(function(a, b) {
  return a - b;
});

// this first counts the occurrences of a chord after the current chord in the input array...
var nextProb = {c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: []};

for (var i = 0; i < inputs.length; i++) {
  for (var j = 0; j < inputs[i].length; j++) {
    var key = 'c' + inputs[i][j];
    var next;

    if (j == 3) {
      next = inputs[i][0];
    } else {
      next = inputs[i][j + 1];
    };

    if (nextProb[key] == undefined) {
      nextProb[key] = [0];
      nextProb[key][next] = 1;
    } else {
      if (nextProb[key][next] == undefined) {
        nextProb[key][next] = 1;
      } else {
        nextProb[key][next] += 1;
      }
    }
  }
}

// ...then converts the count to a probability for each chord ([0] = 0 because the 0 chord doesn't exist.)
for (var key in nextProb) {
  var array = nextProb[key];
  var sum = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      sum += array[i];
    } else {
      array[i] = 0;
    }
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      array[i] = (Math.floor(array[i]/sum*100))/100;
    }
  }
}

// Pulls probability from nextProb to fill an array with instances of the chord number and selects randomly from among them, to add to the progression.
// I've chosen to do it this way because it doesn't give preference to any number.
// Rather than checking against the chords in a particular order, it pulls once from an existing dataset.
var getNext = function(chord) {
  var cur = nextProb[chord];
  var chk = [];

  for (var i = 0; i < cur.length; i++) {
    for (var j = 0; j < cur[i]*100; j++) {
      chk.push(i);
    }
  }
  var n = Math.floor(Math.random()*chk.length);

  return chk[n];
}

// Pulls a random root chord from inputs and then completes progression with getNext.
var getProgression = function(first) {
  var progression = '';
  progression += first;

  while (progression.length < progLength) {
    var cur = progression[progression.length - 1];
    progression += getNext('c' + cur);
  }

  return progression;
}
