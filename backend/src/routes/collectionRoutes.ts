import { Router } from 'express';
import * as collectionController from '../controllers/collectionController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { auditLog } from '../middleware/audit';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addSnippetToCollectionSchema,
} from '../utils/validators';

const router = Router();

/**
 * @route   GET /api/collections
 * @desc    Get user's collections
 * @access  Private
 */
router.get('/', authenticate, collectionController.getCollections);

/**
 * @route   POST /api/collections
 * @desc    Create a new collection
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate(createCollectionSchema),
  auditLog('create', 'collection'),
  collectionController.createCollection
);

/**
 * @route   GET /api/collections/:id
 * @desc    Get collection by ID
 * @access  Public (public collections) / Private (own collections)
 */
router.get('/:id', optionalAuth, collectionController.getCollectionById);

/**
 * @route   PUT /api/collections/:id
 * @desc    Update collection
 * @access  Private (owner only)
 */
router.put(
  '/:id',
  authenticate,
  validate(updateCollectionSchema),
  auditLog('update', 'collection'),
  collectionController.updateCollection
);

/**
 * @route   DELETE /api/collections/:id
 * @desc    Delete collection
 * @access  Private (owner only)
 */
router.delete(
  '/:id',
  authenticate,
  auditLog('delete', 'collection'),
  collectionController.deleteCollection
);

/**
 * @route   POST /api/collections/:id/snippets
 * @desc    Add snippet to collection
 * @access  Private (owner only)
 */
router.post(
  '/:id/snippets',
  authenticate,
  validate(addSnippetToCollectionSchema),
  collectionController.addSnippetToCollection
);

/**
 * @route   DELETE /api/collections/:id/snippets/:snippetId
 * @desc    Remove snippet from collection
 * @access  Private (owner only)
 */
router.delete(
  '/:id/snippets/:snippetId',
  authenticate,
  collectionController.removeSnippetFromCollection
);

export default router;
