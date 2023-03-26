var toggleButtonCustom = document.getElementById('toggle-button-custom');
var testingMessageCustom = document.getElementById('testing-message-custom');

var customTesterActive = false;
var customTesterTimer = null;

var wmf_tester = new WMFTester();
wmf_tester.setRecipeUrl("/recipe");
// wmf_tester.setRecipeJson({});


function onCompleteCustom(data) {
    if (customTesterActive) {
        let data_list = Object.values(data);
        data_list.sort((a, b) => {
            return a[3]/a[4] < b[3]/b[4] ? -1 : 1;
        });
        populateTable(data_list, 'result-table-custom');
        customTesterTimer = setTimeout(runProbeCustom, 500);
    }
}


function onErrorCustom(err) {
    console.log(err);
}


function runProbeCustom() {
    wmf_tester.runProbe(onCompleteCustom, onErrorCustom);
}


function toggleButtonCustomHandler() {
    customTesterActive = !customTesterActive;
    toggleButtonCustom.innerHTML = customTesterActive ? 'Stop' : 'Start';
    testingMessageCustom.innerHTML = customTesterActive ? 'Testing...' : '';
    clearTimeout(customTesterTimer);
    if (customTesterActive)
        runProbeCustom();
}


toggleButtonCustom.addEventListener('click', toggleButtonCustomHandler);
