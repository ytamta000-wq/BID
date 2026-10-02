# BID functional marketplace patch

This patch converts the current demo data layer to a persistent Supabase-backed foundation without deleting the project.

## Adds
- Real listings and bids
- Seller listing creation
- Main image + extra image uploads
- Real connection requests
- Real conversations/messages foundation
- Real profile data
- Real dashboard counts
- Orders/payments tables ready for checkout
- Seller payout/PayPal connection records ready for the PayPal Partner Referrals integration
- Legal pages placeholders

## Required before the new data layer can work
Create a Supabase project and add these Vercel Production environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)

Create a Storage bucket named `listing-images` and run `db/schema.sql` in Supabase SQL Editor.

Do NOT expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

PayPal and 2FA are intentionally represented as secure server-side foundations in this patch; their live credentials/onboarding should be added only after the database foundation is running.
