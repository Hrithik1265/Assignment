const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();


app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.json({Welcome: 'Connected to port' })
  })

// Get all users
app.get('/user', async (req, res) => {
  const users = await prisma.User.findMany();
  res.json(users);
});

// Get a single user by ID
app.get('/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.User.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Create a new user
app.post('/user', async (req, res) => {
  const { name, type } = req.body;

  const newUser = await prisma.User.create({
    data: { name, type },
  });

  res.json(newUser);
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, type } = req.body;

  const updatedUser = await prisma.User.update({
    where: { id: userId },
    data: { name, type },
  });

  res.json(updatedUser);
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  const deletedUser = await prisma.User.delete({
    where: { id: userId },
  });

  res.json(deletedUser);
});


// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
    const { role } = req.user; // Assuming role is part of the authenticated user object
  
    if (role === 'Teacher') {
      next(); // If the role is 'Teacher', continue to the next middleware/route handler
    } else {
      res.status(403).json({ error: 'Only teachers are allowed to perform this action' });
    }
  };
  
  // Example middleware to mock user authentication
  app.use((req, res, next) => {
    // Simulating user authentication, assigning a role to req.user
    req.user = {
      role: 'Teacher' // Change this to 'Teacher' to grant access
    };
    next();
  });

  // Get all tests with associated questions
app.get('/testquestion', isTeacher, async (req, res) => {
    const testsWithQuestions = await prisma.Test.findMany({
      include: {
        question: true,
      },
    });
    res.json(testsWithQuestions);
  });
  

// Create a new test
app.post('/test', isTeacher, async (req, res) => {
  const { subject, grade, type, totalMarks } = req.body;

  const newTest = await prisma.Test.create({
    data: { subject, grade, type, totalMarks },
  });

  res.json(newTest);
});

// Update a test by ID
app.put('/test/:id', isTeacher, async (req, res) => {
  const testId = parseInt(req.params.id);
  const { subject, grade, type, totalMarks } = req.body;

  const updatedTest = await prisma.Test.update({
    where: { id: testId },
    data: { subject, grade, type, totalMarks },
  });

  res.json(updatedTest);
});

// Get all tests
app.get('/test', isTeacher, async (req, res) => {
  const tests = await prisma.Test.findMany();
  res.json(tests);
});

// Get a single test by ID
app.get('/test/:id', isTeacher, async (req, res) => {
  const testId = parseInt(req.params.id);
  const test = await prisma.Test.findUnique({
    where: { id: testId },
  });

  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }

  res.json(test);
});

// Delete a test by ID
app.delete('/test/:id', isTeacher, async (req, res) => {
  const testId = parseInt(req.params.id);

  const deletedTest = await prisma.Test.delete({
    where: { id: testId },
  });

  res.json(deletedTest);
});

// Create a new Question
app.post('/question', isTeacher, async (req, res) => {
    const { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks } = req.body;
  
    const newquestion = await prisma.Question.create({
      data: { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks },
    });
  
    res.json(newquestion);
  });
  
  // Update a question by ID
  app.put('/question/:id', isTeacher, async (req, res) => {
    const questionId = parseInt(req.params.id);
    const { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks } = req.body;
  
    const updatedquestion = await prisma.Question.update({
      where: { id: questionId },
      data: { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks },
    });
  
    res.json(updatedquestion);
  });
  
  // Get all questions
  app.get('/question', isTeacher, async (req, res) => {
    const questions = await prisma.Question.findMany();
    res.json(questions);
  });
  
  // Get a single question by ID
  app.get('/question/:id', isTeacher, async (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = await prisma.Question.findUnique({
      where: { id: questionId },
    });
  
    if (!question) {
      return res.status(404).json({ error: 'question not found' });
    }
  
    res.json(question);
  });
  
  // Delete a question by ID
  app.delete('/question/:id', isTeacher, async (req, res) => {
    const questionId = parseInt(req.params.id);
  
    const deletedquestion = await prisma.Question.delete({
      where: { id: questionId },
    });
  
    res.json(deletedquestion);
  });
 

