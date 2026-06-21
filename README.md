#  BiteBalance - Daily Calorie Tracker

BiteBalance is a client-side calorie counter app built with HTML5, Tailwind CSS, and vanilla ES6+ JavaScript. It features an entry logging workflow, data persistence via `localStorage`, item management capabilities, and simulated database lookups powered by the `Fetch API`.

##  Key Features

- **Dynamic Calorie Logging:** Add customized items and instantly track daily metric accumulations.
- **LocalStorage Persistence:** Retains user metrics and configurations automatically across browser tabs and system reloads.
- **Interactive Component Removals:** Instantly clear items from calculations using smooth layout transitions.
- **Async Database Ingestion Engine:** Simulates remote lookups with placeholder API queries using `async/await` to auto-fill meal data.
- **Responsive Layout:** Adaptive cross-platform styling handled using utility classes from Tailwind CSS.

##  Repository File Structure

```text
├── index.html     # Application page layout and structural configuration
├── styles.css     # Layer overrides and animation specifications
├── script.js     # Core application engine, data synchronization, and state management
└── README.md      # Configuration instructions and repository summary
