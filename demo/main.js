import { RestRecipeProvider, BrowserProbe } from '../probnik/probnik.ts';

var recipeProvider = new RestRecipeProvider('/recipe');

var toggleButtonProbnik = document.getElementById('toggle-button-probnik');
var testingMessageProbnik = document.getElementById('testing-message-probnik');

var testerIsActive = false;

var probeTimer = null;

function onComplete(data) {
    if (testerIsActive) {
        handleData(data);
        probeTimer = setTimeout(runProbe, 500);
    }
}

function runProbe() {
    var t = new BrowserProbe(recipeProvider, onComplete);
    t.start();
}

function toggleTest() {
    toggleButtonProbnik.innerHTML = testerIsActive ? 'Start' : 'Stop';
    testingMessageProbnik.innerHTML = testerIsActive ? '' : 'Testing...';
    testerIsActive = !testerIsActive;
    clearTimeout(probeTimer);
    if (testerIsActive)
        runProbe();
}

toggleButtonProbnik.addEventListener('click', toggleTest);

