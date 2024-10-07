const { default: mongoose } = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  resumeid: String,
  fullName: String,
  dob: String,
  address: String,
  nationality: String,
  languages: String,
  linkedin: String,
});

const workExperienceSchema = new mongoose.Schema({
  resumeid: { type: String, required: true, unique: true },
  work: [
    {
      jobTitle: String,
      companyName: String,
      jobDuration: String,
      jobDescription: String,
    },
  ],
});

const educations = new mongoose.Schema({
  institutionName: String,
  degree: String,
  startYear: String,
  endYear: String,
});

const educationSchema = new mongoose.Schema({
  resumeid: {
    type: String,
    required: true,
    unique: true,
  },
  education: [educations],
});

const skillsSchema = new mongoose.Schema({
  resumeid: {
    type: String,
    required: true,
    unique: true,
  },
  skills: [
    {
      name: String,
      level: String,
    },
  ],
});

const projectSchema = new mongoose.Schema({
  resumeid: {
    type: String,
    required: true,
    unique: true,
  },
  projects: [
    {
      title: String,
      description: String,
      technologies: String,
      link: String,
      duration: String,
    },
  ],
});

const contactSchema = new mongoose.Schema({
  resumeid: String,
  email: String,
  phone: String,
});

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);
const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);
const Education = mongoose.model("Education", educationSchema);
const Skills = mongoose.model("Skills", skillsSchema);
const Project = mongoose.model("Project", projectSchema);
const Contact = mongoose.model("Contact", contactSchema);

module.exports = {
  PersonalInfo,
  WorkExperience,
  Education,
  Skills,
  Project,
  Contact,
};
