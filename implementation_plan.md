# Implementation Plan: Unified Registration Flow & Profile Extensions

This plan outlines the changes required to merge the registration and onboarding flows into a single seamless process, as well as adding the new optional profile fields.

## User Review Required

Please review the proposed two-step registration flow on the `/register` page. It will avoid the "fetch failed" error and streamline the user experience by asking for their email first, and then revealing the password and profile fields on the same page.

## Open Questions

> [!WARNING]
> **Photo Uploads:** To support actual image file uploads for the "Photo" field, we need to set up a Storage Bucket in Supabase. Do you already have a Supabase Storage bucket created for this, or should we just use a text field for an image URL for now? If you want file uploads, I can provide you with the SQL to create a public bucket.

## Proposed Changes

### Database Updates
Provide an SQL script to run in your Supabase SQL Editor to add the new optional fields:
- `photo_url` (text)
- `bio` (text)
- `relationship` (text)
- `kids_names` (text)

### Registration & Onboarding Flow
#### [MODIFY] [`src/app/register/page.js`](file:///c:/Users/baylo/Downloads/Garden/src/app/register/page.js)
- Convert to a two-step client component.
- **Step 1:** Enter email -> Click "Continue".
- **Step 2:** Show "Create Password" field along with all the onboarding fields (Name, Phone, Availability, Volunteer Type, Training, Class Info, plus the new optional fields).
- Submit calls a new unified server action.

#### [NEW] [`src/app/register/actions.js`](file:///c:/Users/baylo/Downloads/Garden/src/app/register/actions.js)
- Create a `registerAndOnboard(formData)` server action.
- This action will first call `supabase.auth.signUp()` to create the account.
- It will immediately follow up by inserting all the form data into the `profiles` table using the newly created `user.id`.
- Finally, it will log the user in and redirect them directly to `/profile`.

#### [DELETE] [`src/app/onboarding`](file:///c:/Users/baylo/Downloads/Garden/src/app/onboarding)
- The standalone onboarding page and its actions will be deleted since the flow is now unified into `/register`.

#### [MODIFY] [`src/utils/supabase/middleware.js`](file:///c:/Users/baylo/Downloads/Garden/src/utils/supabase/middleware.js)
- Remove the routing logic that forces users to `/onboarding`.

### Profile Dashboard Updates
#### [MODIFY] [`src/app/profile/page.js`](file:///c:/Users/baylo/Downloads/Garden/src/app/profile/page.js)
- Update the dashboard UI to display the new optional fields (Photo, Bio, Relationship, Kid's Names).

## Verification Plan
### Manual Verification
- Go to `/register` and complete the new two-step flow.
- Verify the user is successfully created in Supabase Auth.
- Verify the user's profile data (including optional fields) is correctly inserted into the `profiles` table.
- Verify the user is redirected to `/profile` and the new information is displayed correctly.
