/**************** 
 * Stroop2 *
 ****************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// --- информация о эксперименте ---
let expName = 'stroop2';
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// --- инициализация PsychoJS ---
const psychoJS = new PsychoJS({ debug: true });

// --- открытие окна ---
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([1.0, 1.0, 1.0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});

// --- диалоговое окно перед экспериментом ---
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);

psychoJS.scheduleCondition(
    () => (psychoJS.gui.dialogComponent.button === 'OK'),
    flowScheduler,
    dialogCancelScheduler
);

// --- функции для обновления информации ---
var currentLoop;
var frameDur;
async function updateInfo() {
  currentLoop = psychoJS.experiment;
  expInfo['date'] = util.MonotonicClock.getDateStr();
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;

  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  frameDur = (typeof expInfo['frameRate'] !== 'undefined') ? 1.0 / Math.round(expInfo['frameRate']) : 1.0 / 60.0;

  util.addInfoFromUrl(expInfo);

  psychoJS.experiment.dataFileName = `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`;
  psychoJS.experiment.field_separator = '\t';

  return Scheduler.Event.NEXT;
}
var InstrukcjaClock, Instrukcja_text, mouse_2;
var trialClock, text, img_red, img_green, img_blue, img_yellow, mouse;
var globalClock, routineTimer;

async function experimentInit() {
    // --- Компоненты инструкции ---
    InstrukcjaClock = new util.Clock();
    Instrukcja_text = new visual.TextStim({
        win: psychoJS.window,
        name: 'Instrukcja_text',
        text: 'W teście pojawi się 6 słów w języku polskim i 6 w języku angielskim. Wybierz KOLOR, odpowiadający znaczeniu słowa. \n\n\n*kliknij żeby zacząć*',
        font: 'Arial',
        units: undefined,
        pos: [0, 0],
        height: 0.05,
        color: new util.Color([-1.0, -1.0, -1.0])
    });

    mouse_2 = new core.Mouse({ win: psychoJS.window });
    mouse_2.mouseClock = new util.Clock();

    // --- Компоненты trial ---
    trialClock = new util.Clock();
    text = new visual.TextStim({
        win: psychoJS.window,
        name: 'text',
        text: '',
        font: 'Arial',
        units: undefined,
        pos: [0, 0],
        height: 0.15,
        color: new util.Color('white')
    });

    img_red = new visual.ImageStim({
        win: psychoJS.window,
        name: 'img_red',
        image: 'Kolory/red.png',
        pos: [-0.5, 0.4],
        size: [0.3, 0.3]
    });
    img_green = new visual.ImageStim({
        win: psychoJS.window,
        name: 'img_green',
        image: 'Kolory/green.png',
        pos: [0.5, 0.4],
        size: [0.3, 0.3]
    });
    img_blue = new visual.ImageStim({
        win: psychoJS.window,
        name: 'img_blue',
        image: 'Kolory/blue.png',
        pos: [-0.5, -0.4],
        size: [0.3, 0.3]
    });
    img_yellow = new visual.ImageStim({
        win: psychoJS.window,
        name: 'img_yellow',
        image: 'Kolory/yellow.png',
        pos: [0.5, -0.4],
        size: [0.3, 0.3]
    });

    mouse = new core.Mouse({ win: psychoJS.window });
    mouse.mouseClock = new util.Clock();

    // --- Таймеры ---
    globalClock = new util.Clock();
    routineTimer = new util.CountdownTimer();

    return Scheduler.Event.NEXT;
}

// ------------------ Рутины Instrukcja ------------------

var t, frameN, continueRoutine, routineForceEnded, InstrukcjaComponents;
var gotValidClick, prevButtonState, _mouseButtons, _mouseXYs;

function InstrukcjaRoutineBegin(snapshot) {
    return async function () {
        t = 0; frameN = -1; continueRoutine = true; routineForceEnded = false;
        InstrukcjaClock.reset(); routineTimer.reset();
        mouse_2.x = []; mouse_2.y = []; mouse_2.leftButton = []; mouse_2.midButton = []; mouse_2.rightButton = []; mouse_2.time = [];
        gotValidClick = false;

        psychoJS.experiment.addData('Instrukcja.started', globalClock.getTime());
        InstrukcjaComponents = [Instrukcja_text, mouse_2];
        for (const comp of InstrukcjaComponents) if ('status' in comp) comp.status = PsychoJS.Status.NOT_STARTED;
        return Scheduler.Event.NEXT;
    };
}

function InstrukcjaRoutineEachFrame() {
    return async function () {
        t = InstrukcjaClock.getTime();
        frameN = frameN + 1;

        if (t >= 0 && Instrukcja_text.status === PsychoJS.Status.NOT_STARTED) {
            Instrukcja_text.tStart = t;
            Instrukcja_text.frameNStart = frameN;
            Instrukcja_text.setAutoDraw(true);
        }

        if (t >= 0 && mouse_2.status === PsychoJS.Status.NOT_STARTED) {
            mouse_2.tStart = t;
            mouse_2.frameNStart = frameN;
            mouse_2.status = PsychoJS.Status.STARTED;
            mouse_2.mouseClock.reset();
            prevButtonState = mouse_2.getPressed();
        }

        if (mouse_2.status === PsychoJS.Status.STARTED) {
            _mouseButtons = mouse_2.getPressed();
            if (!_mouseButtons.every((e, i) => e === prevButtonState[i])) {
                prevButtonState = _mouseButtons;
                if (_mouseButtons.reduce((a, b) => a + b) > 0) {
                    _mouseXYs = mouse_2.getPos();
                    mouse_2.x.push(_mouseXYs[0]);
                    mouse_2.y.push(_mouseXYs[1]);
                    mouse_2.leftButton.push(_mouseButtons[0]);
                    mouse_2.midButton.push(_mouseButtons[1]);
                    mouse_2.rightButton.push(_mouseButtons[2]);
                    mouse_2.time.push(mouse_2.mouseClock.getTime());
                    continueRoutine = false;
                }
            }
        }

        if (!continueRoutine) {
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;
        for (const comp of InstrukcjaComponents) {
            if ('status' in comp && comp.status !== PsychoJS.Status.FINISHED) { continueRoutine = true; break; }
        }

        return continueRoutine ? Scheduler.Event.FLIP_REPEAT : Scheduler.Event.NEXT;
    };
}

function InstrukcjaRoutineEnd(snapshot) {
    return async function () {
        for (const comp of InstrukcjaComponents) { if (typeof comp.setAutoDraw === 'function') comp.setAutoDraw(false); }
        psychoJS.experiment.addData('Instrukcja.stopped', globalClock.getTime());
        psychoJS.experiment.addData('mouse_2.x', mouse_2.x);
        psychoJS.experiment.addData('mouse_2.y', mouse_2.y);
        psychoJS.experiment.addData('mouse_2.leftButton', mouse_2.leftButton);
        psychoJS.experiment.addData('mouse_2.midButton', mouse_2.midButton);
        psychoJS.experiment.addData('mouse_2.rightButton', mouse_2.rightButton);
        psychoJS.experiment.addData('mouse_2.time', mouse_2.time);
        routineTimer.reset();
        return Scheduler.Event.NEXT;
    };
}
var trialComponents;
var corr, corrAns;

function trialRoutineBegin(snapshot) {
    return async function () {
        t = 0; frameN = -1; continueRoutine = true; routineForceEnded = false;
        trialClock.reset(); routineTimer.reset();

        // задаём слово и цвет кнопки
        text.setText(word);
        text.setColor(new util.Color(fontColor));

        mouse.x = []; mouse.y = []; mouse.leftButton = []; mouse.midButton = []; mouse.rightButton = [];
        mouse.time = []; mouse.corr = []; mouse.clicked_name = [];
        gotValidClick = false;

        psychoJS.experiment.addData('trial.started', globalClock.getTime());
        trialComponents = [text, img_red, img_green, img_blue, img_yellow, mouse];
        for (const comp of trialComponents) if ('status' in comp) comp.status = PsychoJS.Status.NOT_STARTED;

        return Scheduler.Event.NEXT;
    };
}

function trialRoutineEachFrame() {
    return async function () {
        t = trialClock.getTime();
        frameN = frameN + 1;

        // Запуск компонентов
        if (t >= 0 && text.status === PsychoJS.Status.NOT_STARTED) { text.tStart = t; text.frameNStart = frameN; text.setAutoDraw(true); }
        if (t >= 0 && img_red.status === PsychoJS.Status.NOT_STARTED) { img_red.tStart = t; img_red.frameNStart = frameN; img_red.setAutoDraw(true); }
        if (t >= 0 && img_green.status === PsychoJS.Status.NOT_STARTED) { img_green.tStart = t; img_green.frameNStart = frameN; img_green.setAutoDraw(true); }
        if (t >= 0 && img_blue.status === PsychoJS.Status.NOT_STARTED) { img_blue.tStart = t; img_blue.frameNStart = frameN; img_blue.setAutoDraw(true); }
        if (t >= 0 && img_yellow.status === PsychoJS.Status.NOT_STARTED) { img_yellow.tStart = t; img_yellow.frameNStart = frameN; img_yellow.setAutoDraw(true); }

        // Проверка кликов мыши
        if (t >= 0 && mouse.status === PsychoJS.Status.NOT_STARTED) {
            mouse.tStart = t; mouse.frameNStart = frameN; mouse.status = PsychoJS.Status.STARTED;
            mouse.mouseClock.reset();
            prevButtonState = mouse.getPressed();
        }

        if (mouse.status === PsychoJS.Status.STARTED) {
            let _mouseButtons = mouse.getPressed();
            if (!_mouseButtons.every((e,i) => e===prevButtonState[i])) {
                prevButtonState = _mouseButtons;
                if (_mouseButtons.reduce((a,b) => a+b) > 0) {
                    // проверяем, попал ли клик по картинке
                    gotValidClick = false;
                    mouse.clickableObjects = [img_red, img_green, img_blue, img_yellow];
                    for (const obj of mouse.clickableObjects) {
                        if (obj.contains(mouse)) {
                            gotValidClick = true;
                            mouse.clicked_name.push(obj.name);
                        }
                    }
                    if (!gotValidClick) mouse.clicked_name.push(null);

                    if (gotValidClick) {
                        corr = 0;
                        corrAns = eval(correct_ans);
                        if (corrAns.contains(mouse)) corr = 1;
                        mouse.corr.push(corr);
                    }

                    const _mouseXYs = mouse.getPos();
                    mouse.x.push(_mouseXYs[0]); mouse.y.push(_mouseXYs[1]);
                    mouse.leftButton.push(_mouseButtons[0]); mouse.midButton.push(_mouseButtons[1]); mouse.rightButton.push(_mouseButtons[2]);
                    mouse.time.push(mouse.mouseClock.getTime());

                    if (gotValidClick) continueRoutine = false;
                }
            }
        }

        // Проверка выхода
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0)
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);

        // Проверка окончания рутин
        if (!continueRoutine) { routineForceEnded = true; return Scheduler.Event.NEXT; }

        continueRoutine = false;
        for (const comp of trialComponents)
            if ('status' in comp && comp.status !== PsychoJS.Status.FINISHED) { continueRoutine = true; break; }

        return continueRoutine ? Scheduler.Event.FLIP_REPEAT : Scheduler.Event.NEXT;
    };
}

function trialRoutineEnd(snapshot) {
    return async function () {
        for (const comp of trialComponents) if (typeof comp.setAutoDraw === 'function') comp.setAutoDraw(false);

        psychoJS.experiment.addData('trial.stopped', globalClock.getTime());
        psychoJS.experiment.addData('mouse.x', mouse.x); psychoJS.experiment.addData('mouse.y', mouse.y);
        psychoJS.experiment.addData('mouse.leftButton', mouse.leftButton); psychoJS.experiment.addData('mouse.midButton', mouse.midButton);
        psychoJS.experiment.addData('mouse.rightButton', mouse.rightButton); psychoJS.experiment.addData('mouse.time', mouse.time);
        psychoJS.experiment.addData('mouse.corr', mouse.corr); psychoJS.experiment.addData('mouse.clicked_name', mouse.clicked_name);

        routineTimer.reset();
        return Scheduler.Event.NEXT;
    };
}

// ------------------ ЦИКЛ TRIALS ------------------

var trials;
function trialsLoopBegin(trialsLoopScheduler, snapshot) {
    return async function() {
        trials = new TrialHandler({
            psychoJS: psychoJS,
            nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
            extraInfo: expInfo,
            trialList: 'stroop.csv',
            name: 'trials'
        });
        psychoJS.experiment.addLoop(trials);
        currentLoop = trials;

        for (const thisTrial of trials) {
            snapshot = trials.getSnapshot();
            trialsLoopScheduler.add(importConditions(snapshot));
            trialsLoopScheduler.add(trialRoutineBegin(snapshot));
            trialsLoopScheduler.add(trialRoutineEachFrame());
            trialsLoopScheduler.add(trialRoutineEnd(snapshot));
            trialsLoopScheduler.add(trialsLoopEndIteration(trialsLoopScheduler, snapshot));
        }
        return Scheduler.Event.NEXT;
    };
}

function importConditions(currentLoop) {
    return async function () {
        psychoJS.importAttributes(currentLoop.getCurrentTrial());
        return Scheduler.Event.NEXT;
    };
}

// ------------------ URL GOOGLE SCRIPT ------------------

// Вставьте сюда ваш URL Google Script для отправки данных:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9YxwBiVg1-yGT0GN285Jcjz95X-LPGy6utRC5Nyg9EAFjz_cvkXacXkUIT8rWKwk1/exec';
