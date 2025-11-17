// Script untuk memperbaiki image URLs di database
// Jalankan di VPS: docker-compose exec backend python -c "exec(open('fix-image-urls.py').read())"

const fs = require('fs');
const path = require('path');

// Script untuk memperbaiki image URLs di frontend
// Ini hanya contoh - sebenarnya perlu dijalankan di backend untuk update database

console.log('Untuk memperbaiki image URLs, jalankan di VPS:');
console.log('');
console.log('cd ~/aventra');
console.log('docker-compose exec backend python -c "');
console.log(`
import sqlite3

# Connect to database
conn = sqlite3.connect('/app/portfolio.db')
cursor = conn.cursor()

# Update image URLs to use HTTPS
cursor.execute("UPDATE project SET image_url = REPLACE(image_url, 'http://localhost:8001', 'https://api.aventra.my.id')")
cursor.execute("UPDATE project SET image_url = REPLACE(image_url, 'http://api.aventra.my.id', 'https://api.aventra.my.id')")

# Commit changes
conn.commit()

# Verify changes
cursor.execute("SELECT id, title, image_url FROM project")
projects = cursor.fetchall()
for project in projects:
    print(f"Project {project[0]}: {project[1]} -> {project[2]}")

conn.close()
print("✅ Image URLs updated successfully!")
`);
console.log('"');
