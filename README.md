# `not-another-budget-app`

this is the app i use to track my personal finances and budget. i can't believe i started working on this several years ago and, through several iterations, it still works and i still use it.

### getting started

before use, be sure to have the following dependencies installed:

- node >=9 (i'm running on 9.10, haven't experimented with older versions)
- postgres >= 9 (i'm running on 10.3, but not using any significantly new features)

then, clone the repo and run `npm install` to fetch the node dependencies.

run `npm start` to run the app.

### usage

it's a budget app! you can manually enter transactions and budget categories on their respective pages. you can edit both by clicking any piece of data visible on the page. also, a weird quirk that i intend to remove at some point: budget categories can be deleted by changing any of their values to `***`.

the "categories" page allows you to view month-over-month totals for every category.

#### importing transactions

you can import transactions from a csv or tsv file. go to the import page and paste the contents of your file into the textarea.

you'll first need to create `config/import-config.json` to configure how columns are defined in your import data. your csv should have columns that correspond to the keys `description`, `category`, `debit`, `credit`, and `date`. (if your csv has only one column for debits and credits, like "amount", use the same index for both.)

the column indices should be zero-indexed. so for example, if you have a csv like this:

| Status | Date       | Card | Category | Message          | Debit   | Credit |
| ------ | ---------- | ---- | -------- | ---------------- | ------- | ------ |
| New    | 05/20/2016 | 1234 | Travel   | SWA FLIGHT 12345 | -200.00 | 0.00   |

status would be 0, date would be 1, and so on. for this csv, `import-config.json` should look like this:

```javascript
{
  "description": 4,
  "category": 3,
  "debit": 5,
  "credit": 6,
  "date": 1
}
```
