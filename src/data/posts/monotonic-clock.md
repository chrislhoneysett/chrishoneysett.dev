---
title: 'Keeping Time Offline in React Native When the Device Clock Changes'
description: 'How I combined server time with native monotonic clocks to support up to 24 hours offline without relying on the phone’s date and time settings.'
author: 'Chris Honeysett'
date: '2026-10-26'
tags: [React Native, Expo, JavaScript, Computing Fundamentals]
status: published
imageAlt: 'A hand holding a phone with manual time settings open in front of server racks.'
---

While working on a React Native app, I needed to protect its time calculations from users changing their phone’s clock. The app used timestamps for session lengths, lockout expirations, and audit events. I wanted those calculations to follow the server’s time even when the device clock changed.

The app also had to work offline for up to 24 hours. I couldn’t ask the server for the current time before every time-sensitive task. I needed to establish a time reference while connected, then keep track of elapsed time locally while the server was unavailable.

At first, this seemed simple enough: get the server time when the session starts, then use `Date.now()` to work out how much time has passed.

The problem was that `Date.now()` reads the device’s clock. If a user moved that clock forward by 30 minutes, a countdown based on it could decide that a 30-minute lockout had already ended. While connected, the server could reject an invalid request. Offline, the app needed to evaluate time-sensitive conditions using its saved server reference, without letting a change to the phone’s clock alter the result. Client timestamps in an audit trail could be wrong for the same reason.

My first thought was to detect whether the user had set their clock manually and require them to enable automatic time before using the app. That requirement felt unnecessary. Someone could have a valid reason for changing their phone’s time.

I needed the app to calculate time from the server’s answer without depending on the phone’s date setting. That led me to monotonic clocks.

## Getting the starting time was only half the problem

A monotonic clock gave me a way to measure elapsed time without depending on the device’s date setting. Its readings don’t go backward, and changing the device’s date doesn’t move them forward or backward. The native clocks I ended up using measure time since boot. The difference between two readings gives me the elapsed duration.

That let me separate the two jobs:

- The server supplies the starting timestamp.
- The monotonic clock measures how much time has passed since then.

```text
Estimated server time = saved server time
                      + (current monotonic reading − saved monotonic reading)
```

If the server says it’s noon and the monotonic clock advances by five minutes, my estimate becomes 12:05. Changing the phone’s displayed time doesn’t enter the calculation.

Epoch describes a timestamp’s reference point; monotonic describes whether successive readings can go backward. My estimate is still epoch-based and stays monotonic between server syncs, though a new sync can correct it in either direction. `Date.now()` has no monotonic guarantee because it follows the adjustable device clock.

## I started with Expo’s uptime API

