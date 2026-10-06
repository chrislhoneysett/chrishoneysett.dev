---
title: "Making Sense of BLE Byte Data"
description: "Decode and encode BLE values with bytes, integer types, endianness, and JavaScript."
author: "Chris Honeysett"
date: "2026-10-06"
tags: [BLE, React Native, JavaScript]
status: published
series: ble-for-web-developers
seriesOrder: 2
---

In my first article, BLE for Web Developers: The Mental Model I Wish I’d Had, I introduced the workflow I learned while building a React Native app that communicates with BLE hardware.

Finding the device, connecting, and discovering its characteristics gave me a way to exchange data. But that still left another question:

**What do I do with the data once I receive it?**

With the JSON APIs I was used to, my HTTP client could parse a response into a JavaScript object. With BLE, I had to understand how the device represented its values as bytes.

Suddenly, terms like hexadecimal, signed integers, and endianness mattered. These weren’t concepts I’d needed to work with directly in my web projects.

This is the second article in that series: how I learned to turn BLE byte data into values my application could use, and encode values to send back.

I’ll continue using the fictional weather station from the first article. Its protocol is an example for learning these concepts, rather than a standard BLE weather station format.

## The Bytes Don’t Explain Themselves

Suppose the app reads the weather station’s temperature characteristic and receives:

```text
[0xEB, 0x00]
```

In the first article, we decoded those bytes as **23.5°C**. But nothing in that array tells us that it contains a temperature, or that the result should be divided by ten.

The station’s protocol supplies those rules:

```text
Type:       Signed 16-bit integer
Byte order: Little-endian
Unit:       Tenths of a degree Celsius
```

Each part matters. Choosing the wrong integer type, reversing the byte order, or missing the scale can produce a different value from the same bytes.

Before getting to the JavaScript, it helps to understand what those rules mean.

## Bits and Bytes: How Much Space Does a Value Take?

A **bit** is a single binary digit: either `0` or `1`.

A **byte** is a group of eight bits. Eight bits have 256 possible combinations, so a byte interpreted as an unsigned integer can represent a value from **0 through 255**.

A byte array is an ordered sequence of bytes. For example:

```text
[235, 0]
```

Each number represents one byte. The array contains two bytes, but the protocol might define them as one value.

That distinction was important for me. Two entries in the array didn’t necessarily mean two separate readings. They could be the two parts of a single temperature measurement.

## Why Does Everything Start With `0x`?

When I started reading hardware documentation, I kept seeing numbers like `0x00`, `0xFF`, and `0x03E8`.

These are written in **hexadecimal**, usually shortened to **hex**.

Decimal uses ten digits, `0` through `9`. Hexadecimal uses sixteen: `0` through `9`, followed by `A` through `F`. The letters represent the values 10 through 15.

The `0x` prefix tells us that a number is written in hexadecimal:

| Hexadecimal | Decimal |
| ----------- | ------- |
| `0x0A`      | 10      |
| `0x10`      | 16      |
| `0xEB`      | 235     |
| `0xFF`      | 255     |

Hex is useful when working with bytes because each hexadecimal digit represents four bits. Two hex digits can represent all eight bits of a byte:

```text
Binary       Hexadecimal    Decimal
0000 0000    0x00           0
1110 1011    0xEB           235
1111 1111    0xFF           255
```

That means these arrays describe the same two bytes:

```js
const decimal = [235, 0];
const hexadecimal = [0xEB, 0x00];
```

In JavaScript, `235 === 0xEB` is `true`. Hexadecimal changes how we write the number, not its value.

Once I understood that, comparing my application’s logs with the firmware documentation became much easier. A decimal value in one place and a hexadecimal value in another didn’t mean the data had changed.

## `int8`, `uint16`, `int32`: What Do Those Mean?

The next unfamiliar terms were the integer types in the protocol documentation.

In most of my JavaScript code, I could work with `Number` without specifying how many bytes a value occupied. A hardware protocol needs both sides to agree on that layout.

The type names describe the size and whether the value can be negative:

```text
uint16
│ │  └── 16 bits = 2 bytes
│ └───── Integer
└─────── Unsigned

int16
│  └──── 16 bits = 2 bytes
└─────── Signed integer
```

**Unsigned** integers represent zero and positive values. **Signed** integers can also represent negative values.

The common types look like this:

| Type     | Bytes | Range                           |
| -------- | ----- | ------------------------------- |
| `uint8`  | 1     | 0 to 255                        |
| `int8`   | 1     | -128 to 127                     |
| `uint16` | 2     | 0 to 65,535                     |
| `int16`  | 2     | -32,768 to 32,767               |
| `uint32` | 4     | 0 to 4,294,967,295              |
| `int32`  | 4     | -2,147,483,648 to 2,147,483,647 |

The goal isn’t to memorize every range. It’s to recognize that `int16` means a field occupies two bytes and can represent a negative number.

For our weather station, a signed temperature makes sense because it can get below freezing. A battery percentage could use an unsigned byte, with the protocol restricting valid readings to 0 through 100.

The type’s range and the field’s valid range aren’t necessarily the same thing.

### How Can the Same Byte Mean 246 or -10?

Suppose the device sends a byte with the value `0xF6`. Depending on the type defined in the protocol, the app can read it two different ways:

```text
Byte:       0xF6
As uint8:   246
As int8:    -10
```

The byte hasn’t changed. What changed is how the app interprets it.

I didn’t need to work out the conversion myself. The tools I’ll show later handle that. What I needed to know was which type the device expected me to use.

> **The bytes themselves don’t tell you whether a number is signed or unsigned. The protocol does.**

## Byte Order: Which Byte Comes First?

Once a number occupies more than one byte, we also need to know the order of those bytes. That’s what **endianness** describes.

Take the number `1000`, written in hexadecimal as `0x03E8`. It fits in two bytes: `0x03` and `0xE8`.

The most significant byte, `0x03`, contributes `3 × 256 = 768`. The least significant byte, `0xE8`, contributes 232. Together, they make 1000.

Those bytes can appear in either order:

```text
Big-endian:       [0x03, 0xE8]
Little-endian:    [0xE8, 0x03]
```

Big-endian puts the most significant byte first. Little-endian puts the least significant byte first. The [MDN explanation of endianness](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) covers the same distinction.

If the app reads `[0xE8, 0x03]` as big-endian, it gets 59,395 instead of 1000.

This was a source of confusion even when working with the firmware team. We needed to agree on the byte order explicitly; knowing that a field occupied two bytes wasn’t enough.

Byte order applies to the bytes within a value. It doesn’t mean reversing the entire message, and it doesn’t change a single-byte field.

## Turning a Raw Number Into a Measurement

Decoding an integer is only part of the work. The app also needs to know its unit and scale.

Our weather station expresses temperatures in **tenths of a degree Celsius**. A raw value of 235 means 23.5°C:

```text
Bytes:           [0xEB, 0x00]
Signed int16 LE: 235
Temperature:     235 / 10 = 23.5°C
```

This lets the protocol represent fractional temperatures using an integer.

A negative reading follows the same rules:

```text
Bytes:           [0xC9, 0xFF]
Signed int16 LE: -55
Temperature:     -55 / 10 = -5.5°C
```

If the app mistakenly reads that second value as an unsigned integer, it gets 65,481. Dividing by ten then gives 6548.1°C.

The bytes can arrive correctly and still produce a completely wrong measurement. That helped me distinguish a communication problem from a decoding problem.

## Offsets: Where Does Each Field Begin?

So far, we’ve looked at a characteristic containing one value. A protocol can also pack several fields into the same characteristic value.

Suppose our weather station exposes a combined reading with this fixed four-byte layout:

| Byte offset | Type     | Field       | Meaning                 |
| ----------- | -------- | ----------- | ----------------------- |
| 0           | `int16`  | Temperature | Little-endian, 0.1°C     |
| 2           | `uint8`  | Humidity    | Whole percent, 0–100    |
| 3           | `uint8`  | Battery     | Whole percent, 0–100    |

An **offset** is the position where a field begins, counting from zero. The temperature starts at offset `0` and occupies bytes `0` and `1`. Humidity starts at offset `2`.

A reading might look like this:

```text
[0xEB, 0x00, 0x30, 0x64]
 └────┬────┘  │     │
   23.5°C    48%   100%
```

This is where the protocol starts to look like a schema: it describes where each field lives and how to interpret it.

Converting those fields into bytes is often called **serialization**. Reconstructing the values from the bytes is **deserialization**. Encoding describes the representation rules used in that process.

The terminology was unfamiliar, but the goal was familiar: turn a message into data the app can work with.

## Buffer Made the Conversion Easier

I initially worked directly with byte arrays, combining bytes and handling the conversions myself. That helped me learn, but it also left a lot of manual byte manipulation in my code.

Then I started using `Buffer`.

