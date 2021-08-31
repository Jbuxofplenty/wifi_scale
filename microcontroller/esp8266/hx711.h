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

// Default values
// const long LOADCELL_OFFSET = 819655.33;
const long LOADCELL_OFFSET = -815248.33;
const long LOADCELL_DIVIDER = 189.45;
  
//////////////////////////////////////////////////////////////////////////////////
// End scale global variables
//////////////////////////////////////////////////////////////////////////////////

void calibrateScale(float calibration_weight) {
  scale.power_up();
  delay(1000);
  // Scale reading
  Serial.println("//////////////////// Scale Calibration //////////////////////////");
  if (scale.is_ready()) {
    Serial.println("");
    Serial.println("Empty the scale so it can be tared:");
    delay(8000);
    scale.set_scale();  // this value is obtained by calibrating the scale with known weights; see the README for details
    scale.tare();				// reset the scale to 0
    delay(4000);

    Serial.println("Place 100 grams on the scale:");
    delay(14000);
    float current_reading = scale.get_units(10);
    Serial.print("Before setting up scale: \t\t");
    Serial.println(current_reading, 1);	// print the average of 5 readings from the ADC minus tare weight (not set) divided
    Serial.print("Scaling factor: \t\t");
    Serial.println(current_reading/calibration_weight);
    scale.set_scale(current_reading/calibration_weight); // this value is obtained by calibrating the scale with known weights; see the README for details

    Serial.print("After setting up scale: \t\t");
    Serial.println(scale.get_units(5), 1);        // print the average of 5 readings from the ADC minus tare weight, divided
              // by the SCALE parameter set with set_scale
    scale.power_down();              // put the ADC in sleep mode
  } else {
    Serial.println("HX711 not found.");
  }
  Serial.println("////////////////// End Scale Calibration ////////////////////////");
}

String getWeight() {
  scale.power_up();
  delay(1000);
  String payload;
  
  // Scale reading
  Serial.println("//////////////////// Scale Reading //////////////////////////");
  if (scale.is_ready()) {
    float weightGrams = scale.get_units(10);
    Serial.print("\t| average:\t");
    Serial.println(weightGrams, 1);

    payload = String(weightGrams);

    scale.power_down();              // put the ADC in sleep mode
  } else {
    Serial.println("HX711 not found.");
    payload = String("HX711 not found.");
  }
  Serial.println("////////////////// End Scale Reading ////////////////////////");
  return payload;
}

void tareScale() {
  scale.power_up();
  delay(1000);
  // Scale reading
  Serial.println("//////////////////// Scale Tare //////////////////////////");
  if (scale.is_ready()) {
    Serial.println("");
    Serial.println("Scale will be tared in 8 seconds");
    delay(8000);
    scale.tare();				        // reset the scale to 0

    delay(1000);

    Serial.print("read: \t\t");
    Serial.println(scale.read());                 // print a raw reading from the ADC

    Serial.print("read average: \t\t");
    Serial.println(scale.read_average(20));       // print the average of 20 readings from the ADC

    Serial.print("get value: \t\t");
    Serial.println(scale.get_value(5));		// print the average of 5 readings from the ADC minus the tare weight, set with tare()
    scale.power_down();              // put the ADC in sleep mode
  } else {
    Serial.println("HX711 not found.");
  }
  Serial.println("////////////////// End Scale Tare ////////////////////////");
}