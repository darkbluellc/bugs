const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const mqtt = require("mqtt");
require("dotenv").config();

//globals
const SERIAL_PORT = process.env.SERIAL_PORT;
const MQTT_SERVER = process.env.MQTT_SERVER;
const MQTT_TOPIC = process.env.MQTT_TOPIC;
const UPDATE_AT_LEAST_SEC = process.env.UPDATE_AT_LEAST_SEC;
let lastUpdateTimestamp;
let states;

const client = mqtt.connect(`mqtt://${MQTT_SERVER}`);

const handleStates = (line) => {
  let cleanLine = line.substring(2).split("i");
  cleanLine.shift();

  const now = Date.now() / 1000;

  if (
    lastUpdateTimestamp == undefined ||
    now - lastUpdateTimestamp > UPDATE_AT_LEAST_SEC ||
    line !== states
  ) {
    lastUpdateTimestamp = now;
    states = line;
    for (const foo of cleanLine) {
      const currentZone = foo.split(" ");
      const zone = parseInt(currentZone[0]) + 1;
      const state = currentZone[1].substring(1);
      client.publish(`${MQTT_TOPIC}/zone/${zone}`, state);
    }
  }
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

const port = new SerialPort({ path: SERIAL_PORT, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
parser.on("data", handleLine);
