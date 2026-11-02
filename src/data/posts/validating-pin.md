---
title: 'Validating a PIN Without Storing the Answer'
description: 'How I worked through plaintext comparison, PIN hashes, and shared keys before validating a PIN through a cryptographic operation in a React Native app.'
author: 'Chris Honeysett'
date: '2026-10-26'
tags: [React Native, Security, Computing Fundamentals]
status: draft
image: '/blog/validating-pin/pin-entry.jpg'
imageAlt: 'Hands entering a masked PIN on a smartphone beside a generic charcoal steel safe.'
---

While working on a React Native app that communicated with connected hardware, I needed to validate a user's assigned PIN. The backend managed that PIN, but the app needed to check what the user entered before allowing them to continue.

Comparing two strings would have been easy. Getting comfortable with where the expected value lived, and what that comparison actually protected, was harder.

I didn't want the backend to send the actual PIN to the app. I also didn't want to save it locally and rely on keeping that storage hidden. The app was installed on someone else's phone, and I had to account for someone inspecting what it received and stored.

What I wanted sounded straightforward: let the user enter their PIN, validate it at runtime, and avoid giving the app a saved answer to compare against.

Getting there took a few steps. I started with a direct comparison, considered a hash, looked at how dedicated hardware handled the same problem, and eventually changed what the PIN was used for.

## The obvious answer gave the app too much information

The simplest version would have looked something like this:

```typescript
// Illustrative only: the expected PIN came from the server.
const valid = enteredPin === expectedPin

if (valid) {
  navigateToNextScreen()
}
```

That would work, but it meant the app already had the user's PIN before they typed anything. Keeping it only in memory would reduce how long it stayed around, but the backend would still be delivering the answer to the client.

Saving it would add another place to protect, another value to clear when the session ended, and another opportunity for it to turn up in debugging output or a persisted state snapshot.

The app needed the user's input for the operation. It didn't need a separate copy of the expected PIN.

There was a second problem even if I could protect that saved value: the comparison was just an app gate. It produced a boolean that decided whether the user could reach the next screen.

Someone able to modify the app or interfere with its execution could force `valid` to `true` or skip the check. They wouldn't need to know the PIN to get past that routing decision. The app would behave as though validation had succeeded because nothing needed the entered value beyond that comparison.

> **They wouldn't need to know the PIN to get past a routing decision.**

## Could the server just send a hash?

My next option was for the backend to hash the PIN and send that value instead. The app could hash what the user entered using the same process, then compare the results.

```text
Server: assigned PIN → hash → send expected hash
App:    entered PIN  → hash → compare with expected hash
```

A hash is a one-way transformation. Unlike encryption, there isn't a decryption key that turns the result back into the original input.

That sounded closer to what I wanted. The app wouldn't receive the PIN itself.

The problem was that a PIN has a small set of possible values. For an illustrative four-digit numeric PIN, there are only 10,000 combinations, including leading zeros. Someone who copied the hash wouldn't have to reverse the hash function. They could hash each candidate and compare the result, just as the app did.

With a fast general-purpose hash, that comparison is deliberately cheap. An unsalted hash also lets someone prepare candidate hashes in advance and recognize when different users have the same PIN. A unique salt prevents that reuse, but it doesn't stop someone testing guesses against one user's value. [OWASP's password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) explains why salts and deliberately expensive password hashing serve different purposes.

Hashing also left the app gate intact. The comparison would still produce a boolean controlling navigation. Changing how I calculated that boolean wouldn't stop someone who could force its value or bypass the branch entirely.

I would still have a value to store and protect, and that value would exist specifically to tell the app whether a guess was correct. Hashing improved on sending the PIN directly, but it didn't give me the design I wanted.

## A stored symmetric key was already off the table

Other devices in the system used a symmetric key. Symmetric encryption uses the same secret key to encrypt and decrypt data.

Those devices were hardware the customer controlled. Their key storage and provisioning belonged to that hardware design. The mobile app ran on phones they didn't control. Putting a shared symmetric key into the app was a non-starter from the beginning.

I couldn't treat data inside the app as a safe place for that secret. Someone able to inspect the app could extract a bundled key or capture it while it was being used. The existing hardware approach supplied context for the problem, but storing that key in the mobile app was never an option I considered implementing.

The issue wasn't symmetric encryption itself. I still used it in the final solution.

> **I needed to change where the app's key came from and when it became available.**

## Validate the PIN through a cryptographic operation

The app already received an encrypted payload from the backend. That payload was needed for an operation with the connected hardware.

The solution I arrived at was to use a PIN-dependent encryption layer to validate the user's entry. When the user entered their PIN, the app used it as input to derive the cryptographic keys needed to authenticate and remove that layer.

The sensitive contents remained encrypted inside an inner payload. The app passed that encrypted payload along to the hardware, which handled its decryption separately. Validating the PIN didn't give the app access to the sensitive contents.

That changed what I was asking the app to do. The entered PIN now supplied input needed to obtain the encrypted payload that would be passed to the hardware. The result of a comparison couldn't stand in for that input.

```text
Entered PIN
  → derive cryptographic keys
  → authenticate and remove the PIN-dependent layer
  → accept the PIN if successful
  → pass the still-encrypted payload to the hardware
```

There was no separate expected PIN or expected PIN hash to download. The user supplied the missing input at runtime.

### The PIN supplies an input to key derivation

I initially thought of the PIN as a “seed” for decryption. More precisely, it was an input to **key derivation**: a defined process for turning password-like material into cryptographic keys.

That distinction helped me understand the solution. The app wasn't using the short string the user typed directly as an encryption key. It was using a standard cryptographic process to derive the keys needed for the operation.

Authentication matters here too. Successfully obtaining some bytes isn't enough to establish that decryption worked. The app needs a cryptographic check that the encrypted payload is authentic before accepting the result. [OWASP's cryptographic storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) explains why encryption needs authentication as well as confidentiality.

