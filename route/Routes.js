const express = require("express");
const {
  PersonalInfo,
  WorkExperience,
  Education,
  Skills,
  Project,
  Contact,
} = require("./../schema/Schema");
const router = express.Router();

/* want to make something which uniquly identifies someone resume 
   i thought of making an identifier which i will have to be saved in the sessionStorage at the end when i am downloading the resume
   but the problem is how will i distinguish the data i was uploading in the db for a specific resume because there is no auth needed but there should be a distinguisher
   or mybe create a resume id which is available in the system but not visible
*/

// Route to save personal info
router.put("/savePersonalInfo/:resumeId", async (req, res) => {
  const { resumeId } = req.params;

  try {
    // Check if the resume already exists
    let personalInfo = await PersonalInfo.findOne({ resumeId });

    if (personalInfo) {
      // If it exists, update it
      personalInfo = await PersonalInfo.findOneAndUpdate(
        { resumeId },
        req.body,
        { new: true } // Return the updated document
      );
    } else {
      // If it doesn't exist, create a new record
      personalInfo = new PersonalInfo({ resumeId, ...req.body });
      await personalInfo.save();
    }

    res
      .status(200)
      .json({ message: "Personal info saved successfully", personalInfo });
  } catch (err) {
    console.error("Error saving/updating personal info:", err);
    res.status(500).send({ error: "Failed to save personal info" });
  }
});

// Route to save work experience
router.put("/saveWorkExperience/:resumeid", async (req, res) => {
  const { resumeid } = req.params;
  const { work } = req.body; // Assuming 'work' is an array

  console.log("Request body for saving work experience:", req.body);

  try {
    // Update or create work experience entries
    await WorkExperience.updateOne(
      { resumeid },
      { $set: { work } }, // Make sure your schema matches
      { upsert: true } // Create if not exists
    );

    res
      .status(200)
      .json({ message: "Work experience data saved successfully!" });
  } catch (error) {
    console.error("Error saving work experience data:", error);
    res.status(500).json({ message: "Failed to save work experience data." });
  }
});

// Route to save education
router.put("/saveEducation/:resumeid", async (req, res) => {
  const { resumeid } = req.params;
  const { education } = req.body;

  try {
    // Example: Update or create education entries
    await Education.updateOne(
      { resumeid },
      { $set: { education } }, // Make sure your schema matches
      { upsert: true } // Create if not exists
    );
    res.status(200).json({ message: "Education data saved successfully!" });
  } catch (error) {
    console.error("Error saving education data:", error);
    res.status(500).json({ message: "Failed to save education data." });
  }
});

// Route to save skills
router.put("/saveSkills/:resumeid", async (req, res) => {
  const { resumeid } = req.params;
  const { skills } = req.body;

  try {
    // If they exist, update them
    await Skills.updateOne(
      { resumeid },
      { $set: { skills } }, // Make sure your schema matches
      { upsert: true }
    );
    res.status(200).json({ message: "Skills updated successfully", skills });
  } catch (err) {
    console.error("Error saving/updating skills:", err);
    res.status(500).send({ error: "Failed to save or update skills" });
  }
});
// Route to save project
router.put("/saveProjects/:resumeid", (req, res) => {
  const { resumeid } = req.params;
  const { projects } = req.body;

  if (!projects || !Array.isArray(projects)) {
    return res
      .status(400)
      .json({ message: "Projects data is missing or not in array format" });
  }

  // Update the projects in the database
  Project.updateOne(
    { resumeid: resumeid },
    { $set: { projects: projects } }, // Set the projects array in the document
    { upsert: true } // Insert the document if it doesn't exist
  )
    .then(() => {
      res.json({ message: "Projects updated successfully" });
    })
    .catch((error) => {
      console.error("Error saving projects:", error);
      res.status(500).json({ message: "Error saving projects" });
    });
});

