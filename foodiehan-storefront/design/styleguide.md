# FoodieHan — Design Styleguide

> Reference: Crouton – Baker theme · Generated 2026-04-11

---

## 01 · Color Palette

### Brand

| Token      | Hex       | Usage                                             |
| ---------- | --------- | ------------------------------------------------- |
| Gold       | `#e1be64` | Primary accent, CTA buttons, hover states, prices |
| Gold Hover | `#f2d078` | Button hover, link hover                          |

### Dark Scale

| Token       | Hex       | Usage                              |
| ----------- | --------- | ---------------------------------- |
| Black       | `#090909` | Hero / full-bleed dark backgrounds |
| Near Black  | `#181818` | Navigation bar, footer bottom      |
| Dark        | `#232323` | Footer top                         |
| Charcoal    | `#303030` | Dark CTA sections                  |
| Dark Gray   | `#333333` | Primary body text, dark buttons    |
| Border Dark | `#4e4e4e` | Dividers on dark surfaces          |

### Neutral Scale

| Token    | Hex       | Usage                    |
| -------- | --------- | ------------------------ |
| Mid Gray | `#666666` | Secondary text, labels   |
| Medium   | `#8d8d8d` | Descriptions, meta text  |
| Light    | `#999999` | Captions, copyright      |
| Lighter  | `#aaaaaa` | Placeholders             |
| Border   | `#cccccc` | Input borders, hairlines |

### Surface

| Token     | Hex       | Usage                         |
| --------- | --------- | ----------------------------- |
| Off White | `#f5f5f5` | Page background               |
| White     | `#ffffff` | Cards, inputs, light sections |

---

## 02 · Typography

**Font family:** `Open Sans` (Google Fonts)  
**Weights used:** 300 · 400 · 600 · 700

| Level               | Size | Weight | Line-height | Notes                                               |
| ------------------- | ---- | ------ | ----------- | --------------------------------------------------- |
| Display / Hero      | 64px | 700    | 1.1         | Used in hero banners                                |
| H1                  | 42px | 700    | 1.15        | Page titles                                         |
| H2                  | 32px | 700    | 1.2         | Section headings                                    |
| H3                  | 24px | 700    | 1.3         | Sub-section headings                                |
| H4                  | 18px | 600    | 1.4         | Card titles, product names                          |
| H5                  | 15px | 600    | 1.4         | Uppercase · letter-spacing 0.06em                   |
| H6 / Widget Title   | 12px | 700    | 1.4         | Uppercase · letter-spacing 0.14em                   |
| Overline / Category | 11px | 700    | —           | Uppercase · letter-spacing 0.18em · color `#e1be64` |
| Nav Link            | 13px | 400    | —           | Uppercase · letter-spacing 0.08em · white on dark   |
| Body Large          | 16px | 300    | 30px        | Primary readable body copy                          |
| Body                | 14px | 300    | 27px        | Secondary body copy                                 |
| Small / Caption     | 12px | 300    | 22px        | Footer text, helper text · color `#666666`          |

---

## 03 · Buttons

All buttons: `border-radius: 0` · uppercase labels · `letter-spacing: 0.1em` · `font-weight: 600` · `transition: 0.25s ease`

| Variant                    | Background  | Text      | Border    | Hover bg  |
| -------------------------- | ----------- | --------- | --------- | --------- |
| Solid Gold (Primary CTA)   | `#e1be64`   | `#ffffff` | `#e1be64` | `#f2d078` |
| Solid Dark                 | `#333333`   | `#ffffff` | `#333333` | `#e1be64` |
| Solid White (on dark bg)   | `#ffffff`   | `#333333` | `#ffffff` | `#e1be64` |
| Outline Light (on dark bg) | transparent | `#ffffff` | `#666666` | `#e1be64` |
| Outline Dark (on light bg) | transparent | `#333333` | `#cccccc` | `#e1be64` |

**Sizing:** `padding: 12px 28px` (default medium)

