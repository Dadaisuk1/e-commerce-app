# E-commerce Web Application Prototype - README

## Overview

This project is a functional, interactive web application prototype simulating core features of an E-commerce platform. It's built using Next.js and focuses on demonstrating user flows for shopping, checkout, and order management without a real backend database. Data persistence across page reloads is simulated using the browser's `localStorage`.

## Technology Stack

- **Framework:** Next.js 15+ (with App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context API
- **Data Persistence:** Browser `localStorage` (for simulation)
- **Icons:** Lucide React

## Setup Instructions

1.  **Clone the Repository:** (Replace with actual repository URL if applicable)

    ```bash
    git clone <repository-url>
    cd <project-directory-name>
    ```

    _(If just providing the code directly, skip this step)_

2.  **Install Dependencies:** Ensure you have Node.js and npm (or yarn/pnpm) installed. Open your terminal in the project's root directory and run:

    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

    _Note: If you encounter peer dependency issues due to React 19 during install, you might need to use the `--legacy-peer-deps` flag:_

    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run the Development Server:**

    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```

4.  **Access the Application:** Open your web browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## Key Features to Test

This prototype simulates the following functionalities:

1.  **Landing Page:**

    - Visit the root URL (`/`).
    - View the introductory hero section and features overview.
    - Click "Start Shopping" to navigate to the main shop page.

2.  **Shop Page (`/shop`):**

    - View paginated product listings (12 items per page).
    - Use the **Search Bar** in the header (press Enter to search) to filter products by name/description.
    - Use the **Category Buttons** to filter products by category. Search and category filters work together.
    - Use the **Pagination Controls** ("Previous", "Next") at the bottom to navigate through product pages.
    - Observe **Breadcrumbs** updating based on the selected category.

3.  **Product Detail Page:**

    - Click on a product's image or title from the shop page.
    - View detailed product information (image, description, price, available stock).
    - Select a quantity to add.
    - Add the product to the cart using the "Add to Cart" button. Stock availability considers items already in the cart.

4.  **Shopping Cart (`/cart`):**

    - View items added to the cart.
    - Update item quantities using the +/- buttons or by typing in the input field (stock limits enforced).
    - Remove items from the cart.
    - **Save for Later:** Move items from the active cart to a "Saved For Later" section.
    - **Move to Cart:** Move items from the "Saved For Later" section back to the active cart (stock permitting).
    - Remove items from the "Saved For Later" section.
    - Apply a discount code (use `SAVE10` for a 10% discount). Observe the Shadcn `AlertDialog` confirmation.
    - View subtotal, discount, and total.
    - Click "Proceed to Checkout".

5.  **Authentication & Checkout:**

    - **Login Required:** Attempting checkout while logged out should trigger a Shadcn `AlertDialog` prompting login.
    - **Registration (`/register`):** Create a simulated account. Test error handling (password mismatch, short password, existing email `test@example.com`). Uses Shadcn `Alert` for errors.
    - **Login (`/login`):** Log in using simulated credentials. Test error handling (invalid credentials).
      - **Test Credentials:**
        - Email: `test@example.com`
        - Password: `password123`
    - **Header Updates:** Observe the header changing between Login/Register buttons and the User Avatar/Dropdown menu based on login status.
    - **Logout:** Use the "Logout" option in the user dropdown menu. Verify the cart is also cleared upon logout.
    - **Checkout Page (`/checkout`):** (Requires login) Fill in dummy billing/shipping information. Place the order (simulated, no payment).

6.  **Order Management:**

    - **Order Confirmation:** After checkout, verify redirection to the order confirmation page displaying order details.
    - **Order History (`/orders`):** (Requires login) View a list of orders placed by the logged-in user. Verify that logging out hides orders placed by others.
    - **Order Details (`/orders/[orderId]`):** Click "View Details" on an order in the history. View detailed item list, addresses, totals, and current status.
    - **Status Simulation:** Use the "Simulation Controls" on the order detail page to change the order status (Processing -> Shipped -> Delivered/Cancelled). Observe status changes and the appearance of tracking info.

7.  **Notifications:**

    - Observe the **Notification Bell** icon in the header.
    - Placing an order or simulating a status update should add a notification and show a badge count.
    - Clicking the bell icon should open a dropdown listing notifications and clear the badge count.

8.  **Data Persistence:**
    - Add items to the cart, save items for later, log in, place an order.
    - **Reload the browser page (F5 or Cmd+R).**
    - Verify that the cart contents, saved items, login status, and order history persist after the reload.

## Notes

- This is a frontend prototype; all data (products, users, orders) is either mocked or stored temporarily in the browser's `localStorage`. There is no real backend database or API interaction for data storage or validation beyond basic simulations.
- Authentication is simulated; password security is not implemented.
- Payment processing is not implemented.
