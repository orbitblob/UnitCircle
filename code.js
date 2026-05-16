//Global Variables

//Variables used for storing the user's answer
var numValue = 1;
var denomValue = 1;
var isNegative = 1;
var answer = 34;
var isUndefined = 0;

//Variables used during an individual play through
var selectedTrigFunctions = [];
var selectedAngles = [];
var currentAnswer = 34;
var streak = 0;
var points = 0;
var score = 0;
var gameMode = 0;  //0 = learning, 1 = practice, 2 = game
var difficulty = 0;
var hintText = "Hint?";

//Lists storing hard-coded values: angles in rad & deg, as well as the 6 trig functions
var trigFunctions = ["sin", "cos", "tan", "sec", "csc", "cot"];
var degAngles = ["0","30","45","60","90","120","135","150","180","210","225","240","270","300","315","330","360"];
var radAngles = ["0","π/6","π/4","π/3","π/2","2π/3","3π/4","5π/6","π","7π/6","5π/4","4π/3","3π/2","5π/3","7π/4","11π/6","2π"];
var coordinates = ["0", "1/2", "√2/2", "√3/2", "1"];

//Initialize the game
setScreen("mainMenuScreen");


//Main Menu Screen Buttons
onEvent("instButton", "click", function() {
  setScreen("instScreen");
});
onEvent("choiceOne", "click", function() {
  gameMode = 0;
  setForLearningMode();
  setScreen("trigSelectScreen");
});
onEvent("choiceTwo", "click", function() {
  gameMode = 1;
  setForPracticeMode();
  setScreen("trigSelectScreen");
});
onEvent("choiceThree", "click", function() {
  gameMode = 2;
  setForGameMode();
  setScreen("diffSelectScreen");
});

//Difficulty Select Screen Buttons
onEvent("diff0Button", "click", function( ) {
  selectedTrigFunctions = ["sin", "cos", "tan"];
  selectedAngles = degAngles;
  difficulty = 0;
  playForPoints();
});
onEvent("diff1Button", "click", function( ) {
  selectedTrigFunctions = trigFunctions;
  selectedAngles = degAngles;
  difficulty = 1;
  playForPoints();
});
onEvent("diff2Button", "click", function( ) {
  selectedTrigFunctions = trigFunctions;
  selectedAngles = radAngles;
  difficulty = 2;
  playForPoints();
});

//Trig Function Select Screen Buttons
onEvent("gotoDegrees", "click", function() {
  selectedAngles = degAngles;
  checkAndSetScreen();
});
onEvent("gotoRadians", "click", function() {
  selectedAngles = radAngles;
  checkAndSetScreen();
});
onEvent("backButton", "click", function( ) {
  resetMenuScreen();
  setScreen("mainMenuScreen");
});


//Game Screen Buttons

//Numerator Buttons
onEvent("numOne", "click", function() {
  updateAll("numOne", 1, "numerator");
});
onEvent("numSqrtTwo", "click", function() {
  updateAll("numSqrtTwo", Math.sqrt(2), "numerator");
});
onEvent("numSqrtThree", "click", function() {
  updateAll("numSqrtThree", Math.sqrt(3), "numerator");
});
onEvent("numTwo", "click", function() {
  updateAll("numTwo", 2, "numerator");
});
onEvent("numThree", "click", function() {
  updateAll("numThree", 3, "numerator");
});

//Denominator Buttons
onEvent("denomRootTwo", "click", function() {
  updateAll("denomRootTwo", Math.sqrt(2), "denominator");
});
onEvent("denomRootThree", "click", function() {
  updateAll("denomRootThree", Math.sqrt(3), "denominator");
});
onEvent("denomTwo", "click", function() {
  updateAll("denomTwo", 2, "denominator");
});
onEvent("denomThree", "click", function() {
  updateAll("denomThree", 3, "denominator");
});

