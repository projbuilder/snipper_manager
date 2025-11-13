import { Router } from 'express';
import * as snippetController from '../controllers/snippetController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { auditLog } from '../middleware/audit';
import {
  createSnippetSchema,
  updateSnippetSchema,
  searchSnippetsSchema,
} from '../utils/validators';

const router = Router();

/**
 * @route   GET /api/snippets
 * @desc    Get all snippets with filters
 * @access  Public (limited results) / Private (full access)
 */
router.get(
  '/',
  optionalAuth,
  validate(searchSnippetsSchema),
  snippetController.getSnippets
);

/**
 * @route   POST /api/snippets
 * @desc    Create a new snippet
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate(createSnippetSchema),
  auditLog('create', 'snippet'),
  snippetController.createSnippet
);

/**
 * @route   GET /api/snippets/:id
 * @desc    Get snippet by ID
 * @access  Public (public snippets) / Private (own snippets)
 */
router.get('/:id', optionalAuth, snippetController.getSnippetById);

/**
 * @route   PUT /api/snippets/:id
 * @desc    Update snippet
 * @access  Private (owner only)
 */
router.put(
  '/:id',
  authenticate,
  validate(updateSnippetSchema),
  auditLog('update', 'snippet'),
  snippetController.updateSnippet
);

/**
 * @route   DELETE /api/snippets/:id
 * @desc    Delete snippet
 * @access  Private (owner only)
 */
router.delete(
  '/:id',
  authenticate,
  auditLog('delete', 'snippet'),
  snippetController.deleteSnippet
);

/**
 * @route   POST /api/snippets/:id/fork
 * @desc    Fork a public snippet
 * @access  Private
 */
router.post(
  '/:id/fork',
  authenticate,
  auditLog('fork', 'snippet'),
  snippetController.forkSnippet
);

/**
 * @route   POST /api/snippets/:id/star
 * @desc    Star/unstar a snippet
 * @access  Private
 */
router.post(
  '/:id/star',
  authenticate,
  auditLog('star', 'snippet'),
  snippetController.starSnippet
);

export default router;
