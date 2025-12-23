# XML Participant Import System

This project is a full-stack application that allows uploading an XML file, parsing participant data, storing it in MongoDB, and handling duplicate records with an overwrite confirmation flow.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file upload)
- XML parser

### Frontend
- React (Vite)
- Plain CSS
- Fetch API

---

## Features

- Upload XML files (`.xml` only)
- Parse participant data from XML
- Insert new participants into MongoDB
- Detect duplicate records
- Ask user confirmation before overwriting existing data
- Overwrite or skip existing records
- Upload progress indicator & status messages
- Summary of inserted and conflicting records
- Modal-based overwrite confirmation

---

## Expected XML Format

```xml
<OdfBody>
  <Competition>
    <Participant
      Code="100771"
      GivenName="Jeong Yeol"
      FamilyName="YU"
      Gender="M"
      Organisation="KOR"
      BirthDate="19741228"
    />
  </Competition>
</OdfBody>
```

---

## Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/xmlParticipants
   PORT=5000
   ```

4. Start server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   node index.js
   ```

---

## Backend API Endpoints

### Upload XML
```
POST /upload-xml
```

Form Data:
- `file` → XML file

Response:
```json
{
  "insertedCount": 2,
  "conflicts": []
}
```

---

### Overwrite Existing Record
```
POST /overwrite
```

Body:
```json
{
  "personId": "65f123...",
  "newData": { ... },
  "overwrite": true
}
```

---

### View All Records
```
GET /viewAll
```

---

## Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start app:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

---

## Frontend Functionality

- File input accepts only XML files
- Upload button sends XML to backend
- Progress bar during upload
- Status messages (uploading / processing / success)
- Upload summary displayed
- Overwrite confirmation modal appears for duplicates
- User can confirm or cancel overwrite

---

## Duplicate Handling Logic

A participant is considered **duplicate** if:
- Same `IFId`
- Same `GivenName` + `FamilyName`

---

## Project Structure

### Backend
```
backend/
│── index.js
│── routes/
│   └── uploadRoutes.js
│── models/
│   └── Person.js
│── utils/
│   └── XMLparser.js
```

### Frontend
```
frontend/
│── src/
│   ├── App.jsx
│   ├── components/
│   │   └── OverwriteModal.jsx
│   └── index.css
```

---



## Author

Developed as a full-stack XML data import system using  
**Node.js, MongoDB, Express, and React**.
