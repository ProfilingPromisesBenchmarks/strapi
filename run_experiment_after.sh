#!/bin/bash

for i in {1..50}
do
  npm run test:unit >> strapi_after.log
done
