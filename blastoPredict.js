// let ivfRound = {age:30, numberOfEmbryos: 2}
// let embryo = {blQuality: '4ba', ageEmbryo: 5, isTested = false}

let ivfRound = {
  age: prompt("введите возраст на момент пункции яйцеклеток"),
  numberOfEmbryos: prompt("Введите количество эмбрионов"),
};

let embryos = [];
for (let i = 1; i <= ivfRound.numberOfEmbryos; i++) {
  let embryo = {};

  embryo.blQuality = prompt("введите качество бластоцисты").toLowerCase();

  // embryo.blQualityInput = prompt ('введите качество бластоцисты');
  // embryo.blQuality = blQualityInput.toLowerCase();

  // embryo.blQuality = prompt ('введите качество бластоцисты');
  embryo.ageEmbryo = prompt(
    "введите день, на который произошла бластуляция (5 или 6)"
  );
  embryo.isTested = prompt("было ли проведено ПГТ").toLowerCase() == "да";
  embryos.push(embryo);
}

function calculateGrade(embryo) {
  let expansG = 4;
  if (
    embryo.blQuality[0] == 3 ||
    embryo.blQuality[0] == 4 ||
    embryo.blQuality[0] == 6
  ) {
    expansG = 1;
  } else if (embryo.blQuality[0] == 5) {
    expansG = 2;
  }

  let embrG = 4;
  if (embryo.blQuality[1] == "a") {
    embrG = 1;
  } else if (embryo.blQuality[1] == "b") {
    embrG = 2.5;
  }

  let trophG = 4;
  if (embryo.blQuality[2] == "a") {
    trophG = 1;
  } else if (embryo.blQuality[2] == "b") {
    trophG = 2.5;
  }

  let totalG = Math.round(expansG + embrG + trophG);
  return totalG;
}

function calculateScore(totalG) {
  let score = 1;
  if (totalG <= 9 && totalG > 5) {
    score = 2;
  } else if (totalG > 9) {
    score = 3;
  }
  return score;
}

function calculateEuploidyRate(ivfRound, score, embryo) {
  let euploidyRate = 0.63;
  if (ivfRound.age < 35 && score == 2) {
    euploidyRate = 0.47;
  } else if (ivfRound.age < 35 && score == 3) {
    euploidyRate = 0.32;
  } else if (ivfRound.age >= 35 && score == 1) {
    euploidyRate = 0.42;
  } else if (ivfRound.age >= 35 && score == 2) {
    euploidyRate = 0.45;
  } else if (ivfRound.age >= 35 && score == 3) {
    euploidyRate = 0.24;
  }

  embryo.isEmbryoOld = false;
  if (ivfRound.age < 35 && embryo.ageEmbryo > 5) {
    embryo.isEmbryoOld = true;
  }

  embryo.isEmbryoOld ? (euploidyRate /= 1.2) : (euploidyRate /= 1);
  return euploidyRate;
}

function calculateEmbryoCPR(totalG, euploidyRate) {
  let predictionCPReuploid = 0.95;
  if (totalG == 4) {
    predictionCPReuploid = 0.67;
  } else if (totalG == 5) {
    predictionCPReuploid = 0.61;
  } else if (totalG == 6) {
    predictionCPReuploid = 0.56;
  } else if (totalG == 7) {
    predictionCPReuploid = 0.53;
  } else if (totalG == 8) {
    predictionCPReuploid = 0.48;
  } else if (totalG == 9) {
    predictionCPReuploid = 0.44;
  } else if (totalG == 10) {
    predictionCPReuploid = 0.37;
  } else if (totalG == 11) {
    predictionCPReuploid = 0.3;
  } else if (totalG == 12) {
    predictionCPReuploid = 0.27;
  }

  let predictionCPRuntested = (
    predictionCPReuploid *
    calculateEuploidyRate(ivfRound, calculateScore(embryo), embryo)
  ).toFixed(3);

  let embryoCPR = predictionCPRuntested;
  if (embryo.isTested) {
    embryoCPR = predictionCPReuploid;
  }

  return embryoCPR;
}

let predictions = [];

