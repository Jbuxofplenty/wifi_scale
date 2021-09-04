

bool sleeping = false;
int pushButtonPin = 13;   // choose the input pin (for a pushbutton)


void wakeupFromMotion(void) {
  wifi_fpm_close;
  wifi_set_opmode(STATION_MODE);
  wifi_station_connect();
  Serial.println("Woke up from sleep");
}

void sleepNow() {
  Serial.println("going to light sleep...");
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(D4, HIGH);
  wifi_station_disconnect();
  wifi_set_opmode(NULL_MODE);
  wifi_fpm_set_sleep_type(LIGHT_SLEEP_T); //light sleep mode
  gpio_pin_wakeup_enable(GPIO_ID_PIN(13), GPIO_PIN_INTR_HILEVEL); 
  wifi_fpm_open();
  delay(100);
  wifi_fpm_set_wakeup_cb(wakeupFromMotion); //wakeup callback
  wifi_fpm_do_sleep(0xFFFFFFF); 
  delay(100);
}