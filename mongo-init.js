db = db.getSiblingDB('lifediary_db');

db.createUser({
  user: 'lifediary_user',
  pwd: 'lifediary_password',
  roles: [
    {
      role: 'readWrite',
      db: 'lifediary_db'
    }
  ]
});