# Things You May Have Missed When Dealing With Private Data

Generic reference notes for a future blog post. These lessons are distilled from a security-review ticket set and its follow-up discussions. Examples are generalized; no project names, ticket identifiers, internal paths, customer details, or deployment claims are included. The supporting details are technical examples and review questions, not incident statistics or proof of exploitation.

## 1. Logs can become a second database of secrets

**The issue:** Data protected in storage or in transit can still escape through diagnostics. Error paths are especially easy to miss because they often print the entire failed request or command.

Supporting details:

- Raw command bytes may contain credentials before transport encryption happens. Logging those bytes bypasses the protection provided by the encrypted transport.
- Secrets can appear in nested error objects, inline strings, request bodies, and third-party native logs—not just explicit password fields.
- Usernames, device addresses, and session identifiers can expose identity or enable correlation even when passwords are masked.

**Review question:** Do success, failure, retry, and provisioning paths emit only approved diagnostic fields in both development and release builds?

**Blog angle:** “Your encrypted connection cannot protect a password you already printed.”

## 2. Secure storage does not mean you should store it

**The issue:** Encryption answers how a secret is protected; data minimization answers whether it should exist on the device at all.

Supporting details:

- A password cached during multi-factor authentication is still persisted if it is written to secure storage, even with a short validity period.
- A validity deadline is not evidence that the persisted value was physically deleted when the deadline passed.
- Memory-only credentials still need bounded lifetimes and cleanup on completion, cancellation, expiry, and sign-out. Mutation caches and late responses can retain or reintroduce them.
- Passwords and usernames may require different retention rules. Define those rules explicitly rather than treating every credential-related field identically.

**Review question:** Can an unfinished authentication flow restart safely without restoring a password from disk?

**Blog angle:** “Encrypted persistence is still persistence.”

## 3. Metadata can be sensitive even when the main secret is encrypted

**The issue:** Encrypting one credential field can leave the surrounding context readable.

Supporting details:

- Names, addresses, locations, customer associations, and device identifiers can reveal who uses a system and where.
- A database containing encrypted secret blobs can still expose those relationships through ordinary columns and indexes.
- An encryption migration must consider database journals, write-ahead logs, temporary files, and old backups, alongside the primary database.

**Review question:** What could someone learn from the local data without decrypting the field you consider the secret?

**Blog angle:** “The context around a secret can be the sensitive part.”

## 4. Your HTTP stack may persist responses behind your back

**The issue:** Application code is only one layer of network caching. A request option does not, by itself, prove that the underlying native transport leaves no response files.

Supporting details:

- Shared API wrappers, token-refresh requests, and separate native transports may follow different cache policies.
- Native response caches, application query caches, and intentional offline databases are distinct stores with distinct cleanup requirements.
- Disabling future caching does not remove responses left by previous versions.
- Client request headers do not establish which cache-control headers the server actually returns.

**Review question:** After repeated sensitive requests and an upgrade, what remains in each cache layer?

**Blog angle:** “You never wrote the response to disk. Your networking library might have.”

## 5. Local logout does not prove server revocation

**The issue:** Removing a token and returning to sign-in stops local use, but does not establish that the server will reject another copy of that token.

Supporting details:

- Logout needs a defined revocation scope: one access token, a refresh session, or every session belonging to the user.
- Native authentication cookies are a separate credential store, including cookies unavailable to application JavaScript.
- Offline logout, request timeout, and server failure need explicit semantics. Local access should be revoked even when server revocation cannot be confirmed.
- A meaningful server-side check attempts to use a previously valid token after confirmed logout.

**Review question:** Which credentials stop working locally, and which are confirmed invalid on the server?

**Blog angle:** “A sign-in screen is not evidence that the old session is dead.”

## 6. Cleanup is vulnerable to races and partial failure

**The issue:** A deletion sequence can look complete while asynchronous work writes credentials back or an early failure prevents later cleanup.

Supporting details:

- A refresh, login, or certificate response can arrive after sign-out and repopulate state unless writes are tied to the current session.
- In-flight requests can restore cookies after cookie clearing if shutdown ordering is wrong.
- Writing a serialized `null` value leaves a storage entry; it is different from removing the entry.
- Cleanup steps need independent failure handling. A persistent pending-cleanup marker can support retry before session restoration or another sign-in.

**Review question:** If one deletion fails or a delayed response arrives, does protected access stay blocked and does cleanup eventually finish?

**Blog angle:** “Deleting secrets is a workflow, not a single function call.”

## 7. Uninstall is not a universal credential reset

**The issue:** Storage lifetimes can differ from application lifetimes. In particular, iOS Keychain data may survive uninstall and reinstall.

Supporting details:

- An installation marker outside the surviving credential store can help distinguish a fresh installation from an ordinary restart.
- Introducing that marker needs an upgrade policy: existing installations may initially look new.
- Backup restoration and device transfer can restore a marker or other state, so reinstall detection needs a restore policy too.
- Registration identifiers, authentication secrets, and keys for retained audit records may have different lifecycles.

