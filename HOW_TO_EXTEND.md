# Clear to Close — Revision 7

## What changed

- `locations.js` owns a location registry and `switchLocation(name)`.
- Every location entry now uses the helper. All three tour interiors and all three exterior collision groups are registered, including variants that are not currently selected.
- Movement depth and nearby-object detection use the current registry entry instead of separate lists of location names.
- `dialogue.js` now includes the remaining dialogue, page lists, house descriptions, furniture interactions, objectives, and screen text. Wording has been preserved.
- Hidden locations have their collision bodies disabled. Switching also clears stale interaction prompts and all portraits, including the agent portrait.
- The game still uses one Phaser Scene. Separate Phaser Scenes are a future architecture project, not required for this cleanup.

## Start the game

Extract the entire ZIP to a new folder. From that folder, run:

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. The game still loads Phaser 3.90.0 from a CDN and needs an internet connection. Hard refresh with Ctrl+Shift+R after an edit. All local script URLs are now tagged `?v=r7`.

## Review and edit the script

`SCRIPT_REVIEW.md` is a readable inventory of the text with exact editing keys. It is a generated reference, not a second source used by the game. Make actual changes in `dialogue.js`.

The file has two sections, both grouped by location:

- `LINES`: the original 121 plain spoken lines from r6. Existing keys remain compatible.
- `SCRIPT`: the remaining text and grouped collections. This includes `loanPages`, `reviewPages`, `realtorPages`, offer pages, story cards, internet results, house data, interactive furniture, objectives, and menu copy.

Search for the words you want to change. Keep keys, commas, quotes, and speaker prefixes such as `LO:` and `AGENT:`. Escape double quotes as `\"` inside double-quoted strings. `\n` starts a new line. Long spoken dialogue is paginated by `say()`; story cards and menus have fixed layouts and need a visual check after longer edits.

Dynamic entries are small formatting functions. Keep their parameter names and `${...}` expressions intact when editing surrounding words. House selection, page numbering, and document counts are supplied by the gameplay code.

Some old page collections (`SCRIPT.core.buildUI_reviewPages` and `SCRIPT.realtor_office.buildRealtorOffice_realtorPages`) are retained for compatibility but are not displayed by the current flow. The active financial review is `LINES.loan_office.startFinancialReview_*`; the active buyer consultation uses `SCRIPT.realtor_office.continueRealtorDialogue_lines`. The review inventory flags these old collections so edits are not mistaken for changes to live dialogue.

Changing wording does not change story order. Adding choices, changing objectives' timing, or introducing new characters requires editing the corresponding location logic and its stage counters.

## Files

| File | Responsibility |
|---|---|
| `dialogue.js` | Text and story data |
| `locations.js` | Registry, location visibility, collision activation, player reparenting |
| `core.js` | Startup, movement, doors, actions, shared UI and dialogue paging |
| `apartment.js` | Apartment and internet sequence |
| `loan-office.js` | Broker, documents, whiteboard and printing |
| `town.js` | Town, downtown, Cousin Dave |
| `realtor-office.js` | Agent consultation and seating |
| `showings.js` | Driving, home tours and shortlist |
| `offer.js` | Offer discussion and decisions |
| `closing.js` | Inspection, underwriting, appraisal, disclosure and ending |
| `main.js` | Phaser configuration and startup |

## Location versus phase

`currentLocation` records the visible physical place. `phase` records what the player is doing and still drives input and story logic. For example, `currentLocation` can be `office` while `phase` is `printerCutscene`.

`switchLocation(name)` hides every registered layer, disables all registered collision groups, clears transient UI, shows the selected layer, enables its active collision groups, and moves the existing player into that layer. `switchLocation(null)` hides all locations for a full-screen sequence.

The helper intentionally leaves player coordinates, player body enablement, player visibility, `phase`, `control`, and stage counters to the calling method. This preserves seated poses, entry animations, and story timing. Place the player and set the phase in `showX()` after switching. It does not cancel arbitrary timers or tweens; finish or cancel a location's active cinematic before leaving it.

The optional `activate` callback applies conditional solids, such as the whiteboard and downtown NPCs. For variant locations, `layers`/`groups` enumerate every variant and `layer`/`activeGroups` identify the selected one.

## Add a location

1. Create `bank.js` with `Object.assign(ClearToClose.prototype, { ... })`.
2. In `buildBank()`, create its container, static collision group, interactions, and player collider. Call this builder from `create()` before `registerLocations()`.
3. Add one registration in `registerLocations()`:

```js
this.registerLocation("bank", {
  layer: () => this.bankLayer,
  groups: () => [this.bankBarriers],
  items: () => this.bankItems
});
```

4. Implement the entry method:

```js
showBank() {
  this.switchLocation("bank");
  this.player.setPosition(240,215).setVelocity(0);
  this.phase = "bank";
  this.control = true;
}
```

5. Add `bank` to `WALK_PHASES`, connect its doorway in `autoDoor()`, and handle any new interaction kinds in `action()`.
6. Add its text in `dialogue.js` and its script tag before `main.js` in `index.html`.

No other `showX()` hide lists or movement/interaction location lists need editing. Location names must be unique; invalid names throw before changing the visible location.

## Verification

Run the dependency-free registry regression test:

```sh
node tests/location-regression.cjs
```

It covers 270 source/destination/variant combinations, inactive collision groups, conditional NPC/whiteboard solids, a newly registered location, invalid names, and preservation of player and story state.

During this revision, JavaScript syntax checks passed and an AST comparison confirmed that 125 methods outside the location refactor remain equivalent to r6 after expanding text references. These are code-level checks. A browser runtime could not be installed in the editing environment; there has not been a full browser or phone playthrough of r7.

Before visual polishing, play through apartment → internet → broker → document hunt → financial review → agent → all three homes → offer → underwriting → closing. Check both consultation seats, printer return positions, re-entry through doors, hidden collisions, mobile dialogue paging, and the ending.