> All hover states converge on gold `#e1be64` — this is the single interaction colour.

---

## 04 · Form Elements

### Input / Textarea

```
padding:        12px 20px
border:         1px solid #cccccc
border-radius:  0
font-size:      14px
font-weight:    300
color:          #333333
placeholder:    #aaaaaa
focus-border:   #e1be64
```

**Dark variant** (on dark backgrounds):

```
background:     transparent
border-color:   #aaaaaa
color:          #ffffff
focus-border:   #e1be64
```

### Labels

```
font-size:      12px
font-weight:    600
letter-spacing: 0.08em
text-transform: uppercase
color:          #666666
```

### Newsletter Strip

Inline layout: `[email input]` + `[Join button]`  
Button — background `#e1be64`, hover `#f2d078`, white text, no border-radius.

---

## 05 · Product Cards

```
background:     #ffffff
border-radius:  0
```

| Element                  | Spec                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| Image area               | Full-width, fixed height (e.g. 180px), `object-fit: cover`       |
| Category label           | 11px · 700 · uppercase · letter-spacing 0.12em · color `#e1be64` |
| Product name             | 16px · 600 · color `#333333`                                     |
| Description              | 13px · 300 · line-height 22px · color `#8d8d8d`                  |
| Price                    | 18px · 600 · color `#333333`                                     |
| Original price (crossed) | 13px · `text-decoration: line-through` · color `#aaaaaa`         |

Badges positioned `absolute` on the image (top-left, 12px offset).

---

## 06 · Pricing / Menu List

Row layout: item info (left, flex-1) + price (right, no-wrap).

```
border-bottom:  1px dotted #cccccc
padding:        14px 0
```

| Element     | Spec                                           |
| ----------- | ---------------------------------------------- |
| Item name   | 15px · 600 · color `#333333`                   |
| Description | 12px · 300 · line-height 1.6 · color `#8d8d8d` |
| Price       | 15px · 600 · color `#e1be64`                   |

---

## 07 · Badges & Tags

All badges: `border-radius: 0` · `font-size: 10px` · `font-weight: 700` · uppercase · `letter-spacing: 0.12em`

| Variant    | Background  | Text                         |
| ---------- | ----------- | ---------------------------- |
| Featured   | `#e1be64`   | `#ffffff`                    |
| New / Dark | `#333333`   | `#ffffff`                    |
| Sale       | `#c0392b`   | `#ffffff`                    |
| Outline    | transparent | `#666666` (border `#cccccc`) |

---

## 08 · Spacing Scale

| Step | Value | Typical usage          |
| ---- | ----- | ---------------------- |
| 1    | 4px   | Micro gaps             |
| 2    | 8px   | Inline spacing         |
| 3    | 12px  | Tight stacks           |
| 4    | 16px  | Standard component gap |
| 5    | 20px  | Form group spacing     |
| 6    | 24px  | Card padding, grid gap |
| 7    | 32px  | Section inner padding  |
| 8    | 40px  | Container padding      |
| 9    | 48px  | Section padding (sm)   |
| 10   | 60px  | Section padding (md)   |
| 11   | 72px  | Section margin         |
| 12   | 96px  | Hero padding           |

---

## 09 · Separators

| Style           | Spec                   | Usage                                |
| --------------- | ---------------------- | ------------------------------------ |
| Gold accent bar | `60px × 2px · #e1be64` | Centered below section headings      |
| Light hairline  | `1px solid #e5e5e5`    | Section dividers on white background |
| Dotted          | `1px dotted #cccccc`   | Pricing list rows                    |
| Dark hairline   | `1px solid #4e4e4e`    | Dividers on dark surfaces            |

---

## 10 · Layout & Grid

| Token             | Value                                         |
| ----------------- | --------------------------------------------- |
| Max content width | 1100px                                        |
| Column system     | 12 columns                                    |
| Breakpoints       | 1600 · 1440 · 1280 · 1024 · 768 · 600 · 480px |
| Container padding | 40px (desktop)                                |

