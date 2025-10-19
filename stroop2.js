/**************** 
 * Stroop2 *
 ****************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// --- Google Sheets POST function ---
async function sendToGoogleSheet(dataObj) {
    const scriptURL = 'ВАША_ССЫЛКА_НА_WEB_APP'; // <- Вставьте сюда ссылку на Web App Google Apps Script
    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObj)
        });
    } catch (error) {
        console.error('Ошибка отправки данных на Google Sheets:', error);
    }
}

// store info about the experiment session:
let expName = 'stroop2';  
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// Start code blocks for 'Before Experiment'
const psychoJS = new PsychoJS({ debug: true });

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([1.0, 1.0, 1.0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});

// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

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

// ... Здесь весь остальной код эксперимента без изменений ...

// В функции trialRoutineEnd добавляем отправку данных на Google Sheets
function trialRoutineEnd(snapshot) {
  return async function () {
    for (const thisComponent of trialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
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

    routineTimer.reset();

    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }

    // --- Отправка данных на Google Sheets ---
    const trialData = {
        participant: expInfo['participant'],
        session: expInfo['session'],
        trial_time: globalClock.getTime(),
        mouse_x: mouse.x,
        mouse_y: mouse.y,
        mouse_leftButton: mouse.leftButton,
        mouse_midButton: mouse.midButton,
        mouse_rightButton: mouse.rightButton,
        mouse_click_time: mouse.time,
        mouse_corr: mouse.corr,
        mouse_clicked_name: mouse.clicked_name
    };
    sendToGoogleSheet(trialData);

    return Scheduler.Event.NEXT;
  }
}
