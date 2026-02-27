// migrate_lowdb.js
// Run: node migrate_lowdb.js
// It expects server/db.json to exist with { users: [...], ideas: [...] } (lowdb format).
// NOTE: password hashes from lowdb are reused as-is if they exist. If lowdb stored plaintext passwords, you'd need to reset them.

const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const { User, Idea } = require('./models');

async function run(){
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_innovation';
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for migration');

  const raw = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const users = raw.users || [];
  const ideas = raw.ideas || [];

  // Insert users
  const userMap = {}; // map old user email -> new _id
  for(const u of users){
    try{
      const newUser = new User({
        name: u.name || '',
        email: (u.email || '').toLowerCase(),
        password: u.password || 'changeme', // if plaintext, you should force reset
        createdAt: u.createdAt ? new Date(u.createdAt) : undefined
      });
      await newUser.save();
      userMap[u.email] = newUser._id;
      console.log('Inserted user', u.email);
    } catch(err){
      console.error('User insert error for', u.email, err.message);
    }
  }

  // Insert ideas
  for(const it of ideas){
    try{
      const authorId = userMap[it.authorEmail] || it.authorId || null;
      const newIdea = new Idea({
        title: it.title,
        description: it.description,
        tags: it.tags || [],
        authorId: authorId,
        createdAt: it.createdAt ? new Date(it.createdAt) : undefined
      });
      await newIdea.save();
      console.log('Inserted idea', it.title);
    } catch(err){
      console.error('Idea insert error', it.title, err.message);
    }
  }

  console.log('Migration completed');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
