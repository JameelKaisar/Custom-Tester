function dcsDataListPlotCustom(list) {
    const result_table = document.getElementById('result-table-custom');
    const table = document.createElement('table');
    const thead = document.createElement('tr');
    for (const x of ["Data Center", "Minimum", "Maximum", "Average", "Pulses"]) {
        const th = document.createElement('th');
        th.innerHTML = x;
        thead.appendChild(th);
    }
    table.appendChild(thead);
    for (let i=0; i<list.length; i++) {
        const tr = document.createElement('tr');
        for (const x of [list[i][0], list[i][1], list[i][2], Math.round(list[i][3] / list[i][4]), list[i][4]]) {
            const td = document.createElement('td');
            td.innerHTML = x;
            tr.appendChild(td);
        }
        table.appendChild(tr);
        console.log(`${list[i][0]}: min = ${list[i][1]}, max = ${list[i][2]}, avg = ${Math.round(list[i][3]/list[i][4])}, pulses = ${list[i][4]}`);
    }
    result_table.replaceChildren(table);
}


class Tester {
    constructor(recipeUrl = null) {
        this.probeDelay = 500;
        this.recipeUrl = recipeUrl;
        this.dcEndpoints = null;
        this.dcs_data = null;
    }

    setRecipe(recipeUrl) {
        this.recipeUrl = recipeUrl;
        this.dcEndpoints = null;
        this.dcs_data = null;
    }

    async getEndpoints() {
        const response = await fetch(this.recipeUrl);
        const recipe = await response.json();

        this.pulseDelay = recipe.pulse_delay;
        this.pulseTimeout = recipe.pulse_timeout;

        this.dcEndpoints = new Map();

        for (let i=0; i<recipe.targets.length; i++) {
            this.dcEndpoints.set(
                recipe.targets[i].name,
                recipe.targets[i].target
            );
        }

        for (let i=0; i<recipe.targets.length; i++) {
            dcs_data.set(recipe.targets[i].name, [
                recipe.targets[i].name, Infinity, 0, 0, 0
            ]);
        }
    }

    async waitProbe() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        while (this.busy) {
            console.log("waiting", this.busy );
            await delay(100);
        }
    }

    async runProbe(cb = () => {}) {
        if (!this.recipeUrl) {
            console.log("No Recipe Found!");
            return;
        }

        if (!this.dcEndpoints) {
            await this.getEndpoints();
        }

        for (let [key, value] of this.dcEndpoints) {
            this.busy = true;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', value, true);
            xhr.onreadystatechange = function () {
                switch (xhr.readyState) {
                    case 4:
                        let probe_results = window.performance.getEntriesByName(value);
                        let probe_result = probe_results.at(-1);
                        let duration = probe_result.duration;
                        dcs_data.set(key, [
                            key,
                            Math.min(dcs_data.get(key)[1], Math.round(duration)),
                            Math.max(dcs_data.get(key)[2], Math.round(duration)),
                            dcs_data.get(key)[3] + Math.round(duration),
                            dcs_data.get(key)[4] + 1
                        ]);
                        var dcs_data_list = Array.from(dcs_data.values());
                        dcs_data_list.sort((a, b) => {
                            return a[3]/a[4] < b[3]/b[4] ? -1 : 1;
                        });
                        dcsDataListPlotCustom(dcs_data_list);
                        break;
                }
                console.log("finishing...");
                this.busy = false;
                console.log("ready...");
            };
            xhr.send();
            await this.waitProbe();
        }

        cb();
    }

}

var toggleButtonCustom = document.getElementById('toggle-button-custom');
var testingMessageCustom = document.getElementById('testing-message-custom');

toggleButtonCustom.addEventListener('click', () => {
    let t = new Tester();
    t.setRecipe("/recipe");
    t.runProbe();
});