// Assign a question to a test
// app.post('/test/:testId/assign-question/:questionId', isTeacher, async (req, res) => {
//   const { testId, questionId } = req.params;

//   try {
//     const test = await prisma.Test.findUnique({
//       where: { id: parseInt(testId) },
//     });

//     if (!test) {
//       return res.status(404).json({ error: 'Test not found' });
//     }

//     const question = await prisma.Question.findUnique({
//       where: { id: questionId },
//     });

//     if (!question) {
//       return res.status(404).json({ error: 'Question not found' });
//     }

//     const updatedTest = await prisma.Test.update({
//       where: { id: parseInt(testId) },
//       data: {
//         questions: {
//           connect: { id: questionId },
//         },
//       },
//     });

//     res.json(updatedTest);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Assign a question to a test
app.post('/test/:testId/assign-question/:questionId', isTeacher, async (req, res) => {
  const { testId, questionId } = req.params;

  try {
    const test = await prisma.Test.findUnique({
      where: { id: parseInt(testId) },
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const question = await prisma.Question.findUnique({
      where: { id: parseInt(questionId) }, // Parse questionId to an integer
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const updatedTest = await prisma.Test.update({
      where: { id: parseInt(testId) },
      data: {
        question: {
          connect: { id: parseInt(questionId) }, // Parse questionId to an integer
        },
      },
    });

    res.json(updatedTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Get all StudentTestAssignment
  app.get('/sta', isTeacher, async (req, res) => {
    const sta = await prisma.StudentTestAssignment.findMany();
    res.json(sta);
  });

  // Get a single StudentTestAssignment by ID
app.get('/sta/:id', isTeacher, async (req, res) => {
  const staId = parseInt(req.params.id);
  const sta = await prisma.StudentTestAssignment.findUnique({
    where: { id: staId },
  });

  if (!sta) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(sta);
});

// Create a new StudentTestAssignment
app.post('/sta', isTeacher, async (req, res) => {
  const {  studentId, testId } = req.body;

  const newsta = await prisma.StudentTestAssignment.create({
    data: { studentId, testId },
  });

  res.json(newsta);
});

// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
  const { role } = req.user; // Assuming role is part of the authenticated user object

  if (role === 'Student') {
    next(); // If the role is 'Teacher', continue to the next middleware/route handler
  } else {
    res.status(403).json({ error: 'Only Student are allowed to perform this action' });
  }
};

// Create a new StudentTestResult
app.post('/str', isStudent, async (req, res) => {
  const { testId, totalMarks, scoredMarks } = req.body;

  const newstr = await prisma.StudentTestResult.create({
    data: { testId, totalMarks, scoredMarks },
  });

  res.json(newstr);
});

  // Update a StudentTestResult by ID
  app.put('/qr/:id', isStudent, async (req, res) => {
    const qrId = parseInt(req.params.id);
    const { testId, totalMarks, scoredMarks } = req.body;
  
    const updatedqr = await prisma.StudentTestResult.update({
      where: { id: qrId },
      data: { testId, totalMarks, scoredMarks },
    });
  
    res.json(updatedqr);
  });

// Create a new QuestionResult
app.post('/qr', isStudent, async (req, res) => {
  const { testId, studentTestResultId, answer, isCorrect, marks } = req.body;

  const qr = await prisma.QuestionResult.create({
    data: { testId, studentTestResultId, answer, isCorrect, marks },
  });

  res.json(qr);
});

  // Update a QuestionResult by ID
  app.put('/qr/:id', isStudent, async (req, res) => {
    const qrId = parseInt(req.params.id);
    const { testId, studentTestResultId, answer, isCorrect, marks } = req.body;
  
    const updatedqr = await prisma.QuestionResult.update({
      where: { id: qrId },
      data: { testId, studentTestResultId, answer, isCorrect, marks },
    });
  
    res.json(updatedqr);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });