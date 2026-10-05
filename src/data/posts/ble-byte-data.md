# Making Sense of BLE Byte Data

## And Then Came the Bytes

This was my biggest adjustment.

BLE doesn't hand your JavaScript application a friendly object like:

```
{
  temperature: 23.5,
  humidity: 48
}
```

It transports bytes.

Coming from web development rather than a computer science or embedded background, I never needed to think about binary representations directly.

Suddenly terms like bits, bytes, hexadecimal, and endianness mattered.

### Bits and Bytes

A **bit** is a single binary digit: either `0` or `1`.

A **byte** is a group of eight bits.

Eight bits can represent 256 different combinations, so an unsigned (more on unsigned below) byte can hold a number from:

```
0 through 255
```

A **byte array** is simply an ordered sequence of those bytes.

For example:

```
[235, 0, 48, 1]
```

Those numbers don't mean anything by themselves. The device's protocol defines how your application should interpret them.

Perhaps:

```
Bytes 0-1 → Temperature
Bytes 2-3 → Humidity
```

Before we can decode those values, though, there's another representation you'll see constantly when working with BLE: **hexadecimal**.

### Why Does Everything Suddenly Start With `0x`?

When I first started looking at BLE documentation and debugging tools, I kept seeing values like:

```
0x00
0xFF
0x03E8
```

That's **hexadecimal**, usually shortened to **hex**.

We're used to decimal numbers, which use ten digits:

```
0 1 2 3 4 5 6 7 8 9
```

Hexadecimal uses sixteen:

```
0 1 2 3 4 5 6 7 8 9 A B C D E F
```

The letters represent values beyond 9:

```
A = 10
B = 11
C = 12
D = 13
E = 14
F = 15
```

The `0x` prefix is simply a common way of saying:

> "This number is written in hexadecimal."

So:

```
0x0A = 10
0x10 = 16
0xFF = 255
```

Why is hex so common when working with bytes?

Because it maps very neatly to binary.

One hexadecimal digit represents **4 bits**, so two hexadecimal digits represent exactly **one byte**:

```
Binary       Hex
0000 0000    0x00
0000 0001    0x01
1111 1111    0xFF
```

That means a byte whose decimal value is `235` can also be written as:

```
235 decimal = 0xEB hexadecimal
```

They're not different values. They're just two different ways of writing the same value.

In JavaScript, these are equivalent:

```
const decimal = 235;
const hexadecimal = 0xEB;

console.log(decimal === hexadecimal);
// true
```

That realization helped me a lot.

When I saw:

```
[235, 0]
```

and a hardware specification showed:

```
[0xEB, 0x00]
```

those weren't two different payloads.

They were the exact same two bytes written using different notation.

## `int8`, `uint16`, `int32` — What Do Those Actually Mean?

Once I started reading hardware specifications, I ran into types with names like:

```
uint8
int16
uint32
```

Coming from JavaScript, this wasn't terminology I had to think about.

JavaScript mostly lets us work with `Number` without constantly specifying how many bits should be used to represent that number.

Hardware protocols don't have that luxury.

Every field takes up a specific amount of space, so the protocol has to define exactly how large a number is and whether it can be negative.

The names actually tell you both.

Take:

```
uint16
```

Break it apart:

```
u     → unsigned
int   → integer
16    → 16 bits
```

Likewise:

```
int16
```

means:

```
int   → signed integer
16    → 16 bits
```

Because one byte is 8 bits:

```
8 bits  = 1 byte
16 bits = 2 bytes
32 bits = 4 bytes
```

So the common integer types look like this:

| Type     | Bytes | Can Be Negative? | Range                           |
| -------- | ----- | ---------------- | ------------------------------- |
| `uint8`  | 1     | No               | 0 to 255                        |
| `int8`   | 1     | Yes              | -128 to 127                     |
| `uint16` | 2     | No               | 0 to 65,535                     |
| `int16`  | 2     | Yes              | -32,768 to 32,767               |
| `uint32` | 4     | No               | 0 to 4,294,967,295              |
| `int32`  | 4     | Yes              | -2,147,483,648 to 2,147,483,647 |

The important idea isn't memorizing those ranges.

It's understanding that something like:

```
Temperature: int16
```

means that the temperature occupies **two bytes** and can represent both positive and negative values.

While:

```
Battery Percentage: uint8
```

means the value occupies **one byte** and cannot be negative.

A battery percentage obviously doesn't need values below zero, so an unsigned integer makes sense.

### Why Does Unsigned Give You a Bigger Positive Range?

An 8-bit value always has the same 256 possible bit patterns.

If the value is **unsigned**, all 256 possibilities can represent positive values:

```
uint8
0 through 255
```

If the value is **signed**, some of those patterns have to represent negative numbers:

```
int8
-128 through 127
```

You don't gain or lose bits.

You're just deciding what those bit patterns mean.

## What Does a Negative Number Actually Look Like?

This was another concept that initially felt strange.

If a byte can only contain bits—zeros and ones—how does it represent something like `-10`?

Signed integers are typically represented using a system called **two's complement**.

You don't usually need to perform the conversion manually, but understanding the basic idea makes debugging byte arrays much easier.

Let's use an 8-bit signed integer.

The positive number `10` looks like:

```
Decimal:  10
Binary:   0000 1010
Hex:      0x0A
```

The signed 8-bit representation of `-10` is:

```
Decimal:  -10
Binary:   1111 0110
Hex:      0xF6
```

So if a BLE device sends:

```jsx
;[0xf6]
```

that byte can mean very different things depending on the protocol.

If you interpret it as a `uint8`:

```
0xF6 = 246
```

If you interpret the exact same byte as an `int8`:

```
0xF6 = -10
```

