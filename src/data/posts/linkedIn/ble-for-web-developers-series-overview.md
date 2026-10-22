# From Web APIs to Bluetooth: What I Learned Building With BLE

I knew React. I’d spent years building web applications. When I started a React Native project that needed to communicate with hardware over Bluetooth Low Energy (BLE), I thought a BLE library would cover most of the unfamiliar ground.

Then I started asking questions I’d rarely needed to ask on the web.

What do these two bytes mean? How much data can I send in one write? Has the device finished the command, or has it only acknowledged the write? What happens if the user leaves the screen while the app is still connecting?

Working through those questions changed how I thought about communication between an app and a device. I’ve now finished a four-part series sharing what I learned, written from the perspective of a web developer making that transition.

The examples use a fictional weather station and its companion app. The lessons come from my experience building a React Native app that communicates with BLE hardware.

Here’s how the pieces fit together.

## Part 1 – Learning a different communication model

My first challenge was understanding the path from “there’s a device nearby” to “my app can use it.”

A peripheral advertises its presence. The app scans, connects, and discovers services and characteristics. Those characteristics expose values the app can read, write, or subscribe to for updates.

Familiar web concepts gave me a starting point. Reading a value felt a little like a GET request. Subscribing to notifications reminded me of receiving WebSocket messages. But those comparisons had limits.

One distinction mattered early: a successful write response doesn’t necessarily mean the device has finished the work that write triggered. Sending a calibration command and confirming that calibration has completed are separate concerns.

I also needed to think about the whole session: setup, ongoing communication, and cleanup when the user leaves or the connection ends.

[Read Part 1: BLE for Web Developers: The Mental Model I Wish I’d Had](https://chrishoneysett.dev/blog/ble-for-web-developers/)

## Parte 2 – Giving the bytes meaning

Receiving data was only the beginning. I still had to interpret it.

In the weather station example, the bytes `[0xEB, 0x00]` represent 23.5°C. Getting that result requires knowing that the protocol uses a signed 16-bit little-endian integer measured in tenths of a degree Celsius.

The bytes don’t explain any of that themselves.

Integer types, hexadecimal, byte order, offsets, and scaling were all new to me. This part follows how I learned those concepts and started using JavaScript’s Node-style `Buffer` API to encode and decode values. Keeping those rules in small functions lets the rest of the app work with temperatures, percentages, and settings.

[Read Part 2: Making Sense of BLE Byte Data](https://chrishoneysett.dev/blog/ble-byte-data/)

## Part 3 – Making larger transfers fit

A setting might fit in a few bytes. A firmware image needs a different approach.

I had to understand the connection’s payload budget, account for protocol overhead, and split a complete message into ordered writes the device knew how to assemble.

The slicing loop was straightforward. The harder questions were what the reported size actually included, how the device expected the transfer to be framed, and what should happen if it stopped halfway through.

Progress also needed a clear meaning. Writing 100% of the bytes doesn’t establish that the device has validated or installed a firmware update. Those outcomes need their own confirmation.

[Read Part 3: Chunking BLE Data: Fitting a Large Transfer Into Small Writes](https://chrishoneysett.dev/blog/ble-data-chunking/)

## Part 4 – Turning the lessons into a reusable library

As the app grew, I kept finding the same coordination problems across different screens: unfinished connection attempts, work continuing after a disconnect, listeners that needed cleanup, etc.

That led me to build BLEBridge, a layer around [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager).

I wanted one place to manage operations, session state, cancellation, and cleanup. The app could use familiar functions, promises, callbacks, and cancellation signals, while the library coordinated the BLE work underneath.

The goal was to let the next developer use the device without having to repeat every part of my learning process.

[Read Part 4: Building BLEBridge: A React Native BLE Library](https://chrishoneysett.dev/blog/react-native-ble-library/)

## What I’m taking forward

The most useful shift was learning to ask what each layer actually guarantees.

A connection gives me a way to communicate. The device’s protocol tells me what the bytes mean. A write response confirms the write. Session management gives that work a lifetime and a way to end.

Understanding those responsibilities helped me build an interface the rest of the app could use with confidence.

If you’re coming from web development and starting a BLE project, I wrote this series to give you the starting point I wish I’d had. [Begin with the mental model](https://chrishoneysett.dev/blog/ble-for-web-developers/), or follow the links above to the part you’re working through now.