Expo already had a function that looked like what I needed: [`Device.getUptimeAsync()`](https://docs.expo.dev/versions/latest/sdk/device/#devicegetuptimeasync).

```typescript
import * as Device from 'expo-device'

const startedAtMs = await Device.getUptimeAsync()

// Later...
const elapsedMs = (await Device.getUptimeAsync()) - startedAtMs
```

I could save that first reading alongside the server timestamp, then add the elapsed duration whenever the app needed the current time.

![A phone with its screen asleep on a sofa cushion, with a wall clock in the background.](/blog/monotonic-clock/sleep-timing-square.jpg "aside")

During testing, I noticed discrepancies on iOS in particular. The app had a countdown showing how much longer a session was valid, and it was ending up far behind reality. It showed time remaining when the session should already have expired.

Debugging that discrepancy led me to the sleep issue. The problem was what “uptime” counted.

On Android, Expo uses `SystemClock.uptimeMillis()`, which excludes deep sleep. Expo’s documentation calls this out. On iOS, its [implementation uses `ProcessInfo.systemUptime`](https://github.com/expo/expo/blob/main/packages/expo-device/ios/DeviceModule.swift), an awake-time clock rather than a clock that includes sleep.

Imagine starting a 30-minute countdown, using the phone for five minutes, then leaving it asleep for 20 minutes. Here’s what the countdown could show when the phone wakes up:

| Clock behavior | Elapsed time counted | Time remaining |
| --- | --- | --- |
| Excludes sleep | 5 minutes | 25 minutes |
| Includes sleep | 25 minutes | 5 minutes |

I’d found a clock that avoided changes to the device’s date, but it wasn’t measuring all the elapsed time I needed.

> **A clock can be monotonic and still exclude sleep.**

## Using native clocks that include sleep

That discovery led me to build a small native module for each platform. I wanted to keep the same calculation in JavaScript and change where the elapsed-time readings came from.

On Android, [`SystemClock.elapsedRealtime()`](https://developer.android.com/reference/android/os/SystemClock) provides milliseconds since boot, including deep sleep. The important part of the native code is just:

```kotlin
import android.os.SystemClock

fun nowMs(): Double = SystemClock.elapsedRealtime().toDouble()
```

On iOS, `mach_continuous_time()` includes sleep too. It returns ticks, so there’s a conversion to milliseconds using the system’s timebase:

```swift
import Darwin

func nowMs() -> Double {
  var timebase = mach_timebase_info_data_t()
  mach_timebase_info(&timebase)

  return Double(mach_continuous_time())
    * Double(timebase.numer) / Double(timebase.denom)
    / 1_000_000
}
```

Apple describes the sleep behavior in its [Mach time API header](https://github.com/apple-oss-distributions/xnu/blob/main/osfmk/mach/mach_time.h). The conversion gives both platforms the same unit, so the JavaScript calculation doesn’t need to know which one it’s running on.

I exposed those readings through a shared `nowMs()` function using the [Expo Modules API](https://docs.expo.dev/modules/get-started/). The snippets above show the clock calls at the center of that module; the registration and build setup live around them.

With that function available, the idea in JavaScript is small enough to show on its own:

```typescript
// Illustrative: MonotonicClock is the wrapper around the native module.
// serverTimeMs comes from a fresh server response, in epoch milliseconds.
const savedServerTimeMs = serverTimeMs
const savedMonotonicMs = MonotonicClock.nowMs()

function estimatedServerNowMs(): number {
  const elapsedMs = MonotonicClock.nowMs() - savedMonotonicMs
  return savedServerTimeMs + elapsedMs
}
```

The starting timestamp still comes from the server. The native clock supplies the elapsed duration, including the time the phone spends asleep.

This also means a countdown doesn’t need to depend on every timer callback running on schedule. When the app updates the display, it can subtract the estimated current time from the deadline returned by the server. If JavaScript was suspended, the next update can catch up. The clock counting sleep doesn’t mean the app keeps executing during sleep.

## What this approach can and can’t tell me

The result is an estimate of server time. It still has some uncertainty from the response’s travel time, and the local clock can drift relative to the server. The requirement was to support up to 24 hours offline, so a fresh server response couldn’t be a prerequisite for every time-sensitive task. I’d refresh the saved pair when connectivity allowed, including after a long background period when online.

Those native readings also belong to the current device boot. I keep the saved pair in memory and get a fresh server timestamp when the app launches, rather than assuming a persisted reading will remain valid after a reboot. Starting offline without that reference needs an explicit app decision; silently falling back to `Date.now()` would bring back the original problem.

This approach also doesn’t protect against someone who can modify the app itself. On a rooted or jailbroken device, an attacker could hook the native call, replace its result, or skip the check entirely.

> **The app carries the server’s time reference forward while offline. That estimate remains subject to the app’s offline policy and the integrity of the device.**

While connected, the server can enforce its own time checks. While offline, the app has to evaluate time-sensitive conditions locally within the permitted offline window. A monotonic clock keeps ordinary changes to the device’s date setting out of that calculation; it doesn’t make local enforcement tamper-proof. For audit events, I’d keep the server’s receipt time alongside any client-reported occurrence time. An offline event’s estimated timestamp is useful context, but it isn’t proof of when that action happened.

## What about the browser?

The browser has `performance.now()` for measuring elapsed time independently of changes to the device’s wall clock. The [High Resolution Time specification](https://www.w3.org/TR/hr-time-3/) defines that monotonic behavior.

The sleep question still matters, though. Browser implementations have differed in whether their clock advances during operating-system sleep, as discussed in the [standard’s issue on sleep behavior](https://github.com/w3c/hr-time/issues/115). I wouldn’t assume it offers the same behavior as the native clocks above. For a web countdown, I’d refresh server time when the page becomes visible again.

## What I took away from this

The calculation was simple once I had the right inputs. Finding those inputs took more work than I expected.

Getting the starting time from the server solved one part. Measuring elapsed time without `Date.now()` solved another. Testing with the phone asleep exposed the last piece: I needed that elapsed duration to include the time when the device wasn’t awake.

That was the approach I wanted to carry forward: let the server establish the time, then use a local clock that measures the full duration since that answer. The native modules were a small part of the implementation, but choosing the right clocks made the difference in how the app behaved.
