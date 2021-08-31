
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h> 

extern "C" {
#include "gpio.h"
}
extern "C" {
#include "user_interface.h"
}

// User built libs must be included after system libs
// NOTE: Order dependent
#include "esp8266_mqtt.h"
#include "wifi.h"
#include "hx711.h"
#include "util.h"
#include "push_button.h"

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
  else if(payload == "sleep") {
    ESP.reset();
  }
  else {
    Serial.println("Unrecognized Command: " + payload);
  }
}

void setup() {  
  // Serial connection setup
  Serial.begin(115200);
  gpio_init();

  // Setup scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(LOADCELL_DIVIDER);
  scale.set_offset(LOADCELL_OFFSET);

  // Wifi manager setup
  Serial.println("Starting WifiManager with SSID=WifiScale");
  // wifiManager.resetSettings();
  wifiManager.autoConnect("WifiScale");
  delay(1000);
  pinMode(LED_BUILTIN, OUTPUT);
  setupCloudIoT();
  sleepNow();
}

unsigned long lastHours = 0;
void loop() {
  if(WiFi.status() == WL_CONNECTED) {
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
  delay(1000);
}
