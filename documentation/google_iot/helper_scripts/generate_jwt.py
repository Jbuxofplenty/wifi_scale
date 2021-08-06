#!/usr/bin/env python
"""
Author: Josiah Buxton
Description: Uses a ES256 private key (defined in a file) to generate a JWT for
debugging cloud IoT functions
"""

import datetime

import jwt

import argparse
parser = argparse.ArgumentParser()
   
parser.add_argument('-i', '--input', type=str, required=True, default='../../offline/ec_private.pem',
    help="path to private key which will be used to generate JWT")
args = parser.parse_args()

PROJECT_ID = 'wifi-scale-9b7b1'
SSL_PRIVATE_KEY_FILEPATH = args.input
SSL_ALGORITHM = 'ES256'


def create_jwt(project_id, private_key_file, algorithm):
    """Creates a JWT (https://jwt.io) to establish an MQTT connection.
        Args:
         project_id: The cloud project ID this device belongs to
         private_key_file: A path to a file containing either an RSA256 or
                 ES256 private key.
         algorithm: The encryption algorithm to use. Either 'RS256' or 'ES256'
        Returns:
            An MQTT generated from the given project_id and private key, which
            expires in 60 minutes. After 60 minutes, your client will be
            disconnected, and a new JWT will have to be generated.
        Raises:
            ValueError: If the private_key_file does not contain a known key.
        """

    token = {
        # The time that the token was issued at
        'iat': datetime.datetime.utcnow(),
        # The time the token expires.
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        # The audience field should always be set to the GCP project id.
        'aud': project_id
    }

    # Read the private key file.
    with open(private_key_file, 'r') as f:
        private_key = f.read()

    print('Creating JWT using {} from private key file {}'.format(algorithm, private_key_file))

    return jwt.encode(token, private_key, algorithm=algorithm)


print('JWT token:')
print(create_jwt(PROJECT_ID, SSL_PRIVATE_KEY_FILEPATH, SSL_ALGORITHM))

"""
Test publish event over http
curl -X POST \
  -H 'authorization: Bearer <jwt>' \
  -H 'content-type: application/json' \
  -H 'cache-control: no-cache' \
  --data '{"binary_data": "aGVsbG8K"}' \
  'https://cloudiotdevice.googleapis.com/v1/projects/wifi-scale-9b7b1/locations/us-central1/registries/wifi-scale-registry/devices/esp8266:publishEvent'
"""

"""
Test publish event over mqtt
mosquitto_pub \
--host mqtt.googleapis.com \
--port 8883 \
--id projects/wifi-scale-9b7b1/locations/us-central1/registries/wifi-scale-registry/devices/esp8266 \
--username unused \
--pw "<jwt>" \
--cafile ./roots.pem \
--tls-version tlsv1.2 \
--protocol-version mqttv311 \
--debug \
--qos 1 \
--topic /devices/esp8266/events \
--message "Hello MQTT"

Verify it works
gcloud pubsub subscriptions pull --auto-ack $PUBSUB_SUBSCRIPTION --limit=1
"""