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
  '4511'
];

// this first counts the occurrences of a chord after the current chord in the input array...
var preProb = {c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: []};
for (let i = 0; i < inputs.length; i++) {
  for (var j = 0; j < inputs[i].length; j++) {
    var key = 'c' + inputs[i][j];
    var next;

    if (j == 3) {
      next = inputs[i][0];
    } else {
      next = inputs[i][j + 1];
    };

    if (preProb[key] == undefined) {
      preProb[key] = [0];
      preProb[key][next] = 1;
    } else {
      if (preProb[key][next] == undefined) {
        preProb[key][next] = 1;
      } else {
        preProb[key][next] += 1;
      }
    }
  }
}

// ...then converts the count to a probability for each chord ([0] = 0 because the 0 chord doesn't exist.)
for (var key in preProb) {
  var array = preProb[key];
  var sum = 0;

  for (let i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      sum += array[i];
    } else {
      array[i] = 0;
    }
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      array[i] = (Math.floor(array[i]/sum*100))/100;
    }
  }
}

console.log(inputs);

// Pulls probability from preProb to fill an array with instances of the chord number and selects randomly from among them, to add to the progression.
// I've chosen to do it this way because it doesn't give preference to any number.
// Rather than checking against the chords in a particular order, it pulls once from an existing dataset.
var getNext = function(chord) {
  var cur = preProb[chord];

  var chk = [];

  for (let i = 0; i < cur.length; i++) {
    for (let j = 0; j < cur[i]*100; j++) {
      chk.push(i);
    }
  }
  var n = Math.floor(Math.random()*chk.length);

  //console.log(cur, chk, chk[n]);

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