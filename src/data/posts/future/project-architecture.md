# Organizing React Features Around What Changes

A useful application structure makes ownership clear. When a requirement changes, I want to know which part of the application is responsible and how far that change should reach.

Most of my organization centers around features: related behavior grouped with the components, hooks, and supporting code that implement it. Larger domains give related features a common home. Shared components and services support those features at the scope where they belong.

That sounds straightforward when the application has one way to perform each operation. It becomes a more interesting design problem when a second product needs the same features through a different implementation.

I encountered that in a React Native application built around BLE devices. The product expanded to support NFC devices with a similar feature set. Both needed the same data sent to them and returned the same data. How that exchange happened, including concerns such as connecting, differed.

Before getting to that boundary, a login form provides a familiar example of the structure I use. The auth examples are illustrative; the device example is the requirement that made the sharing decisions more involved.

## Components, features, and domains have different responsibilities

A common text input owns presentation: its label, value, error message, and disabled state. It can be used throughout the application because it does not need to understand authentication.

A login form composes those inputs and gives them meaning. It collects credentials, submits them, and displays the result. When MFA is required, the login feature also presents the challenge step and handles the user's response.

That makes login a **feature**: a related set of behavior with a clear purpose. The form is one component within it. Supporting hooks and other components can live beside it because they serve the same behavior.

Forgot-username and forgot-password links provide entry points to other features. Their workflows belong alongside login within the **auth domain**, as does changing a password after signing in.

```text
Auth/
├── features/
│   ├── Login/
│   │   ├── CredentialsForm.tsx
│   │   └── MfaForm.tsx
│   ├── ForgotUsername/
│   ├── ForgotPassword/
│   └── ChangePassword/
└── services/
    └── authService.ts
```

This is a simplified layout. The important relationship is that each feature owns a workflow, while auth provides a home for their related responsibilities.

The scope of reuse determines where shared code belongs. The text input can be shared across the app. An auth service used by login and change password still belongs within auth. Being imported by several features does not make it application-wide infrastructure.

## Services handle operations; facades simplify coordination

An auth service provides callable operations such as submitting credentials, validating an MFA challenge, and changing a password. It owns the request details and translates responses into results the auth code can use.

The login UI should not need to know endpoint paths or interpret raw transport responses. Equally, the service should not decide how a field's error message is rendered.

Some workflows need coordination beyond an API request. Login may require tracking an MFA challenge and updating session state once authentication completes. A **facade** can give callers a simpler interface over those collaborating pieces:

```typescript
// Illustrative public interface:
auth.login(credentials)
auth.verifyMfa(code)
auth.signOut()
```

The facade can coordinate service calls and session updates without requiring each caller to repeat that sequence. If another object would only forward the same arguments unchanged, I would question whether an extra layer helps.

Other parts of the app can read the current user through a public hook such as `useCurrentUser()`. That hook subscribes to session state. It is a state accessor; the coordination hidden behind the auth operations is what makes the facade useful.

These names describe responsibilities. They do not require every feature to have a service, facade, and store of its own.

## Compose features into pages

A route brings the appropriate features together. A login route can render the login feature, including its credentials and MFA steps. A settings route can compose change password with other settings features.

The route owns that page composition. The features retain ownership of their behavior. Changing a password does not require importing code from the login form simply because both use authentication services.

That separation addresses a problem I have encountered as projects grow: finding the screen is easy, but following its behavior can require tracing imports across many folders. Grouping only by file type tells me where hooks or components live. Grouping by feature also tells me what they are responsible for.

A public entry point gives callers a clear way to use each area. Internal helpers can change without requiring every consumer to understand the new layout. An `index.ts` can express that interface, although the import conventions still have to respect it.

## The harder question was where to share device behavior

The login example explains the basic boundaries. Supporting a second device implementation tested how useful those boundaries were.

The application originally worked with BLE devices. When NFC support entered the product, the new devices needed a similar set of features. The required outgoing data and the expected incoming data were the same. The communication and connection behavior differed.

The question was how much of the existing feature behavior should become shared, and where the implementation-specific work should remain.

There were two directions I needed to weigh. Keeping each implementation self-contained would make its behavior easy to follow locally, but duplicating common feature logic would mean maintaining the same requirement in two places. Moving everything into one implementation would centralize the code, but could spread BLE/NFC conditions through the workflow.