With the correct PIN, the app can authenticate and remove the PIN-dependent layer. An incorrect entry doesn't supply the keys needed to complete that operation. A damaged encrypted payload can fail too, so the app still needs to handle errors without assuming every failure means the user mistyped their PIN.

The important change for me was moving from a routing decision to a data access decision. Someone could still modify the app to display the next screen, but setting a boolean to `true` wouldn't produce the keys or recover the inner encrypted payload. Continuing the actual operation required the data, not just a screen that said validation had succeeded.

> **Setting a boolean to `true` wouldn't produce the keys or recover the inner encrypted payload.**

Here, data access means obtaining the still-encrypted payload to pass along. The sensitive contents remained encrypted for the hardware.

### Why this fit the requirement better

The direct comparison required the backend to give the app the expected PIN. The hash comparison replaced that PIN with a stored value whose purpose was to check guesses.

Using the encrypted payload gave me a way to validate the PIN without introducing another saved answer solely for the check. I didn't need to embed a shared secret in the app, and the sensitive contents could stay encrypted as they passed through it.

That also made the requirement easier to describe. The app needed to check the user's entry and pass along an encrypted payload. It could do both without knowing the expected PIN or decrypting the sensitive contents intended for the hardware.

This was the part that made the solution feel like a better fit for production. The PIN had a necessary role in accessing the encrypted payload. Bypassing navigation alone couldn't supply what the next step needed.

## The hardware still has to validate the operation

Validating the PIN in the app doesn't establish that the hardware should accept an operation. Those are separate decisions, and the hardware has to make the final authorization decision independently of the app's result.

PIN-based encryption doesn't eliminate guessing attacks. A short PIN has a limited number of possibilities, and key derivation can make guesses more expensive without making the PIN itself less predictable. Someone with a copied encrypted payload and the required context may be able to test guesses outside the app, where the app's retry limits don't apply. The app also handles the entered PIN and derived keys temporarily, so a compromised phone may expose them during legitimate use.

Recovering those keys wouldn't by itself reveal the separately encrypted contents intended for the hardware. But keeping those contents unreadable doesn't prevent every form of misuse. An attacker might only need to pass the still-encrypted payload to the hardware and have it accepted.

> **An encrypted payload can remain confidential and still be misused. The hardware must validate whether it authorizes the requested operation, rather than trusting that the app accepted the PIN.**

That is why the hardware's validation is the real authorization boundary. It needs to establish that the encrypted payload is authentic and valid for the requested operation, including any applicable restrictions on when, where, or how it can be used. Expiration and protection against replay are examples of controls that need enforcement by the component accepting the operation; checking them only in the app wouldn't protect against someone bypassing that app.

The PIN check supports the user flow without storing the expected answer. It doesn't replace the hardware's own validation or make a compromised phone trustworthy.

## What I took away from this

I started by asking how the app could compare a user's entry without storing their PIN. Each alternative moved the same question somewhere else: what information would the client need, and what could someone do with it?

The useful change was moving from an app gate to data access. A boolean could let someone reach the next screen, but it couldn't substitute for the PIN-derived keys needed to obtain the encrypted payload. The app could validate the PIN while leaving the sensitive contents encrypted for the hardware to validate and decrypt separately.

The result met the requirement without giving the app a saved copy of the expected answer. The user supplies the PIN at runtime, and the app uses it to unlock the next step. Getting there meant looking beyond how to compare two values and thinking through what the app actually needed the PIN to do.
