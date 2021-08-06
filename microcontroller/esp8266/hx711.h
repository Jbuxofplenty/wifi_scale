#include <HX711.h>

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

void tareScale() {
  Serial.println("");
  Serial.println("Empty the scale so it can be tared:");
//  delay(10000);
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
//  delay(10000);
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

String publishWeight() {
  scale.power_up();
  delay(1000);
  String payload;
  
  // Scale reading
  Serial.println("//////////////////// Scale Reading //////////////////////////");
  if (scale.is_ready()) {\
    float weightGrams = scale.get_units(10);
    Serial.print("\t| average:\t");
    Serial.println(weightGrams, 1);

    payload = String("{\"timestamp\":") + time(nullptr) +
                      String(",\"weight in grams\":") + weightGrams +
                      String("}");

    scale.power_down();              // put the ADC in sleep mode
  } else {
    Serial.println("HX711 not found.");
    payload = String("HX711 not found.");
  }
  Serial.println("////////////////// End Scale Reading ////////////////////////");
  return payload;
}