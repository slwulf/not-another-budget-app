# Not Another Budget App

I originally started this as a client JavaScript app and attempted to do it without a framework.

That was a mistake.

So now out of necessity I've started over as an Express/Mongo app.

### Usage

This app actually works now! You can get it running locally with the following steps:

- Make sure you have MongoDB installed.
- Fork the repo and pull it down.
- Navigate to the directory and run the following commands:

```
npm install
npm run debug
```

Once you've got it running, you can access the app in your browser at `localhost:3000`. The UI should be fairly straightforward. (Don't try to use the import function. It's currently set up to expect a CSV format that was defined by my credit card provider.)

You can add new transactions and budgets from their respective pages. Existing transactions and budgets can be edited in-line simply by clicking on the attribute you want to edit. All changes are synced to your local MongoDB.

### Contributing

Moral support is always appreciated! This is a solo, personal project, and I honestly don't expect anyone to contribute.