# Adding BLE to Your Connected Product, Part 2: Making Device Communication Reliable

A BLE connection can succeed while the application displays an incorrect reading or reports a task finished too early. Reliable product behavior requires agreement about what the transmitted data means and what each response establishes.

Firmware and application development share that responsibility. Firmware supplies measurements, accepts commands, and reports outcomes. The app interprets those values and explains the device’s state to the user. Their communication contract needs to cover both normal operation and conditions that require recovery.

This second article in our BLE series focuses on that contract. A fictional weather station provides the examples, following the device-and-app architecture discussed in [Part 1](adding-ble-part-1-device-and-app-design.md).

At Twisthink, we’ve solved these challenges in BLE devices and their applications. Developing both sides together lets us verify the behavior users depend on as features take shape.

## Choose Operations Around the Task

The device’s characteristics define which communication operations are available. Firmware and app teams should choose them around the intended interaction:

| Operation | Weather station use | Design consideration |
| --- | --- | --- |
| Read | Retrieve a measurement | Define how recent the returned reading is |
| Write with response | Change the measurement interval | Separate write success from any later work |
| Write without response | Send intermediate brightness changes | Decide whether the final setting needs confirmation |
| Notify | Deliver new readings | Define update timing and handling of missed readings |
| Indicate | Deliver a status with ATT confirmation | Separate receipt from application processing |

**ATT**, the Attribute Protocol, carries the messages used by GATT. Notifications do not request ATT confirmation; indications do. Neither mechanism by itself defines whether an application has finished processing a value. The [Bluetooth SIG’s BLE primer](https://www.bluetooth.com/bluetooth-le-primer/) explains these operations.

For live measurements, decide how the app obtains its initial value and when subsequent updates arrive. Subscribing does not establish whether the device sends periodically, on a change, or only after a command. That behavior belongs in the product protocol.

## Define Meaning, Not Just Bytes

A characteristic value is a sequence of bytes. Both implementations need the same rules for field sizes, signed and unsigned numbers, byte order, units, and valid ranges.

For example, the weather station could represent temperature as a signed two-byte integer in tenths of a degree Celsius. With the least significant byte first, a raw value of 235 represents 23.5°C. If the app assumes a different scale or treats a negative value as unsigned, the bytes can arrive correctly and still produce an incorrect measurement.

The business consequence is a loss of confidence in the product’s data. The engineering response is a documented format and shared examples that demonstrate how firmware and app interpret it.

Include normal readings, negative temperatures, boundary values, unavailable measurements, and invalid messages. Agree on what the app should display when a sensor cannot supply a value, rather than allowing a placeholder to appear as a real measurement.

Keep encoding and decoding in dedicated protocol functions. That gives each team a clear place to implement and verify changes without spreading byte-format assumptions throughout the product.

## Separate Command Acceptance From Completion

For example, suppose the weather station app starts sensor calibration. A successful write response confirms that the write succeeded; it does not necessarily mean calibration has finished or contain its result. The [GATT procedures](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-61/out/en/host/generic-attribute-profile--gatt-.html) distinguish write responses from subsequent device updates.

The firmware needs to expose enough state for the app to represent the task accurately. Define how it reports acceptance, progress where useful, completion, and failure. The app should be ready to receive a result before triggering work that could finish quickly.

If several commands can be active, associate results with their originating commands. Also define what happens when the app repeats a request or reconnects while calibration is underway. Otherwise, a retry could start work twice or leave the user without a trustworthy result.

For settings, agree on when a value takes effect, whether it is retained after a restart, and how the app confirms the effective value. Input validation in the app helps users; enforcement in the firmware protects the device from unsupported values.

## Make Freshness and Compatibility Explicit

A previously received measurement may still be valid data, but it is not necessarily current. Define how the app identifies freshness and indicates that updates have stopped.

If a connected device must preserve readings while disconnected, firmware needs storage and retrieval behavior. The application needs to understand which readings are historical and how to reconcile them with live updates. Notifications alone are not a history mechanism.

Compatibility needs the same care. As firmware evolves, older apps should identify which capabilities they can use. Agree on version rules and behavior for unsupported commands before releasing changes.

## Validate the Agreement Together

Test complete interactions against the shared contract: a reading is interpreted correctly, a setting takes effect, and calibration reaches a clear result. Include delayed responses, malformed values, and reconnection during a task.

Twisthink can implement firmware against your application requirements or develop an app for your existing device. When we develop both, we can resolve a mismatch where it originates, update both implementations, and verify the resulting experience within one coordinated team.

[Talk with Twisthink](https://twisthink.com/contact-us/) about reliable BLE communication. In [Part 3](adding-ble-part-3-updates-and-recovery.md), we’ll explore larger transfers, interrupted connections, and recovery.
