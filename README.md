🚀 Live Demo
🔗 https://employmentmanagement.netlify.app

🛠️ Tech Stack
Frontend: React.js, React Hook Form
Backend: Node.js, Express.js
Database: MongoDB (Atlas)
UI/UX: Infinite Scroll, Modal Popups, Confirmation Dialogs


✨ Key Highlights
⚡  React Hook Form for optimized form handling and validation
♾️ Infinite Scroll–based pagination for smooth data loading
🪟 Modal popup to view complete employee details
🗑️ Delete confirmation modal to prevent accidental data loss
⏳ Debounced search & sorting for improved performance
🆔 Auto-generated Unique Employee UID using MongoDB counters


🔧 Core Functionalities

Employee Management
➕ Add employees with:
     - Name
     - Email
     - Department
     - Designation
     - Salary
     - Date of Joining
👁️ View employee details in a modal popup
❌ Delete employees with confirmation prompt

✨ Pagination Strategy (Infinite Scrolling)
- This project uses infinite scrolling instead of traditional pagination to load employee data efficiently.
    - Employees are fetched in chunks (pages) from the backend
    - Additional data loads automatically as the user scrolls
    - Prevents loading large datasets at once
    - Improves performance and user experience
- Implemented using a React Infinite Scroll component integrated with backend pagination logic.

🔧 Data Fetching Flow
1. Initial employee data loads on page render
2. Backend returns a limited set of records
3. More employees are fetched automatically when scrolling
4. Stops fetching when no more data is available

🔍 Search & Filter
- Search employees by:
   - Name
   - Email
   - UID
- Debounced input to minimize unnecessary API calls


📊 Sorting Options
- Department-wise sorting
- Designation-wise sorting
- Newest → Oldest / Oldest → Newest employees
- Salary-based sorting
- Alphabetical name sorting

🆔 Unique Employee ID (UID) Generation
Each employee is assigned a custom unique numeric UID (e.g. 2511980001, 2511980002) at the time of creation.
This is implemented using a MongoDB counter collection with a pre('save') middleware to ensure:

- Uniqueness
- Sequential generation
- No race conditions


🗃️ Database Design
- MongoDB schema with:
   - Unique email constraint
   - Enum-based employee status (Active / Inactive)
   - Automatic createdAt & updatedAt timestamps
- Clean separation of employee and counter collections


🎯 Project Objective
- This project demonstrates:
- Real-world CRUD operations
- Optimized UI rendering with infinite scroll
- Scalable backend patterns (custom UID generation)
- Clean, maintainable MERN architecture

📌 Future Enhancements
- Role-based authentication (Admin / HR)
- Employee status toggle (Active / Inactive)
- Export employee data (CSV / Excel)
- Pagination fallback for large datasets
