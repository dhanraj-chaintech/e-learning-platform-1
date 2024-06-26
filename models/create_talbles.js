const logger = require('../utils/pino');
const Query = require('../config/database').query;

const tableQueries = [
  {
    name: 'users',
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile_img_url TEXT DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255),
        role TEXT[] DEFAULT ARRAY['user']
      );
    `,
  },
  {
    name: 'courses',
    query: `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      duration VARCHAR(255),
      rating FLOAT,
      description TEXT,
      category TEXT[] DEFAULT '{}'::TEXT[],
      instructor_name VARCHAR(255),
      instructor_rating FLOAT,
      instructor_description TEXT,
      language VARCHAR(50),
      tag VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  },
  {
    name: 'otp',
    query: `
    CREATE TABLE IF NOT EXISTS otp (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      otp VARCHAR(6) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       expiration_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '10 minutes'
    );
    `,
  },
  {
    name: 'enrollments',
    query: `
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        UNIQUE (user_id, course_id)
      );
    `,
  },
];

// Create a table
async function createTable(name, query) {
  try {
    await Query(query);
    logger.info(`${name} table created successfully`);
  } catch (err) {
    logger.error(`Error creating ${name} table: ${err}`);
  }
}

// Create all tables
exports.createTables = async () => {
  await Promise.all(tableQueries.map(({ name, query }) => createTable(name, query)));
};