//Special buttons
onEvent("negativeButton", "click", function() {
  updateAll("negativeButton", 0, "negative");
});
onEvent("zeroButton", "click", function() {
  updateAll("zeroButton", 0, "zero");
});
onEvent("undefButton", "click", function() {
  updateAll("undefButton", 0, "undef");
});

//Button to check answer; parameter determines how long the pause lasts
onEvent("answerButton", "click", function() {
  checkAnswer(1500);
});

//Button to leave the Game Screen
onEvent("quitButton", "click", function() {
  if (gameMode == 2) {
    gameOver();
  } else {
    quitAndReset();
  }
});

//Hint button
onEvent("hintButton", "click", function() {
  if(getText("hintButton") == "Hint?") {
    setText("hintButton", hintText);
  } else {
    setText("hintButton", "Hint?");
  }
});


//Instruction screen - only button here; takes user back to main menu
onEvent("quitInst", "click", function() {
  setScreen("mainMenuScreen");
});

//Game Over screen - only button here; takes user back to main menu
onEvent("backToMainButton", "click", function() {
  quitAndReset();
  setScreen("mainMenuScreen");
});

//Functions     Functions     Functions     Functions     Functions     Functions!

//Randomly selects an angle and an eligible trig function to give the user
function prepareNewQuestion() {
  var tempWhichAngle = randomNumber(0, selectedAngles.length-1);
  var tempTrigFunction = selectedTrigFunctions[randomNumber(0, selectedTrigFunctions.length-1)];
  var tempTrigAngle = selectedAngles[tempWhichAngle];
  setText("trigLabel", tempTrigFunction);
  setText("angleLabel", tempTrigAngle);
  currentAnswer = determineAnswer(tempTrigFunction, tempWhichAngle);
  if (gameMode == 0) {
    helpMe(degAngles[tempWhichAngle]);
  } else if (gameMode == 2) {
    countDown(streak, 50, 23);
    setText("DefeatedBy","You were defeated by a wild "+tempTrigFunction+"("+tempTrigAngle+")");
  }
}

//Determines the answer to the current problem & sets hint
function determineAnswer(trig,ang) {
  if (trig == "sin") {
    hintText = "sin θ = y\n"+findCoords(ang);
    return(Number.parseFloat(Math.sin(degAngles[ang]*Math.PI/180)).toPrecision(3));
  } else if (trig == "cos") {
    hintText = "cos θ = x\n"+findCoords(ang);
    return(Number.parseFloat(Math.cos(degAngles[ang]*Math.PI/180)).toPrecision(3));
  } else if (trig == "tan") {
    hintText = "tan θ = y/x\n"+findCoords(ang);
    return(Number.parseFloat(Math.tan(degAngles[ang]*Math.PI/180)).toPrecision(3));
  } else if (trig == "sec") {
    hintText = "sec θ = 1/x\n"+findCoords(ang);
    return(Number.parseFloat(1/Math.cos(degAngles[ang]*Math.PI/180)).toPrecision(3));
  } else if (trig == "csc") {
    hintText = "csc θ = 1/y\n"+findCoords(ang);
    return(Number.parseFloat(1/Math.sin(degAngles[ang]*Math.PI/180)).toPrecision(3));
  } else if (trig == "cot") {
    hintText = "cot θ = x/y\n"+findCoords(ang);
    return(Number.parseFloat(1/Math.tan(degAngles[ang]*Math.PI/180)).toPrecision(3));
  }
}
function findCoords(ang) {
  var xCoord;
  var yCoord;
  if (ang <= 4) {
    xCoord = coordinates[4-ang];
    yCoord = coordinates[ang];
  } else if (ang <= 8) {
    xCoord = "-"+coordinates[ang-4];
    yCoord = coordinates[8-ang];
  } else if (ang <= 12) {
    xCoord = "-"+coordinates[12-ang];
    yCoord = "-"+coordinates[ang-8];
  } else {
    xCoord = coordinates[ang-12];
    yCoord = "-"+coordinates[16-ang];
  }
  if (ang%4 == 0 && ang%8 == 0) {
    yCoord = 0;
  } else if (ang %4 == 0 && ang%8 != 0) {
    xCoord = 0;
  }
  return ("("+xCoord+","+yCoord+")");
}

