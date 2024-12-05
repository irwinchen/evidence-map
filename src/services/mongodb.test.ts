import { mongoDBService } from './mongodb';

async function testMongoDBConnection() {
  try {
    // Test connection
    await mongoDBService.connect();
    console.log('✅ Successfully connected to MongoDB');

    // Test user preferences
    const testUserId = 'test-user-1';
    await mongoDBService.updateUserPreferences(testUserId, {
      userId: testUserId,
      visualization: {
        layout: 'force',
        theme: 'light',
        filters: {
          evidenceTypes: [],
          forceLevels: [1, 2, 3],
        },
        savedViews: [],
      },
    });
    console.log('✅ Successfully created test user preferences');

    const prefs = await mongoDBService.getUserPreferences(testUserId);
    console.log('✅ Successfully retrieved user preferences:', prefs);

    // Clean up test data
    const db = (mongoDBService as any).db;
    if (db) {
      await db.collection('userPreferences').deleteOne({ userId: testUserId });
    }
    console.log('✅ Successfully cleaned up test data');

    // Disconnect
    await mongoDBService.disconnect();
    console.log('✅ Successfully disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMongoDBConnection();
