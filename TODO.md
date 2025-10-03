# TODO: Fix "Post Free Ad" Button Authentication Logic

## Current Issue
The "Post Free Ad" button in Hero.jsx uses a Link component that directly navigates to the dashboard, bypassing the login modal logic that other protected routes use.

## Tasks
- [ ] Import useAuthStore in Hero.jsx
- [ ] Use isAuthenticated state from authStore
- [ ] Change "Post Free Ad" Link to button with click handler
- [ ] Implement click handler: if logged in, navigate to dashboard; if not, open login modal
- [ ] Test the functionality when logged in and logged out

## Files to Edit
- components/Hero.jsx

## Expected Behavior
- When user clicks "Post Free Ad" and is not logged in: Login modal should open
- When user clicks "Post Free Ad" and is logged in: Navigate to dashboard with country query
