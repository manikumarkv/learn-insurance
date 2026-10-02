# Accessibility

Target: **WCAG 2.2 AA** (story 5.5).

## Automated (runs in CI)

`tests/e2e/a11y.spec.ts` runs axe on the key pages and fails on any **moderate, serious or critical** issue:

- Home, Terms A–Z, a full term (Endorsement), a basic term (HMO), Insurance types, a nested type page, search results, About, Privacy, 404.
- Colour contrast is also checked in the soft dark, high-contrast light and high-contrast dark themes.

Other browser tests cover behaviour axe can't see:

| Area | Test |
|---|---|
| Skip link and focus ring | `theme.spec.ts` |
| Mobile menu | `layout.spec.ts` |
| Insurance types tree (arrow keys, Home/End, Enter) | `types-tree.spec.ts` |
| Check yourself quiz | `term-page.spec.ts` |
| Term link previews (hover, focus, Escape, touch) | `term-links.spec.ts` |
| Search results announced in a live region | `search.spec.ts` |
| Diagram text alternatives, 390px layout | `visuals.spec.ts` |
| Cookie banner reopened from the footer, focus moves to it | `cookies.spec.ts` |

## Manual checks (before launch)

Automated tools catch about a third of issues, so do one pass by hand with **VoiceOver (Mac or iPhone)** or **NVDA (Windows)**:

- [ ] Term page: headings read in order; the diagram's text alternative is read; term links announce their preview; the quiz announces "Correct" or "Not quite" after Check answer.
- [ ] Search: typing announces the result count; "Did you mean" is read.
- [ ] Insurance types tree: announced as a tree, with expanded/collapsed state and level.
- [ ] Keyboard only (no mouse): every page can be used with Tab, Shift+Tab, Enter, Space and arrow keys, and focus is always visible.
- [ ] Zoom to 200% and 400%: no content is cut off and no sideways scrolling except where expected.
- [ ] Learn card (story 7.x): add to this list when it exists.

Record findings in a GitHub issue labelled `accessibility`.