---

## 11 · Navigation Header

```
background:   #181818
height:       72px
padding:      0 40px
```

| Element           | Spec                                                       |
| ----------------- | ---------------------------------------------------------- |
| Logo              | 20px · 700 · uppercase · letter-spacing 0.06em · `#ffffff` |
| Nav links         | 12px · 400 · uppercase · letter-spacing 0.1em · `#ffffff`  |
| Nav link hover    | color `#e1be64`                                            |
| Cart / menu icons | `#ffffff`                                                  |

---

## 12 · Hero / Banner Section

```
background:       #090909 (+ overlay gradient)
min-height:       360px
text-align:       center
padding:          80px 40px
```

| Element     | Spec                                                        |
| ----------- | ----------------------------------------------------------- |
| Eyebrow     | 11px · 700 · uppercase · letter-spacing 0.18em · `#e1be64`  |
| Title       | 52px · 700 · line-height 1.1 · `#ffffff`                    |
| Sub-copy    | 16px · 300 · line-height 30px · `#cccccc` · max-width 560px |
| CTA buttons | Solid Gold + Outline Light, flex row, gap 16px              |

---

## 13 · Dark CTA Section

```
background:   #303030
padding:      60px 48px
text-align:   center
```

| Element      | Spec                                     |
| ------------ | ---------------------------------------- |
| Overline     | 11px · 700 · uppercase · `#e1be64`       |
| Gold divider | 60px × 2px · `#e1be64` · centered        |
| Heading      | 38px · 700 · `#ffffff`                   |
| Body copy    | 16px · 300 · `#cccccc` · max-width 560px |
| Button       | Solid White → hover Gold                 |

---

## 14 · Footer

### Footer Top — `#232323`

```
padding:  48px 40px
grid:     2fr 1fr 1fr 1fr  (4 columns)
```

| Element        | Spec                                                       |
| -------------- | ---------------------------------------------------------- |
| Widget title   | 12px · 700 · uppercase · letter-spacing 0.14em · `#ffffff` |
| Body text      | 12px · 300 · line-height 22px · `#cccccc`                  |
| Links          | 12px · `#cccccc` → hover `#e1be64`                         |
| Phone / accent | 14px · 400 · `#e1be64`                                     |

### Footer Bottom — `#181818`

```
padding:        20px 40px
layout:         space-between (copyright ↔ social links)
```

| Element      | Spec                                                       |
| ------------ | ---------------------------------------------------------- |
| Copyright    | 12px · 300 · `#999999`                                     |
| Social links | 12px · `#cccccc` → hover `#e1be64` · letter-spacing 0.06em |

---

## 15 · CSS Custom Properties (Recommended Tokens)

```css
:root {
  /* Brand */
  --color-brand: #e1be64;
  --color-brand-hover: #f2d078;

  /* Text */
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-muted: #8d8d8d;
  --color-text-light: #cccccc;
  --color-text-faint: #999999;

  /* Background / Surface */
  --color-surface: #ffffff;
  --color-surface-off: #f5f5f5;
  --color-bg-dark: #303030;
  --color-bg-darker: #232323;
  --color-bg-darkest: #181818;
  --color-bg-black: #090909;

  /* Border */
  --color-border: #cccccc;
  --color-border-dark: #4e4e4e;

  /* Typography */
  --font-family: "Open Sans", sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 42px;
  --font-size-display: 64px;

  --line-height-body: 30px;
  --line-height-sm: 22px;

  /* Misc */
  --border-radius: 0px;
  --transition-speed: 0.25s;
  --transition: 0.25s ease;
  --letter-spacing-nav: 0.1em;
  --letter-spacing-label: 0.08em;
  --letter-spacing-caption: 0.14em;
  --letter-spacing-overline: 0.18em;

  /* Layout */
  --max-width: 1100px;
  --container-padding: 40px;
}
```
