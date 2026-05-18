const bcrypt = require('bcrypt');

const testHash = async () => {
  console.log('🔍 TESTING PASSWORD HASHING:\n');

  const password = 'admin123';
  console.log(`Original password: "${password}"`);

  // Hash the password
  const hash = await bcrypt.hash(password, 10);
  console.log(`Generated hash: ${hash}`);

  // Test comparison
  const isMatch = await bcrypt.compare(password, hash);
  console.log(`Comparison result: ${isMatch}`);

  // Test with the stored hash from database
  const storedHash = '$2b$10$WQC9/juceA.xyQcVJ0PHuuMczGCAoKZzRDvm7DQ7Yn0FMNgciocO.';
  const storedMatch = await bcrypt.compare(password, storedHash);
  console.log(`Stored hash matches "admin123": ${storedMatch}`);

  // Let's see what password the stored hash actually corresponds to
  console.log('\n🔎 CHECKING WHAT PASSWORD THE STORED HASH REPRESENTS:');
  const commonPasswords = ['admin123', 'admin', 'password', '123456', 'admin123!'];
  for (const testPass of commonPasswords) {
    const match = await bcrypt.compare(testPass, storedHash);
    console.log(`  "${testPass}": ${match}`);
  }
};

testHash();