# Keeping Time Offline When the Device Clock Changes

How do you keep time-sensitive behavior working when an app can be offline for up to 24 hours—and the user can change their phone’s clock?

That was a requirement I ran into while building a React Native app.

The app needed to track session lengths, lockout expirations, and event timestamps. Checking the server before every time-sensitive task wasn’t an option because those tasks also needed to work offline.

I could get a timestamp from the server while connected. But how would I reliably advance that timestamp over the next several hours?

Using Date.now() to measure elapsed time brought me back to the device’s adjustable clock. Moving the phone’s time forward could make a lockout appear to have expired. Moving it backward could make a session appear valid for longer.

A monotonic clock gave me the missing piece.

The native clocks I used measure elapsed time since the device booted. Changing the phone’s date or time doesn’t change those readings.

When the app received a server timestamp, I saved a monotonic reading alongside it. Later, even without connectivity, the app could calculate:

Estimated server time = saved server timestamp + elapsed time measured by the monotonic clock.

If five hours had passed, the estimate advanced by five hours—regardless of what the user did to the phone’s displayed time.

One detail caught me during testing: a monotonic clock doesn’t necessarily count the time a phone spends asleep. Choosing the right clock mattered too.

This gave the app a way to carry the server’s time reference through the offline period without depending on the user’s date settings.

It’s still an estimate, and it doesn’t protect against someone modifying the app itself. But it addressed the clock-change problem while supporting the offline requirement.

The useful distinction for me was separating “What time is it?” from “How much time has passed since we checked?”

The server supplied the reference. The monotonic clock let the app keep using it offline.

Read more about the implementation and its limitations here:
https://chrishoneysett.dev/blog/monotonic-clock/?utm_source=linkedin&utm_medium=social&utm_campaign=monotonic-clock&utm_content=feed-post
