const app = require("./app");
app.listen(process.env.PORT, () =>
  console.log(`API running on http://localhost:${process.env.PORT}`)
);