`Buffer` is a Node.js API, rather than a built-in JavaScript global on every platform. In React Native, I used the [`buffer` package](https://github.com/feross/buffer) to access that functionality.

Here’s our temperature example:

```js
import { Buffer } from 'buffer';

const received = Buffer.from([0xEB, 0x00]);
const temperature = received.readInt16LE(0) / 10;

// 23.5
```

The method name captures the decoding rules: `Int16` reads a signed 16-bit integer, `LE` specifies little-endian, and `0` is the byte offset. The division applies our protocol’s scale. The [Node.js Buffer documentation](https://nodejs.org/api/buffer.html#bufreadint16leoffset) describes the method and its bounds requirements.

For the combined reading, we can put the layout in one function:

```js
import { Buffer } from 'buffer';

function decodeWeatherReading(bytes) {
  const data = Buffer.from(bytes);

  if (data.length !== 4) {
    throw new Error('Expected a four-byte weather reading');
  }

  const temperature = data.readInt16LE(0) / 10;
  const humidity = data.readUInt8(2);
  const battery = data.readUInt8(3);

  if (humidity > 100 || battery > 100) {
    throw new Error('Weather reading contains an invalid percentage');
  }

  return { temperature, humidity, battery };
}

const reading = decodeWeatherReading([0xEB, 0x00, 0x30, 0x64]);

// { temperature: 23.5, humidity: 48, battery: 100 }
```

Now the rest of the app has the kind of object I was used to working with. The byte layout stays inside the decoder.

The length check follows our fictional fixed-length protocol. A different protocol might allow optional fields or reserve particular values to mean “measurement unavailable.” Those rules belong in its decoder too.

## Sending Data Works in the Other Direction

Reading values means following the device’s decoding rules. Writing values means producing the bytes the device expects.

Suppose the weather station’s measurement interval characteristic accepts an unsigned 16-bit little-endian integer measured in seconds. To set a ten-second interval:

```js
import { Buffer } from 'buffer';

const outgoing = Buffer.alloc(2);
outgoing.writeUInt16LE(10, 0);

const bytes = Array.from(outgoing);

// [10, 0], or [0x0A, 0x00]
```

This prepares the payload. A BLE library then writes it to the characteristic, using whatever value representation that library requires.

The application should also validate the setting against the device’s permitted interval range. Fitting in two bytes doesn’t automatically make a setting valid.

## What About Text or Base64?

Text still needs an encoding. For example, UTF-8 represents `Hello` with these bytes:

```text
[0x48, 0x65, 0x6C, 0x6C, 0x6F]
```

The protocol must define the text encoding and how to identify the string’s length or end. The app can’t infer those rules just because some bytes happen to resemble letters.

Some BLE libraries expose characteristic values as **Base64 strings**. That’s another representation of the bytes, used at the library boundary:

```js
const data = Buffer.from('6wA=', 'base64');
const temperature = data.readInt16LE(0) / 10;

// 23.5
```

Base64 decoding recovers `[0xEB, 0x00]`. The temperature protocol still determines what those bytes mean. See the [Buffer encoding reference](https://nodejs.org/api/buffer.html#buffers-and-character-encodings) for supported conversions.

I needed to keep two questions separate: how does the library give me the bytes, and how does the device encode its values?

## The Model That Finally Made Sense

I started out thinking that receiving the data was most of the work. Understanding the protocol showed me what was still missing.

For each field, I needed to know:

- **Offset:** Where does it begin?
- **Size:** How many bytes does it occupy?
- **Type:** Is it signed, unsigned, text, or another representation?
- **Byte order:** How are multi-byte values ordered?
- **Unit and scale:** How does the decoded value become a measurement?
- **Valid values:** Are there limits or special values the app must handle?

Tools like `Buffer` made the conversions easier, but the device documentation still supplied the meaning.

> **Knowing how to read bytes isn’t the same as knowing what those bytes represent.**

Once I could keep the encoding and decoding in small functions, the rest of the app could work with temperatures, percentages, and settings. I didn’t need every screen to understand the device’s byte layout.

That became another part of the BLE abstraction I was building: turn the protocol into an interface that felt familiar to an application developer.

Next in the series, I’ll look at what happens when a payload is too large for one write, and how chunking lets the app and device exchange larger amounts of data.

## Further Reading

- [Node.js: Buffer](https://nodejs.org/api/buffer.html) — Reference for working with bytes, integer reads and writes, and text encodings.
- [buffer package](https://github.com/feross/buffer) — The Node-style Buffer implementation I used in React Native.
- [MDN: Endianness](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) — An explanation of byte order with examples.
