# ED side-room prioritisation (preliminary)

A static web version of the **ED side-room aide-memoire, draft v5 (Oct 2026)** for UHB emergency departments: who gets the side room first when rooms run out.

**Status: preliminary draft, for IPC review, not yet Trust-approved.** Clinical judgement and IPC advice override this tool.

The wording is transcribed from the draft aide-memoire PDF. No clinical content has been added. The only interactive part is the NHS England Isolation Prioritisation Tool risk-matrix lookup (appendix A8): it applies the "stop at the first No" probability questions and the published matrix; the impact level is chosen by the user because the aide-memoire does not say how the four impact answers combine.

## Files

- `index.html`: all content
- `styles.css`: layout, colours, dark mode, print
- `app.js`: tabs and the risk-matrix lookup (no data leaves the page, nothing is stored)
- `side-room-prioritisation-draft-v5.pdf`: the A4 print version of the aide-memoire, linked from the page header and from the emevidence.org card
- `netlify.toml`: security headers; `frame-ancestors` allows emevidence.org to show it in its viewer

## Updating

When a new version of the aide-memoire is approved, update the text in `index.html` the version line in the banner and footer, and replace the PDF (renaming it changes the link, so update the `href` in `index.html` and the `download` URL in emevidence.org's `tools.js` too).

Live at https://uhbsideroom.netlify.app (Netlify project `uhbsideroom`). Until the Netlify project is linked to this repo, changes here need deploying by hand. Listed on [emevidence.org](https://emevidence.org).
