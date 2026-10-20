---
title: 'Building Auris: My React Native BLE Library'
description: 'How I built Auris to simplify React Native BLE connections, manage sessions, and cancel ongoing work with AbortController.'
author: 'Chris Honeysett'
date: '2026-10-20'
tags: [BLE, React Native, JavaScript]
status: draft
series: ble-for-web-developers
seriesOrder: 4
imageAlt: 'A notebook sketch of BLE library architecture beside a connected phone, wireless sensor, and laptop.'
---

## Why I built it

- react-native-ble-manager already provided the native operations you needed.
- The repeated work was coordinating scanning, connecting, discovering services, exchanging data, and disconnecting.
- Describe one real situation where overlapping work or stale session state caused trouble.
- Introduce your goal: give application code a straightforward API while centralizing that coordination.
  Avoid opening with the architecture. Let readers encounter the problem first.

2. A connection is only part of a session
   Explain what you mean by session in this article: the connection plus the operations, state, and listeners associated with working with a device.

Use concrete questions to establish the responsibilities:

- What happens to an active scan when a connection starts?
- What happens if another connection attempt is already running?
- What happens to reads, writes, and notifications when the device disconnects?
- How does the UI learn what is happening?
  These map directly to the task management and event systems described in your README.

One wording adjustment: describe single-device usage as your original design goal, rather than an unconditional library restriction. The README documents disconnectAllFirst: true as the discovery default, but allows callers to disable it and preserve an existing connection. 3. What using AurisBLE looks like
Show the payoff before explaining the internals.

Use one compact example covering:

1. Connecting to a selected peripheral.
2. Receiving connection progress.
3. Reading a characteristic using the returned peripheral.
4. Disconnecting.
   Explain that the connection workflow includes service discovery and optional MTU negotiation. The app still chooses the device and data operation; AurisBLE coordinates the steps underneath.

Introduce type safety here through the actual parameters and results. Readers will understand its value more easily beside a concrete example. 4. How I organized the coordination
Explain your three layers briefly:
Layer Responsibility
Public API Provides the functions the app calls, initializes the library, and delegates operations.
Orchestration core and operation modules Coordinate tasks, state transitions, events, and cleanup.
react-native-ble-manager Performs the native BLE operations.

Then follow one connect() call through those layers. That will be more readable than describing every module.

Your points about a single index.ts entry point and separate operation files fit naturally here. Explain how that separation helps you maintain the code. 5. Managing the work that is already running
This should be the technical heart of the article.

Use the documented examples:

- Starting a connection stops scanning.
- Existing connection attempts to the same peripheral are cleaned up.
- Disconnecting cleans up that peripheral’s reads, writes, and notifications.
- Cancellation and timeouts need cleanup paths too.
  Introduce AbortController as part of this design, with one short example of passing a signal into an operation.

A useful detail from your README: aborting one discovery caller does not necessarily stop the native scan, because other callers can share it. stopCurrentScan() explicitly forces scan teardown. This gives you a concrete way to explain why “cancel my work” and “stop the underlying operation” can be different responsibilities. 6. Keeping the UI informed
Give events a short section of their own—they are a meaningful part of your design.

- Promises provide an operation’s result.
- Events communicate progress, discovered peripherals, and connection changes.
- Application state can consume those events so components don’t each manage BLE subscriptions.
  Show one progress callback or event subscription. Leave the full Zustand implementation out of this article.

7. What I learned
   Close with your own observations:

- Which responsibilities became easier to follow?
- What complexity moved into the library?
- Which design choice proved most useful?
- What would you approach differently now?
  This is where the post becomes more than a shortened README.

What to keep versus split out:
Topic Recommendation
Permissions Briefly mention the common API and automatic discovery checks. Put platform setup and version differences in a separate guide.
AbortController Keep its role in session cleanup here. Give cancellation mechanics and shared-operation behavior their own follow-up.
Events and Zustand Keep the event model here. Save a complete React/Zustand integration walkthrough for another post.
MTU and payload chunking Mention only when explaining the returned peripheral object. Save the details for a data-transfer article.
File organization and type safety Keep alongside the design and examples; neither needs a standalone section.

One detail to verify before writing code examples: the README describes overlapping scans in different places as stopped, queued, or coalesced. Use the behavior confirmed by the implementation, and avoid broad claims such as “all conflicting operations are queued.”

For this post, I’d aim for two main code examples: consuming the API and cancelling an operation, supported by a short walkthrough of what happens internally.

- react-native-ble-manager gave my the operations I needed
- Found myself repeatedly managing connections and losing track of sessions

## Permissions

- Requirements for iOS vs Android (plus Android differences between old and new)