//Sets up image of unit circle, highlighting the current angle for learning mode
function helpMe(currentAngle) {
  showElement("helpCanvas");
  setActiveCanvas("helpCanvas");
  setFillColor("rgba(0,0,0,0)");
  clearCanvas();
  setStrokeWidth(1);
  setStrokeColor("white");
  circle(72, 72, 70);
  line(2, 72, 142, 72);
  line(72, 2, 72, 142);
  line(11, 107, 133, 37);
  line(37, 133, 107, 11);
  line(11, 37, 133, 107);
  line(107, 133, 37, 11);
  line(22, 122, 122, 22);
  line(22, 22, 122, 122);
  setStrokeWidth(5);
  setStrokeColor("yellow");
  line(72, 72, 72+70*Math.cos(currentAngle*Math.PI/180), 72-70*Math.sin(currentAngle*Math.PI/180));
}

//Starts a countdown according to the user's streak; 
function countDown(streak, refreshRate, maxTime) {  
  var counter = 0;
  var time;
  if (streak <= 40) {
    time = 1000*(maxTime-2*Math.floor(streak/5));
  } else {
    time = 7000;
  }
  var tics = time/refreshRate;
  var length = 310;
  points = 1000+100*streak*(1+difficulty);
  setText("thesePointsLabel",points);
  setProperty("meterLeft","background-color","#00FF00");
  timedLoop(refreshRate, function() {
    length = length - 310/tics;
    setProperty("meterLeft", "width", length);
    if (0.2*time <= counter*refreshRate) {
      points = points-(1000+100*streak*(1+difficulty))/(0.8*tics);
      if (points < 0) {
        points = 0;
      }
      setText("thesePointsLabel",Math.round(points));
      setProperty("meterLeft","background-color","#DDDD00");
    }
    counter++;
    if (counter > tics) {
      gameOver();
    }
  });
}

//Sends player to "game over" screen; ends timed loop and resets game
function gameOver() {
  stopTimedLoop();
  setText("finalScoreLabel","Your final score was "+score);
  setText("finalStreakLabel", "You got "+streak+"\ncorrect");
  if (streak >= 25) {
    setText("congratsLabel", "Wow!!! You're incredible!");
  } else if (streak >= 10) {
    setText("congratsLabel", "Impressive!!");
  } else if (streak >= 5) {
    setText("congratsLabel", "Good job!");
  } else if (streak > 0) {
    setText("congratsLabel", "Good effort!");
  } else {
    setText("congratsLabel", "It's okay. I still love you.");
  }
  setScreen("gameOverScreen");
  
  //Reset variables and labels
  score = 0;
  answer = 34;
  streak = 0;
  setText("thesePointsLabel", 1000);
  setProperty("meterLeft", "width", 310);
  setProperty("meterLeft","background-color","#00FF00");
  setProperty("feedbackLabel","hidden",true);
  setProperty("trigLabel","hidden",false);
  setProperty("angleLabel","hidden",false);
  setText("streakCountLabel", streak);
}

//Checks if answer is correct, hides/shows/updates labels, and sets next question
function checkAnswer(timer) {
  hideProblemLabels();
  if (Math.abs(answer - currentAnswer) < 0.01 || (Math.abs(answer - currentAnswer) > 340 && isUndefined == 1)) {
    answer = 34;
    streak++;
    setText("feedbackLabel", "Correct!");
    if (gameMode == 2) {
      stopTimedLoop();
      score = Math.round(score + points);
      setText("scoreLabel", score);
    }
    setTimeout(function() {
      resetAllButtons();
      prepareNewQuestion();
    }, timer);
  } else {
    if (gameMode == 2) {
      gameOver();
    }
    streak = 0;
    setText("feedbackLabel", "Not quite...");
  }
  setProperty("feedbackLabel", "hidden", false);
  setText("streakCountLabel", streak);
  setTimeout(function() {
    showProblemLabels();
    setProperty("feedbackLabel", "hidden", true);
  }, timer);
}

