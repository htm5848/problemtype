# PHYS 211 Group-Work Coding Tool

Sister tool to the PHYS 211 TA Observation Tool. The NetID screen and the
"New observation" setup screen (discussion section, TA being observed,
observation date, number of tables) are identical. The observation page is a
full classroom map for coding student interaction.

## Run it
- Open `index.html` in a browser, or
- host the folder on GitHub Pages as its own repo (e.g. `TAcoding`), like the original.

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
(mean code, % collaborative 3–4, % any interaction 2.5–4, % no work 0, activity length), then one block
per table with a bar for Structured and a bar for Open-ended showing the share of time at each code.
Built in the browser with the bundled jsPDF library (`js/vendor/`, MIT licence), so it works offline.
A **TA positioning** section has room maps of where the TA spent time (dot size = how long, dot color = when: red at the start of class, blue at the end), then a table per
activity with TA time, visits and % collaborative with vs. without the TA at each table.
On iPad, tap the report button on the done screen.

## CSV export
Session details, coding scheme, activity-type log, full coding log, qualitative notes,
time at each code by activity type, participation by table and by student for each activity type, the TA position log, TA time by place, collaboration with vs. without the TA at the table, per-student summary, and per-table summary.
A code lasts until that student's next code, the end of its activity, or the end of the observation, so the summaries report
seconds at each code and a time-weighted mean code.
