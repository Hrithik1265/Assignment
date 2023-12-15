// Import necessary modules and Prisma client
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());

// Root URL response in JSON format
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Teacher Management System' });
});

// User Create

app.post('/users', async (req, res) => {
  try {
    
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        is_hod,
        is_teacher,
        country_code,
        phone_num,
        is_active,
        password_last_change,
        secondary_email,
        secondary_phone_num,
        gender,
        student_roll_no,
        created_by,
        terms_and_condition
      } = req.body
    });

    // Respond with a success message and the newly created user's data
    res.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    console.log('Request Body:', req.body); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//get the users

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: 'Internal Server Error' }); 
  } 
});

//update that users

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await prisma.users.update({
      where: { id },
      data: req.body // Assuming req.body contains fields to update
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete that users

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({
      where: { id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create a new subject

app.post('/subjects', async (req, res) => {
  try {
    const { description, subjectId, chapters, semesters } = req.body;
    const createdSubject = await prisma.subject.create({
      data: {
        description,
        subjectId,
        chapters,
        semesters,
      },
    });
    res.json(createdSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Error creating subject' });
  }
});


// Get all subjects
app.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subjects' });
  }
});

// Get a specific subject by ID
app.get('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subject' });
  }
});

// Update a subject by ID
app.put('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  const { description, subjectId, chapters, semisters } = req.body;
  try {
    const updatedSubject = await prisma.subject.update({
      where: {
        id,
      },
      data: {
        description,
        subjectId,
        chapters,
        semisters,
      },
    });
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating subject' });
  }
});

// Delete a subject by ID
app.delete('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.subject.delete({
      where: {
        id,
      },
    });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subject' });
  }
});

//create a teachers
app.post('/teachers', async (req, res) => {
  const { email, userName, password, agreeToTerms } = req.body;

  try {
    const newTeacher = await prisma.teacher.create({
      data: {
        email,
        userName,
        password,
        agreeToTerms,
      },
    });

    res.json({ message: 'Teacher created successfully', teacher: newTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating teacher' });
  }
});

//get all teachers
app.get('/teachers', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teachers' });
  }
});

//get a specific id

app.get('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teacher' });
  }
});

//update teacher

app.put('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { email, userName, password, agreeToTerms } = req.body;
  try {
    const updatedTeacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        email,
        userName,
        password,
        agreeToTerms,
      },
    });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ error: 'Error updating teacher' });
  }
});

//delete teacher
app.delete('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.teacher.delete({
      where: {
        id,
      },
    });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting teacher' });
  }
});

//send notification

app.post('/send-notification', async (req, res) => {
  const { message, senderId, receiverId } = req.body;

  try {
    const senderExists = await prisma.teacher.findUnique({
      where: { id: senderId }, // Use 'id' as the unique identifier
    });

    const receiverExists = await prisma.teacher.findUnique({
      where: { id: receiverId }, // Use 'id' as the unique identifier
    });

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    const newNotification = await prisma.notification.create({
      data: {
        message,
        senderId,
        receiverId,
      },
    });

    res.json({ message: 'Notification sent successfully', notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending notification' });
  }
});

//get notifications

app.get('/notifications/:teacherId', async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const sentNotifications = await prisma.notification.findMany({
      where: {
        senderId: teacherId, // Retrieve notifications sent by the teacher
      },
    });

    const receivedNotifications = await prisma.notification.findMany({
      where: {
        receiverId: teacherId, // Retrieve notifications received by the teacher
      },
    });

    res.json({
      sentNotifications,
      receivedNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
