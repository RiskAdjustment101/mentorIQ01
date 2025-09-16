# MentorIQ UI Theme — Dark Mode (Landing + Onboarding)

**Design Principle**:  
All UI must be implemented with [shadcn/ui](https://ui.shadcn.com/) components. Tailwind utility classes may be used for layout and overrides. The following color palette and font stack replace the shadcn defaults.

---

## 1. Color Palette
- **Background**:  
  - Primary: `#1C1C1C` (very dark gray, almost black)  
  - Secondary panels: `#181818`  

- **Text**:  
  - Primary text: `#FFFFFF` (white)  
  - Secondary text: `#EAEAEA` (light gray)  
  - Muted/labels: `#B3B3B3`  

- **Accent (CTAs, icons, highlights)**:  
  - Primary orange: `#FF6A2D` (bright, modern)  
  - Hover/pressed: `#E65C1F` (slightly deeper orange)  

- **Borders/Dividers**: `#2E2E2E` (soft neutral for separation)  

---

## 2. Fonts
- **Primary Typeface**: **Inter** (sans-serif, Google Fonts, also used by ChatGPT)  
- **Fallbacks**: system-ui, Helvetica, Arial  
- **Weights**:  
  - H1: `font-bold`, size ~`text-4xl`  
  - Subtext: `font-medium`, `text-lg`  
  - Body: `text-base`  
  - Buttons: `font-semibold`  

---

## 3. Components (shadcn/ui + Tailwind overrides)
- **Buttons**:  
  - Primary CTA: `bg-[#FF6A2D] hover:bg-[#E65C1F] text-white rounded-lg px-6 py-3`  
  - Secondary CTA: `border border-gray-600 text-white hover:bg-gray-800 rounded-lg px-6 py-3`  

- **Cards / Modals**:  
  - `bg-[#181818] border border-[#2E2E2E] rounded-xl shadow-lg`  

- **Inputs**:  
  - Background `#1C1C1C`, border `#2E2E2E`, text `#FFFFFF`  
  - Focus: orange outline (`focus:ring-2 focus:ring-[#FF6A2D]`)  

---

## 4. Accessibility
- Orange accent passes AA contrast on dark backgrounds  
- Ensure text ≥14px for body, ≥18px for headlines  
- Keyboard focus rings in orange for clarity  

---

## 5. Implementation Notes
- All **interactive elements** (buttons, inputs, modals) must be shadcn/ui components.  
- **Tailwind utilities** are allowed for spacing, layout, and responsive tweaks.  
- Apply palette and fonts globally via Tailwind config (`tailwind.config.js`) and CSS variables.  
