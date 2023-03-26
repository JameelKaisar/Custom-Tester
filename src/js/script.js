var dcs_data = new Map();
var dcs_data_init = false;

function dcsDataListPlot(list) {
    const result_table = document.getElementById('result-table-probnik');
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

function handleData(data) {
    // console.log(JSON.stringify(data, 0, 4));
    if (!dcs_data_init) {
        for (let i=0; i<data.data.length; i++) {
            dcs_data.set(data.data[i].name, [
                data.data[i].name, Infinity, 0, 0, 0
            ]);
        }
        dcs_data_init = true;
    }
    for (let i=0; i<data.data.length; i++) {
        for (let j=0; j<3; j++) {
            dcs_data.set(data.data[i].name, [
                data.data[i].name,
                Math.min(dcs_data.get(data.data[i].name)[1], Math.round(data.data[i].data[j].d)),
                Math.max(dcs_data.get(data.data[i].name)[2], Math.round(data.data[i].data[j].d)),
                dcs_data.get(data.data[i].name)[3] + Math.round(data.data[i].data[j].d),
                dcs_data.get(data.data[i].name)[4] + 1
            ]);
        }
    }
    var dcs_data_list = Array.from(dcs_data.values());
    dcs_data_list.sort((a, b) => {
        return a[3]/a[4] < b[3]/b[4] ? -1 : 1;
    });
    dcsDataListPlot(dcs_data_list);
}
