// Title    :   WMF Teater
// Author   :   Jameel Kaisar
// Date     :   Mar 26, 2023


// syncronize ith pulse of each target?
// this.busy -> Enforce only 1 probe at a time
// static class



class WMFTester {
    constructor() {
        this.recipe = null;
        this.recipeUrl = null;
        this.targets = null;
        this.target_data = null;
    }

    setRecipeUrl(recipeUrl) {
        this.recipe = null;
        this.recipeUrl = recipeUrl;
        this.targets = null;
        this.target_data = null;
    }

    setRecipeJson(recipeJson) {
        this.recipe = recipeJson;
        this.recipeUrl = null;
        this.targets = null;
        this.target_data = null;
    }

    async runProbe(onComplete) {
        if (!this.recipe && !this.recipeUrl) {
            console.log("No recipe found!");
            return;
        }

        if (!this.recipe) {
            await this.fetchRecipe();
        }

        if (!this.targets || !this.target_data) {
            this.setupRecipe();
        }

        if (this.type != 'http_get') {
            console.log("Unsupported recipe!");
            return;
        }

        const targets = this.targets.keys();
        this.shuffleArray(targets);
        const probes = [];

        for (const target of targets) {
            probes.push(this.probeTarget(target));
        }

        Promise.all(probes).then(results => {
            let data = this.target_data;
            let data_obj = Object.fromEntries(data);
            onComplete(data_obj);
        }).catch(error => {
            onError("Something went wrong!");
        });
    }

    async fetchRecipe() {
        const response = await fetch(this.recipeUrl);
        this.recipe = await response.json();
    }

    setupRecipe() {
        this.name = this.recipe.name;
        this.type = this.recipe.type;
        this.pulses = this.recipe.pulses;
        this.pulse_delay = this.recipe.pulse_delay;
        this.pulse_timeout = this.recipe.pulse_timeout;
        this.ctx = this.recipe.ctx;

        this.targets = new Map();
        for (const target of this.recipe.targets) {
            this.targets.set(
                target.name,
                target.target
            );
        }

        this.target_data = new Map();
        for (const target of this.recipe.targets) {
            this.target_data.set(
                target.name,
                [target.name, Infinity, 0, 0, 0]
            );
        }
    }

    async probeTarget(target) {
        for (let i=0; i<this.pulses; i++) {
            const request = this.loadUsingXHR(target);
            // const request = this.loadUsingFetch(target);
            const timeout = this.delay_rej(this.pulse_timeout);
            try {
                await Promise.race([request, timeout]);
            } catch(error) {
                continue;
            }
            this.handleProbeResult(target);
            this.delay(this.pulse_delay);
        }
    }

    async loadUsingXHR(target) {
        let target_url = this.targets.get(target);
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', target_url, true);
            xhr.onreadystatechange = function () {
                switch (xhr.readyState) {
                    case 4:
                        resolve();
                        break;
                }
            };
            xhr.send();
        });
    }

    async loadUsingFetch(target) {
        let target_url = this.targets.get(target);
        await fetch(target_url);
    }

    handleProbeResult(target) {
        let target_url = this.targets.get(target);
        let probe_results = window.performance.getEntriesByName(target_url);
        let probe_result = probe_results.at(-1);
        let duration = probe_result.duration;
        let target_entry = this.target_data.get(target);
        this.target_data.set(target, [
            target,
            Math.min(target_entry[1], Math.round(duration)),
            Math.max(target_entry[2], Math.round(duration)),
            target_entry[3] + Math.round(duration),
            target_entry[4] + 1
        ]);
    }

    shuffleArray(array) {
        for (let i=array.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async delay(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }

    async delay_rej(ms) {
        return new Promise((res, rej) => setTimeout(rej, ms));
    }
}



function onComplete(data) {
    let data_list = Object.values(data);
    data_list.sort((a, b) => {
        return a[3]/a[4] < b[3]/b[4] ? -1 : 1;
    });
    for (const target of data_list) {
        console.log(`${target[0]}: min = ${target[1]}, max = ${target[2]}, avg = ${Math.round(target[3]/target[4])}, pulses = ${target[4]}`);
    }
}

function onError(err) {
    console.log(err);
}

let wmf_tester = new WMFTester();
wmf_tester.setRecipeUrl("/recipe");
// wmf_tester.setRecipeJson({});
wmf_tester.runProbe(onComplete, onError);
