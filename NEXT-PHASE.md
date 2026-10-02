# Next phase: 2FA + PayPal

## 2FA
Use an authenticator-app TOTP flow for password sign-ins:
1. Settings -> Security -> Enable 2FA.
2. Server generates a one-time secret and QR provisioning URI.
3. User confirms a 6-digit TOTP code.
4. Store only the encrypted/secured secret server-side.
5. On password login, require a second code when `two_factor_enabled=true`.
6. Google sign-in can also require the same second step if the user enabled it.

Do not store TOTP secrets in client-side localStorage.

## PayPal
The seller-facing "Connect PayPal" button should call a server route that creates a PayPal Partner Referral and redirects the seller to the PayPal onboarding URL. After return, verify the callback and persist the merchant ID/onboarding status server-side. PayPal's current marketplace seller onboarding uses Partner Referrals and requires appropriate partner/API approval for live platform payments.
