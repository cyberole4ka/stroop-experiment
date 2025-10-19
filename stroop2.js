/**************** 
 * Stroop2 *
 ****************/

import { core, data, util, visual } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;

// --- Экспериментальная информация ---
let expName = 'stroop2';
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};

// Инициализация PsychoJS
const psychoJS = new PsychoJS({ debug: true });
psychoJS.openWindow({
    fullscr: true,
    color: new util.Color([1, 1, 1]),
    units: 'height',
    waitBlanking: true,
});

// --- Диалоговое окно участника ---
psychoJS.schedule(psychoJS.gui.DlgFromDict({
    dictionary: expInfo,
    title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);

psychoJS.scheduleCondition(
    () => psychoJS.gui.dialogComponent.button === 'OK',
    flowScheduler,
    dialogCancelScheduler
);

// --- Update Info ---
async function updateInfo() {
    expInfo['date'] = util.MonotonicClock.getDateStr();
    expInfo['expName'] = expName;
    expInfo['psychopyVersion'] = '2025.1.1';
    expInfo['OS'] = window.navigator.platform;
    expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
    psychoJS.experiment.dataFileName = `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`;
    psychoJS.experiment.field_separator = '\t';
    return Scheduler.Event.NEXT;
}

// --- Переменные эксперимента ---
var InstrukcjaClock, Instrukcja_text, mouse_2;
var trialClock, text, img_red, img_green, img_blue, img_yellow, mouse;
var globalClock, routineTimer;
var trials;

// --- Инициализация эксперимента ---
async function experimentInit() {
    // --- Instrukcja ---
    InstrukcjaClock = new util.Clock();
    Instrukcja_text = new visual.TextStim({
        win: psychoJS.window,
        name: 'Instrukcja_text',
        text: 'W teście pojawi się 6 słów w języku polskim i 6 w języku angielskim. Wybierz KOLOR, odpowiadający znaczeniu słowa. \n\n\n*kliknij żeby zacząć*',
        font: 'Arial',
        units: undefined, pos: [0, 0], height: 0.05,
        color: new util.Color([-1, -1, -1])
    });
    mouse_2 = new core.Mouse({ win: psychoJS.window });
    mouse_2.mouseClock = new util.Clock();

    // --- Trial ---
    trialClock = new util.Clock();
    text = new visual.TextStim({ win: psychoJS.window, name: 'text', text: '', font: 'Arial', pos: [0,0], height: 0.15, color: new util.Color('white') });
    img_red = new visual.ImageStim({ win: psychoJS.window, name: 'img_red', image: 'Kolory/red.png', pos: [-0.5,0.4], size:[0.3,0.3] });
    img_green = new visual.ImageStim({ win: psychoJS.window, name: 'img_green', image: 'Kolory/green.png', pos: [0.5,0.4], size:[0.3,0.3] });
    img_blue = new visual.ImageStim({ win: psychoJS.window, name: 'img_blue', image: 'Kolory/blue.png', pos: [-0.5,-0.4], size:[0.3,0.3] });
    img_yellow = new visual.ImageStim({ win: psychoJS.window, name: 'img_yellow', image: 'Kolory/yellow.png', pos: [0.5,-0.4], size:[0.3,0.3] });
    mouse = new core.Mouse({ win: psychoJS.window });
    mouse.mouseClock = new util.Clock();

    globalClock = new util.Clock();
    routineTimer = new util.CountdownTimer();
    return Scheduler.Event.NEXT;
}

// --- Scheduler ---
flowScheduler.add(updateInfo);
flowScheduler.add(experimentInit);
flowScheduler.add(InstrukcjaRoutineBegin());
flowScheduler.add(InstrukcjaRoutineEachFrame());
flowScheduler.add(InstrukcjaRoutineEnd());

const trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
flowScheduler.add(trialsLoopScheduler);
flowScheduler.add(trialsLoopEnd);

flowScheduler.add(sendDataToSheet); // отправка данных на Google Sheets
flowScheduler.add(quitPsychoJS, 'Thank you for your patience.', true);
dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your patience.', false);

// --- Google Sheets ---
async function sendDataToSheet() {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbw9YxwBiVg1-yGT0GN285Jcjz95X-LPGy6utRC5Nyg9EAFjz_cvkXacXkUIT8rWKwk1/exec"; // <-- сюда вставь свой URL Google Apps Script
    const dataToSend = psychoJS.experiment.getDataAsJSON();
    try {
        await fetch(sheetUrl, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: { "Content-Type": "application/json" }
        });
        console.log("Data sent to Google Sheets successfully.");
    } catch (error) {
        console.error("Error sending data to Google Sheets:", error);
    }
    return Scheduler.Event.NEXT;
}

// --- Quit ---
async function quitPsychoJS(message, isCompleted) {
    if (psychoJS.experiment.isEntryEmpty()) psychoJS.experiment.nextEntry();
    psychoJS.window.close();
    psychoJS.quit({message, isCompleted});
    return Scheduler.Event.QUIT;
}
