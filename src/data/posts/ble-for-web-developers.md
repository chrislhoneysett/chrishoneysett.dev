---
title: "BLE for Web Developers: The Mental Model I Wish I’d Had"
description: "A web developer’s introduction to finding BLE devices, discovering services, and exchanging data."
author: "Chris Honeysett"
date: "2026-10-06"
tags: [BLE, React Native, JavaScript]
status: published
series: ble-for-web-developers
seriesOrder: 1
---

After years of building web applications, my first mobile project involved communicating directly with hardware over Bluetooth Low Energy (BLE).

I already knew React, so React Native felt like a natural choice. With a BLE library handling communication with the device, I thought I had the main pieces covered.

What I quickly discovered was that the difficult part wasn't calling the library. It was understanding a different model of communication.

I was used to URLs, JSON, REST APIs, and WebSockets. Suddenly I was dealing with advertising, services, characteristics, and byte arrays—concepts I'd rarely needed to think about when building web applications.

This is the introduction I wish I'd had: how an app finds a BLE device, discovers what it exposes, and exchanges data with it.

This is the first article in a series about what I learned building a React Native app that communicates with BLE hardware.

I learned these concepts while building a mobile app, but the mental model applies to BLE clients on other platforms too. The APIs and platform restrictions differ.

## What Is BLE?

Bluetooth Low Energy, or BLE, is a wireless communication technology in the Bluetooth family, designed for very low power consumption.

It’s commonly used by sensors, wearables, medical devices, locks, and other battery-powered hardware. These devices often exchange small amounts of data—a temperature reading, a battery level, or a command—then spend time idle.

You may already know Bluetooth Classic from streaming audio to headphones. BLE is especially useful when a device needs to communicate while conserving its battery.

For the kind of application I was building, BLE let my mobile app interact with a physical device through an interface that felt something like an API.

Except it didn’t behave much like any API I’d encountered before.

## The BLE Workflow

Before getting into the terminology, it helps to see the general sequence.

Imagine a BLE weather station and an app that displays its readings and changes its settings. I’ll use a fictional weather station throughout this article to make the concepts concrete. The hardware differs from my projects, but the learning experiences and engineering challenges I describe are my own.

A typical session in the mobile workflow I used might look like this:

1. Scan for nearby BLE devices.
1. Identify the weather station.
1. Connect to it.
1. Discover its services and characteristics.
1. Read measurements, change settings, and subscribe to sensor updates.
1. Disconnect when the session is finished.

The steps look straightforward. Understanding what each one means is where the unfamiliar terminology starts.

## Central and Peripheral: Who Is Talking to Whom?

One of the first concepts I encountered was the distinction between a central and a peripheral.

For our weather station:

```
Phone                          Weather Station
Central ─── Connects to ─────▶ Peripheral
```

In this example, the app runs on a phone, which acts as the central: it scans for nearby devices and initiates the connection. A BLE client on another platform could fill the same role.

The weather station acts as the peripheral: it advertises its presence and accepts the connection.

These roles describe how the connection is established. Once connected, data can flow in both directions.

You’ll also encounter the terms GATT client and GATT server, which describe different roles that we’ll come to later. For this example, phone = central and weather station = peripheral is enough to get started.

## How Does the App Find the Device?

Before the app can read the temperature, it first has to find the weather station.

BLE peripherals solve this through **advertising**.

A peripheral periodically broadcasts advertising packets announcing its presence and providing some information about itself.

In my mobile app, I could **scan** for those advertisements. The scanning and device-selection APIs available to an app depend on its platform.

Conceptually:

```
Weather station advertising:
"I'm here: WeatherStation-1042."
"I'm here: WeatherStation-1042."
"I'm here: WeatherStation-1042."

Phone scanning nearby:
"OK, I see you."
```

The app doesn't need to display every Bluetooth device nearby, so it filters the scan results.

