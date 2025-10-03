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

---

# TODO: Fix Subscription Modal Mobile Responsiveness

## Current Issue
The subscription modal distorts the page layout on mobile view when opened from the investors page.

## Tasks
- [x] Update modal container with responsive padding (p-2 sm:p-4)
- [x] Add max-height constraint (max-h-[90vh]) to prevent overflow
- [x] Implement responsive text sizes and spacing
- [x] Change button layout to stack vertically on mobile (flex-col sm:flex-row)
- [x] Add proper overflow handling for scrollable content
- [x] Adjust icon sizes for mobile (w-3 h-3 sm:w-4 sm:h-4)

## Files to Edit
- modals/SubscriptionModal.jsx

## Expected Behavior
- Modal displays properly on mobile without distorting the page
- Content is scrollable if it exceeds viewport height
- Text and buttons are appropriately sized for mobile screens
- Modal maintains proper spacing and readability on all screen sizes

---

# TODO: Fix Investors Page Mobile Responsiveness

## Current Issue
The investors page layout is not optimized for mobile devices, causing poor user experience on smaller screens.

## Tasks
- [x] Make hero section responsive with proper text sizing (text-3xl sm:text-4xl md:text-5xl)
- [x] Optimize search bar for mobile (responsive padding, button sizing)
- [x] Improve stats grid responsiveness (text-xl sm:text-2xl, text-xs sm:text-sm)
- [x] Make filters section mobile-friendly (stack vertically on small screens)
- [x] Optimize investor cards for mobile (responsive padding, text sizes, button spacing)
- [x] Improve pagination for mobile (stack controls, hide text on small screens, add overflow-x-auto)
- [x] Make investor detail modal mobile-responsive (responsive padding, button layout, text truncation)
- [x] Add proper responsive grid layouts throughout (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)

## Files to Edit
- app/(public)/investors/page.jsx

## Expected Behavior
- Page displays properly on all screen sizes from mobile to desktop
- Text and elements scale appropriately for readability
- Touch targets are appropriately sized for mobile interaction
- Content flows naturally without horizontal scrolling on mobile
- Modal dialogs are fully functional on mobile devices