for (embryo of embryos) {
  console.log(embryo);
  let totalG = calculateGrade(embryo);
  console.log(calculateGrade(embryo));
  let score = calculateScore(totalG);
  let euploidyRate = calculateEuploidyRate(ivfRound, score, embryo);
  let embryoCPR = calculateEmbryoCPR(totalG, euploidyRate);

  predictions.push(embryoCPR);
}

predictions = predictions.sort().reverse();
console.log(predictions);

let cumulativeFail = 1;
for (prediction of predictions) {
  console.log(prediction);
  cumulativeFail = cumulativeFail * (1 - prediction);
}

console.log(cumulativeFail);

let finalPrediction = 1 - cumulativeFail;
console.log(finalPrediction);

// letProbs = []
// function calculateProbabilityOf(predictions, desiredChildren)
// for (let prediction of predictions)
//

// let desiredChance = parseInt(prompt('какая вероятность рождения ребенка для вас приемлима'))/100
// console.log(desiredChance)

// let additionals = [finalPrediction];
// function successForAdditional(
//   finalPrediction,
//   finalPrediction2 = finalPrediction
// ) {
//   if (finalPrediction2 >= 0.9) {
//     return additionals;
//   }
//   if (finalPrediction2 < 0.9) {
//     let fail1 = 1 - finalPrediction;
//     let fail2 = 1 - finalPrediction2;
//     finalPrediction2 = 1 - fail1 * fail2;
//     additionals.push(finalPrediction2);
//   }
//   return successForAdditional(finalPrediction, finalPrediction2);
// }

let desiredChance =
  parseInt(prompt("насколько вы хотите быть уверены в одном ребенке в %")) /
  100;
console.log("DESIRED CHANCE: " + desiredChance);

let additionals = [finalPrediction];
function successForAdditional(
  desiredChance,
  finalPrediction,
  finalPrediction2 = finalPrediction
) {
  if (finalPrediction2 >= desiredChance) {
    return additionals;
  }
  if (finalPrediction2 < desiredChance) {
    let fail1 = 1 - finalPrediction;
    let fail2 = 1 - finalPrediction2;
    finalPrediction2 = 1 - fail1 * fail2;
    additionals.push(finalPrediction2);
  }
  console.log("ADDITIONALS: " + additionals);
  return successForAdditional(desiredChance, finalPrediction, finalPrediction2);
}

// console.log(successForAdditional(0.35, 0.35, 0.9))
console.log(successForAdditional(desiredChance, finalPrediction));

// далее очевидно избыточная хуйня,ведь можно посчитать successForAdditional.length
// function howManyCyclesNeeded(
//   finalPrediction,
//   finalPrediction2 = finalPrediction,
//   i = 1
// ) {
//   if (finalPrediction < 0.9) {
//     i = i + 1;
//     let finalPrediction2 = 1 - (1 - finalPrediction2) * (1 - finalPrediction);
//     if (finalPrediction2 > 0.9) {
//       return i;
//     } else if (finalPrediction2 <= 0.9) {
//       return howManyCyclesNeeded(finalPrediction, finalPrediction2, i);
//     }
//   }
// }

//
alert(
  "вероятность рождения ребенка при переносе первого эмбриона: " +
    parseInt(predictions[0] * 100) +
    "%, вероятность рождения ребенка при переносе второго эмбриона: " +
    parseInt(predictions[1] * 100) +
    "%, вероятность рождения двойни при переносе двух эмбрионов: " +
    parseInt(predictions[0] * predictions[1] * 100) +
    "%"
);

alert(
  "вероятность рождения ребенка при переносе всех эмбрионов, полученных в первом цикле: " +
    parseInt(finalPrediction * 100) +
    "%"
);

alert(
  "с вероятностью " +
    parseInt(desiredChance * 100) +
    "% родится как минимум один ребенок при проведении " +
    successForAdditional(desiredChance, finalPrediction).length +
    "полных циклов ЭКО"
);

alert(
  "вероятность рождения ребенка при переносе всех эмбрионов, полученных в первом цикле:" +
    parseInt(additionals[0] * 100) +
    "%, вероятность рождения ребенка при проведении второго цикла: " +
    parseInt(additionals[1] * 100) +
    "%, вероятность рождения ребенка при проведении третьего цикла: " +
    parseInt(additionals[2] * 100) +
    "%"
);
