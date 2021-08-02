/*
 *  Simple HTTP get webclient test
 */
 
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h>

// Helper functions
void resetToFactoryDefaults() {
  WiFi.disconnect();
  delay(3000);
}

// Globals
int LED = 0; // Assign LED pin i.e: D1 on NodeMCU
const char* host = "wifitest.adafruit.com";

void setup() {
  // Reset
  resetToFactoryDefaults();
  
  // Serial connection setup
  Serial.begin(115200);
  delay(100);

  // LED control
  pinMode(LED, OUTPUT);

  // Wifi manager setup
  Serial.println();
  Serial.println();
  Serial.println("Starting WifiManager with SSID=AutoConnectAP");
  WiFiManager wifiManager;
  wifiManager.resetSettings();
  wifiManager.autoConnect("AutoConnectAP");
}

void loop() {
  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 80;
  digitalWrite(LED, LOW); // turn the LED off
  if (!client.connect(host, httpPort)) {
    delay(2000);
    digitalWrite(LED, HIGH); // turn the LED on
    delay(2000);
    Serial.println("connection failed");
    return;
  }

  // Connection established, wait 5 seconds before fetching
  delay(5000);
  
  // We now create a URI for the request
  String url = "/testwifi/index.html";
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(500);
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("closing connection");
}
