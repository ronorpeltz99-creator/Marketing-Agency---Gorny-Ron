# Project Guidelines

## Core Skills & Tools
- **Caveman Commit**: Use this for all commits to ensure consistent, descriptive, and atomic git history.
- **Caveman Review**: Use this for code reviews to maintain high quality and adherence to project patterns.

## Development Rules
- Always prioritize the **Caveman** methodology for development tasks.
- Keep the root directory clean by following the established organization (documentation in `docs/`, core WAT framework in `src/`).
- Use the Supabase SSR utilities in `src/utils/supabase/` for all database and auth operations.

## Reference
- See @AGENTS.md for specific AI agent instructions and Next.js version rules.

---

# PRODUCT VISION — Full User Journey

Every feature built must support this end-to-end flow. Before any change, verify it fits.

## Stage 1: IMPORT PRODUCT URL
- User pastes AliExpress product URL in "IMPORT PRODUCT URL" section
- System extracts: all product images, price, title, variants from supplier

## Stage 2: STORE & SUPPLIER INTEGRATION
- Auto-create new Shopify theme (free "example Theme" — theme name TBD)
- DSers: import product from URL → sync price + images to Shopify store
- Dashboard shows and allows editing:
  - Current price, Compare-at price, Cost per unit
  - Physical product (yes/no)
  - Product images (swap/edit)
- Shopify store created on user's email with Shopify Payments installed
- Every new order → dashboard entry with: name, email, address, shipping, all checkout fields
- **Auto-fulfillment**: every order automatically fulfilled via DSers to supplier

## Stage 3: PRODUCT & AUDIENCE IDENTIFICATION
- Section with two input options:
  1. Upload file (product name, niche, target audience, etc.)
  2. Answer AI-generated questions inline
- Output: structured document identifying product, target audience, desires the product solves
- (Dedicated skill for this — TBD by user)

## Stage 4: COPYWRITING
- After audience ID: AI asks deeper questions or accepts file uploads
- Goal: identify exact audience desires + write direct-response copy (above & below the fold)
- Copy must be conversion-first — site looks great but copy is what makes money
- (Dedicated skill for this — TBD by user)

## Stage 5: ADS CREATOR
Section called "ADS CREATOR" with two creative formats:

### Image Ads
- Popup: AI finds competitor successful image ads based on product knowledge
- Shows competitor ad + supplier product image (prefer white background)
- "RECREATE" button → AI builds prompt mimicking competitor ad for user's brand
- Prompt sent to relevant image model → image created
- Approve → goes to "Statics Creatives" folder
- Reject → try again

### Video Ads
- Upload starting image (image-to-video)
- Choose video part type (each is a separate clip):
  - **HOOK** (#1) — attention grabber
  - **STANDARD** (#2) — main message
  - **B-ROLL** (#3) — supporting visuals
  - **CTA** (#4) — call to action
- Each type has dedicated skill with direct-response copywriting prompts
- Video created per part → approve/reject
- Approved clips ordered by number (1→2→3→4)
- "MIX" button: combines clips in order + auto-adds word-by-word subtitles
- Final mixed video → approve → goes to "Video Creatives" folder

## Stage 6: CAMPAIGN LAUNCH (Meta Integration)
- User grants access to Meta account + ad account + Business Manager
- "CAMPAIGN LAUNCH" section:
  - All approved creatives (images + videos) auto-upload here
  - "TOP UP ACCOUNT BALANCE" feature — add funds visible in dashboard
  - Choose ad account per creative (from Business Manager)
  - Set budget per campaign → launches as CBO campaign
  - Click any ad → see metrics (metrics list TBD by user)
  - "ANALYZE METRICS" button → AI decides kill/scale based on dedicated skill (TBD)
  - Custom rules (e.g., "kill if $40 spend and <2 purchases")

---

## Non-Negotiables
1. Dashboard must allow FULL Shopify management — user should never need to open Shopify directly
2. Every order auto-fulfilled — zero manual fulfillment
3. Copy quality = revenue. Visuals serve copy, not the other way around
4. Ad creatives approved by user before anything goes live
5. Meta campaign control fully from dashboard — no need to open Ads Manager
