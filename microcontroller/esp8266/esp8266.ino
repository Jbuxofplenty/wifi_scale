/*
 *  Simple HTTP get webclient test
 */
 
#include <ESP8266WiFi.h>
#include <strings_en.h>
#include <WiFiManager.h>
#include "HX711.h"

//////////////////////////////////////////////////////////////////////////////////
// Scale global variables
//////////////////////////////////////////////////////////////////////////////////

// Define switch pin
#define MODE_PIN 2

// Define scale amp data pins

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 4;
const int LOADCELL_SCK_PIN = 5;

HX711 scale;

// Define calibration factor.  This can be adjusted in calibration mode by pressing
// a/z or +/- keys
float calibration_factor = -21050;
float reading = 0;
  
//////////////////////////////////////////////////////////////////////////////////
// End scale global variables
//////////////////////////////////////////////////////////////////////////////////


// Helper functions
void resetToFactoryDefaults() {
  WiFi.disconnect();
  delay(3000);
}

void setupScale() {
  // Scale setup
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  Serial.println("Empty the scale so it can be tared:");
  delay(10000);
  scale.set_scale();                      // this value is obtained by calibrating the scale with known weights; see the README for details
  scale.tare();				        // reset the scale to 0

  Serial.println("Before setting up the scale:");
  Serial.print("read: \t\t");
  Serial.println(scale.read());			// print a raw reading from the ADC

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));  	// print the average of 20 readings from the ADC

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));		// print the average of 5 readings from the ADC minus the tare weight (not set yet)

  Serial.print("get units: \t\t");
  Serial.println(scale.get_units(5), 1);	// print the average of 5 readings from the ADC minus tare weight (not set) divided
						// by the SCALE parameter (not set yet)

  Serial.println("Place 138 grams on the scale:");
  delay(10000);
  scale.set_scale(138.f);                      // this value is obtained by calibrating the scale with known weights; see the README for details

  Serial.println("After setting up the scale:");

  Serial.print("read: \t\t");
  Serial.println(scale.read());                 // print a raw reading from the ADC

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));       // print the average of 20 readings from the ADC

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));		// print the average of 5 readings from the ADC minus the tare weight, set with tare()

  Serial.print("get units: \t\t");
  Serial.println(scale.get_units(5), 1);        // print the average of 5 readings from the ADC minus tare weight, divided
						// by the SCALE parameter set with set_scale
}

// Globals
int LED = 0; // Assign LED pin i.e: D1 on NodeMCU
const char* host = "wifitest.adafruit.com";

void setup() {
  // Reset
  // resetToFactoryDefaults();
  
  // Serial connection setup
  Serial.begin(115200);
  delay(1000);

  // LED control
  pinMode(LED, OUTPUT);

  // Setup scale
  setupScale();

  // Wifi manager setup
  Serial.println();
  Serial.println();
  Serial.println("Starting WifiManager with SSID=AutoConnectAP");
  WiFiManager wifiManager;
  // wifiManager.resetSettings();
  wifiManager.autoConnect("AutoConnectAP");
}

void loop() {
  // Scale reading
  Serial.println("//////////////////// Scale Reading /////////////////////////");
  if (scale.is_ready()) {\
    Serial.print("one reading:\t");
    Serial.print(scale.get_units(), 1);
    Serial.print("\t| average:\t");
    Serial.println(scale.get_units(10), 1);

    scale.power_down();			        // put the ADC in sleep mode
  } else {
    Serial.println("HX711 not found.");
  }
  Serial.println("//////////////////// End Scale Reading /////////////////////////");

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
  
    scale.power_up();
    return;
  }

  // Connection established, wait 5 seconds before fetching
  delay(5000);
  
  scale.power_up();
  
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
