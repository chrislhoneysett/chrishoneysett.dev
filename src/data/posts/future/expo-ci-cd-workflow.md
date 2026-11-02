# From Commit to Device: A Practical Expo CI/CD Workflow

Future article outline. Keep all examples generic: no client names, app identities, repository URLs, real commit hashes, build/update IDs, backend addresses, screenshots, credentials, or internal project details. Use hypothetical versions and fictional examples throughout.

## Article angle

Explain how a React Native app moves from development to tester devices and eventually production using Azure DevOps and Expo EAS. Focus on understandable responsibilities and established tooling, with a small amount of project-specific policy rather than a custom release platform.

Audience: developers comfortable with Git and React Native who are new to mobile pipelines.

Frame this as one practical branching and delivery strategy, not a universal Expo requirement. Explain when a smaller team might choose fewer long-lived branches.

## 1. The problem: a mobile deployment is more than a Git merge

- Open with two fictional changes: fixing screen text and adding a native capability.
- Explain why the first may fit an OTA while the second needs a new binary.
- Separate validation, compilation, submission, distribution, and installation.
- Introduce the goal: know what source shipped, which apps can run it, and how to recover.

## 2. Give Azure and EAS clear responsibilities

- Azure Repos: source control, pull requests, and branch protection.
- Azure Pipelines: validation, manual delivery entry points, secrets, run history, and deployment locks.
- EAS Build: native compilation, signing, and build records.
- EAS Submit: transferring selected binaries to store services; distinguish upload from public release.
- EAS Update: publishing compatible JavaScript and assets.
- Define pipeline, run, agent, job, deployment environment, and artifact in plain language.
- Explain why an Ubuntu CI agent can initiate an iOS cloud build without compiling iOS locally.

Planned visual: source → Azure validation → EAS Build or EAS Update → tester device.

## 3. Design the branching strategy around release intent

| Branch | Purpose in the example strategy | Typical action |
| --- | --- | --- |
| `feature/*`, `fix/*` | Isolated work | PR into `develop` |
| `develop` | Reviewed ongoing development | Automatic validation |
| `preview/v1.2.0` | Stabilize a selected version for QA | Validation; explicitly request a Preview binary or compatible OTA |
| `release/v1.2.0` | Qualify production-configured binaries | Validation; explicitly build and test Production |
| `main` | Record approved full releases | Record/tag the qualified release without rebuilding it |

- Walk a change from a feature branch through Preview, release qualification, and main.
- Explain why Preview and Production may need separate binaries: identity, backend, feature flags, and signing/distribution settings.
- Explain that promoting source does not mean sending a test-configured bundle to Production.
- Reconcile stabilization fixes back into `develop` so later versions retain them.
- Cover hotfixes from released source and how they rejoin the same qualification path.
- Optional sidebar: an `integration` branch/profile for hardware or backend experiments; keep experimental content out of product branches until reviewed.
- Discuss the cost of extra branches and when trunk-based development may be sufficient.

Planned visual: branch lifecycle with the fix-reconciliation path shown explicitly.

## 4. Git branches, build profiles, environments, and channels are different things

| Concept | Question it answers |
| --- | --- |
| Git branch / commit | Which source is being used? |
| EAS build profile | How is the native app configured and packaged? |
| EAS environment | Which environment variables are available? |
| EAS Update channel | Which update stream does an installed app request? |
| EAS Update branch | Where are published update groups collected? |
| Runtime version | Which native compatibility contract does this app use? |
| Azure environment | Which deployment permissions/checks apply? |

- Show a hypothetical `preview/v1.2.0` Git branch using a `preview` profile, environment, and channel.
- Explain that matching names are a convention, not automatic synchronization.
- Describe separate app identities for Development, Preview, and Production.
- Note that client-bundled configuration is not secret, including public environment variables.

## 5. Make CI automatic and delivery intentional

- Every PR runs configuration checks, locked dependency installation, lint, type checking, and the existing automated tests.
- Azure Repos branch policies enforce PR validation and review.
- A passing validation run does not automatically imply that anything was distributed.
- Introduce two explicit delivery actions: native build and OTA check/publish.
- Default the OTA operation to checking compatibility without publication.
- Explain this as a team policy; discuss criteria for automating delivery later.
- Pin tool versions, configure signing ahead of time, and supply an Expo token through CI secret storage.

Planned example: small annotated YAML excerpts, omitting full application-specific scripts.

## 6. Native builds: create and distribute a new installed app

- Select the intended commit, profile, and platform(s).
- Let EAS compile and sign; wait for completion and retain the build links.
- Distinguish Android AAB/APK and iOS store/ad hoc distribution at a high level.
- Test the embedded bundle, upgrades from the prior installation, and native capabilities on physical devices.
- Submit and distribute the exact accepted artifacts rather than rebuilding after approval.
- Explain marketing version, platform build number, and runtime version separately.
- Build success is not proof of distribution or tester acceptance.

