Act as a Senior Full Stack Engineer and System Architect. I need you to scaffold a web application called "E-Com Auto-Lister" tailored for the Indonesian market.

**1. Project Goal:**
A web app where online sellers upload a product photo, and an AI analyzes it to generate a sales-optimized Title, Description, and Hashtags (for Shopee/Tokopedia) in Bahasa Indonesia. The user can then save this listing to a database.

**2. Tech Stack Requirements (Strict):**
* **Architecture:** Monorepo (Frontend and Backend in one). Use **Next.js 15 (App Router)**.
* **Language:** TypeScript.
* **Styling:** Tailwind CSS (Mobile-first design).
* **Database:** PostgreSQL.
* **Infrastructure:** The Database MUST run inside a Docker container via `docker-compose.yml`.
* **ORM:** Use **Prisma** (or Drizzle) for database interaction.
* **AI Integration:** Create a backend API route that simulates (or connects to) Google Gemini API to process images and return JSON.

**3. Database Schema (PostgreSQL):**
Please design a schema with at least this table:
* `Listing`: id (uuid), imageUrl (text), generatedTitle (text), generatedDescription (text), platform (enum: Shopee, Tokopedia, TikTok), createdAt (timestamp).

**4. Deliverables:**
Please provide the following code blocks and instructions:
1.  **`docker-compose.yml`**: To spin up the PostgreSQL database and a generic PGAdmin container.
2.  **`schema.prisma`**: The data model.
3.  **`.env.example`**: The required environment variables.
4.  **`app/api/generate/route.ts`**: The backend logic that accepts an image (Base64 or FormData), constructs a prompt for the AI to "Generate Indonesian sales copy," and returns the result.
5.  **`components/ListingGenerator.tsx`**: A client component for file upload and displaying the result.

**Constraint:**
Focus on code correctness. Ensure the `docker-compose` setup handles the standard Postgres ports and environment variables correctly.