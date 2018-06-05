import * as axios from 'axios';

const BASE_URL = 'https://www.ebi.ac.uk/chembl/api/utils';

function convert2xyz(formData) {
    const smiles = formData.getAll("smiles");

    const promises = smiles.map((x) => validateSmiles(x)
        .then(smile => {
            return smiles2ctab(smile);
        })
        .then(ctab => {
            return ctab2xyz(ctab);
        })
        .then(xyz => {
            //console.log(x.name, xyz);
            return { name: x.name, body: xyz};
        }));

    return Promise.all(promises);
}

function smiles2ctab(smile) {
    const url = `${BASE_URL}/smiles2ctab`;

    return axios.post(url, smile)
        // get data
        .then(x => x.data);
}

function ctab2xyz(ctab) {
    const url = `${BASE_URL}/ctab2xyz`;

    return axios.post(url, ctab)
        // get data
        .then(x => x.data);
}

function validateSmiles(smile) {
    return new Promise((resolve, reject) => {
        const fReader = new FileReader();

        fReader.onload = () => {

            let x = fReader.result.trim();
            if (x.match(/^([^J][0-9BCOHNSOPrIFla@+\-\[\]\(\)\\\/%=#$]{6,})$/ig)) {
                //console.log(escape(smile.name));
                //console.log(fReader.result);
                resolve(fReader.result);
            } else {
                reject(new Error(escape(smile.name) + " doesn\'t look like a valid SMILES file"));
            }
        }

        fReader.readAsText(smile);
    })
}

function xyz2speck(data) {
    let lines = data.split("\n");
    let natoms = parseInt(lines[0]);
    let nframes = Math.floor(lines.length / (natoms + 2));
    let trajectory = [];
    for (let i = 0; i < nframes; i++) {
        let atoms = [];
        for (let j = 0; j < natoms; j++) {
            let line = lines[i * (natoms + 2) + j + 2].split(/\s+/);
            let atom = {};
            let k = 0;
            while (line[k] == "") k++;
            atom.symbol = line[k++];
            atom.position = [
                parseFloat(line[k++]),
                parseFloat(line[k++]),
                parseFloat(line[k++])
            ];
            atoms.push(atom);
        }
        trajectory.push(atoms);
    }
    return trajectory;
}

export { convert2xyz, xyz2speck }