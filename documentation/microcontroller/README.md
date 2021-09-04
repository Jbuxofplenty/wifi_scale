# Microcontroller Setup

## Google Cloud IoT

Generate an Eliptic Curve (EC) private / public key pair:

    openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
    openssl ec -in ec_private.pem -pubout -out ec_public.pem

Register the device using the keys you generated:
*** Important: I've been using the MAC address without the colons as device names (cloud functions assume this naming convention for now) ***
- Example: MAC Address = `E8:DB:84:95:28:A6` -> Device Name = `E8DB849528A6`

    gcloud iot devices create <DEVICE_NAME> --region=us-central1 \
        --registry=wifi-scale-registry \
        --public-key path=ec_public.pem,type=es256

- Note: ran into a lot of issues trying to re-add a device with the same public key as another deleted device (gave weird x.509 certificate errors that didn't reference the true problem.  Needed to delete the registry and re-add it.)
- In order to retrieve the MAC address, you will need to upload the program to the microcontroller and connect to the WifiScale SSID with a computer.  Then navigate to `http://192.168.4.1/info` in your browser and look for the `Station MAC` field

## Microcontroller program

Download and install Arduino IDE
  - [Reference](https://www.arduino.cc/en/software)

Add libraries in the `microcontroller/lib` folder (referenced from the root of this repo)
  - Manually by placing them in your `Arduino` home folder you made during installation (mac)
  - Find libraries in public repos by going to `Tools->Manage Libraries...`

Convert private EC key to DER (x.509) format

    openssl ec -in ec_private.pem -out private-key.der -outform DER

Copy private-key.der to device by placing it in the `data` folder referenced from the root of the project directory. Then use the sketch data upload plugin to copy to device
- Reference [this repository](https://github.com/esp8266/arduino-esp8266fs-plugin)

Copy `GSR4.crt` and `gtsltsr.crt`certificate authority (CA) certs to device by placing it in the `data` folder referenced from the root of the project directory. Then use the sketch data upload plugin to copy to device

Replace `device_id` variable in `microcontroller/esp8266/ciotc_config.h` with the MAC address of the microcontroller

Compile and upload `microcontroller/esp8266` project (referenced from the root of this repo)

## References
- [Google Cloud IoT Arduino](https://github.com/GoogleCloudPlatform/google-cloud-iot-arduino)