//Retrieves user's selected trig functions when they click quiz (both rad or deg) button
function retrieveTrigFunctions() {
  var tempBoxID;
  for (var i = 0; i < 6; i++) {
    tempBoxID = "box" + i;
    if (getChecked(tempBoxID)) {
      appendItem(selectedTrigFunctions, trigFunctions[i]);
    }
  }
}

//Checks if at least one trig function was chosen and sets the screen if so
function checkAndSetScreen() {
  retrieveTrigFunctions();
  if (selectedTrigFunctions.length == 0) {
    setProperty("youMustChooseOneLabel", "hidden", false);
    setTimeout(function() {
      setProperty("youMustChooseOneLabel", "hidden", true);
    }, 1500);
  } else {
    prepareNewQuestion();
    setScreen("gameScreen");
  }
}

//Prepares game screen for Game Mode
function playForPoints() {
  var countdown = 5;
  hideProblemLabels();
  setScreen("gameScreen");
  setText("scoreLabel", score);
  setText("feedbackLabel", countdown);
  setProperty("feedbackLabel", "hidden", false);
  var thisOne = timedLoop(1000, function() {
    countdown--;
    setText("feedbackLabel", countdown);
    if (countdown == 0) {
      stopTimedLoop(thisOne);
      setProperty("feedbackLabel", "hidden", true);
      showProblemLabels();
      prepareNewQuestion();
    }
  });
}

//This function takes the elementID ID, value of the button, and where that button goes
function updateAll(elementID, buttonValue, type) {
  if (type == "numerator") {
    numeratorButton(elementID, buttonValue);
  } else if (type == "denominator") {
    denominatorButton(elementID, buttonValue);
  } else if (type == "negative") {
    negativeButton();
  } else if (type == "zero") {
    theZeroButton();
  } else if (type == "undef") {
    undefinedButton();
  }
}

//Functions that handle the different button types: numerator, denom, specials and zero
function numeratorButton(ID, value) {
  resetNumButtons();
  if (answer == 0 || answer == 34) {
    resetAllButtons();
    denomValue = 1;
  }
  setProperty(ID, "background-color", "#00CC00");
  numValue = value;
  answer = (isNegative*numValue)/denomValue;
}
function denominatorButton(ID, value) {
  resetDenomButtons();
  if (denomValue == value) {
    denomValue = 1;
  } else {
    if (answer == 0 || answer == 34) {
      resetAllButtons();
      setProperty("numOne", "background-color", "#00CC00");
    }
    denomValue = value;
    setProperty(ID, "background-color", "#00CC00");
  }
  answer = (isNegative*numValue)/denomValue;
}
function negativeButton() {
  if (isNegative == -1) {
    setProperty("negativeButton", "background-color", "#666666");
  } else {
    if (answer == 0 || answer == 34) {
      resetAllButtons();
      denomValue = 1;
      isUndefined = 0;
      setProperty("numOne", "background-color", "#00CC00");
    }
    setProperty("negativeButton", "background-color", "#00CC00");
  }
  isNegative = -1*isNegative;
  answer = (isNegative*numValue)/denomValue;
}
function theZeroButton() {
  resetAllButtons();
  answer = 0;
  setProperty("zeroButton", "background-color", "#00CC00");
}
function undefinedButton() {
  resetAllButtons();
  isUndefined = 1;
  answer = 34;
  setProperty("undefButton", "background-color", "#00CC00");
}

