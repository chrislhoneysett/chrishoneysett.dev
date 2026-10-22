---
title: 'Building BLEBridge: A React Native BLE Library'
description: 'How I built BLEBridge to put BLE complexity behind a familiar API so app developers could focus on using the device.'
author: 'Chris Honeysett'
date: '2026-10-22'
tags: [BLE, React Native, JavaScript]
status: published
series: ble-for-web-developers
seriesOrder: 4
imageAlt: 'A notebook sketch of BLE library architecture beside a connected phone, wireless sensor, and laptop.'
---

I was building a React Native app that needed to work with thousands of devices in the field, but only one device at a time. I already had [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) to handle the BLE operations. I thought I had what I needed.

The trouble started when users moved between devices. Sometimes the app tried to write to a device that had already disconnected. Other times, a new connection failed because the previous connection hadn’t been released.

I kept adding code to handle these situations, then finding another place that needed the same logic. Scanning, connecting, and reading all worked individually. Getting them to behave together was taking more effort than I’d expected.

That’s why I built BLEBridge, a layer around `react-native-ble-manager` that gave me one place to manage that work and reuse it in other projects.

In the [first article in this series](ble-for-web-developers.md), I described why I started treating BLE communication as a session. This is how I turned that idea into a library.

## A connection was only part of the problem

When a user opened a device screen, the app needed to connect, discover services, and start exchanging data. When they left, it needed to stop.

That sounds simple enough until:

- The user leaves halfway through connecting.
- The user starts looking for another device while a read is still running.
- The device loses power before the app finishes what it was doing.

I started thinking about this as a **session**: the connection plus the operations and listeners associated with that device. Ending the session meant cleaning up all of it, including work that hadn’t finished yet.

I wanted the application to be able to say “connect to this device” without every screen having to work out what was already running and how to stop it. That became a broader goal for the architecture.

## Abstraction, abstraction, abstraction

I’d spent a lot of time learning BLE to get this working. I didn’t want every developer using the library to have to go through the same process.

I treated BLEBridge as the app’s BLE back end. The app asks it to find a device, connect, or exchange data. The library handles the BLE setup, platform differences, session state, and cleanup behind those calls. It runs inside the app, with no dependency on a particular screen or UI.

That meant an app developer could work with familiar functions, promises, callbacks, and cancellation signals. They wouldn’t need to understand [MTU sizing](ble-data-chunking.md) or the order of native BLE calls just to read a value from a device.

The app still needs to know the device’s interface: which value to read and [what the returned bytes mean](ble-byte-data.md). A device-specific function, like the battery-reading example later in this post, can hide those details from the screen too.

This also made the library useful beyond the original app. I could bring the BLE behavior into another project without bringing its screens or state store along with it.

To make that separation work, the library needed to own the coordination the app was giving up. The first step was keeping track of the work.

## Keeping track of the work

I split the library into two main areas: **operations** for the individual workflows, and **core managers** for the things they share.

A shortened view looks like this:

```text
BLEBridge/
├── index.ts
├── core/
│   ├── eventManager.ts
│   ├── stateManager.ts
│   └── tasks/taskManager.ts
└── operations/
    ├── connection/
    ├── discovery/
    ├── read/
    ├── write/
    └── notify/
```

The operation modules handle workflows such as connecting or reading. The state and event managers track what’s happening and share updates with the app. The task manager records which work belongs to each device and how to clean it up.

With that information shared across the workflows, I could apply rules before starting more work:

- Stop scanning before connecting.
- Clean up an existing connection attempt before starting another one for the same device.
- Clean up a device’s registered reads, writes, and notifications before disconnecting it.

For example, the important order in the disconnect workflow is:

```typescript
// Stop registered work and release its resources first.
await OperationManager.cleanupPeripheralOperations(peripheralId)

// Then ask the native BLE manager to disconnect.
await nativeBleManager.disconnect(peripheralId)
```

There’s logging and error handling around this in the implementation, but those two lines show the decision: deal with the work attached to the device before requesting the native disconnect.

Cleanup includes listeners, timers, and task registrations. I had to think about successful operations too—an old timeout or listener could still cause trouble after its original job was done.

My app only needed to control one device at a time, so discovery disconnects existing devices by default. I made that configurable so other apps could keep a connection open while scanning.

That gave me a place to find active work and run its cleanup. The next question was how the screen that started it could say it was time to stop.

## Giving the caller a way to cancel

A user leaving the device screen was one of the reasons I needed cleanup in the first place. I wanted that screen to be able to cancel its work without knowing which timers, listeners, or native operations were involved. I used an `AbortController` for that.

If you’ve used it with `fetch()`, the shape is familiar: pass a signal into an operation, then call the controller’s `abort()` method when the work is no longer needed.

For a discovery screen, that can fit into a React effect:

```typescript
import { useEffect } from 'react'
import { BLEBridge } from '@/lib/BLEBridge'

// Inside a discovery screen:
useEffect(() => {
  // Give this screen’s search its own cancellation signal.
  const controller = new AbortController()

  BLEBridge.startDiscovery({
    options: { scanDurationMs: 10000 },
    signal: controller.signal,
  })
    .then((peripherals) => {
      // Ignore results if this screen no longer needs them.
      if (!controller.signal.aborted) {
        console.log('Discovered devices:', peripherals)
      }
    })
    .catch((error) => {
      if (!controller.signal.aborted) {
        console.error('Discovery failed:', error)
      }
    })

  // Cancel this search when the effect ends.
  return () => controller.abort()
}, [])
```

The console calls stand in for updating the screen. When the effect ends, its cleanup cancels that search. The signal check keeps the caller from using results it no longer needs.

