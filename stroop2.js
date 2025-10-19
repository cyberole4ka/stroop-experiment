/**************** 
 * Stroop2 *
 ****************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

let expName = 'stroop2';
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

const psychoJS = new PsychoJS({ debug: true });

psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([1.0, 1.0, 1.0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});

psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); },flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo);
flowScheduler.add(experimentInit);
flowScheduler.add(InstrukcjaRoutineBegin());
flowScheduler.add(InstrukcjaRoutineEachFrame());
flowScheduler.add(InstrukcjaRoutineEnd());
const trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
flowScheduler.add(trialsLoopScheduler);
flowScheduler.add(trialsLoopEnd);
flowScheduler.add(quitPsychoJS, 'Thank you for your patience.', true);

dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your patience.', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    {'name': 'stroop.csv', 'path': 'stroop.csv'},
    {'name': 'Kolory/red.png', 'path': 'Kolory/red.png'},
    {'name': 'Kolory/green.png', 'path': 'Kolory/green.png'},
    {'name': 'Kolory/blue.png', 'path': 'Kolory/blue.png'},
    {'name': 'Kolory/yellow.png', 'path': 'Kolory/yellow.png'},
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.INFO);

var currentLoop;
var frameDur;

async function updateInfo() {
  currentLoop = psychoJS.experiment;
  expInfo['date'] = util.MonotonicClock.getDateStr();
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;

  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0;

  util.addInfoFromUrl(expInfo);

  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';

  return Scheduler.Event.NEXT;
}

// ------------------ инициализация эксперимента ------------------

var InstrukcjaClock, Instrukcja_text, mouse_2, trialClock, text;
var img_red, img_green, img_blue, img_yellow, mouse;
var globalClock, routineTimer;

async function experimentInit() {
  InstrukcjaClock = new util.Clock();
  Instrukcja_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'Instrukcja_text',
    text: 'W teście pojawi się 6 słów w języku polskim i 6 w języku angielskim. Wybierz KOLOR, odpowiadający znaczeniu słowa. \n\n\n*kliknij żeby zacząć*',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,
    color: new util.Color([-1.0, -1.0, -1.0]),
  });

  mouse_2 = new core.Mouse({ win: psychoJS.window });
  mouse_2.mouseClock = new util.Clock();

  trialClock = new util.Clock();
  text = new visual.TextStim({ win: psychoJS.window, name: 'text', text: '', font: 'Arial', units: undefined, pos: [0,0], height:0.15, color: new util.Color('white') });

  img_red = new visual.ImageStim({win: psychoJS.window, name:'img_red', image:'Kolory/red.png', pos:[-0.5,0.4], size:[0.3,0.3]});
  img_green = new visual.ImageStim({win: psychoJS.window, name:'img_green', image:'Kolory/green.png', pos:[0.5,0.4], size:[0.3,0.3]});
  img_blue = new visual.ImageStim({win: psychoJS.window, name:'img_blue', image:'Kolory/blue.png', pos:[-0.5,-0.4], size:[0.3,0.3]});
  img_yellow = new visual.ImageStim({win: psychoJS.window, name:'img_yellow', image:'Kolory/yellow.png', pos:[0.5,-0.4], size:[0.3,0.3]});

  mouse = new core.Mouse({ win: psychoJS.window });
  mouse.mouseClock = new util.Clock();

  globalClock = new util.Clock();
  routineTimer = new util.CountdownTimer();

  return Scheduler.Event.NEXT;
}

// ------------------ Рутины (Instrukcja, trial) ------------------
// Здесь вставляешь свои функции InstrukcjaRoutineBegin, InstrukcjaRoutineEachFrame, InstrukcjaRoutineEnd
// и trialRoutineBegin, trialRoutineEachFrame

// ------------------ trialRoutineEnd с Google Sheets ------------------
function trialRoutineEnd(snapshot) {
  return async function () {
    for (const thisComponent of trialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') thisComponent.setAutoDraw(false);
    }

    psychoJS.experiment.addData('trial.stopped', globalClock.getTime());
    psychoJS.experiment.addData('mouse.x', mouse.x);
    psychoJS.experiment.addData('mouse.y', mouse.y);
    psychoJS.experiment.addData('mouse.leftButton', mouse.leftButton);
    psychoJS.experiment.addData('mouse.midButton', mouse.midButton);
    psychoJS.experiment.addData('mouse.rightButton', mouse.rightButton);
    psychoJS.experiment.addData('mouse.time', mouse.time);
    psychoJS.experiment.addData('mouse.corr', mouse.corr);
    psychoJS.experiment.addData('mouse.clicked_name', mouse.clicked_name);

    // --- Отправка данных в Google Sheets ---
    const sheetURL = 'https://script.google.com/macros/s/AKfycbw9YxwBiVg1-yGT0GN285Jcjz95X-LPGy6utRC5Nyg9EAFjz_cvkXacXkUIT8rWKwk1/exec';
    const trialData = {
        participant: expInfo.participant,
        trialTime: globalClock.getTime(),
        mouseX: mouse.x,
        mouseY: mouse.y,
        clicked: mouse.clicked_name,
        correct: mouse.corr,
        word: word,
        fontColor: fontColor
    };

    fetch(sheetURL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(trialData)
    }).then(response => {
        if (!response.ok) console.error('Ошибка при отправке данных на Google Sheets');
    }).catch(error => console.error('Ошибка сети:', error));

    routineTimer.reset();

    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

// ------------------ Остальные функции ------------------
function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
  };
}

async function quitPsychoJS(message, isCompleted) {
  if (psychoJS.experiment.isEntryEmpty()) psychoJS.experiment.nextEntry();
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  return Scheduler.Event.QUIT;
}