That's an important lesson:

> **The bytes themselves don't tell you whether a number is signed or unsigned. The protocol does.**

The exact same eight bits:

```
1111 0110
```

can mean either:

```
246
```

or:

```
-10
```

depending on how you interpret them.

### A More Realistic BLE Example

Suppose the device sends these two bytes:

```
[0xC9, 0xFF]
```

The protocol tells us that this value is:

```
Type: int16
Byte Order: Little-endian
Scale: 0.1°C
```

So conceptually, decoding it looks something like:

```
bytes = [0xC9, 0xFF]

rawTemperature =
    interpret bytes as signed 16-bit little-endian integer

rawTemperature = -55

temperature = rawTemperature / 10

temperature = -5.5°C
```

If we accidentally interpreted those same bytes as an **unsigned** 16-bit integer instead:

```
interpret [0xC9, 0xFF]
as uint16 little-endian

= 65481
```

After applying the same scale:

```
65481 / 10 = 6548.1°C
```

At that point, the problem isn't the data the device sent.

It's how we interpreted it.

That's a recurring theme with BLE:

> **The bytes only have meaning because the device's protocol tells us how to read them.**

### What About Strings?

A BLE device can send text, but it still sends that text as bytes.

For example, the string:

```
Hello
```

could be encoded as UTF-8:

```
[0x48, 0x65, 0x6C, 0x6C, 0x6F]
```

The app would then decode those bytes back into `"Hello"`.

In many BLE protocols, strings are used less often than compact numeric values because they generally require more bytes to represent the same information. For battery-powered devices where bandwidth and power usage matter, it is common to send tightly packed integers, flags, and bit fields instead.

But the same rule still applies:

> BLE sends bytes. The protocol tells both sides whether those bytes represent text, a number, a flag, or something else.

### Byte Order: Little-Endian vs. Big-Endian

This one was a doozy and even created confusion on the BLE firmware teams side!

Once a value requires more than one byte, another question appears:

**Which byte comes first?**

That's what **endianness** describes.

Take the number `1000`.

In hexadecimal, `1000` is:

```
0x03E8
```

Because that value is larger than a single byte can hold, it requires two bytes:

```
0x03
0xE8
```

`0x03` is the **most significant byte** because it contributes the larger portion of the value.

In decimal:

```
0x03 = 3
3 × 256 = 768
```

The other byte is:

```
0xE8 = 232
```

Together:

```
768 + 232 = 1000
```

But those two bytes can be stored in different orders.

**Big-endian** puts the most significant byte first:

```
[0x03, 0xE8]
```

**Little-endian** puts the least significant byte first:

```
[0xE8, 0x03]
```

The numeric value is still `1000`.

Only the order in which its bytes are transmitted or stored has changed.

If your device sends little-endian data but your application interprets it as big-endian, you'll get a completely different number.

Welcome to hardware.

## Signed vs. Unsigned Numbers

The protocol also has to specify whether numbers are **signed** or **unsigned**.

An unsigned 8-bit integer can represent:

```
0 through 255
```

A signed 8-bit integer can typically represent:

```
-128 through 127
```

Supporting negative numbers requires using some of the possible bit patterns to represent those negative values.

So when a hardware specification tells you a field is something like:

```
int16 little-endian
```

every piece of that description matters.

It means:

- integer
- signed
- 16 bits / 2 bytes
- little-endian byte order

## Offsets, Encoding, and Serialization

A few more terms started appearing frequently.

An **offset** is simply where a value begins in the byte array, usually starting from zero.

For example:

```
Byte 0       → Status
Bytes 1-2    → Temperature
Bytes 3-4    → Pressure
```

The temperature has an offset of `1`.

**Encoding** describes the rules used to represent information as bytes. Text, for example, might use UTF-8.

**Serialization** means converting structured information into bytes.

**Deserialization** means taking those bytes and reconstructing meaningful values.

Once I understood those concepts, BLE data started feeling much less mysterious.

But I was still doing far too much manual byte manipulation.

Then I discovered `Buffer`.

## Buffer Made Binary Data Click for Me

While I initially worked directly on byte arrays, which was a great way to learn the concepts, I discovered `Buffer` as part of javascript. Instead of manually shifting bits, reordering arrays, and combining bytes, I could use a `Buffer` to explicitly describe how the bytes should be interpreted.

In React Native, Node-style Buffer functionality is available through the `buffer` package.

Suppose my hardware protocol defines temperature as:

> A signed 16-bit little-endian integer representing tenths of a degree Celsius.

If the device sends:

```
[0xEB, 0x00]
```

I can decode it with:

```
import { Buffer } from 'buffer';

const received = Buffer.from([0xEB, 0x00]);

const temperature = received.readInt16LE(0) / 10;

// 235 / 10
// 23.5°C
```

That one method name contains almost the entire protocol description:

```
readInt16LE(0)
```

Breaking that apart:

```
Int     → signed integer
16      → 16 bits / 2 bytes
LE      → little-endian
0       → begin reading at byte offset 0
```

Encoding the value to send in the other direction is just as straightforward:

```
const outgoing = Buffer.alloc(2);

outgoing.writeInt16LE(
  Math.round(23.5 * 10),
  0
);

const bytes = Array.from(outgoing);

// [235, 0]
```

Buffer can also handle text:

```
const encoded = Buffer.from('Hello', 'utf8');

const decoded = encoded.toString('utf8');
```

This eliminated a huge amount of manual binary manipulation from my code.

But there's an important distinction:

> **Buffer understands bytes. It does not understand your device.**

The hardware protocol still has to tell your application that bytes `0-1` contain a signed little-endian temperature in tenths of a degree.

Buffer simply makes following those rules much easier.

