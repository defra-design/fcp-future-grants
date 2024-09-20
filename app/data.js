const fs = require('fs')
const _ = require('underscore')

const files = fs.readdirSync('./app/data/equipment/')
const data = []

// Function below is combining all JSON data files into a function called getData

function getData() {
    // The loop to merge all JSON files together
    _.each(files, (filename) => {
            if (filename.endsWith('.json')){
            const file = fs.readFileSync('./app/data/equipment/' + filename).toString()
            try {
                const json = JSON.parse(file)
                json.filename = filename
                data.push(json)
            } catch(err) {
                console.log('Can\'t read file: ',filename)
            }
        }
    })

    return data;
}

module.exports = {
    getData,
}
