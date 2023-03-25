const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "corusers1" },
  { id: 2, name: "corusers2" },
  { id: 3, name: "corusers3" },
];

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// PORT
// /api/courses/1

// app.get("/api/courses/:id", (req, res) => {
//   res.send(req.params.id);
// });
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  //const result = Joi.validate(req.body, schema); // return an object
  const result = validateCourse(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad Request
  //   res.status(400).send("Name is required and should be minumum 3 character");
  //   return;
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // if not existing return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found");
    return;
  }

  // validate
  // if invalid return 400 - Bad request

  const result = validateCourse(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  // Update course

  course.name = req.body.name;
  // Return the update course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // look up the course
  // not existing,return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send("The course with the given ID was not found");
    return;
  }

  // Delete

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// app.post();

// app.put();

// app.delete();