Our example weather station could advertise a name such as `WeatherStation-1042`. The app could look for the `WeatherStation-` prefix, extract the station identifier, and show matching stations to the user. This follows the same approach I used with my hardware.

Once the user selects a station, the app can initiate a connection.

One terminology lesson I learned here: **connecting** and **pairing** aren't necessarily the same thing.

In my mobile app, I could connect directly to a peripheral without asking the user to first pair with it through the phone's Bluetooth settings. Bluetooth pairing and bonding are separate concepts related to things like authentication and storing security information.

For my application, what I primarily cared about was establishing the BLE connection from inside the app.

## Once I'm Connected, What Can I Actually Do?

Finding and connecting to the weather station is only the beginning. Now the app needs to discover what it can interact with.

That’s where GATT, the Generic Attribute Profile, comes in. It defines how a device organizes its data into services and characteristics and how another device discovers and interacts with it. GATT uses the **Attribute Protocol (ATT)** underneath to discover that data and exchange values between devices.

In our example, the weather station is the GATT server, exposing its data and functionality. The phone is the GATT client, accessing that interface.

The two main building blocks are services and characteristics.

A service groups related functionality.

A characteristic exposes a value within that service. That value might represent a sensor reading, a setting, or a command the app sends to the device.

Our weather station might expose something like:

```text
Weather Station
├── Sensor Service
│   ├── Temperature Characteristic
│   ├── Humidity Characteristic
│   └── Pressure Characteristic
└── Configuration Service
    ├── Measurement Interval Characteristic
    ├── Display Brightness Characteristic
    └── Calibration Command Characteristic
```

Each characteristic has properties that describe which operations it supports:

- Read
- Write
- Write Without Response
- Notify
- Indicate

A characteristic can support more than one of these operations, much like an API endpoint might accept both GET and PUT requests. For example, the measurement interval characteristic could support reading the current interval and writing a new one. The characteristic’s properties tell the app which operations are available.

This was where BLE started looking more familiar: an interface with values I could read, settings I could change, and updates I could listen for.

The operations don’t map directly to HTTP methods, but those familiar patterns gave me a starting point.

### Discovering Services and Characteristics

After connecting, the app discovers the weather station’s services and the characteristics within them.

Think of service discovery as asking the device:

> "Now that I'm connected, what interface do you expose?"

Services and characteristics have UUIDs that identify their types. UUID stands for **Universally Unique Identifier**—an identifier used to distinguish one type of service or characteristic from another. These identifiers let the app select the service and characteristic it wants to interact with.

The names in the diagram above are labels for us as readers. The app needs to know which UUIDs correspond to the temperature reading, measurement interval, and other parts of the station’s interface.

Discovery reveals the available characteristics and their properties. It doesn’t automatically explain what their values mean or how to send a calibration command. For that, I still needed the device’s protocol documentation.

### Reading: The Most Familiar Operation

A read retrieves a characteristic’s value. For our weather station, the app might ask:

> "What is the weather station's current temperature?"

This felt familiar from making GET requests: ask for a value and receive a response.

```text
App ─── Read temperature ───▶ Weather Station
App ◀── Temperature bytes ─── Weather Station
```

The characteristic must support reading. The response contains bytes representing its value, rather than the parsed JSON object I was used to getting from an HTTP client. The app has to decode those bytes according to the device’s protocol, which we’ll look at shortly.

### Writing: Sending a Command

A write sends a value to a characteristic that supports writing. That might change a setting or trigger an operation on the weather station.

My initial instinct was to think of this like a PUT or POST request: send data and wait for a response.

On web projects I’ve worked on, that response could also contain the result of the operation, such as an updated object. Early on, I expected the same thing from a BLE write response and didn’t understand why I wasn’t getting a data payload back.

That was my first encounter with the term acknowledgment, often shortened to `ack`. A successful BLE write response confirms that the write succeeded; it does not include the operation’s result data. I had to separate the response to the write from the result of the command I was sending.

Suppose the app writes a command to the calibration characteristic to start a sensor calibration:

```text
App ─── Calibration command ───▶ Weather Station
App ◀──── Write response ──────── Weather Station
```

The device can also return an error if the write fails.

The distinction is between completing the write and completing the work it triggered. A successful write response does **not necessarily mean the calibration has finished**.

If the app needs confirmation that calibration finished or data from the result, the device’s protocol must provide it separately—perhaps through a status characteristic or a later notification.

### Write Without Response: Fire and Forget

Write without response sends a value without requesting a write response from the device. The characteristic must specifically support this operation.

This initially sounded risky to me, but a brightness slider makes the use case concrete. Suppose the weather station has a display. As the user drags the slider, the app sends a series of brightness values.

Waiting for a response to each update adds overhead. If the app doesn’t need confirmation of every intermediate value, writing without response can be useful.

```text
App ─── Display brightness ───▶ Weather Station
```

With write without response, no ATT response is requested or expected. Bluetooth still handles delivery at lower layers, but the app receives no ATT acknowledgment that the value was written and no ATT error response if the write fails.

That distinction changes what the app can claim: sending a brightness value is not confirmation that the display applied it. If that matters, the device’s protocol needs another way to check the result.

### Notifications: When the Device Needs to Talk First

Reads let the app ask for a value. Notifications let the weather station send values when it has updates to share.

This reminded me of receiving messages over a WebSocket. Instead of polling for the temperature, the app subscribes to a characteristic that supports notifications. The station can then send new measurements as it takes them.

```text
App ─── Subscribe to temperature ───▶ Weather Station

App ◀────── Temperature bytes ─────── Weather Station
App ◀────── Temperature bytes ─────── Weather Station
App ◀────── Temperature bytes ─────── Weather Station
```

The notification carries a characteristic’s value from the GATT server to the client. The app can still send data in the other direction using writes, including to the same characteristic if it supports them.

Subscribing enables notifications; it doesn’t define when they arrive. The device’s protocol determines whether updates are periodic, sent when a value changes, or triggered by something else.

BLE also supports indications. These carry values in the same direction, but require the receiving Bluetooth stack to confirm receipt at the ATT layer. Notifications don’t require that confirmation.

That confirmation doesn’t tell the station that my application has finished processing the value. In a React Native app, the Bluetooth stack generally handles it below the application code.

## BLE Sends Bytes

This was one of my biggest adjustments.

With the JSON APIs I was used to, my HTTP client could parse the response into a JavaScript object. With BLE, I had to interpret the bytes in a characteristic’s value according to the device’s protocol.

For example, the weather station might send these two bytes for a temperature reading:

```
[0xEB, 0x00]
```

The station’s protocol defines this value as a little-endian 16-bit integer, so the app decodes these bytes as **235**. Temperatures are expressed in tenths of a degree Celsius, giving a reading of **23.5°C**.

Sending data works in the other direction: the app encodes a setting or command into the bytes the device expects.

The important lesson is:

> **Knowing which characteristic to read or write isn’t enough. You also need to know how its value is encoded.**

Understanding that conversion was a learning curve of its own. In a future article, Making Sense of BLE Byte Data, I’ll cover hexadecimal, signed integers, byte order, and decoding in JavaScript.

## What Happens When the Data Is Too Large?

Sending a brightness setting to the weather station might take only a few bytes. Sending a firmware update could take thousands.

That introduces another unfamiliar acronym: **MTU — Maximum Transmission Unit**.

The ATT MTU limits how much data fits in an individual message used for GATT communication. Some of that space is used by the protocol itself, so the space available for your data is smaller. The available size can also vary between connections.

The important lesson is:

> **You cannot assume an arbitrarily large payload can be sent as one BLE write.**

For larger transfers, the device’s protocol may require **chunking**: dividing the data into smaller pieces and sending them across multiple writes.

Conceptually, a firmware transfer might look like:

```text
App ─── Start firmware transfer ───▶ Weather Station
App ─── Send chunk ────────────────▶ Weather Station
App ─── Send chunk ────────────────▶ Weather Station
App ─── Finish transfer ───────────▶ Weather Station
```

The app and station need to agree on how those pieces form a complete transfer. Simply splitting the bytes isn’t enough; the station needs to know what to do with them.

Depending on the operation and library, some handling of larger values may be automatic. For a transfer like a firmware update, I still needed to understand what the device’s protocol expected.

In a future article, Chunking BLE Data, I’ll explore MTU limits and how I handled larger transfers.

## BLE Isn't Just a Collection of Requests

This may have been the biggest conceptual change for me.

When I'm working with a REST API, I tend to think in individual operations:

```text
request → response
```

With BLE, I also had to manage a **session**:

```text
connect
  ↓
discover
  ↓
subscribe
  ↓
read / write / receive notifications
  ↓
disconnect
```

The app needs to keep track of where it is in that lifecycle: still connecting, discovering the device’s interface, or connected and listening for updates.

It also needs to handle interruptions. The weather station might go out of range or lose power, Bluetooth might turn off, or the operating system might interrupt the connection.

Even normal navigation introduces lifecycle decisions.

For our weather station app, opening the station’s detail screen could connect to the station and subscribe to its sensor readings. Leaving that screen would stop listening for updates and disconnect.

In my application, I wanted that same pattern. But I started noticing that devices sometimes stopped appearing in scan results. I discovered that they were still connected: BLE sessions were surviving when I expected them to have ended.

Looking at the session lifecycle also revealed places where the app could create multiple sessions. I needed a clear rule: only one session could be active at a time, and there had to be a concrete way to tear it down.

That included work still in progress. What happens if the user leaves while the app is still connecting or discovering characteristics? Cleanup needed to account for both unfinished setup and whatever had already been established.

Eventually I began treating the whole session as one cancellable operation, with responsibility for its setup, ongoing communication, and teardown. That gave me a way to reason about the lifetime of the connection as a whole.

Session management was one of the primary reasons I built my own BLE library abstraction. I also wanted to make more complex operations, such as chunking, easier to use. The goal was to let a developer work with the device without having to learn every BLE detail I’d had to figure out along the way.

## The Mental Model I Wish I'd Started With

Coming from web development, the unfamiliar terminology made it hard to know where to start.

The mental model that finally worked for me was:

- **Advertising:** The device announces its presence.
- **Scanning:** The app looks for nearby devices.
- **Connecting:** The app establishes a connection to the device.
- **Services and characteristics:** The device exposes groups of functionality and the values the app can interact with.
- **Reading and writing:** The app retrieves values, changes settings, or sends commands. A write response confirms the write, but doesn’t necessarily mean the work it triggered has finished.
- **Writing without response:** The app sends a value without receiving an `ack` response.
- **Notifications:** The app subscribes so the device can send updates.
- **Bytes:** The app interprets and encodes values according to the device’s protocol.
- **Chunking:** Larger transfers may need to be divided into pieces the device knows how to handle.
- **Session management:** The app coordinates setup, ongoing communication, and cleanup—including when something interrupts the connection.

Once I understood that model, BLE stopped feeling like a mysterious hardware technology and started feeling like something much more familiar:

**an interface between two pieces of software.**

It just happens that one of those pieces of software is running inside something you can hold in your hand.

## Further Reading

- [Bluetooth SIG: Bluetooth Low Energy Primer](https://www.bluetooth.com/bluetooth-le-primer/) — A deeper introduction to the BLE stack, including advertising, connections, ATT, and GATT.
- [Bluetooth SIG: Assigned Numbers](https://www.bluetooth.com/specifications/assigned-numbers/) — The official reference for standardized identifiers, including service and characteristic UUIDs.
- [Bluetooth Core Specification: Generic Attribute Profile (GATT)](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-61/out/en/host/generic-attribute-profile--gatt-.html) — The formal technical reference for discovery, reads, writes, notifications, and indications.
