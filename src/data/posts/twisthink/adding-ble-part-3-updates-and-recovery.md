# Adding BLE to Your Connected Product, Part 3: Handling Updates and Interruptions

A connected product needs to keep working when communication becomes inconvenient. A user walks out of range, closes the application, or loses device power during an update. The firmware and app need a shared plan for what happens next.

Large transfers make that coordination especially visible. The application must send data at a size and pace the device can accept. Firmware must receive, validate, and process it, then expose a result the app can communicate accurately.

This final article in our BLE series covers transfer design, connection lifecycle, and recovery. [Part 1](adding-ble-part-1-device-and-app-design.md) covered architecture, and [Part 2](adding-ble-part-2-reliable-communication.md) covered the communication contract.

## Size Transfers for the Actual Connection

A measurement may occupy a few bytes. A firmware image needs many writes. **Chunking** divides the larger message into pieces that fit the connection’s payload limits.

The **ATT MTU**, or Maximum Transmission Unit, limits an individual Attribute Protocol message. Some of that space belongs to the protocol, so it is not all available for application data. A normal write request allows up to `MTU - 3` bytes for its value: an MTU of 23 provides 20 bytes. Other operations have different overhead. The [ATT specification](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-62/out/en/host/attribute-protocol--att-.html) defines these limits.

Use the actual connection limit or the platform’s maximum write-value size for the selected operation. A requested size is not a guarantee. Also account for smaller device or library limits and any fields added to each chunk.

Firmware and application teams should agree on this budget early. The update needs to work across the supported phones and connection sizes, rather than only under the conditions used during development.

## Design the Transfer Protocol Together

Splitting bytes is only one part of an update. Repeated writes to a characteristic do not automatically become a file. Firmware must know how the pieces form a complete transfer.

Define the start condition, expected length, ordering, validation, and final outcome. Decide whether the protocol needs chunk identifiers or byte offsets, and how the device reports invalid or unexpected data.

The device also needs a receiving strategy: where chunks are stored, how much buffering is available, and how the app learns that it can send more. The application’s sending behavior must respect that capacity. A faster sender is useful only if the receiver can keep up.

For a sequential transfer using writes with response, the app waits for each write before sending the next chunk. Other approaches need their own flow-control design. Choose based on the device’s capabilities and the product’s transfer-time requirements.

## Report the Outcome the User Actually Needs

A progress indicator should describe a defined stage of the operation. Successfully writing every chunk establishes transfer progress; it does not prove the firmware image was accepted, installed, or started successfully.

Define how the device reports validation and installation outcomes, including any restart and reconnection required. The app needs enough information to distinguish “sending,” “finishing,” and a confirmed result.

That distinction prevents a misleading success message followed by a device that appears unresponsive. Firmware provides the evidence, while application design explains what is happening and whether the user needs to take action.

## Treat Disconnection as a Designed State

A connection has a lifecycle beyond individual reads and writes. The app may still be connecting when a user leaves, and firmware may be processing a command when the link disappears.

Give the application clear ownership of connection setup, subscriptions, ongoing work, and cleanup. Unfinished setup must not create a new active session after the user has left. Stop unnecessary operations and release subscriptions when their owner no longer needs them.

On the device, release connection-specific resources and follow a defined policy for work already underway. Decide whether an operation continues independently and how its outcome can be retrieved later.

Timeouts prevent indefinite waits. Cancellation stops additional work when it is no longer needed. Reconnection should restore the required subscriptions and establish the device’s current state before the app resumes its workflow.

## Agree on Recovery Before an Update Fails

Repeating a chunk or restarting a transfer is not automatically safe. The device protocol must define whether partial data is discarded, whether a transfer can resume, and how both sides establish the correct position.

Those rules determine what the app offers after reconnecting: retry, resume, or a recovery procedure. The user should not have to infer the device’s state from a failed progress indicator.

Validate the full workflow across supported phones and realistic conditions. Interrupt transfers at different stages, restart the device, background the app, and reconnect. Confirm that the product reaches a known state and gives the user a clear next step.

## Bring Firmware and Application Development Together

Twisthink has solved these BLE communication challenges and built applications that connect users to device capabilities. We can develop firmware alongside your app team, or build an application around established firmware. Our hardware expertise supports the radio and power design underneath the connection.

When we develop both firmware and application software, transfer behavior, error handling, and recovery can be designed and tested together. We can coordinate changes across the interface and validate the complete workflow without a separate integration handoff.

[Talk with Twisthink](https://twisthink.com/contact-us/) about adding BLE to your product, whether you need support on one side or a team to bring the hardware, firmware, and app together.
