# PHYS 211 Group-Work Coding Tool

Sister tool to the PHYS 211 TA Observation Tool. The NetID screen and the
"New observation" setup screen (discussion section, TA being observed,
observation date, number of tables) are identical. The observation page is a
full classroom map for coding student interaction.

**Live site:** https://htm5848.github.io/problemtype/

## Run it
- Use the live site above (works on iPad, phone and laptop), or
- open `index.html` in a browser. Pushing to `main` updates the live site through GitHub Pages in about a minute.

No backend. Work autosaves to the device so an accidental reload can be resumed.

## Coding scheme
| Code | Meaning |
|------|---------|
| 0   | No interaction and no work |
| 1   | Working independently, no interaction |
| 2   | Working independently, just checking the final answer/product |
| 2.5 | Working independently with occasional interaction / process |
| 3   | Working collaboratively with occasional interaction |
| 4   | Working collaboratively with a high interaction level |

Edit `CODES` in `js/main.js` to change the wording. Edit `TA_ROSTER` for a new semester.

## 1-minute table rotation (time sampling)
- Pick the activity (**Structured / Open-ended / Other**) in the top bar. That starts a rotation at **Table 1**.
- The blue bar above the map shows the table to watch now and a 1:00 countdown. Code the students at that table (the highlighted one; the others fade back).
- When the minute is up the tool moves to the next table on its own (1 → 2 → … → last → 1) and shows "Move to Table N". **Next table ›** moves on early; **‹ Back** returns to the previous table.
- Each time a table's turn comes round, its seats start blank. Switching activity ends the current turn and starts a new rotation at Table 1.
- Each minute gives **one observation per student** at that table: the last code given that minute. Codes given to a table outside its turn are kept in the log but not counted (the side panel offers "Observe Table N now").
- A turn shorter than 30 s with nothing coded (skipped or cut off) is not kept.

## Using it
- The front of the room is the top; tables are in 2 columns × 3 rows by default, numbered down the left column first.
- Students sit two in front of two (4 by default). Use the **− / +** on each table to change how many students sit there (1–10). Tap the table itself to code everyone at once.
- Tap a student: the right panel opens with the codes, a notes box and that student's history.
- Set **Activity** (Structured / Open-ended / Other) in the top bar; every code and note is tagged with it.
  Switching activity gives a clean slate: every seat shows as uncoded again and earlier codes stop counting at the switch.
- **TA position:** tap the empty space around a table (or the front strip) whenever the TA moves. An orange TA marker shows where they are now and small numbered dots show every earlier position; it stays put across activity switches.
- Seats with a dashed orange outline haven't been re-coded in 5+ minutes.
- The **live log** at the bottom lists every code, note and TA move, newest first. Tap **×** on any row to undo just that entry, or **Undo last**. Tap the header to collapse it for more map space.

## Participation report (PDF)
Saved alongside the CSV at End & Export as `…_participation_by_table.pdf`. It has a whole-class summary
(mean code, % collaborative 3–4, % any interaction 2.5–4, % no work 0, activity length, chunks observed, student
observations coded), then one block per table with a bar for Structured and a bar for Open-ended showing the
share of student observations at each code.
Built in the browser with the bundled jsPDF library (`js/vendor/`, MIT licence), so it works offline.
A **TA positioning** section has room maps of where the TA spent time (dot size = how long, dot color = when: red at the start of class, blue at the end), then a table per
activity with TA time, visits and % collaborative with vs. without the TA at each table.
On iPad, tap the report button on the done screen.

## CSV export
Session details, coding scheme, activity-type log, the 1-minute rotation chunks, one row per student per chunk,
the full coding log (marking which codes counted), qualitative notes, observations at each code by activity type,
participation by table and by student for each activity type, the TA position log, TA time by place,
collaboration with vs. without the TA at the table, per-student summary, and per-table summary.
All participation numbers are counts of student observations (one per student per chunk); TA time is in seconds.
