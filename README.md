# AMFCC Library

Catalogue, physical-copy inventory and circulation system for the AMFCC Library.

**Repository:** [amfcc-hre/library-site](https://github.com/amfcc-hre/library-site)  
**Live site:** [AMFCC Library](https://amfcc-hre.github.io/library-site/)

## Purpose

Use this site to record the books physically held by the Library, issue and return copies, renew loans, follow up overdue items and export Library records.

The catalogue starts empty by design. Library staff enter real titles and add each physical copy with its own barcode.

## Access

| User | Access |
| --- | --- |
| Public visitor | Search the public catalogue and see title, author, shelf location and availability only |
| Library Staff | Catalogue, copies, circulation, active loans, overdue follow-up and reports |
| School Administrator | All Library Staff functions plus Library rule settings |
| IT Administrator | Full Library access and Library Staff PIN setup |

IT Administration must set the first Library Staff PIN before Library Staff can sign in.

The name entered after login is recorded against Library work. It is not a separate user account or PIN.

## Main capabilities

### Catalogue and physical copies

- Add and edit book titles.
- Scan or enter an ISBN and retrieve available title details from Open Library.
- Review the retrieved title, author, publisher, publication year and category before saving.
- Record author, ISBN, publisher, publication year, category, shelf location and notes.
- Add each physical copy with its own barcode.
- Record accession number, acquisition date and condition notes.
- Search by title, author, ISBN, category or shelf location.
- Filter by availability, on-loan status or titles without copies.

### Circulation

- Issue books to students selected from the shared student directory.
- Issue books to staff by entering the staff member's name.
- Scan or type a copy barcode when issuing or returning a book.
- Use the calculated due date or enter a different due date.
- Return a copy as Available or Damaged.
- Renew an active loan within the configured renewal limit.

### Follow-up and reporting

- View active loans, items due soon and overdue loans.
- Search by borrower, registration number, title or barcode.
- Export the catalogue and physical-copy inventory to CSV for Excel.
- Export up to the latest 500 loan records.
- Export the current overdue follow-up list.

### Library rules

The current starting rules are:

| Rule | Default |
| --- | --- |
| Standard loan period | 14 days |
| Maximum active loans per borrower | 3 |
| Maximum renewals per loan | 1 |
| Public catalogue | Enabled |

School Administration or IT Administration can change these values in the Library settings section. A changed loan period affects new due dates only. It does not rewrite existing loan due dates.

Fines and reservations are intentionally not included in this version.

## Security and privacy

- Public visitors can see catalogue and availability information only.
- Borrower details, loan history and overdue information require a protected Library session.
- Four-digit role PINs are verified in Supabase and are not stored in this repository.
- The browser uses a Supabase publishable key only.
- Never add a Supabase secret key or legacy `service_role` key to this repository.
- Protected actions require a temporary session token and the operator's name.

## Repository files

| File | Purpose |
| --- | --- |
| `index.html` | Public catalogue and protected Library interface |
| `library.js` | Catalogue, circulation, reporting and settings behaviour |
| `isbn-lookup.js` | ISBN validation and Open Library book-detail lookup |
| `library.css` | Main Library styling |
| `library-fixes.css` | Login display and navigation corrections |
| `shared_config.js` | Supabase project URL and publishable key |
| `shared_supabase.js` | Shared Supabase browser-client setup |
| `README.md` | Repository and operating instructions |

## Deployment with GitHub Pages

1. Open the existing public repository `library-site` under the `amfcc-hre` account.
2. Upload every file from this folder to the repository root, including `isbn-lookup.js`.
3. Keep the filenames and folder structure unchanged.
4. Open **Settings > Pages** in GitHub.
5. Select **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder.
7. Wait for GitHub Pages to publish the site.
8. Open the live-site link above.

Do not run database migrations when updating only the browser files. The Library database and permissions are already live.

## First-use checklist

1. In IT Administration, set the Library Staff PIN.
2. Sign in to the Library using that PIN.
3. Enter the operator's name.
4. Review the Library rules.
5. Open Catalogue, place the cursor in the ISBN field and scan a real book.
6. Confirm the online details appear, review them and enter the shelf location.
7. Save the title, then add a physical copy and scan or enter its copy barcode.
8. Issue the copy to a test student or staff borrower.
9. Return the copy and confirm it becomes available again.
10. Open the public catalogue and confirm that borrower information is not shown.
11. Download each CSV report and confirm it opens correctly in Excel.

## Barcode-scanner notes

Most USB, Bluetooth and iPad-compatible 2D scanners operate as keyboards.

- To add a title, open Catalogue, place the cursor in the ISBN barcode field and scan the ISBN on the back of the book. If the scanner sends Enter, the internet search starts automatically.
- The site searches Open Library at low volume and fills the title form with the details it finds. Staff must review the result before saving it.
- If no online record is found or the internet is unavailable, the ISBN remains in the form and staff can enter the other details manually.
- After saving the title, add each physical copy separately. The copy barcode is the Library's unique identifier for that physical item and does not need to be the same as the ISBN.

If a scanner does not work:

1. Test the scanner in a plain text field.
2. Confirm it outputs the barcode printed on the Library copy.
3. Confirm the scanner is configured for keyboard or HID mode.
4. Confirm the iPad adapter or Bluetooth connection is active.

## Related repositories

- [AMFCC IT Administration](https://github.com/amfcc-hre/it-admin-site): creates or changes the Library Staff PIN.
- [AMFCC Department Operations](https://github.com/amfcc-hre/department-operations): staff operations, departmental reporting and administration.
- [AMFCC Student Services](https://github.com/amfcc-hre/amfcc_student_services): student meal check-in and personal gate passes.
