# Kate's little universe

A completely custom, eight-chapter encouragement website made for Kate, written from Bella's perspective.

The original five-page site has become a small *interactive universe*: an illustrated opening stararium, a heartfelt letter, flip cards, an arcade-style appreciation station with 36 encouragement notes, a page about healthy love, a growable garden, future postcards, and optional messages Kate can copy.

This is intentionally not a remake of the website for Bella. The new version has its own **moon-and-stars brand**, illustrated micro-worlds and interactive mechanisms.

## The eight chapters

| # | Page | Experience |
|---|------|------------|
| 1 | `index.html` | Kate's illustrated pocket universe, with four clickable surprise stars and a surprise button |
| 2 | `letter.html` | A thoughtful letter from Bella about Kate's value and agency |
| 3 | `mirror.html` | Six interactive self-worth cards she can flip over |
| 4 | `pocket.html` | A retro compliment dispenser with three channels, 12 messages each, previous/next/surprise, copy, and favorite notes |
| 5 | `love.html` | Five expandable reminders about boundaries, kindness, honesty, and mutual respect |
| 6 | `garden.html` | Tap six pots to grow a garden of peace, joy, trust, respect, hope and self-worth |
| 7 | `future.html` | Six illustrated future postcards, with flipping, carousel controls and dot navigation |
| 8 | `choose.html` | Choose to request space, communicate boundaries, end the relationship, or talk to Bella first, then optionally copy the message. Nothing sends automatically |

## Files

- Eight `.html` pages: one page per experience, connected by a navigation menu
- `style.css`: all design, responsive rules, animations, flower growth, arcade, postcard and stararium artwork
- `site.js`: all interactive features
- `favicon.svg`: the original crescent-and-stars logo

No build step or installation required. The site is built in HTML/CSS/JavaScript, with Google Fonts used only for decorative typefaces and system fallbacks.

## Favorite notes and privacy

The appreciation station stores only the **identifiers of favorite compliment notes** in this browser's `localStorage`, so saved notes survive page reloads. Kate can clear them at any time using **empty my pocket**. No messages she writes or personal information are collected.

The site has no analytics, accounts, backend, or automatic messaging. Copying the optional messages requires a deliberate button press and uses the device clipboard.

This is a public repository / website, so the page doesn't name an ex, expose intimate private details, or claim cheating is proven.

## Publish on GitHub Pages

Enable **Settings → Pages → Deploy from a branch → main → /(root)** if Pages has not yet been enabled.

Intended public URL:

https://sfg246.github.io/4kate/

All site navigation uses relative links, so the project also works on a project-hosted GitHub Pages subpath. Styles and script links are versioned to reduce stale mobile caching.

## Design / QA

- Mobile breakpoints for compact phones
- Keyboard-accessible links, buttons, native disclosure elements and flip cards
- Motion respects `prefers-reduced-motion`
- Live regions for dynamic feedback and note updates
- A review of source links, CSS syntax, JavaScript syntax and interactive component checks
- 24/24 scripted interaction checks passed during this iteration
- Browser-level visual review on physical iOS is still recommended before sharing

## A note about choice

The goal is to remind Kate that she is valuable, deserves respect and owns her decisions, not to make that decision for her. Any breakup or boundaries message is optional. If she is concerned about a hostile reaction, it's okay to lean on trusted people and choose a safer communication method.

Made with care, from Bella.
