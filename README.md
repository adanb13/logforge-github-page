# LogForge Deposit

Static GitHub Pages site for the LogForge refundable deposit page.

## Files

- `index.html` is the Pages entry file.
- `styles.css` contains the page styling.
- `main.js` controls tier switching, GitHub links, and Stripe Payment Link redirects.

## Publish on GitHub Pages

1. Push this folder to the root of the GitHub repository.
2. In the repository settings, open **Pages** and set **Source** to **GitHub Actions**.
3. Push to the `main` or `master` branch, or run the **Deploy GitHub Pages** workflow manually.

The workflow in `.github/workflows/pages.yml` uploads the static site from the repository root. `.nojekyll` keeps GitHub Pages from running Jekyll against the site.

## Before Accepting Deposits

Replace the placeholder Stripe Payment Links in `main.js`:

```js
const STRIPE_PAYMENT_LINKS = {
  personal: "https://buy.stripe.com/...",
  business: "https://buy.stripe.com/...",
};
```

Until those values are replaced, clicking **Continue to Stripe** shows a warning instead of redirecting.
