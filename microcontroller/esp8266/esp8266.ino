
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h>

// User built libs must be included after system libs
#include "esp8266_mqtt.h"
#include "wifi.h"
#include "hx711.h"

WiFiManager wifiManager;

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
    // String weight = getWeight();
    int random_number = rand() % 100 + 1;
    String weight = String(random_number);
    Serial.println("Weight: " + weight)
    publishTelemetry("/getWeight", weight);
  }
}

void setup() {  
  // Serial connection setup
  Serial.begin(115200);

  // Setup scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  // Wifi manager setup
  Serial.println("Starting WifiManager with SSID=WifiScale");
  wifiManager.resetSettings();
  wifiManager.autoConnect("WifiScale");
  delay(1000);
  pinMode(LED_BUILTIN, OUTPUT);
  setupCloudIoT();
}

unsigned long lastMillis = 0;
void loop() {
  mqtt->loop();
  delay(10);  // <- fixes some issues with WiFi stability

  if (!mqttClient->connected()) {
    connect();
  }

  delay(60000);

  // publish a message roughly every second.
  // if (millis() - lastMillis > 10000) {
  //   lastMillis = millis();
  //   publishTelemetry(getDefaultSensor());
  // }
}
