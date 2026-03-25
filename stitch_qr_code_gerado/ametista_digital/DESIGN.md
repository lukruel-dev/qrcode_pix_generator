# Design System Strategy: The Fluid Editorial Standard

## 1. Overview & Creative North Star
**The Creative North Star: "Precision Fluidity"**

In the world of Brazilian finance, "Pix" represents more than a transaction; it represents instant movement. This design system moves away from the rigid, boxy "banking" templates of the past. Instead, it adopts a **High-End Editorial** approach. We treat the interface like a premium financial broadsheet—using high-contrast typography, intentional asymmetry, and "The No-Line Rule" to create a sense of infinite space and effortless trust. 

The system breaks the "app" feel by using overlapping elements and sophisticated layering, ensuring the user feels they are interacting with a living service, not a static database.

---

## 2. Colors: Tonal Depth & The Glass Principle
We utilize a palette of deep, authoritative purples (`primary`) and high-energy, functional greens (`secondary`).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. 
Structure is achieved through background shifts. A `surface-container-low` section sitting on a `surface` background provides all the separation required. If a boundary feels "missing," increase the spacing—do not add a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#fdf8fd)
- **Secondary Sectioning:** `surface-container-low` (#f7f2f8)
- **Active Interactive Areas:** `surface-container-highest` (#e5e1e7)

### The Glass & Gradient Rule
To achieve a "signature" feel, floating action buttons or high-priority modals should utilize **Glassmorphism**. Use `surface` or `primary_container` at 80% opacity with a `backdrop-blur` of 20px. 
*   **Signature Texture:** For primary CTAs, use a linear gradient from `primary` (#2e0052) to `primary_container` (#4b0082) at a 135° angle. This adds a "soul" to the button that a flat hex code cannot replicate.

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with utility.

*   **Display & Headlines (Manrope):** This is our "Editorial" voice. `display-lg` and `headline-md` should be used with tight letter-spacing (-0.02em) to create a bold, authoritative presence. Large-scale numbers for account balances should always be `display-md` to emphasize transparency.
*   **Body & Labels (Inter):** While Manrope handles the personality, Inter handles the data. Use `label-md` for micro-copy and transaction IDs. Inter’s high x-height ensures readability even at the smallest scales (`label-sm`).
*   **Hierarchy as Trust:** High contrast between a `headline-lg` (Deep Purple) and `body-md` (On Surface Variant) mimics premium financial reporting, signaling to the user that the information is curated and secure.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." We use light and tone to lift elements.

*   **The Layering Principle:** Place a `surface-container-lowest` card (Pure White #ffffff) on a `surface-container` background (#f1ecf2). This creates a "soft lift" that feels natural and architectural.
*   **Ambient Shadows:** When a floating state is required (e.g., a bottom sheet), use a shadow with a 32px blur, 0px spread, and 4% opacity of the `on-surface` color.
*   **The Ghost Border:** If accessibility requires a stroke (e.g., in high-contrast mode), use the `outline_variant` (#cec3d3) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism Depth:** Use `surface_variant` with 60% opacity for navigation bars to allow the vibrant `secondary` (Green) of success states to "glow" through the UI as the user scrolls.

---

## 5. Components: Fluid Primitives

### Buttons (The Interaction Engine)
*   **Primary:** Gradient of `primary` to `primary_container`. Corner radius: `full` (9999px) for a modern, friendly feel.
*   **Secondary:** `secondary_fixed` (#62ff96) with `on_secondary_fixed` (#00210b) text. This is reserved strictly for "Success" or "Money In" actions.
*   **Tertiary:** No background. Use `primary` text with a subtle `surface-container-high` hover state.

### Input Fields (The Clarity Standard)
*   **Base:** Large padding (`spacing-4`). Background: `surface-container-low`.
*   **Focus State:** Transition the background to `surface-container-highest` and add a 2px "Ghost Border" of `primary` at 20% opacity. 
*   **Error:** Use `error` (#ba1a1a) text but a `error_container` background. Never use a red border; it creates unnecessary "alarm" in a financial context.

### Cards & Lists (The Editorial Feed)
*   **Rule:** Forbid divider lines. 
*   **Structure:** Use `spacing-6` (1.5rem) of vertical white space to separate transaction groups. 
*   **Visual Shift:** Use a `surface-container-low` rounded box (`radius-lg`) to group related transactions, rather than separating them with lines.

### Signature Component: The "Transfer Glow"
For Pix transfers, use a "Glow Card" using the `secondary_container` color. It should feel "energized" to represent the speed of the transaction.

---

## 6. Do’s and Don'ts

### Do:
*   **Use White Space as a Tool:** If two elements feel too close, double the spacing rather than adding a divider.
*   **Align to a 4px Grid:** Even with "asymmetric" editorial layouts, ensure the underlying grid is mathematically sound using the Spacing Scale.
*   **Embrace the Deep Purple:** Use `primary` (#2e0052) for "High Trust" areas like Security Settings and Balance Privacy.

### Don’t:
*   **Don't use 100% Black:** Always use `on_surface` (#1c1b1f) for text to maintain a premium, softer look.
*   **Don't Over-Round:** Stick to `radius-md` (0.75rem) for functional elements like inputs, and reserve `radius-full` only for buttons and chips.
*   **Don't mix Gradients:** Only the `primary` brand color gets a gradient. The `secondary` (Green) must remain flat and functional to signify "Action/Go."