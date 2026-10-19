What is a Set
Set vs. Array
Faster for determining if a value exists
Weakset and why one would us it

When would you use each?

- Array: When you need an ordered list, potentially containing duplicates.
- Set: When you need a collection of unique values.
- WeakSet: When you need to track objects without preventing garbage collection.
- Boolean: When you only need to track a single true/false state.
  For your SQLite example: You're not really interested in storing a collection of database connections. You're interested in knowing whether you've already performed an operation on a particular connection.
  That's exactly the kind of situation where a WeakSet makes sense.
