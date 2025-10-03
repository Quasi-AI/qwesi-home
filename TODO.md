# TODO: Fix "Post Free Ad" Button Authentication Logic

## Current Issue
The "Post Free Ad" button in Hero.jsx uses a Link component that directly navigates to the dashboard, bypassing the login modal logic that other protected routes use.

## Tasks
- [x] Import useAuthStore in Hero.jsx
- [x] Use isAuthenticated state from authStore
- [x] Change "Post Free Ad" Link to button with click handler
- [x] Implement click handler: if logged in, navigate to dashboard; if not, open login modal
- [x] Test the functionality when logged in and logged out

## Files to Edit
- components/Hero.jsx

## Expected Behavior
- When user clicks "Post Free Ad" and is not logged in: Login modal should open
- When user clicks "Post Free Ad" and is logged in: Navigate to dashboard with country query

---

# TODO: Implement Auto-Logout on Idle Timeout

## Current Issue
Users remain logged in indefinitely, which is a security concern.

## Tasks
- [x] Add idle timeout state to authStore (30 minutes)
- [x] Track user activity (mouse, keyboard, touch events)
- [x] Reset idle timer on activity
- [x] Auto-logout when idle timeout is reached
- [x] Clean up event listeners on logout

## Files to Edit
- stores/authStore.js

## Expected Behavior
- User is automatically logged out after 30 minutes of inactivity
- Activity (mouse, keyboard, touch) resets the idle timer
- Event listeners are properly cleaned up
