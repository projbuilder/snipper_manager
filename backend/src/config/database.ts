import mongoose from 'mongoose';
import logger from '../utils/logger';

const dropLegacySnippetIndexes = async (): Promise<void> => {
  try {
    const collection = mongoose.connection.collection('snippets');
    const indexes = await collection.indexes();

    for (const index of indexes) {
      const name = index.name;
      if (!name || name === 'SnippetTextIndex') {
        continue;
      }

      const hasTextKey = index.key && Object.values(index.key).includes('text');
      if (!hasTextKey && !name.includes('text')) {
        continue;
      }

      await collection.dropIndex(name);
      logger.info(`Dropped legacy snippet index: ${name}`);
    }
  } catch (error: any) {
    if (error?.codeName === 'NamespaceNotFound') {
      return;
    }
    logger.warn('Failed to drop legacy snippet indexes:', error);
  }
};

const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snippet-manager';

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');

    await dropLegacySnippetIndexes();

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDatabase;
