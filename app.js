const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 4000
app.use(express.json());

// Create Subject API
app.post('/api/v1/hod/subject', async (req, res) => {
  try {
    const { subject_name, category, sub_category, discipline, level, subject } = req.body;
    const newSubject = await prisma.subject.create({
      data: {
        description: subject_name,
        subjectMaster: {
          create: {
            category,
            subCategory: sub_category,
            dicipline: discipline,
            level,
            subName: subject,
          },
        },
      },
    });

    res.json({ sts: true, msg: 'Subject added' });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ sts: false, msg: 'Failed to create subject' });
  }
});

// Get Subject API
app.get('/api/v1/hod/subject', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        subjectMaster: true,
      },
    });

    res.json({ sts: true, data: { count: subjects.length, results: subjects } });
  } catch (error) {
    console.error('Error getting subjects:', error);
    res.status(500).json({ sts: false, msg: 'Failed to get subjects' });
  }
});

// Delete Subject API
app.delete('/api/v1/hod/group/subject', async (req, res) => {
  try {
    const { subject_ids } = req.body;

        // Check if subjects are active before deleting
        const activeSubjects = await prisma.subject.findMany({
          where: {
            id: {
              in: subject_ids,
            },
            status: true, 
          },
        });
    
        if (activeSubjects.length > 0) {
          return res.json({ sts: false, msg: "Can't delete active subjects" });
        }

    await prisma.subject.deleteMany({
      where: {
        id: {
          in: subject_ids,
        },
      },
    });

    res.json({ sts: true, msg: 'Subjects deleted' });
  } catch (error) {
    console.error('Error deleting subjects:', error);
    res.status(500).json({ sts: false, msg: 'Failed to delete subjects' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//POST :
//https://api.iqlabsacademy.com/424f_0659/api/v1/hod/subject/
//{
//   "subject_name": "Math 2",
//   "category": "DEG",
//   "sub_category": "ENG",
//   "discipline": "CS",
//   "level": "002",
//   "subject": "SOM"
// }

//GET
//https://api.iqlabsacademy.com/424f_0659/api/v1/hod/subject/.


//DELETE
//https://api.iqlabsacademy.com/424f_0659/api/v1/hod/group/subject/
// {
//   "subject_ids": ["656c2438e6c10b997d06c0e3"]
// }