//Functions that un-highlight deselected buttons and reinitialize some values
function resetAllButtons() {
  resetNumButtons();
  resetDenomButtons();
  resetSpecials();
  resetNegative();
  numValue = 1;
  setProperty("answerButton", "hidden", false);
}

function resetNumButtons() {
  setProperty("numOne", "background-color", "#666666");
  setProperty("numSqrtTwo", "background-color", "#666666");
  setProperty("numSqrtThree", "background-color", "#666666");
  setProperty("numTwo", "background-color", "#666666");
  setProperty("numThree", "background-color", "#666666");
}
function resetDenomButtons() {
  setProperty("denomRootTwo", "background-color", "#666666");
  setProperty("denomRootThree", "background-color", "#666666");
  setProperty("denomTwo", "background-color", "#666666");
  setProperty("denomThree", "background-color", "#666666");
}
function resetSpecials() {
  setProperty("zeroButton", "background-color", "#666666");
  setProperty("undefButton", "background-color", "#666666");
  denomValue = 1;
  isUndefined = 0;
}
function resetNegative() {
  setProperty("negativeButton", "background-color", "#666666");
  isNegative = 1;
}

//Hide or show the appropriate elements according to play mode 
function setForGameMode() {
  setText("streakLabel", "Score");
  setProperty("streakLabel", "hidden", false);
  setProperty("streakCountLabel", "hidden", true);
  setProperty("scoreLabel", "hidden", false);
  setProperty("thesePointsLabel", "hidden", false);
  setProperty("meterLeft", "hidden", false);
  setProperty("fullMeter", "hidden", false);
  setProperty("notchMark", "hidden", false);
  setProperty("hintButton", "hidden", true);
  setProperty("helpCanvas", "hidden", true);
}
function setForPracticeMode() {
  setText("streakLabel", "Streak:");
  setProperty("streakLabel", "hidden", false);
  setProperty("streakCountLabel", "hidden", false);
  setProperty("scoreLabel", "hidden", true);
  setProperty("thesePointsLabel", "hidden", true);
  setProperty("meterLeft", "hidden", true);
  setProperty("fullMeter", "hidden", true);
  setProperty("notchMark", "hidden", true);
  setProperty("hintButton", "hidden", true);
  setProperty("helpCanvas", "hidden", true);
}
function setForLearningMode() {
  setProperty("streakLabel", "hidden", true);
  setProperty("streakCountLabel", "hidden", true);
  setProperty("scoreLabel", "hidden", true);
  setProperty("thesePointsLabel", "hidden", true);
  setProperty("meterLeft", "hidden", true);
  setProperty("fullMeter", "hidden", true);
  setProperty("notchMark", "hidden", true);
  setProperty("hintButton", "hidden", false);
  setText("hintButton", "Hint?");
  setProperty("helpCanvas", "hidden", false);
}

function resetMenuScreen() {
  setProperty("instButton", "hidden", false);
  setText("welcomeLabel", "The Unit Circle!");
  setText("choiceOne", "Learning Mode");
  setText("choiceTwo", "Practice Mode");
  setText("choiceThree", "Game Mode");
  gameMode = 0;
}
function hideProblemLabels() {
  setProperty("answerButton", "hidden", true);
  setProperty("trigLabel", "hidden", true);
  setProperty("angleLabel", "hidden", true);
}
function showProblemLabels() {
  setProperty("answerButton", "hidden", false);
  setProperty("trigLabel", "hidden", false);
  setProperty("angleLabel", "hidden", false);
  setText("hintButton", "Hint?");
}

//Reset elements and restore default values
function quitAndReset() {
  resetMenuScreen();
  resetAllButtons();
  answer = 34;
  streak = 0;
  selectedTrigFunctions = [];
  setScreen("mainMenuScreen");
  setText("streakCountLabel",streak);
}

/*
Version 3 of my unit circle quiz app.
Written for fun and for practice by a Math
and CS teacher @ Walter Payton College Prep.
Happy studying! And go Grizzlies!  :)
*/


