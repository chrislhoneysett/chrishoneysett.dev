# Organizing a Growing React App Around Domains and Features

Working title. Suggested outline and prompts, not a finished article.

## Article angle

Tell the story of how a growing React Native project became difficult to navigate, and how grouping related behavior made it easier to understand and change.

Frame the organizational lessons for React developers broadly. Be explicit early that the concrete example is a React Native app with BLE and NFC capabilities. Keep those real examples rather than inventing a web app to make the article seem more general.

Central question: when a behavior needs to change, can I work out where it lives and which parts of the app it affects?

## 1. I could find the screen, but not the behavior

- Original problem: as the project grew, code became scattered and it was difficult to find who did what where.
- Start with one actual change or debugging task that required jumping between several folders.
- Describe the original organization and what became awkward. Avoid assuming folders such as `components`, `hooks`, and `utils` are inherently wrong; explain why the structure stopped helping this project.
- What logic was duplicated? Which files knew too much about each other? Include only problems that actually occurred.

Possible opening:

> As my React Native app grew, I could usually find a screen, but finding the behavior behind it took more searching. Connecting to a device could involve UI components, shared state, BLE code, and utilities scattered across the project.

## 2. Start with what belongs together

- Introduce domains and features through the problem they solve, before showing a folder tree.
- Explain what “domain” and “feature” mean in this project. Terminology varies; these are working definitions, not universal React rules.
- Use the Device domain with BLE and NFC features as the main example.
- Explain why these belong together: which device concepts, workflows, or responsibilities do they share?
- Explain what remains specific to BLE or NFC. Do not force different behavior into a shared abstraction just because both communicate with devices.
- Briefly connect this to web work: a payments domain might contain integrations with different payment providers. One comparison is enough.

## 3. Follow one operation through the structure

- Pick a real, small workflow, such as opening a device screen and requesting device information.
- Show where the UI interaction starts, where coordination happens, and where transport-specific work lives.
- Explain where state is held and how results and failures reach the screen.
- Show a small before-and-after folder tree using the actual structure, simplified for the article.
- Include only enough code to make the boundaries visible. Avoid reproducing the BLEBridge implementation.

Possible visual: screen → feature entry point → BLE/NFC implementation, with the actual shared responsibilities shown separately.

## 4. Give each part a clear responsibility

Use the workflow above to explain the terms that actually appear in the project:

- **Component:** what it renders and which interactions it owns.
- **Service:** which behavior it provides and what it depends on.
- **Facade:** whether a simpler entry point hides coordination among several pieces; show why that extra layer helped, if used.
- **Module:** clarify whether this means a source file or a larger unit of functionality in this article.
- **Utility:** what makes a helper broadly reusable, and when it should stay beside the feature that uses it.

Do not turn this into a glossary or imply that every feature needs all five. Show where each responsibility landed and why.

## 5. Decide what other parts of the app can use

- What is the public entry point for a feature or domain?
- Which implementation details should callers avoid importing directly?
- How do shared pieces avoid depending back on the features that use them?
- What belongs in shared code, and what should remain local until another use actually appears?
- Connect this briefly to the existing BLEBridge article: that library handles BLE coordination; this article explains where that capability fits within the larger application.

Use examples from the implemented architecture rather than introducing rules the project does not follow.

## 6. Move toward the structure incrementally

- Describe one manageable extraction or move, including how callers changed.
- Did you start with the most confusing workflow, the most duplicated logic, or a feature already being changed?
- Explain how you checked that the behavior still worked.
- Mention any temporary compromises or boundaries you revised after using them.

## 7. What improved, and what still costs effort

- Give concrete outcomes: fewer places to inspect for a change, simpler screen code, clearer ownership, or easier reuse—only where supported by experience.
- Describe a case where another service, facade, or folder would have added navigation without enough benefit.
- Explain when a smaller app could reasonably keep a simpler structure.
- End with the practical question from the opening: is it easier to find the behavior and understand the effect of changing it?

## Material to gather before drafting

- One real change that illustrates the original problem.
- Simplified before-and-after folder trees.
- One operation traced through the final structure.
- An example of BLE and NFC sharing something, and an example of them staying separate.
- One architectural choice you reconsidered or decided against.

Keep examples generic and remove client names, internal paths, credentials, and proprietary device details.

## Scope to keep focused

- Keep state ownership relevant to the example; save the full local/server/global state discussion for the state-management article.
- Save storage selection and offline strategy for their own articles.
- Avoid presenting the structure as a React requirement or a complete domain-driven design methodology.
- Broad relevance should come from explaining the decisions, while retaining the concrete React Native experience.
