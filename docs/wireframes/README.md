# Wireframes

Grey-box wireframes for LearnInsurance. They show layout and flow, not final colors or branding.

- **Live canvas (clickable, private):** https://claude.ai/artifact/CBYNRdQdbW87sPbV5PPyg9
- **Offline previews:** open any file in `preview/` in a browser.

## Screens

| # | Screen | Preview |
|---|---|---|
| 1 | Home | [Home](preview/Home.html) |
| 2 | Search & request a term | [Search](preview/Search.html) |
| 3 | Term detail (Endorsement) | [Term](preview/Term.html) |
| 4 | Terms A–Z | [Glossary](preview/Glossary.html) |
| 5 | Insurance types tree | [Types](preview/Types.html) |
| 5b | Insurance type page (Cyber) | [TypePage](preview/TypePage.html) |
| 6 | Learning paths | [Paths](preview/Paths.html) |
| 7 | Path detail | [PathDetail](preview/PathDetail.html) |
| 7b | Quick review + "all caught up" | [Review](preview/Review.html) |
| 8 | Learn one term at a time | [Learn](preview/Learn.html) |
| 8b | Learning as a guest | [GuestLearn](preview/GuestLearn.html) |
| 9 | Quiz | [Quiz](preview/Quiz.html) |
| 10 | My progress | [Dashboard](preview/Dashboard.html) |
| 11 | Sign in / sign up (Clerk) | [SignIn](preview/SignIn.html) |
| 12 | Auto term pipeline | [Pipeline](preview/Pipeline.html) |
| 13 | Account settings | [Settings](preview/Settings.html) |
| 14 | Page not found (404) | [NotFound](preview/NotFound.html) |
| M1 | Home (mobile) | [MHome](preview/MHome.html) |
| M2 | Term page (mobile) | [MTerm](preview/MTerm.html) |
| M3 | Learn card (mobile) | [MLearn](preview/MLearn.html) |

## Files

| Path | What it is |
|---|---|
| `build.py` | Generates every artboard. Edit this to change a screen. |
| `source/*.dc.html` | Artboards in the canvas format, as published to the live canvas. |
| `source/canvas.json` | Canvas layout: where each artboard sits, row titles and sticky notes. |
| `preview.py` | Converts `source/` into plain HTML in `preview/`. |
| `preview/*.html` | Plain HTML previews. Links between screens work. |

## Updating

```bash
python3 docs/wireframes/build.py     # regenerate source/*.dc.html
python3 docs/wireframes/preview.py   # regenerate preview/*.html
```

Then publish the changed `source/` files to the live canvas and commit both folders, so the PR diff shows what changed.

The live canvas can also be edited by hand. When that happens, copy the edited artboard back into `source/` before the next build, or the change will be lost.
