# WeekReport

This repository is designed for research groups that want a simple way to collect, store, and display weekly reports in a centralized and browser-accessible interface.

## Overview

WeekReport provides a minimal full-stack workflow for weekly reporting:

- a **static frontend** for viewing the current week's submissions and sending new reports;
- a **database schema** for member management and weekly report storage;
- a **server-side submission function** for controlled write access;
- a **public read path** for displaying weekly reports on the page.

The project is intentionally lightweight and easy to deploy, making it suitable for internal academic groups, labs, student teams, or other small collaborative settings.

## Repository Purpose

The purpose of this repository is to host the code and database definitions for a weekly report portal, including:

- project page structure and UI;
- frontend submission and data-loading logic;
- database table definitions and access rules;
- serverless submission workflow.

This repository focuses on **system structure and implementation**, rather than storing operational secrets or environment-specific deployment details.

## Project Structure

```text
.
├── index.html            # Main page structure and UI entry
├── style.css             # Frontend styles
├── app.js                # Frontend logic for loading and submitting reports
└── config.js             # Runtime configuration placeholder for frontend integration
```

## Core Components

### 1. Frontend

The frontend is a static webpage that allows users to:

- open the weekly report portal;
- view the current week's submitted reports;
- fill in a report form;
- submit a report through a backend function.

The frontend is intentionally simple and can be deployed through any static hosting workflow.

### 2. Database

The database layer defines two main entities:

- **members**: stores the list of allowed members;
- **weekly_reports**: stores one weekly report per member per week.

The schema also includes:

- a uniqueness constraint to ensure one report per member per week;
- an automatic timestamp update mechanism;
- read-access configuration for report display.

### 3. Submission Function

The serverless submission function is responsible for:

- receiving report submissions from the frontend;
- validating the request;
- checking whether the member is allowed to submit;
- computing the current reporting week;
- creating or updating the member's report for that week.

This keeps write operations on the server side and separates public viewing from controlled submission.

## How the System Works

The typical workflow is:

1. A user opens the frontend page.
2. The page loads the reports for the current week.
3. The user fills in the submission form.
4. The frontend sends the report to the backend submission function.
5. The backend validates the request and writes the data into the weekly report table.
6. The frontend refreshes the visible weekly report list.

## Data Model Summary

### Members

Represents the set of people who are allowed to participate in the reporting process.

Typical fields include:

- unique member identity by name;
- enable/disable status;
- creation timestamp.

### Weekly Reports

Represents the actual submitted weekly content.

Typical fields include:

- member reference;
- reporting week start date;
- report content;
- creation and update timestamps.


## License / Usage

You may adapt this repository structure for your own internal reporting workflow, with appropriate review of deployment, security, and access-control settings for your environment.
