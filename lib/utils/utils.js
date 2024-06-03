// function to remove space and \n
const extractJobDataSpace = (data) => {
    if(!data) return;

    const res = data.text().trim();
    // const output = res.replace(/[\r\n]+/gm, "").replace(/\s+/g, ' ');
    const output = res.replace(/[\r\n]+/gm, "").replace(/\s+/g, " ").replace(/<(?:.|\n)*?>/g, ", ");
    return output;
};

// function to remove space and replace with ','
const extractJobDataComma = (data) => {
    if(!data) return;

    const res = data.text().trim();
    const lines = res.split(/\n/);
    const output = lines.map(line => line.trim()).filter(line => line.length > 0).join(', ');
    return output;
};

// separate each tag with comma
const extractCommaSeparated = ($,data) => {
    if(!$) return;

    const output = $(data).map((index, element) => $(element).text().trim()).get().join(", ");
    return output.match(/\b\w+\b/g);
} 

// remove space function
const extractWhiteSpace = (data) => {
    if(!data) retrun;
    const output = data.replace(/\s/g, "-");
    console.log(output);
    return output;
}



module.exports = {
    extractJobDataSpace, 
    extractJobDataComma, 
    extractCommaSeparated,
    extractWhiteSpace
};