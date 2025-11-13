import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Collection from '../models/Collection';
import Snippet from '../models/Snippet';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const createCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const collection = await Collection.create({
      ...req.body,
      owner: req.user.id,
    });

    logger.info(`Collection created: ${collection._id} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { collection },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Create collection error:', error);
    throw new AppError('Failed to create collection', 500, 'CREATE_COLLECTION_ERROR');
  }
};

export const getCollections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const collections = await Collection.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { collections },
    });
  } catch (error: any) {
    logger.error('Get collections error:', error);
    throw new AppError('Failed to fetch collections', 500, 'GET_COLLECTIONS_ERROR');
  }
};

export const getCollectionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id)
      .populate('snippetIds')
      .populate('owner', 'username displayName');

    if (!collection) {
      throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
    }

    // Check access permissions
    if (collection.visibility === 'private') {
      if (!req.user || collection.owner._id.toString() !== req.user.id) {
        throw new AppError('Access denied', 403, 'ACCESS_DENIED');
      }
    }

    res.status(200).json({
      success: true,
      data: { collection },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Get collection error:', error);
    throw new AppError('Failed to fetch collection', 500, 'GET_COLLECTION_ERROR');
  }
};

export const updateCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const collection = await Collection.findById(id);

    if (!collection) {
      throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
    }

    // Check ownership
    if (collection.owner.toString() !== req.user.id) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }

    Object.assign(collection, req.body);
    await collection.save();

    logger.info(`Collection updated: ${collection._id} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: { collection },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Update collection error:', error);
    throw new AppError('Failed to update collection', 500, 'UPDATE_COLLECTION_ERROR');
  }
};

export const deleteCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const collection = await Collection.findById(id);

    if (!collection) {
      throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
    }

    // Check ownership
    if (collection.owner.toString() !== req.user.id) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }

    await collection.deleteOne();

    logger.info(`Collection deleted: ${id} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: {
        message: 'Collection deleted successfully',
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Delete collection error:', error);
    throw new AppError('Failed to delete collection', 500, 'DELETE_COLLECTION_ERROR');
  }
};

export const addSnippetToCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const { snippetId } = req.body;

    const [collection, snippet] = await Promise.all([
      Collection.findById(id),
      Snippet.findById(snippetId),
    ]);

    if (!collection) {
      throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
    }

    if (!snippet) {
      throw new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND');
    }

    // Check ownership
    if (collection.owner.toString() !== req.user.id) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }

    // Check if snippet already in collection
    if (collection.snippetIds.includes(snippetId)) {
      throw new AppError('Snippet already in collection', 409, 'SNIPPET_EXISTS');
    }

    collection.snippetIds.push(snippetId);
    await collection.save();

    res.status(200).json({
      success: true,
      data: { collection },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Add snippet to collection error:', error);
    throw new AppError('Failed to add snippet to collection', 500, 'ADD_SNIPPET_ERROR');
  }
};

export const removeSnippetFromCollection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id, snippetId } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
    }

    // Check ownership
    if (collection.owner.toString() !== req.user.id) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }

    collection.snippetIds = collection.snippetIds.filter(
      (sid) => sid.toString() !== snippetId
    );
    await collection.save();

    res.status(200).json({
      success: true,
      data: { collection },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Remove snippet from collection error:', error);
    throw new AppError('Failed to remove snippet from collection', 500, 'REMOVE_SNIPPET_ERROR');
  }
};
