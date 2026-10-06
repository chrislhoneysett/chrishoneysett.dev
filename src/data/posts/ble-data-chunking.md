---
title: "Chunking BLE Data: Fitting a Large Transfer Into Small Writes"
description: "Understand payload budgets and split larger BLE transfers into ordered writes."
author: "Chris Honeysett"
date: "2026-10-06"
tags: [BLE, React Native, JavaScript]
status: published
series: ble-for-web-developers
seriesOrder: 3
---

When I first started working with Bluetooth Low Energy, sending a setting to a weather station felt straightforward. Encode a few bytes, write them to a characteristic, and wait for the write to finish.

Now imagine sending that weather station a firmware update.

Coming from web development, I was used to handing a request body to an HTTP client and letting the layers underneath deal with transporting it. For the weather station, I need to understand how much data I can send in each write—and how the device expected those writes to form a complete transfer.

The basic idea was simple: split the data into smaller pieces.

The part that took more thought was deciding how small those pieces needed to be.

This article follows *BLE for Web Developers: The Mental Model I Wish I’d Had*. I’ll use the same fictional weather station and its companion app throughout. The protocol details and sizing values below belong to that example.

## The MTU Is a Budget

MTU stands for **Maximum Transmission Unit**. For the GATT communication we’re discussing, the ATT MTU limits the size of an individual Attribute Protocol message.

That message includes protocol information as well as the value I want to write. So an MTU of 512 does not mean I can put 512 bytes of firmware into a write.

A normal ATT write request uses three bytes for its opcode and attribute handle:

- **Opcode (one byte):** A code identifying the operation, such as a request to write a value.
- **Attribute handle (two bytes):** A numeric identifier for a particular attribute on the connected device. For our weather station, it tells the device which characteristic value to write. Unlike a UUID, which identifies the kind of characteristic, the handle identifies a specific attribute in the device’s attribute table.

That leaves `MTU - 3` bytes for the characteristic value. Other operations have different overhead; a prepare write, for example, also carries an offset and uses five bytes. These sizes are defined in the [Bluetooth Attribute Protocol specification](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-62/out/en/host/attribute-protocol--att-.html).

For a normal write request with an MTU of 23, the calculation is:

```text
23 bytes: ATT message budget
 3 bytes: write request overhead
20 bytes: space for the characteristic value
```

Even that remaining space might not all be available for my firmware data. If the weather station’s protocol adds a chunk index or byte offset to each chunk, those bytes need to fit too.

The question I needed to answer was:

> **How large can the final value passed to the BLE write be, after everything has been added to it?**

## Use the Connection’s Size, Not Just the Requested Size

The weather station app requests a larger MTU during connection setup on Android. But the requested size is a preference, not a guarantee of the size the connection will use.

I keep the returned size on the connected peripheral and use that value when preparing a transfer. The firmware transfer also caps the value at 512, which we’ll use as the limit for this weather station example.

That makes chunk sizing part of the current session. A size that worked on one connection isn’t something I want to assume for every phone and device.

iOS introduced another wrinkle: the weather station app’s BLE library doesn’t get the negotiated ATT MTU directly through the same API. Instead, the connection code queries the maximum write value length for writes without response and uses it as a payload-size signal.

Those two numbers mean different things:

```text
ATT MTU                  Includes ATT overhead
Maximum write value size Describes space for the value
```

I want the transfer code to work with the available write payload size. On Android, that means subtracting the overhead for the write operation from the connection’s ATT MTU. If a platform API already reports the maximum write value size for the operation I’m using, that value describes the payload budget directly.

This was a useful lesson for me: before doing arithmetic with a library’s size value, I needed to understand what that value actually represented. Subtracting overhead from a value that already excludes it would make the chunks unnecessarily small.

## Calculate the Chunk Size

For our weather station, suppose each write carries only the next portion of the transfer frame, with no additional per-chunk fields. Using normal ATT write requests, the calculation is:

```text
ATT MTU − 3 bytes of write request overhead = chunk size
```

With an MTU of 512, that gives:

```text
512 − 3 = 509 bytes per chunk
```

With a smaller MTU of 80, the same calculation gives:

```text
80 − 3 = 77 bytes per chunk
```

If the station’s protocol required additional fields in every write, I’d subtract their size from that payload budget before slicing the frame. The calculation needs to account for everything included in the write value.

The device or library may also impose a smaller write limit. I’d use the smallest applicable limit so that each chunk fits both the connection and the station’s protocol.

There also needs to be enough space for useful data. If subtracting the overhead leaves no room for a chunk, that connection cannot support this transfer as framed. Making the chunk size one byte doesn’t solve that problem—the overhead still has to fit.

## Build the Message Before Splitting It

The weather station needs more than a series of unrelated byte arrays. Its firmware protocol needs to define how those bytes form an update.

For example, a complete transfer message might look like this:

