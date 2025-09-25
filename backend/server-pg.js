require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:manki@123@localhost:5432/supa_mess_db";
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const Contact = sequelize.define(
  "Contact",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
  },
  { timestamps: true }
);

const Student = sequelize.define(
  "Student",
  {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
  },
  { timestamps: true }
);

const Feedback = sequelize.define(
  "Feedback",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    feedback: DataTypes.TEXT,
  },
  { timestamps: true }
);

const Menu = sequelize.define(
  "Menu",
  {
    date: { type: DataTypes.DATEONLY, unique: true, allowNull: false },
    breakfast: { type: DataTypes.STRING, defaultValue: "Not available" },
    lunch: { type: DataTypes.STRING, defaultValue: "Not available" },
    dinner: { type: DataTypes.STRING, defaultValue: "Not available" },
  },
  { timestamps: false }
);

const Booking = sequelize.define(
  "Booking",
  {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    meals: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  },
  {
    timestamps: true,
    indexes: [
      { unique: true, fields: ["studentId", "date"] }
    ],
  }
);

const Complaint = sequelize.define(
  "Complaint",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" }, 
  },
  { timestamps: true }
);

Student.hasMany(Booking, { foreignKey: { name: "studentId", allowNull: false }, onDelete: "CASCADE" });
Booking.belongsTo(Student, { foreignKey: { name: "studentId", allowNull: false } });

Student.hasMany(Complaint, { foreignKey: { name: "studentId", allowNull: true }, onDelete: "SET NULL" });
Complaint.belongsTo(Student, { foreignKey: { name: "studentId", allowNull: true } });

async function init() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Postgres Connected & Models synced");
  } catch (err) {
    console.error("Database init error:", err);
    process.exit(1);
  }
}

function toDateOnly(value) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}


function mapStudent(row) {
  const r = row?.toJSON ? row.toJSON() : row;
  if (!r) return r;
  return { _id: r.id, id: r.id, name: r.name, email: r.email, createdAt: r.createdAt };
}

function mapBooking(row) {
  const r = row?.toJSON ? row.toJSON() : row;
  if (!r) return r;
  let studentObj = r.Student ? mapStudent(r.Student) : undefined;
  return {
    _id: r.id,
    id: r.id,
    studentId: studentObj ?? r.studentId,
    date: r.date,
    meals: r.meals || [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function mapComplaint(row) {
  const r = row?.toJSON ? row.toJSON() : row;
  if (!r) return r;
  return {
    _id: r.id,
    id: r.id,
    studentId: r.studentId,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function mapFeedback(row) {
  const r = row?.toJSON ? row.toJSON() : row;
  if (!r) return r;
  return {
    _id: r.id,
    id: r.id,
    name: r.name,
    email: r.email,
    rating: r.rating,
    feedback: r.feedback,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function mapContact(row) {
  const r = row?.toJSON ? row.toJSON() : row;
  if (!r) return r;
  return {
    _id: r.id,
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages." });
  }
});

// register part.

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, message: "Student registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Registration failed." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    res.json({
      success: true,
      message: "Login successful!",
      student: { id: student.id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed." });
  }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    await Feedback.create({ name, email, rating, feedback });
    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit feedback." });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [["createdAt", "DESC"]] });
    res.json(feedbacks.map(mapFeedback));
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch feedbacks." });
  }
});

app.post("/api/menu", async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    const dateOnly = toDateOnly(date);

    const [menu, created] = await Menu.upsert(
      { date: dateOnly, breakfast, lunch, dinner },
      { returning: true }
    );

    const menuRow = menu?.toJSON ? menu.toJSON() : menu;
    res.status(201).json({ success: true, message: "Menu updated successfully!", menu: menuRow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update menu." });
  }
});

app.get("/api/menu/:date", async (req, res) => {
  try {
    const dateOnly = toDateOnly(req.params.date);
    const menu = await Menu.findOne({ where: { date: dateOnly } });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found for this date." });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch menu." });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { studentId, date, meals } = req.body;
    const dateOnly = toDateOnly(date);

    let booking = await Booking.findOne({ where: { studentId, date: dateOnly } });
    if (booking) {
      booking.meals = meals || [];
      await booking.save();
    } else {
      booking = await Booking.create({ studentId, date: dateOnly, meals: meals || [] });
    }
    res.status(201).json({ success: true, message: "Meals booked successfully!", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to book meals." });
  }
});

app.get("/api/bookings/daily/:date", async (req, res) => {
  try {
    const dateOnly = toDateOnly(req.params.date);
    const bookings = await Booking.findAll({
      where: { date: dateOnly },
      include: [{ model: Student, attributes: ["id", "name", "email", "createdAt"] }],
    });
    res.json(bookings.map(mapBooking));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch daily bookings." });
  }
});

app.get("/api/bookings/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const bookings = await Booking.findAll({
      where: { studentId },
      order: [["date", "DESC"]],
      include: [{ model: Student, attributes: ["id", "name", "email", "createdAt"] }],
    });
    res.json(bookings.map(mapBooking));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch student bookings." });
  }
});

app.post("/api/complaints", async (req, res) => {
  try {
    const { studentId, name, email, subject, message } = req.body;
    await Complaint.create({ studentId, name, email, subject, message });
    res.status(201).json({ success: true, message: "Complaint submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to submit complaint." });
  }
});

app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.findAll({ order: [["createdAt", "DESC"]] });
    res.json(complaints.map(mapComplaint));
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch complaints." });
  }
});

app.get("/api/complaints/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const complaints = await Complaint.findAll({
      where: { studentId },
      order: [["createdAt", "DESC"]],
    });
    res.json(complaints.map(mapComplaint));
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch student complaints." });
  }
});

app.put("/api/complaints/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    complaint.status = status;
    await complaint.save();
    res.json({ success: true, message: "Complaint status updated.", complaint: mapComplaint(complaint) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update complaint status." });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.findAll({ attributes: ["id", "name", "email", "createdAt"] });
    res.json(students.map(mapStudent));
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch students." });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.json({ success: true, message: "Student deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete student." });
  }
});

const PORT = process.env.PORT || 5000;
init().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});