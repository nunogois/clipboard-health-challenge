## Challenge

<!-- please don't remove the following line-->

version: v1.3

The context for this challenge is that you work at a company that powers a marketplace app for healthcare facilities to hire healthcare professionals (a.k.a. workers).

Your role is that of a senior software engineer in charge of the open-shift backend service. This service stores information on the `Shift`, `Facility`, `Worker`, `Document`, `FacilityRequirement`, and `DocumentWorker` entities.

Your task is to complete the following User Story: As a worker, I want to get all available shifts across all active facilities where I'm eligible to work.

### Acceptance Criteria

For a Worker to be eligible for a facility's shift:

- The `Facility` must be active
- The `Shift` must be active (i.e., not deleted)
- The `Worker` must be active
- The `Shift` must not be claimed by someone else
- The `Worker` must have all of the facility's required documents
- The professions between the `Shift` and `Worker` must match

We provide a PostgreSQL database and a seed file. It is random such that:

- Some `Shifts` are claimed
- Some `Workers` are inactive
- Some `Facilities` are inactive
- Some `Workers` don't have all of a facility's required documents

## Challenge expectations

Provide a RESTful HTTP server (or another interchange format if you think it's a better match) with the following:

- Risk mitigation through proper testing
- Proper error handling and logging
- A brief writeup on how you would improve the performance of the endpoint with a justification of why it would perform better than your submission
- (Bonus) Measure the performance of your endpoint and provide a brief report in a `PERFORMANCE.md` file

## Seeding your database

We provide a folder called `seed`, which contains a `docker-compose.yaml` file that helps you set up a database. It is a PostgreSQL database seeded with about 2 million records.

To set it up, go into the `seed` folder and execute the command `docker compose up --build`. Once seeded, do not stop `docker-compose`. Keep the database running and use your framework of choice to connect to it using the database URL `postgres://postgres:postgres@localhost:5432/postgres`.

The seed script inserts a lot of workers. Among those workers, three fulfill all document requirements; they all have one of the professions. The seed script prints their IDs and professions at the end so you can verify them against your query.

## Submission

Please submit your solution by creating a pull request (PR) on this repository. **Do not merge your PR**. Instead, please return to your Hatchways assessment page to confirm your submission.
