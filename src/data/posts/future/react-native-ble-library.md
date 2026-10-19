# Building My React Native BLE Library

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
