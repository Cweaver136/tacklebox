
const file = "./test.jpg";
const buffer = fs.readFileSync(file);
const parser = exif.create(buffer);
const result = parser.parse();
console.log(result)
const hdr = result.tags.CustomRendered === 3;
// for iphone se 2
// values in mm
let focalLength = 3.9900000095374253;
let sensorSize = 8.46582