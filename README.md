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
| 1   | Off-topic interaction |
| 2   | Working independently, no interaction |
| 3   | Working independently, just checking the final answer/product |
| 3.5 | Working independently with occasional interaction / process |
| 4   | Working collaboratively with occasional interaction |
| 5   | Working collaboratively with a high interaction level |

Collaborative = codes 4–5; any on-task peer interaction = 3.5–5; off-topic = 1.
Edit `CODES` in `js/main.js` to change the wording. Edit `TA_ROSTER` for a new semester.

## 1-minute table turns (manual, time sampling)
- The bar above the map shows the **next table** (‹ › to choose another) and its **problem type**: Structured / Open-ended / Other.
  Problem type is set **per table**, because groups work at different paces; a table keeps its type until you change it
  (in the bar or the table's panel). Each table shows its type on the map.
- Tap **Start 1 minute ▶** (needs a problem type). Code the students at the highlighted table while the minute counts down;
  **■ Stop** ends it early.
- After one minute the tool **stops and waits** — nothing happens until you start the next table.
- Each turn starts with that table's seats blank, and changing a table's problem type gives it a blank slate too.
- Each minute gives **one observation per student** at that table: the last code given that minute, filed under the table's
  problem type. Codes given to a table outside its minute are kept in the log but not counted (the side panel offers to start it).
- A turn shorter than 30 s with nothing coded is not kept.

## Using it
- The front of the room is the top; tables are in 2 columns × 3 rows by default, numbered down the left column first.
- Students sit two in front of two (4 by default). Use the **− / +** on each table to change how many students sit there (1–10). Tap the table itself to code everyone at once.
- Tap a student: the right panel opens with the codes, a notes box and that student's history.
- **TA position:** tap the empty space around a table (or the front strip) whenever the TA moves. An orange TA marker shows where they are now and small numbered dots show every earlier position; it stays put across activity switches.
- Seats with a dashed orange outline haven't been re-coded in 5+ minutes.
- The **live log** at the bottom lists every code, note and TA move, newest first. Tap **×** on any row to undo just that entry, or **Undo last**. Tap the header to collapse it for more map space.

## Participation report (PDF)
Saved alongside the CSV at End & Export as `…_participation_by_table.pdf`. It has a whole-class summary
(mean code, % collaborative 3–4, % any interaction 2.5–4, % no work 0, activity length, chunks observed, student
observations coded), then one block per table with bars for Structured, Open-ended and Other showing the
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
