import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Types from our schema
interface Evidence {
  _id?: string;
  title: string;
  url: string;
  description: string;
  type: string;
  source: {
    name: string;
    importedFrom: 'manual' | 'raindrop';
    originalId?: string;
  };
  metadata: {
    dateAdded: Date;
    dateModified: Date;
    addedBy: string;
    tags: string[];
    rating: number;
    confidence: number;
  };
  content: {
    summary: string;
    highlights: string[];
    notes: string;
  };
}

interface Force {
  _id?: string;
  name: string;
  description: string;
  type: 'driving' | 'restraining';
  level: number;
  metadata: {
    dateCreated: Date;
    dateModified: Date;
    createdBy: string;
  };
  visualization: {
    color: string;
    size: number;
    position?: {
      x: number;
      y: number;
    };
  };
  parentForce?: string;
}

interface Connection {
  _id?: string;
  sourceId: string;
  targetId: string;
  type: 'evidence_force' | 'force_force';
  strength: number;
  metadata: {
    dateCreated: Date;
    dateModified: Date;
    createdBy: string;
    notes: string;
  };
  directionality: 'unidirectional' | 'bidirectional';
}

interface UserPreferences {
  _id?: string;
  userId: string;
  visualization: {
    layout: 'force' | 'hierarchical' | 'radial';
    theme: 'light' | 'dark';
    filters: {
      evidenceTypes: string[];
      forceLevels: number[];
      dateRange?: {
        start: Date;
        end: Date;
      };
    };
    savedViews: Array<{
      name: string;
      config: object;
      dateCreated: Date;
    }>;
  };
}

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private evidence: Collection<Evidence> | null = null;
  private forces: Collection<Force> | null = null;
  private connections: Collection<Connection> | null = null;
  private userPreferences: Collection<UserPreferences> | null = null;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
  }

  async connect(): Promise<void> {
    try {
      this.client = await MongoClient.connect(process.env.MONGODB_URI as string);
      this.db = this.client.db(process.env.MONGODB_DB_NAME || 'evidence-map');

      // Initialize collections
      this.evidence = this.db.collection('evidence');
      this.forces = this.db.collection('forces');
      this.connections = this.db.collection('connections');
      this.userPreferences = this.db.collection('userPreferences');

      // Create indexes
      await this.createIndexes();

      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.evidence || !this.forces || !this.connections || !this.userPreferences) {
      throw new Error('Collections not initialized');
    }

    // Evidence indexes
    await this.evidence.createIndex({ 'metadata.addedBy': 1 });
    await this.evidence.createIndex({ 'metadata.tags': 1 });
    await this.evidence.createIndex({ type: 1 });
    await this.evidence.createIndex({ 'source.importedFrom': 1 });

    // Forces indexes
    await this.forces.createIndex({ type: 1 });
    await this.forces.createIndex({ level: 1 });
    await this.forces.createIndex({ 'metadata.createdBy': 1 });
    await this.forces.createIndex({ parentForce: 1 });

    // Connections indexes
    await this.forces.createIndex({ sourceId: 1 });
    await this.forces.createIndex({ targetId: 1 });
    await this.forces.createIndex({ type: 1 });
    await this.forces.createIndex({ 'metadata.createdBy': 1 });

    // User preferences indexes
    await this.userPreferences.createIndex({ userId: 1 }, { unique: true });
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.evidence = null;
      this.forces = null;
      this.connections = null;
      this.userPreferences = null;
    }
  }

  // Evidence methods
  async addEvidence(evidence: Omit<Evidence, '_id'>): Promise<Evidence> {
    if (!this.evidence) throw new Error('Not connected to MongoDB');
    const result = await this.evidence.insertOne(evidence);
    return { ...evidence, _id: result.insertedId.toString() };
  }

  async getEvidence(id: string): Promise<Evidence | null> {
    if (!this.evidence) throw new Error('Not connected to MongoDB');
    return this.evidence.findOne({ _id: id });
  }

  async getAllEvidence(): Promise<Evidence[]> {
    if (!this.evidence) throw new Error('Not connected to MongoDB');
    return this.evidence.find().toArray();
  }

  // Forces methods
  async addForce(force: Omit<Force, '_id'>): Promise<Force> {
    if (!this.forces) throw new Error('Not connected to MongoDB');
    const result = await this.forces.insertOne(force);
    return { ...force, _id: result.insertedId.toString() };
  }

  async getForce(id: string): Promise<Force | null> {
    if (!this.forces) throw new Error('Not connected to MongoDB');
    return this.forces.findOne({ _id: id });
  }

  async getAllForces(): Promise<Force[]> {
    if (!this.forces) throw new Error('Not connected to MongoDB');
    return this.forces.find().toArray();
  }

  // Connections methods
  async addConnection(connection: Omit<Connection, '_id'>): Promise<Connection> {
    if (!this.connections) throw new Error('Not connected to MongoDB');
    const result = await this.connections.insertOne(connection);
    return { ...connection, _id: result.insertedId.toString() };
  }

  async getConnection(id: string): Promise<Connection | null> {
    if (!this.connections) throw new Error('Not connected to MongoDB');
    return this.connections.findOne({ _id: id });
  }

  async getConnectionsByForce(forceId: string): Promise<Connection[]> {
    if (!this.connections) throw new Error('Not connected to MongoDB');
    return this.connections
      .find({
        $or: [{ sourceId: forceId }, { targetId: forceId }],
      })
      .toArray();
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    if (!this.userPreferences) throw new Error('Not connected to MongoDB');
    return this.userPreferences.findOne({ userId });
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    if (!this.userPreferences) throw new Error('Not connected to MongoDB');
    await this.userPreferences.updateOne({ userId }, { $set: preferences }, { upsert: true });
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService();