`AbortController` provides the signal; the library still has to do the cleanup. Calling `abort()` doesn’t automatically stop native BLE work or undo a command already sent to a device.

One decision took a little more thought: compatible discovery calls can share a native scan. Cancelling one caller should let the others continue. The library removes that caller and stops the native scan when nobody needs it anymore.

The caller could now control how long it needed the work, while the library handled the resources underneath. But while that work was running, the screen still needed to show the user what was happening.

## Keeping the UI in the loop

Tracking operations and handling cancellation gave the library a better picture of the session. I needed to share that picture with the UI: was the app still connecting, ready to exchange data, or disconnected because the device had lost power? Waiting for a promise to finish wouldn’t cover all of those changes.

I added callbacks for updates tied to a particular call, such as connection progress, and a predefined set of typed events for code observing the session more broadly:

- `stateChanged` reports state transitions, such as connecting, connected, or disconnected.
- `scanProgress` reports elapsed time and how many devices have been found.
- `connectionProgress` reports the connection stage and percentage.

These names are defined by the library’s `BLEBridgeEventType` type. Choosing an event also gives the listener the right payload type, so the editor can suggest available fields and TypeScript can catch a misspelled event name.

The states inside `stateChanged` are predefined too, through `BleEvents`. For example, the app can react to a connection change and show scan progress without interpreting native BLE events:

```typescript
import { BLEBridge, BleEvents } from '@/lib/BLEBridge'

// The state is typed; use the library’s constants to react to changes.
const stateSubscription = BLEBridge.addEventListener(
  'stateChanged',
  ({ state, peripheralId }) => {
    if (state === BleEvents.CONNECTED) {
      console.log('Device connected:', peripheralId)
    } else if (state === BleEvents.DISCONNECTED) {
      console.log('Device disconnected:', peripheralId)
    }
  },
)

// Choosing scanProgress gives this callback a typed scan progress payload.
const scanSubscription = BLEBridge.addEventListener(
  'scanProgress',
  ({ progress }) => {
    console.log(`Found ${progress.peripheralsFound} devices`)
  },
)

// Later, during the observer’s cleanup:
stateSubscription.remove()
scanSubscription.remove()
```

That lets the app turn BLE updates into loading indicators, device status, and error messages. If several components need the same information, a shared store such as Zustand can subscribe and expose it to them.

With those updates in place, the app could follow the session without managing the BLE listeners itself. That left one last piece: putting these decisions behind the API I wanted to use from a screen.

## Putting it together in the app

Those pieces form the BLE back end I wanted the app to use. Here’s a device-specific function that brings them together: scan, choose a device, connect, read its battery level, and disconnect.

The shared `BLEBridge` object lives in the library’s `index.ts`. JavaScript evaluates that module once, so screens and hooks importing it get the same object. I keep device information and UI status in application state; the library object stays in its module.

The first operation initializes the native BLE manager automatically. This example looks for our fictional weather station by name and assumes it supports the standard Battery Service:

```typescript
// Import the shared object; each screen or hook uses the same export.
import { BLEBridge } from '@/lib/BLEBridge'

async function readWeatherStationBattery(name = 'WeatherStation-1042') {
  // Scan for ten seconds. BLEBridge initializes itself and checks permissions.
  const devices = await BLEBridge.startDiscovery({
    options: { scanDurationMs: 10000 },
  })

  // A real screen could let the user choose from these results.
  const selectedDevice = devices.find((device) => device.name === name)

  if (!selectedDevice) {
    throw new Error('Weather station not found')
  }

  try {
    // Connect and report progress while the library handles setup.
    const { peripheral } = await BLEBridge.connect({
      peripheralId: selectedDevice.id,
      onConnectionProgress: ({ stage, percentage }) => {
        console.log(`${stage}: ${percentage}%`)
      },
    })

    if (!peripheral) {
      throw new Error('Connection did not complete')
    }

    // Use the returned peripheral to read the Battery Level characteristic.
    const batteryLevel = await BLEBridge.read({
      peripheral,
      serviceUUID: '180F',
      characteristicUUID: '2A19',
    })

    // This standard characteristic stores its percentage in the first byte.
    return batteryLevel.readUInt8(0)
  } finally {
    // Clean up this device’s registered work and request a disconnect,
    // even if connecting or reading failed.
    await BLEBridge.disconnect({ peripheralId: selectedDevice.id })
  }
}

// A screen action could call this and display the result.
readWeatherStationBattery()
  .then((level) => console.log(`Battery: ${level}%`))
  .catch((error) => console.error('Could not read battery:', error))
```

This is where the earlier decisions come together. Connecting stops scanning, the progress callback keeps the UI informed, and disconnecting cleans up the work registered for that device. The returned `peripheral` carries connection information into the read, and the read returns a `Buffer` for the app to interpret. I cover [decoding byte arrays with `Buffer`](ble-byte-data.md) in more detail in the byte-data article.

The screen can await `readWeatherStationBattery()` and get a number back. That function knows the weather station’s interface; BLEBridge handles the BLE workflow underneath. Each layer gives the next one less to think about.

## What I’d take into the next project

The biggest change was having one place to answer “what is still running for this device?” Before that, the answer was spread across screens and callbacks.

The difficult cases still existed. A device could disconnect, a connection could time out, and a user could leave halfway through an operation. But I could handle those cases alongside the work they affected, rather than asking every caller to remember the same cleanup steps.

I built BLEBridge because I kept solving the same session problems in different places. Keeping those decisions behind a shared API meant the next developer could use the device without first learning everything I’d learned about BLE. That was the benefit I wanted to carry into the next project.
