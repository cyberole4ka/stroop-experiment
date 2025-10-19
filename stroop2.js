/**************** 
 * Stroop2 Web *
 ****************/

import { core, data, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;

const { round } = util;

// --- EXPERIMENT INFO ---
let expName = 'stroop2';
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// --- INIT PSYCHOJS ---
const psychoJS = new PsychoJS({ debug: true });

psychoJS.openWindow({
    fullscr: true,
    color: new util.Color([1.0, 1.0, 1.0]),
    units: 'height',
    waitBlanking: true
});

// --- EXPERIMENT DIALOG ---
psychoJS.schedule(psychoJS.gui.DlgFromDict({
    dictionary: expInfo,
    title: expName
}));

// --- FLOW SCHEDULER ---
const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(() => (psychoJS.gui.dialogComponent.button === 'OK'), flowScheduler, dialogCancelScheduler);

// --- ADD FUNCTIONS TO FLOW ---
flowScheduler.add(updateInfo);
flowScheduler.add(experimentInit);
flowScheduler.add(InstrukcjaRoutineBegin());
flowScheduler.add(InstrukcjaRoutineEachFrame());
flowScheduler.add(InstrukcjaRoutineEnd());

const trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
flowScheduler.add(trialsLoopScheduler);
flowScheduler.add(trialsLoopEnd);

flowScheduler.add(sendDataToGoogleSheet); // Отправка данных на Google Sheets
flowScheduler.add(quitPsychoJS, 'Thank you!', true);

dialogCancelScheduler.add(quitPsychoJS, 'Experiment cancelled', false);

// --- START EXPERIMENT ---
psychoJS.start({
    expName: expName,
    expInfo: expInfo,
    resources: [
        { name: 'stroop.csv', path: 'stroop.csv' },
        { name: 'Kolory/red.png', path: 'Kolory/red.png' },
        { name: 'Kolory/green.png', path: 'Kolory/green.png' },
        { name: 'Kolory/blue.png', path: 'Kolory/blue.png' },
        { name: 'Kolory/yellow.png', path: 'Kolory/yellow.png' },
    ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.INFO);

// ==========================
// --- UPDATE INFO FUNCTION --- 
// ==========================
async function updateInfo() {
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

    psychoJS.experiment.dataFileName = `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`;
    psychoJS.experiment.field_separator = '\t';

    return Scheduler.Event.NEXT;
}

// ==========================
// --- EXPERIMENT INIT --- 
// ==========================
let InstrukcjaClock, Instrukcja_text, mouse_2;
let trialClock, text, img_red, img_green, img_blue, img_yellow, mouse;
let globalClock, routineTimer;

async function experimentInit() {
    // --- INSTRUCTION ---
    InstrukcjaClock = new util.Clock();
    Instrukcja_text = new visual.TextStim({
        win: psychoJS.window,
        name: 'Instrukcja_text',
        text: 'W teście pojawi się 6 słów w języku polskim i 6 w języku angielskim.\nWybierz KOLOR, odpowiadający znaczeniu słowa.\n\n*kliknij żeby zacząć*',
        font: 'Arial',
        pos: [0, 0],
        height: 0.05,
        color: new util.Color([-1, -1, -1])
    });

    mouse_2 = new core.Mouse({ win: psychoJS.window });
    mouse_2.mouseClock = new util.Clock();

    // --- TRIAL ---
    trialClock = new util.Clock();
    text = new visual.TextStim({ win: psychoJS.window, name: 'text', text: '', height: 0.15, color: new util.Color('white') });

    img_red = new visual.ImageStim({ win: psychoJS.window, name: 'img_red', image: 'Kolory/red.png', pos: [-0.5, 0.4], size: [0.3, 0.3] });
    img_green = new visual.ImageStim({ win: psychoJS.window, name: 'img_green', image: 'Kolory/green.png', pos: [0.5, 0.4], size: [0.3, 0.3] });
    img_blue = new visual.ImageStim({ win: psychoJS.window, name: 'img_blue', image: 'Kolory/blue.png', pos: [-0.5, -0.4], size: [0.3, 0.3] });
    img_yellow = new visual.ImageStim({ win: psychoJS.window, name: 'img_yellow', image: 'Kolory/yellow.png', pos: [0.5, -0.4], size: [0.3, 0.3] });

    mouse = new core.Mouse({ win: psychoJS.window });
    mouse.mouseClock = new util.Clock();

    globalClock = new util.Clock();
    routineTimer = new util.CountdownTimer();

    return Scheduler.Event.NEXT;
}

// ==========================
// --- SEND DATA TO GOOGLE SHEETS --- 
// ==========================
async function sendDataToGoogleSheet() {
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbw9YxwBiVg1-yGT0GN285Jcjz95X-LPGy6utRC5Nyg9EAFjz_cvkXacXkUIT8rWKwk1/exec';
    const formData = new FormData();
    
    // Получаем все данные эксперимента
    const rows = psychoJS.experiment._trials.flatMap(trial => trial.data ? [trial.data] : []);
    formData.append('data', JSON.stringify(rows));

    try {
        await fetch(googleScriptURL, { method: 'POST', body: formData });
        console.log('Данные отправлены на Google Sheets!');
    } catch (err) {
        console.error('Ошибка при отправке данных: ', err);
    }

    return Scheduler.Event.NEXT;
}

// ==========================
// --- QUIT --- 
// ==========================
async function quitPsychoJS(message, isCompleted) {
    if (psychoJS.experiment.isEntryEmpty()) psychoJS.experiment.nextEntry();
    psychoJS.window.close();
    psychoJS.quit({ message: message, isCompleted: isCompleted });
    return Scheduler.Event.QUIT;
}