## 7. OTA delivery: update JavaScript without replacing native code

- Explain what an OTA can and cannot change.
- Introduce runtime compatibility and Expo fingerprints as complementary concepts.
- Use the actual distributed builds as comparison references, not whichever build happened to finish most recently.
- Show a tiny configuration containing fictional Android and iOS build-ID placeholders.
- Explain why the baseline changes only after new binaries are accepted and distributed.
- Compare both platforms, require the correct runtime, and stop on missing or incompatible evidence.
- Native changes require a new runtime and binary; do not bypass a failed check to force an OTA.
- Fingerprints do not prove behavioral correctness or safe persisted-data migrations.
- Build IDs are comparison references, not delivery filters: matching channel/platform/runtime determines update eligibility.

Planned decision table: JavaScript-only candidate / native change / uncertain evidence.

## 8. Publishing an OTA and applying it are separate actions

- CI publishes an update group; each platform has its own update ID.
- Contrast manually initiated checks/downloads with automatic launch checks.
- Explain that an already-downloaded update can activate on a later cold start.
- Discuss restart timing when the app is performing device communication or other sensitive operations.
- Successful publication does not prove installation, activation, or acceptance on user devices.
- Changes to native update policy require appropriate native distribution; an OTA cannot rewrite the installed binary.

## 9. Trace a release without tagging every Preview OTA

- Follow a generic chain: ticket → EAS update group → source commit → Azure publication run.
- Distinguish Git SHA, EAS branch ID, update-group ID, platform update ID, and native build ID.
- Explain why short UUID prefixes can look alike and why a group link is the useful cross-platform reference.
- Reserve version tags for full releases; optionally tag accepted milestones.
- Show a fictional ticket entry with placeholders for update link, commit, pipeline run, supported binaries, and device verification.
- Proposed improvement: a run summary containing publication mode, source commit, runtime, baseline builds, and EAS link.
- Point out that a check-only success and a publication success need to be distinguishable.

## 10. Keep the automation small and use platform features

- Prefer official EAS CLI commands and Azure's built-in job, artifact, and locking features.
- Explain the role of a small compatibility-policy helper when the app needs one.
- Contrast checked-in native projects with Continuous Native Generation.
- Evaluate EAS Workflows against the project's native architecture and current supported jobs before choosing another orchestration layer.
- Avoid a baseline-import service or custom adoption registry when reviewed build references suffice.
- Note the reported Azure caching limitation in deployment jobs; verify current behavior before writing the final article. Caching is an optimization, not a delivery requirement.
- Explain why YAML compilation alone cannot prove an end-to-end hosted run will succeed.

## 11. Recovery belongs in the workflow

- Inspect EAS after a failed or canceled CI run before retrying; remote work may already have completed.
- Explain republishing a known-good update and runtime-scoped rollback to the embedded bundle.
- A Git revert does not undo an update already on a device.
- OTA rollback cannot reverse destructive saved-data changes or repair every native failure.
- For native regressions, discuss stopping further distribution and qualifying a replacement binary.
- Rehearse recovery on both platforms and keep the previous known-good references.

## 12. Walk through two complete examples

1. **Screen text fix:** PR → validation → compatible Preview OTA → manual/device update flow → verification → ticket record.
2. **New native capability:** PR → changed native requirements → new runtime → Android/iOS builds → distribution and acceptance → update baseline references → future compatible OTA.

Close with the few decisions an operator actually makes, then link to companion posts on local tooling, architecture, offline behavior, and SBOMs where relevant.

## Research and drafting checklist

- Recheck current Expo guidance and Azure task behavior before drafting executable examples.
- Clearly label team policy versus product constraints and optional future improvements.
- Keep Production OTA as a separate extension requiring its own release policy; do not imply a Preview workflow automatically qualifies it.
- Use synthetic diagrams and screenshots with invented data.
- Remove all identifying client information from prose, YAML, URLs, sample output, and images.
- Keep the final article educational; move longer configuration samples to a generic example repository if needed.

Official references to revisit:

- [Trigger EAS builds from CI](https://docs.expo.dev/build/building-on-ci/)
- [How EAS Update works](https://docs.expo.dev/eas-update/how-it-works/)
- [Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/)
- [EAS Workflows packaged jobs](https://docs.expo.dev/eas/workflows/pre-packaged-jobs/)
- [EAS Update recovery](https://docs.expo.dev/eas-update/rollbacks/)
- [Azure pipeline concepts](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops)
- [Azure approvals and checks](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops)
