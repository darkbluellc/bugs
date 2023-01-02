const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
require("dotenv").config();

//globals
const SERIAL_PORT = process.env.SERIAL_PORT;
const MQTT_SERVER = process.env.MQTT_SERVER;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

const handleStates = (line) => {
  let lineA = line.substring(2).split("i");
  lineA.shift();
  console.log(lineA);
};

const handleChange = (line) => {
  console.log("change");
};

const handleLine = (line) => {
  const firstChar = line.slice(0, 1);
  if (firstChar == "s") {
    handleStates(line);
  } else if (firstChar == "c") {
    handleChange(line);
  } else {
    return -1;
  }
};

const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
parser.on("data", handleLine);
