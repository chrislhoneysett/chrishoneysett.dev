Just because I have a hammer doesn't mean everything has to be a nail

I thought it was harder than it ended up being
JS processing of large data sets would handle it but
Ran into issue with async storage or 7MB(?) size limit
Adding it made viewing the contents even easier with expo-sqlite devtools
Adding encryption
What is a migration
Moving audit entries from JSON to SQLCrypto as well since we already had it
Moving a counter from secure storage into SQLCrypto - also uses an Atomic Counter so the counter change works in a single command rather than separater so they can't get off
Any time there are more than 1 piecce of data (counter, data for example) a database entry can help ensure those don't get partially set and things get ouf sync (Serialization?)
