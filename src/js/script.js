function populateTable(data_list, table_id) {
    const result_table = document.getElementById(table_id);
    const table = document.createElement('table');
    const thead = document.createElement('tr');
    for (const x of ["Data Center", "Minimum", "Maximum", "Average", "Pulses"]) {
        const th = document.createElement('th');
        th.innerHTML = x;
        thead.appendChild(th);
    }
    table.appendChild(thead);
    for (const target of data_list) {
        const tr = document.createElement('tr');
        for (const x of [target[0], target[1], target[2], Math.round(target[3] / target[4]), target[4]]) {
            const td = document.createElement('td');
            td.innerHTML = x;
            tr.appendChild(td);
        }
        table.appendChild(tr);
        console.log(`${target[0]}: min = ${target[1]}, max = ${target[2]}, avg = ${Math.round(target[3]/target[4])}, pulses = ${target[4]}`);
    }
    result_table.replaceChildren(table);
}