// Route to save contact
router.put("/saveContact/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    // Check if contact info for this resumeid exists
    let contact = await Contact.findOne({ resumeid });

    if (contact) {
      // If it exists, update it
      contact = await Contact.findOneAndUpdate(
        { resumeid },
        req.body,
        { new: true } // Return the updated document
      );
      res
        .status(200)
        .json({ message: "Contact updated successfully", contact });
    } else {
      // If it doesn't exist, create a new contact entry
      const newContact = new Contact({
        resumeid,
        ...req.body,
      });
      await newContact.save();
      res
        .status(201)
        .json({ message: "Contact created successfully", newContact });
    }
  } catch (err) {
    console.error("Error saving/updating contact:", err);
    res.status(500).send({ error: "Failed to save or update contact" });
  }
});

// get info
// Route to get personal info
// Route to get personal info by resumeid
router.get("/getPersonalInfo/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const personalInfo = await PersonalInfo.findOne({ resumeid });

    if (!personalInfo) {
      return res.status(404).json({ error: "Personal info not found" });
    }

    res.status(200).json(personalInfo);
  } catch (err) {
    console.error("Error retrieving personal info:", err);
    res.status(500).send({ error: "Failed to retrieve personal info" });
  }
});

// Route to get education
// Route to get education by resumeid
router.get("/getEducation/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const educationData = await Education.findOne({ resumeid });

    if (!educationData) {
      return res
        .status(404)
        .json({ message: "No education data found for this resume ID." });
    }

    res.status(200).json(educationData);
  } catch (error) {
    console.error("Error retrieving education data:", error);
    res.status(500).json({ message: "Failed to retrieve education data." });
  }
});
// Route to get work experience

router.get("/getWorkExperience/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const work = await WorkExperience.findOne({ resumeid });

    if (!work) {
      return res
        .status(404)
        .json({ message: "No work experience found for this resume ID." });
    }

    res.status(200).json({ work });
  } catch (error) {
    console.error("Error retrieving work experience:", error);
    res.status(500).json({ message: "Failed to retrieve work experience." });
  }
});

// Route to get skills
// Route to get skills by resumeid
router.get("/getSkills/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const skills = await Skills.findOne({ resumeid });

    if (!skills) {
      return res.status(404).json({ error: "Skills not found" });
    }

    res.status(200).json(skills);
  } catch (err) {
    console.error("Error retrieving skills:", err);
    res.status(500).send({ error: "Failed to retrieve skills" });
  }
});

// Route to get projects
// Route to get projects by resumeid
router.get("/getProjects/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const projects = await Project.findOne({ resumeid });

    if (!projects) {
      return res.status(404).json({ error: "Projects not found" });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error retrieving projects:", err);
    res.status(500).send({ error: "Failed to retrieve projects" });
  }
});

// Route to get contact info
// Route to get contact info by resumeid
router.get("/getContact/:resumeid", async (req, res) => {
  const { resumeid } = req.params;

  try {
    const contactInfo = await Contact.findOne({ resumeid });

    if (!contactInfo) {
      return res.status(404).json({ error: "Contact info not found" });
    }

    res.status(200).json(contactInfo);
  } catch (err) {
    console.error("Error retrieving contact info:", err);
    res.status(500).send({ error: "Failed to retrieve contact info" });
  }
});

// route for a specific id
router.get(`/getResume/:resumeid`, async (req, res) => {
  const { resumeid } = req.params;

  try {
    const personalInfo = await PersonalInfo.findOne({ resumeid });
    const education = await Education.find({ resumeid }); // Array of education
    const workExperience = await WorkExperience.find({ resumeid });
    const skills = await Skills.find({ resumeid }); // Array of skills
    const projects = await Project.find({ resumeid });
    const contact = await Contact.findOne({ resumeid });

    if (!personalInfo) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({
      personalInfo,
      education, // Make sure this is an array
      workExperience,
      skills, // Skills array
      projects,
      contact,
    });
  } catch (err) {
    console.error("Error retrieving all information:", err);
    res.status(500).send({ error: "Failed to retrieve all information" });
  }
});

module.exports = router;
