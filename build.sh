#!/bin/bash

java -jar bundletool-all-1.17.2.jar build-apks --bundle=platforms/android/app/build/outputs/bundle/release/app-release.aab --output=patroli.apks --ks=release-key.jks --ks-key-alias=release-key --ks-pass=pass:bismillah --key-pass=pass:bismillah