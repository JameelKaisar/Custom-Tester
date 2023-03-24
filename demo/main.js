import { RestRecipeProvider, BrowserProbe } from '../probnik/probnik.ts';

var recipeProvider = new RestRecipeProvider('/recipe');

var toggleButton = document.getElementById('toggle-button');
var testingMessage = document.getElementById('testing-message');

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
    toggleButton.innerHTML = testerIsActive ? 'Start' : 'Stop';
    testingMessage.innerHTML = testerIsActive ? '' : 'Testing...';
    testerIsActive = !testerIsActive;
    clearTimeout(probeTimer);
    if (testerIsActive)
        runProbe();
}

toggleButton.addEventListener('click', toggleTest);

