import express from "express";
import multer from "multer";
import Person from "../Models/Person.js";
import parsePeopleXML from "../Utiles/XMLparser.js";


const router = express.Router();
const upload = multer();

router.get("/",(req,res)=>{
  console.log("working");
  res.send("working");
})

router.post("/upload-xml", upload.single("file"), async (req, res) => {
  try {
    const xmlData = req.file?.buffer.toString();
    if (!xmlData) {
      return res.status(400).json({ message: "No XML file provided" });
    }

    const peopleFromXML = parsePeopleXML(xmlData);

    // Prepare arrays
    const newPeople = [];
    const conflicts = [];

    for (const p of peopleFromXML) {
      const personData = {
        IFId: p.Code,
        givenName: p.GivenName,
        familyName: p.FamilyName,
        gender: p.Gender,
        organisation: p.Organisation,
        birthDate: p.BirthDate
          ? new Date(
              `${p.BirthDate.slice(0, 4)}-${p.BirthDate.slice(4, 6)}-${p.BirthDate.slice(6, 8)}`
            )
          : null,
        email: p.Email || null
      };

     
      if (!personData.givenName || !personData.familyName) {
        console.warn("Invalid record skipped:", p);
        continue;
      }

      const query = [
        { givenName: personData.givenName, familyName: personData.familyName, IFId: personData.IFId }
      ];
      if (personData.email) query.push({ email: personData.email });

      const existing = await Person.findOne({ $or: query });

      if (!existing) {
        newPeople.push(personData); // Add to insert array
      } else {
        conflicts.push({ existing, incoming: personData });
      }
    }

    const insertedDocs = newPeople.length ? await Person.insertMany(newPeople) : [];

    res.json({
      insertedCount: insertedDocs.length,
      conflicts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "XML processing failed" });
  }
});


// POST /api/overwrite
router.post("/overwrite", async (req, res) => {
  try {
    const { personId, newData, overwrite } = req.body;

    if (!overwrite) {
      return res.json({ message: "Overwrite cancelled" });
    }

    const updated = await Person.findByIdAndUpdate(
      personId,
      { $set: newData },
      { new: true }
    );

    res.json({
      message: "Person updated successfully",
      updated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Overwrite failed" });
  }
});

router.get("/viewAll", async (req, res) => {
  try {
    // Fetch all participants from the database
    const allParticipants = await Person.find({});

    // Return them as JSON
    res.json({
      message: "All participants fetched successfully",
      data: allParticipants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch participants" });
  }
});


export default router;