The fact that both products did similar things was not enough to settle that decision. I needed to identify which parts actually had the same responsibility.

## Separate the operation from the way data moves

The matching data requirements gave me a concrete starting point.

For a device operation, I could distinguish the data being sent, the transfer itself, and the data received back. The transfer depended on BLE or NFC. The common requirements around that exchange gave the shared features a reason to exist.

That also clarified the scope of sharing. These features belonged to the device area, even when both implementations used them. Moving them into application-wide shared code would lose that context.

The resulting organization included a device domain with BLE and NFC domains beneath it, plus a shared area:

```text
features/
└── Devices/
    ├── BLE/
    ├── NFC/
    ├── shared/
    ├── index.ts
    └── README.md
```

This is a shortened view of the project structure. The top-level name `features` describes the main organizing approach; it does not require every folder beneath it to represent the same size of responsibility.

The higher-level `Devices` folder gives related features and implementations a common home. Within that boundary, BLE and NFC can retain the code that deals with their specific communication requirements.

> **The shared feature owns the common device behavior. The implementation owns the details that differ when communicating with the device.**

That is a more useful boundary than sharing code simply because it looks alike. A change to common operation data concerns both implementations. A change to BLE connection handling belongs with BLE.

## Shared inputs and outputs do not make the lifecycles identical

The difficult part is deciding how far that shared interface should extend.

It is tempting to make both implementations fit the same sequence of calls. But a BLE connection has responsibilities that should remain visible within BLE. The NFC implementation should not inherit those steps merely to make the interfaces look symmetrical.

For example, [BLEBridge](../react-native-ble-bridge.md) handles BLE operations and the cleanup associated with them. Those responsibilities still exist when the higher-level feature is shared. They need an owner inside the BLE implementation.

The same applies to feedback for the user. A common feature can share its purpose and data requirements while presenting implementation-specific instructions or progress where needed. Sharing the operation does not require every screen state to be identical.

This is where a service interface or facade can help, provided its contract describes behavior both implementations can actually support. A simpler entry point is valuable when it hides coordination the caller does not need to repeat. It becomes harder to use when it conceals differences the caller genuinely needs to handle.

I want the common interface to make the shared responsibility clear, with the remaining differences given an explicit home.

## Use the boundary to assess the next change

A folder tree is only useful if it helps explain how the application changes.

In the device example, a change to common feature data belongs near the shared behavior. A BLE transfer change belongs in BLE. A general input styling change belongs in the shared UI component. Those changes have different owners even when they affect the same user workflow.

That is also how I assess whether something should move. A second consumer is a reason to examine the scope of reuse. It does not automatically justify a global abstraction. The code may be shared within one feature, between features in a domain, or throughout the application.

My earlier difficulty was following behavior through files whose locations did not make that ownership clear. Feature-based organization gives me a better starting point. The BLE-to-NFC expansion makes the next question more demanding: which responsibilities remain common when the implementation changes?

The architecture needs to support both answers. Shared behavior needs a clear home, and each implementation needs room to handle the things that genuinely differ.

---

## Author notes before publication

- The auth example establishes the architecture; the BLE-to-NFC expansion is the main case study. Keep the opening confident and the thought process focused on ownership, scope of reuse, and implementation differences.
- Add one concrete shared device operation using generic names and synthetic data. Show its inputs, outputs, and the responsibility that differs between BLE and NFC. This would provide stronger evidence than another abstract interface example.
- Confirm exactly which feature logic moved into `Devices/shared` and what the public entry point coordinates. The draft does not claim a specific adapter, strategy, or facade implementation in the device code.
- The separate-implementation and unified-implementation approaches are design tradeoffs, not claims that both were built and discarded. Add actual refactor history only where supported by your experience.
- Add a concrete outcome from the NFC expansion: a requirement handled once in shared code, or a transfer change contained within its implementation. Avoid claiming measured improvements without evidence.
- The lifecycle and UI discussion describes boundary considerations. Confirm which differences occurred in the project before turning them into specific first-person implementation claims.
- Keep proprietary device details and project-specific identities out of the public examples.
- Add publication frontmatter and an image when ready to move the article out of `future`.