```text
Firmware metadata | Image length | Firmware image
```

For the weather station, I build the complete transfer frame first: the firmware metadata, the image length, and the image itself.

Then I slice that frame into chunks.

This keeps two decisions separate: the protocol defines the message, and the connection’s size determines how much of that message I send at a time.

The chunks aren’t necessarily meaningful on their own. A chunk boundary can fall inside the image or inside another field. The receiving firmware has to interpret the incoming bytes according to its transfer protocol.

Repeated writes to a characteristic don’t automatically append to a file. That behavior has to be implemented by the device. Another protocol might require a chunk index, byte offset, or explicit start and finish commands on every transfer.

## Slice Bytes and Send Them in Order

Once I have a valid chunk size, the slicing itself is fairly small.

Here’s a simplified version of the loop, using a `Buffer` for the complete frame and a `writeChunk` function representing the BLE write:

```ts
async function sendFrame(
  frame: Buffer,
  chunkSize: number,
  writeChunk: (chunk: Buffer) => Promise<void>,
) {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('Chunk size must be a positive integer.')
  }

  for (let offset = 0; offset < frame.length; offset += chunkSize) {
    const chunk = frame.subarray(
      offset,
      Math.min(offset + chunkSize, frame.length),
    )

    await writeChunk(chunk)
  }
}
```

The frame is already encoded as bytes. I’m slicing those bytes, rather than splitting a string by its character count. The limit is measured in bytes, and characters don’t always encode to one byte each.

The last chunk can be smaller than the others. For a 1,200-byte frame and a chunk size of 509, the writes contain:

```text
Chunk 1: bytes    0–508  → 509 bytes
Chunk 2: bytes  509–1017 → 509 bytes
Chunk 3: bytes 1018–1199 → 182 bytes
```

I don’t pad that last chunk just to make it match the others. Any padding would become additional data unless the device’s protocol explicitly defined how to handle it.

The `await` inside the loop matters too. The weather station app uses writes with response and waits for each write operation before starting the next one.

```text
App ─── Chunk 1 ───▶ Weather Station
App ◀── Response ── Weather Station
App ─── Chunk 2 ───▶ Weather Station
App ◀── Response ── Weather Station
App ─── Chunk 3 ───▶ Weather Station
App ◀── Response ── Weather Station
```

I keep the chosen size fixed throughout the transfer. The code doesn’t start with small chunks and gradually increase them; it calculates the size from the connection before entering the loop.

## Progress Means Bytes Written

Chunking gave me a natural place to report progress.

After each successful write, I add that chunk’s length to the count of bytes sent. The percentage comes from:

```text
bytes sent / total frame bytes × 100
```

Counting bytes accounts for the smaller final chunk. For the weather station app, the total also includes the transfer metadata, because that metadata is part of the frame being written.

The transfer reports chunk counts and transfer speed as well. For this example, I limit intermediate progress callbacks to roughly one every 200 milliseconds so the interface doesn’t need an update for every write. The initial and final updates still get reported.

But there’s an important distinction from the first article: a successful write response does not necessarily mean the work triggered by that write has finished.

When this transfer reaches 100%, it means all of the frame’s chunks have been written successfully. It doesn’t establish that the device has validated the image, installed it, or rebooted into the new firmware.

Those outcomes need their own confirmation from the device’s protocol.

## A Transfer Can Stop Halfway Through

A large transfer takes time. The user might leave the screen, the device might disconnect, or a write might time out.

The weather station app needs a way to stop sending chunks when the user leaves the screen or the connection ends. Before each write, I check whether the transfer should continue. Each write also needs a timeout so the transfer cannot wait indefinitely.

In an upcoming article, I’ll explain how I use `AbortController` and `AbortSignal` to coordinate cancellation across a BLE session.

If a write fails, I’d include the chunk index, byte offset, chunk length, and sizing details in the error. That gives me something concrete to inspect: which part of the frame was being sent, and how large the write value was expected to be.

Cancellation also has a device-side consequence. Stopping the app’s loop doesn’t undo the bytes the station has already received.

Whether I can restart or resume depends on the firmware protocol. I can’t assume that repeating a chunk is safe or that a new transfer automatically clears the previous one. The app and device need to agree on how interrupted transfers recover.

## What I Learned From Chunking

The actual slicing loop was one of the easiest parts of this work.

The harder part was understanding the full path from the data I wanted to send to the value that would reach the BLE write:

```text
Build the protocol frame
  ↓
Calculate the payload budget for this connection
  ↓
Slice one chunk
  ↓
Write it and wait for the response
  ↓
Record progress and continue
```

Once I understood that path, the MTU stopped being just a number I requested during connection setup. It became a budget I had to account for at every layer that added bytes.

That’s the approach I wish I’d started with: **build the message the device expects, then make sure each final write fits the connection’s payload budget.**
