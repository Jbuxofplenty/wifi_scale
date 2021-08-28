
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h>

// User built libs must be included after system libs
#include "esp8266_mqtt.h"
#include "wifi.h"
#include "hx711.h"
#include "util.h"

WiFiManager wifiManager;
float publishFrequency = 1;

// The MQTT callback function for commands and configuration updates
// Place your message handler code here.
void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  if(payload == "register") {
    Serial.println("Registering device with MAC address: " + WiFi.macAddress());
    publishTelemetry("/register", WiFi.macAddress());
  }
  else if(payload == "reset") {
    Serial.println("Reseting the device...");
    wifiManager.resetSettings();
    delay(2000);
    ESP.restart();
  }
  else if(payload == "getWeight") {
    Serial.println("Getting the weight...");
    String weight = getWeight();
    // int random_number = rand() % 100 + 1;
    // String weight = String(random_number);
    Serial.println("Weight: " + weight);
    publishTelemetry("/getWeight", weight);
  }
  else if(payload.startsWith("calibrate")) {
    float calibrationWeight = payload.substring(payload.indexOf(" ")+1).toFloat();
    calibrateScale(calibrationWeight);
    publishTelemetry("/calibrated", "");
  }
  else if(payload.startsWith("publishFrequency")) {
    publishFrequency = payload.substring(payload.indexOf(" ")+1).toFloat();
  }
  else if(payload == "tare") {
    tareScale();
  }
  else {
    Serial.println("Unrecognized Command: " + payload);
  }
}

int inPin = 13;   // choose the input pin (for a pushbutton)
int val = 0;     // variable for reading the pin status
void setup() {  
  pinMode(inPin, INPUT);    // declare push button as input
  // Serial connection setup
  Serial.begin(115200);

  // Setup scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  // Wifi manager setup
  Serial.println("Starting WifiManager with SSID=WifiScale");
  // wifiManager.resetSettings();
  wifiManager.autoConnect("WifiScale");
  delay(1000);
  pinMode(LED_BUILTIN, OUTPUT);
  setupCloudIoT();
}

unsigned long lastHours = 0;
void loop() {
  mqtt->loop();
  delay(10);  // <- fixes some issues with WiFi stability

  if (!mqttClient->connected()) {
    connect();
  }

  // publish a message roughly every second.
  if (hours() - lastHours > publishFrequency) {
    lastHours = hours();
    getWeight();
  }
}
