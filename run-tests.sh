#!/usr/bin/env bash

# Clear detections
echo "" > ~/detections

# Run the unit tests
npm run test:unit

# Print the detections
cat ~/detections
