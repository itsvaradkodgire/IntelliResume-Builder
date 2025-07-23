# IntelliResume Builder

A dynamic resume builder that allows you to create and manage multiple role-specific resumes in a tabbed, document-style interface. Easily tailor your summary, skills, and experience for each job application while keeping your core information consistent.

## Features

- **Tabbed Interface**: Manage multiple resume versions for different job roles.
- **Document-Style Layout**: Clean, professional design inspired by modern word processors.
- **Inline Editing**: Click any field to edit it directly on the resume.
- **Shared & Role-Specific Sections**: Keep common data (like name and education) consistent while customizing sections like Summary and Skills for each role.
- **Dynamic Sections**: Easily add or remove projects, skills, education entries, and certifications.
- **Copy-on-Create**: Start a new role resume by copying content from an existing one or starting fresh.
- **PDF Export**: Generate a clean, print-ready PDF of your resume.

## Getting Started

This project is built with React and TypeScript but requires no complex build setup to run locally. It uses an `importmap` in `index.html` to load dependencies directly from a CDN.

### Prerequisites

You only need a modern web browser and a way to serve the files from a local web server.

### Running the Application

Because web browsers have security restrictions that prevent opening local HTML files that use JavaScript modules (`type="module"`), you need to serve the project folder using a simple local server. Here are two easy ways to do this:

**Option 1: Using Python (If you have Python installed)**

1.  Open your terminal or command prompt.
2.  Navigate to the project's root directory (the folder containing `index.html`).
3.  Run the following command:

    ```bash
    # For Python 3
    python -m http.server
    ```
    or for Python 2:
    ```bash
    # For Python 2
    python -m SimpleHTTPServer
    ```

4.  Open your web browser and go to `http://localhost:8000`.

**Option 2: Using Node.js and `serve`**

1.  Make sure you have [Node.js](https://nodejs.org/) installed.
2.  Open your terminal or command prompt.
3.  Install the `serve` package globally (you only need to do this once):

    ```bash
    npm install -g serve
    ```

4.  Navigate to the project's root directory.
5.  Run the server:

    ```bash
    serve -l 3000
    ```
6. Open your web browser and go to `http://localhost:3000`.


That's it! The IntelliResume Builder application should now be running in your browser.
