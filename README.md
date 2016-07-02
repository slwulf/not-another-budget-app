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

Once you've got it running, you can access the app in your browser at `localhost:3000`. Here's a few tips for working with the UI, since I designed it for myself:
* You can edit any point of data (description, category, amount, etc.) by clicking on it and editing it in-line. This will save changes as you type. If you accidentally remove all of the text of an element and lock yourself out of editing it, you can refresh the page to get back without losing the original value.
* Budget categories can be deleted by changing any of their values to `***`.

##### Importing Transactions

The import tab in the interface allows you to import transactions from CSV. Paste the content of your CSV into the text area and click submit.

You can use the import functionality by setting up [config/import-config.json](./config/import-config.json). Your CSV should have columns that correspond to the keys description, category, debit, credit, and date. (If your CSV has only one amount column, use the same index of debit and credit.)

The column indexes are zero-indexed like arrays. For example, if your CSV looks like this...

| Status | Date       | Card | Category | Message          | Debit   | Credit |
| ------ | ---------- | ---- | -------- | ---------------- | ------- | ------ |
| New    | 05/20/2016 | 1234 | Travel   | SWA FLIGHT 12345 | -200.00 | 0.00   |

Status would be 0, date would be 1, and so on. So, your `import-config.json` would look like this:

```javascript
{
  "description": 4,
  "category": 3,
  "debit": 5,
  "credit": 6,
  "date": 1
}
```

### Contributing

Moral support is always appreciated! This is a solo, personal project, and I honestly don't expect anyone to contribute.