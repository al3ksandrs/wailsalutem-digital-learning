# Technology Stack

## Dev tools
- **Vite**
- **NPM** for package management
- **Monorepo setup** (client and server code in one repository)

## Frontend
- **React** with **TypeScript**
- **Bulma** + **Vanilla CSS** for styling

## Backend
- **Fastify** (Node.js) (also uses TypeScript)
- **PostgreSQL** for database
- **Redis** (if caching is required)

## Hosting
- **VPSs** provided by Rachid for both frontend and server (and services like the database)

## AI (Used for enhanced matching)
- **API** from Gemini, OpenAI, or Anthropic
- Possibility for **Local LLM** connection

## Testing
- **Jest** and **RTL** (React Testing Library) for unit tests
- **Cypress** for E2E tests

## CI/CD
- **GitHub Actions**
- Separate **prod/dev environments**
- **SonarQube** for static code analysis
- **Version control:** GitHub

---

## Why we chose this
We chose this stack because it provides ease of development, it can be easily expanded, and it is used a lot in the industry, which will be helpful for us to have experience later when we graduate.

*   **Vite:** Vite is a popular development framework that will ease our development by allowing live editing, use of web workers if needed, and providing other useful features.

*   **Frontend:** This will be done with a **React + TypeScript** combination because React is easy to use and widely used in the industry. TypeScript allows better teamwork due to Types and error reporting before runtime.

*   **Backend:** We chose **Fastify**, a Node.js framework that focuses on providing the best developer experience by being easy to use and very fast. We can also use TypeScript here, which enables the monorepo setup even more.

*   **Database:** We will be using **PostgreSQL**. This is what we are most familiar with.

*   **Hosting:** Initially we wanted to use Vercel or Render for hosting, but our product owner (Rachid) will provide us with VPSs to use.

*   **AI:** One of the requirements is to use an LLM to enhance algorithmic matching; for this, we will use an API endpoint provided by one of the AI companies we have yet to determine. Local LLM connections should also be possible, as stated by our product owner.

*   **Testing:** This is another important part of the product. For user tests, we will use **Jest** and **React Testing Library**, since these are the two easiest to use and most popular tools in the industry for our tech stack. **Cypress** will be used for End-to-End tests, due to the team having experience in this already. All these tests will also be automatically run in the CI/CD pipeline.

*   **CI/CD:** This will be done by using **GitHub Actions**, since the repository is on GitHub. We also use a separate production/development environment when we work with Git, as we learned before starting this project.

*   **SonarQube:** We will use SonarCloud for static code analysis in the CI/CD pipeline, which we also learned before starting the project.