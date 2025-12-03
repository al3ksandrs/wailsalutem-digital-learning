# Software Requirements Specification (SRS)
**Project Name:** LeerMatch
**Version:** 6.0

## 1. Introduction
**1.1 Purpose**
The purpose of the LeerMatch system is to facilitate academic connections between students/parents and teachers. The platform utilizes a hybrid matching system (Algorithmic Tags + LLM Semantic Analysis) to pair users effectively.

The scheduling logic is designed primarily for **one-off appointments**, with the technical possibility to extend these into recurring weekly meetings based on **Microsoft Teams planning functions**.

**1.2 Scope & Safety Priority**
The system prioritizes **child safety**. Consequently, the Teacher workflow includes a mandatory "Holding State" where an Administrator must verify the user before they are granted access to student data or communication tools. The Administrator holds absolute authority ("God Mode") over all system data and connections.

*   **Design Reference:** All wireflows and visual hierarchy details are located in the [Project Figma](https://www.figma.com/design/ELI2vvbAyvQdbZh6M9sQqM/Wail-Salutem-Design?node-id=0-1&p=f&t=H23ITwqDcjI4iMrU-0).
*   **Documentation:** Full project requirements are maintained on the Project Wiki.

---

## 2. Actors and User Roles
1.  **Student / Parent:**
    *   Can be a parent registering a Primary School child.
    *   Can be a Student in High School (HAVO/VWO) or Higher Education (HBO/Uni).
    *   *Need:* Immediate access to post help requests.
2.  **Teacher:** The service provider.
    *   **Unverified Teacher:** Registered but pending Admin approval. Has **zero** access to data.
    *   **Approved Teacher:** Approved by Admin for access, but provided no CV. Can match and teach, but has no badge.
    *   **Verified Teacher (Badged):** Approved by Admin **AND** has submitted a valid CV. Has a "Verified" badge to increase trust.
3.  **Administrator:** The super-user with full CRUD (Create, Read, Update, Delete) rights over users, connections, and content.

---

## 3. Functional Requirements (FR)

### 3.1. Authentication & Registration
*   **FR-01 Unified Login:**
    *   Email/Password authentication.
    *   "Forgot Password" recovery flow.
    *   Toggle between "Login" and "Register" modes.
*   **FR-02 Student Registration (Dynamic Profile):**
    *   **Step 1:** Credentials (Name, Email, Password).
    *   **Step 2: Education Level Logic:** The system shall adapt the form based on the selected Level:
        *   *If Primary School:* Hide "Year" and "Profile" fields.
        *   *If High School (VMBO/HAVO/VWO/Gymnasium):* Show "Year" (1-6) and "Profile" dropdowns (C&M, N&T, etc.).
        *   *If Higher Education (MBO/HBO/WO):* Replace "Profile" dropdown with a **Free-Text/Tag Field** for "Study Name/Major" (since these are not fixed).
    *   **Step 3:** Subject Needs.
*   **FR-03 Teacher Registration (Optional CV):**
    *   **Step 1-3:** Credentials, Expertise (Level/Institution), Subjects Taught (Multi-select + Custom entry).
    *   **Step 4:** Bio & CV Upload.
    *   **CV Constraint:** Upload is **Optional**.
    *   **Note to User:** UI must state "Upload a CV to earn a Verified Badge."
    *   **File Handling:** System must allow deleting/replacing the file before submission.
*   **FR-04 Teacher Verification State:**
    *   Upon completing registration, the Teacher account is set to **"Pending."**
    *   If a "Pending" Teacher logs in, they see a status screen ("Awaiting Approval") and **cannot** access the main dashboard.
*   **FR-05 Self-Service Profile Updates:**
    *   Users can edit their own Profile (Level, Year, Subjects, Bio) at any time.
    *   **Constraint:** Updates do not trigger re-approval, *unless* a Teacher modifies their CV (which flags the account for Admin review).

### 3.2. Administrator Dashboard ("God Mode")
*   **FR-06 Teacher Access Control:**
    *   Admins view the "Pending Teachers" queue.
    *   **Decision 1 (Access):** Admin can "Approve Access" (allow login) or "Reject" (ban). This is independent of the CV.
    *   **Decision 2 (Badge):** If a CV is present, Admin can toggle the **"Verified Badge"** status on.
    *   *Constraint:* Only Teachers can receive badges.
*   **FR-07 Absolute User Management:**
    *   Admins can Edit, Ban, or Delete *any* user account immediately.
    *   Banning a user must instantly invalidate their session (force logout).
*   **FR-08 Connection Override:**
    *   Admins can view all open Help Requests.
    *   Admins can **Force Match** a specific Teacher to a Student request.
    *   Admins can **Terminate** an existing connection/match manually.
*   **FR-09 Chat Moderation:**
    *   Admins have access to chat logs to investigate safety disputes.
*   **FR-10 System Analytics:**
    *   View metrics on total users, active matches, and completed sessions.

### 3.3. Student / Parent Features
*   **FR-11 Dashboard:** Displays counts for Pending Requests, Matches, and Connections.
*   **FR-12 Create Help Request:**
    *   Modal form collecting: Subject, Education Level, Location, Description.
    *   **Education Logic:** If Student Profile is "Primary School," the request form hides the "Year" field.
    *   **Availability Input:** Day toggles + Time Range Sliders.
*   **FR-13 Manage Requests:**
    *   Edit existing request details or Delete requests.
*   **FR-14 Match Interaction:**
    *   View algorithmic matches (Teacher Cards with Star Rating/Bio).
    *   "Connect" or "Accept" a match.
*   **FR-15 Review System:**
    *   **Review Modal:** A pop-up dialog that interrupts the user flow specifically for rating a Teacher (1-5 Stars + Text) after a session loop.
    *   **Notification Center:** A distinct list (Bell icon) for system alerts (e.g., "Request Accepted").

### 3.4. Teacher Features (Approved Only)
*   **FR-16 Verified Badge:**
    *   If the Admin has enabled the Badge, it must appear on the Teacher's Profile Card, Chat interface, and Search Results.
*   **FR-17 Dashboard:** Displays Help Requests, Potential Matches, and Active Student Roster.
*   **FR-18 Manage Availability (Scheduling):**
    *   Interface to select Days of Week.
    *   Dual-handle sliders to define specific "Available Hours."
    *   *Context:* Availability allows for one-off appointments, with logic supporting recurring patterns (mimicking MS Teams planning).
*   **FR-19 Handle Requests:**
    *   View detailed incoming requests.
    *   **Action:** "Accept" or "Decline" buttons.
    *   Accepting updates the Calendar and opens the Chat.
*   **FR-20 Student Roster:**
    *   View list of active students with quick links to Profile and Chat.

### 3.5. Communication
*   **FR-21 Real-Time Chat:**
    *   1-to-1 messaging between connected users.
    *   **Media Sharing:** Upload images (homework/notes) directly in chat.
*   **FR-22 Calendar:**
    *   Weekly view showing confirmed sessions as colored blocks.
    *   Clicking a block shows "Meeting Details."
    *   Visual distinction between "Available Slots" and "Booked Sessions."

---

## 4. Non-Functional Requirements (NFR)

### 4.1. Security & Privacy
*   **NFR-01 Security Gate:** The architecture must enforce that `role: teacher` + `status: pending` = **No API Access** to student data.
*   **NFR-02 CV Protection:** Teacher CVs are viewable **only** by Administrators and the uploading Teacher. They are never exposed to Students.
*   **NFR-03 Malware Scanning:** All file uploads (CVs, Chat Images) must be scanned before storage.

### 4.2. User Interface (UI/UX)
*   **NFR-04 Localization:** The system defaults to Dutch educational terminology (HAVO, VWO, Gymnasium, etc.).
*   **NFR-05 Feedback Loops:** Critical actions (Accept/Decline) must provide immediate visual feedback (button state change) to prevent double-clicks.
*   **NFR-06 Notification Visibility:** New Matches and Reviews must trigger prominent modals (pop-ups), whereas status updates trigger standard notifications.
*   **NFR-07 Dynamic Forms:** Registration and Edit forms must use conditional rendering (Show/Hide fields) to handle the complexity of the Dutch education system without cluttering the UI.

### 4.3. Performance
*   **NFR-08 Chat Latency:** Messages should be delivered in under 2 seconds.
*   **NFR-09 Image Optimization:** Images shared in chat should be compressed for speed but maintain high enough resolution to read handwriting.

---

## 5. System Logic & AI Integration
*   **SL-01 Hybrid Matching Algorithm:**
    *   **Layer 1 (Hard Filters):** The system filters matches based on strict criteria: *Availability Overlap* AND *Subject Match*.
    *   **Layer 2 (LLM Enhancement):** The system shall utilize a Large Language Model (LLM) to calculate a **"Compatibility Score."**
        *   *Input A:* Student's Help Request Description (e.g., "I struggle with algebra word problems").
        *   *Input B:* Teacher's Bio/Experience (e.g., "I specialize in making math stories understandable").
        *   *Process:* The LLM compares semantic meaning to suggest the best "Soft Skill" match.
*   **SL-02 Ranking Logic:**
    *   Results are displayed to the Student ranked by:
        1.  **Verified Badge Status** (Badged teachers appear higher).
        2.  **LLM Compatibility Score**.
        3.  **Star Rating**.