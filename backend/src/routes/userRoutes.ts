import { Router } from 'express';
import * as snippetController from '../controllers/snippetController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/users/:userId/snippets
 * @desc    Get user's public snippets
 * @access  Public
 */
router.get('/:userId/snippets', optionalAuth, snippetController.getUserSnippets);

export default router;