**Review question:** What survives logout, uninstall, reinstall, backup restore, and device transfer on each platform?

**Blog angle:** “The user deleted the app. Did the credentials leave with it?”

## 8. Deleting records is different from proving erasure

**The issue:** A database query returning no rows demonstrates logical deletion, not necessarily removal of historical bytes.

Supporting details:

- Residual data may exist in database pages, journals, write-ahead logs, temporary files, and backups.
- Open connections and active operations complicate file cleanup; deletion needs coordination with database shutdown.
- Cryptographic erasure relies on destroying the relevant keys and controlling copies of those keys. It does not retroactively protect historical plaintext.
- Retained audits may need separate encryption and retention rules. Encrypting the main database does not automatically protect separate audit files.

**Review question:** Does the policy require logical deletion, file removal, or cryptographic erasure—and what evidence supports that specific claim?

**Blog angle:** “Empty tables do not necessarily mean empty storage.”

## 9. Account disablement has a delivery and offline boundary

**The issue:** Disabling an account on the server does not establish when a disconnected device learns about it or removes local data.

Supporting details:

- A dedicated remote-disable command is one possible mechanism; rejection of the next authenticated request can be another. Document the actual contract.
- An unauthorized response may trigger token refresh first. Disablement must also be enforced during refresh if that path could restore access.
- Polling, background restrictions, and offline operation affect the delay before enforcement.
- Local data cleanup, active-operation cancellation, and return to sign-in require separate verification.

**Review question:** What happens after disablement during online use, failed refresh, and offline use—and how long can local access remain available?

**Blog angle:** “Disabled on the server does not mean immediately disabled everywhere.”

## 10. Session expiry, idle timeout, token expiry, and local unlock expiry are different clocks

**The issue:** Calling every timer a “session timeout” hides important differences in what ends access and what can extend it.

Supporting details:

- Absolute session expiry is measured from the original login. Idle expiry is measured from the last qualifying user activity. Neither implies the other is required.
- Token rotation should not silently restart an absolute session deadline. Automatic requests are not user activity for an idle policy.
- Background time, process restarts, offline use, and device-clock changes need defined behavior and an appropriate trusted-time strategy.
- Protected operations should check validity directly; a delayed timer callback should not be the only enforcement mechanism.
- The server needs its own enforcement. Client-side expiry alone does not prove a refresh credential is rejected remotely.

**Review question:** For each clock, what starts it, what can reset it, and what happens at the deadline?

**Blog angle:** “A timer that keeps resetting may never end the session you intended to limit.”

## 11. Dependency visibility belongs in the privacy conversation

**The issue:** Libraries influence logging, caching, storage, and transport behavior. Reviewing only first-party code leaves those defaults out of view.

Supporting details:

- A software bill of materials (SBOM) records shipped components and versions so later vulnerability investigations can identify affected releases.
- Include native and transitive dependencies, plus relevant patches; a top-level JavaScript dependency list is incomplete for a mobile binary.
- An SBOM supports investigation but does not establish that a component is safe or configured appropriately.

**Review question:** Can you identify the dependency versions and modifications shipped in a particular release?

**Blog angle:** “Your privacy boundary includes code you did not write.”

## 12. A source-code fix is not the same as a deployed control

**The issue:** Native logging, transport caching, and database encryption changes can require a new application binary. Updating application scripts alone may leave older native behavior intact.

Supporting details:

- Reproducible build configuration matters; manual local changes can disappear during regeneration or CI builds.
- Runtime compatibility needs to prevent application updates from assuming native features absent from older binaries.
- Mocked tests, compilation, device inspection, and deployed backend checks establish different things. A passing test at one layer does not prove every layer is covered.
- Upgrade, failure, and cross-platform checks matter because fresh-install success does not demonstrate legacy-data cleanup.

**Review question:** Which installed versions have the control, and what evidence establishes its behavior on each platform?

**Blog angle:** “Fixed in the repository does not mean fixed on the user's phone.”

## Possible framing for the post

**Working title:** “Things You May Have Missed When Dealing With Private Data”

**Central idea:** Private data has a lifecycle. Review where it enters, every copy created along the way, how long access remains valid, and what happens when that access ends.

A useful narrative moves through four stages:

1. **Copies you did not intend:** diagnostic logs, metadata, native caches, and authentication convenience caches.
2. **Lifetimes you did not define:** token refresh, absolute versus idle expiry, reinstall, and offline disablement.
3. **Deletion you did not prove:** partial cleanup, delayed writes, residual files, backups, and retained audit keys.
4. **Controls you did not ship or verify:** native dependencies, build compatibility, server enforcement, and installed-version coverage.

For a later article, collect reproducible examples with synthetic data: an unexpected cache file, a delayed response after logout, a surviving test Keychain item, or a session deadline preserved across refresh. Label examples and measurements clearly, and support platform-specific claims with current primary documentation before publication.