## Repeated Session Management

### Manage Single Session

- Only allow a single connection
- App can make calls without worrying about the session
- Library handled state management

## How its used

- Using a single index for consumption by other

- Passing in peripheral and event handler
- Type safety
- code exmaples

## AbortController

- A key difficulty in managing the single session was stopping any current work.
- AbortControllers became the right solution

- Maintainability by segmenting each operation into its own file

AurisBLE takes the coordination of BLE operations out of your application code. Session management is the motivation; state, tasks, events, and cleanup are how you addressed it.

I’d keep the title “Building AurisBLE: Managing BLE Sessions in React Native.” Here’s the refined outline I’d write from.

1. Why I built it

- react-native-ble-manager already provided the native operations you needed.
- The repeated work was coordinating scanning, connecting, discovering services, exchanging data, and disconnecting.
- Describe one real situation where overlapping work or stale session state caused trouble.
- Introduce your goal: give application code a straightforward API while centralizing that coordination.
  Avoid opening with the architecture. Let readers encounter the problem first.

2. A connection is only part of a session
   Explain what you mean by session in this article: the connection plus the operations, state, and listeners associated with working with a device.

Use concrete questions to establish the responsibilities:

- What happens to an active scan when a connection starts?
- What happens if another connection attempt is already running?
- What happens to reads, writes, and notifications when the device disconnects?
- How does the UI learn what is happening?
  These map directly to the task management and event systems described in your README.

One wording adjustment: describe single-device usage as your original design goal, rather than an unconditional library restriction. The README documents disconnectAllFirst: true as the discovery default, but allows callers to disable it and preserve an existing connection. 3. What using AurisBLE looks like
Show the payoff before explaining the internals.

Use one compact example covering:

1. Connecting to a selected peripheral.
2. Receiving connection progress.
3. Reading a characteristic using the returned peripheral.
4. Disconnecting.
   Explain that the connection workflow includes service discovery and optional MTU negotiation. The app still chooses the device and data operation; AurisBLE coordinates the steps underneath.

Introduce type safety here through the actual parameters and results. Readers will understand its value more easily beside a concrete example. 4. How I organized the coordination
Explain your three layers briefly:
Layer Responsibility
Public API Provides the functions the app calls, initializes the library, and delegates operations.
Orchestration core and operation modules Coordinate tasks, state transitions, events, and cleanup.
react-native-ble-manager Performs the native BLE operations.

Then follow one connect() call through those layers. That will be more readable than describing every module.

Your points about a single index.ts entry point and separate operation files fit naturally here. Explain how that separation helps you maintain the code. 5. Managing the work that is already running
This should be the technical heart of the article.

Use the documented examples:

- Starting a connection stops scanning.
- Existing connection attempts to the same peripheral are cleaned up.
- Disconnecting cleans up that peripheral’s reads, writes, and notifications.
- Cancellation and timeouts need cleanup paths too.
  Introduce AbortController as part of this design, with one short example of passing a signal into an operation.

A useful detail from your README: aborting one discovery caller does not necessarily stop the native scan, because other callers can share it. stopCurrentScan() explicitly forces scan teardown. This gives you a concrete way to explain why “cancel my work” and “stop the underlying operation” can be different responsibilities. 6. Keeping the UI informed
Give events a short section of their own—they are a meaningful part of your design.

- Promises provide an operation’s result.
- Events communicate progress, discovered peripherals, and connection changes.
- Application state can consume those events so components don’t each manage BLE subscriptions.
  Show one progress callback or event subscription. Leave the full Zustand implementation out of this article.

7. What I learned
   Close with your own observations:

- Which responsibilities became easier to follow?
- What complexity moved into the library?
- Which design choice proved most useful?
- What would you approach differently now?
  This is where the post becomes more than a shortened README.

What to keep versus split out:
Topic Recommendation
Permissions Briefly mention the common API and automatic discovery checks. Put platform setup and version differences in a separate guide.
AbortController Keep its role in session cleanup here. Give cancellation mechanics and shared-operation behavior their own follow-up.
Events and Zustand Keep the event model here. Save a complete React/Zustand integration walkthrough for another post.
MTU and payload chunking Mention only when explaining the returned peripheral object. Save the details for a data-transfer article.
File organization and type safety Keep alongside the design and examples; neither needs a standalone section.

One detail to verify before writing code examples: the README describes overlapping scans in different places as stopped, queued, or coalesced. Use the behavior confirmed by the implementation, and avoid broad claims such as “all conflicting operations are queued.”

For this post, I’d aim for two main code examples: consuming the API and cancelling an operation, supported by a short walkthrough of what happens internally.
