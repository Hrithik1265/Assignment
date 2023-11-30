const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3000
const role = 'isTeacher'


app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.json({Welcome: 'Connected to port' })
  })

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
    const testsWithQuestions = await prisma.test.findMany({
      include: {
        questions: true,
      },
    });
    res.json(testsWithQuestions);
  });
  

// Create a new test
app.post('/test', isTeacher, async (req, res) => {
  const { subject, grade, type, totalMarks } = req.body;

  const newTest = await prisma.test.create({
    data: { subject, grade, type, totalMarks },
  });

  res.json(newTest);
});

// Update a test by ID
app.put('/test/:id', isTeacher, async (req, res) => {
  const testId = parseInt(req.params.id);
  const { subject, grade, type, totalMarks } = req.body;

  const updatedTest = await prisma.test.update({
    where: { id: testId },
    data: { subject, grade, type, totalMarks },
  });

  res.json(updatedTest);
});

// Get all tests
app.get('/test', isTeacher, async (req, res) => {
  const tests = await prisma.test.findMany();
  res.json(tests);
});

// Get a single test by ID
app.get('/test/:id', isTeacher, async (req, res) => {
  const testId = parseInt(req.params.id);
  const test = await prisma.test.findUnique({
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

  const deletedTest = await prisma.test.delete({
    where: { id: testId },
  });

  res.json(deletedTest);
});

// Create a new Question
app.post('/question', isTeacher, async (req, res) => {
    const { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks } = req.body;
  
    const newquestion = await prisma.question.create({
      data: { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks },
    });
  
    res.json(newquestion);
  });
  
  // Update a question by ID
  app.put('/question/:id', isTeacher, async (req, res) => {
    const questionId = parseInt(req.params.id);
    const { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks } = req.body;
  
    const updatedquestion = await prisma.question.update({
      where: { id: questionId },
      data: { testId, type, questionText, answer1, answer2, answer3, answer4, correctAnswer, marks },
    });
  
    res.json(updatedquestion);
  });
  
  // Get all questions
  app.get('/question', isTeacher, async (req, res) => {
    const questions = await prisma.question.findMany();
    res.json(questions);
  });
  
  // Get a single question by ID
  app.get('/question/:id', isTeacher, async (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = await prisma.question.findUnique({
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
  
    const deletedquestion = await prisma.question.delete({
      where: { id: questionId },
    });
  
    res.json(deletedquestion);
  });
  
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
