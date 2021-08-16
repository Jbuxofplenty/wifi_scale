
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h>

// User built libs must be included after system libs
#include "esp8266_mqtt.h"
#include "wifi.h"
#include "hx711.h"

// The MQTT callback function for commands and configuration updates
// Place your message handler code here.
void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
}

void setup() {  
  // Serial connection setup
  Serial.begin(115200);

  // Setup scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  // Wifi manager setup
  Serial.println("Starting WifiManager with SSID=WifiScale");
  WiFiManager wifiManager;
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
