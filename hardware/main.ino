// pins go clockwise starting at Darkblue logo
const int inputs[] = {A7, A6, A5, A4, A3, A2, A1, A0, 13, 12,
                      11, 10, 9,  8,  7,  6,  5,  4,  3,  2};

// 1 will mean HIGH or closed; if 0 or LOW, this means the window/door has been
// opened
bool states[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

bool currentState;

bool getState(int x) {
    if (x <= 1) {
        return analogRead(inputs[x]) > 200;
    }
    return digitalRead(inputs[x]);
}

bool stateChanged(int input, bool newState) {
    return states[input] != newState;
}

void updateAndSendChangedState(int input, bool newState) {
    states[input] = newState;

    Serial.print("c ");
    Serial.print('i');
    Serial.print(input);
    Serial.print(" s");
    Serial.println(newState);
}

void sendStateSummary() {
    Serial.print("s ");
    for (int x = 0; x < 20; x++) {
        Serial.print('i');
        Serial.print(x);
        Serial.print(" s");
        Serial.print(states[x]);
        Serial.print(" ");
    }
    Serial.println();
}

// * * * * * * program follows * * * * * *

void setup() {
    for (int x = 0; x < 20; x++) {
        pinMode(inputs[x], INPUT);
    }
    Serial.begin(115200);
}

void loop() {
    for (int x = 0; x < 20; x++) {
        currentState = getState(x);
        if (stateChanged(x, currentState)) {
            updateAndSendChangedState(x, currentState);
        }
        delay(1);
    }
    sendStateSummary();
    delay(500);
}
