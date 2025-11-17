import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Snippet from '../models/Snippet';
import Star from '../models/Star';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const createSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const snippetData = {
      ...req.body,
      author: req.user.id,
    };

    const snippet = await Snippet.create(snippetData);

    logger.info(`Snippet created: ${snippet._id} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { snippet },
    });
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Create snippet error:', error);
    return next(
      new AppError(error.message || 'Failed to create snippet', 500, 'CREATE_SNIPPET_ERROR')
    );
  }
};

export const getSnippets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      language,
      tags,
      author,
      visibility,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query: any = {};

    // Text search
    if (q) {
      query.$text = { $search: q as string };
    }

    // Language filter
    if (language) {
      query.language = language;
    }

    // Tags filter (comma-separated)
    if (tags) {
      const tagArray = (tags as string).split(',').map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Visibility filter - only show public if not authenticated or not own snippets
    if (!req.user) {
      query.visibility = 'public';
    } else if (visibility) {
      query.visibility = visibility;
    } else {
      // Show public snippets and user's own snippets
      query.$or = [{ visibility: 'public' }, { author: req.user.id }];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [snippets, total] = await Promise.all([
      Snippet.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'username displayName')
        .lean(),
      Snippet.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        snippets,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    logger.error('Get snippets error:', error);
    return next(new AppError('Failed to fetch snippets', 500, 'GET_SNIPPETS_ERROR'));
  }
};

export const getSnippetById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const snippet = await Snippet.findById(id).populate('author', 'username displayName email');

    if (!snippet) {
      return next(new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND'));
    }

    // Check visibility permissions
    if (snippet.visibility === 'private') {
      if (!req.user || snippet.author._id.toString() !== req.user.id) {
        return next(new AppError('Access denied', 403, 'ACCESS_DENIED'));
      }
    }

    // Increment view count
    snippet.stats.views += 1;
    await snippet.save();

    // Check if user has starred this snippet
    let isStarred = false;
    if (req.user) {
      const star = await Star.findOne({
        userId: req.user.id,
        snippetId: snippet._id,
      });
      isStarred = !!star;
    }

    res.status(200).json({
      success: true,
      data: {
        snippet,
        isStarred,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Get snippet error:', error);
    return next(new AppError('Failed to fetch snippet', 500, 'GET_SNIPPET_ERROR'));
  }
};

export const updateSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const { id } = req.params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return next(new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND'));
    }

    // Check ownership
    if (snippet.author.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return next(new AppError('Access denied', 403, 'ACCESS_DENIED'));
    }

    // Update fields
    Object.assign(snippet, req.body);
    await snippet.save();

    logger.info(`Snippet updated: ${snippet._id} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: { snippet },
    });
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Update snippet error:', error);
    return next(new AppError('Failed to update snippet', 500, 'UPDATE_SNIPPET_ERROR'));
  }
};

export const deleteSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const { id } = req.params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return next(new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND'));
    }

    // Check ownership
    if (snippet.author.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return next(new AppError('Access denied', 403, 'ACCESS_DENIED'));
    }

    await snippet.deleteOne();

    // Delete associated stars
    await Star.deleteMany({ snippetId: id });

    logger.info(`Snippet deleted: ${id} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: {
        message: 'Snippet deleted successfully',
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Delete snippet error:', error);
    return next(new AppError('Failed to delete snippet', 500, 'DELETE_SNIPPET_ERROR'));
  }
};

export const forkSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const { id } = req.params;
    const originalSnippet = await Snippet.findById(id);

    if (!originalSnippet) {
      return next(new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND'));
    }

    // Only public snippets can be forked
    if (originalSnippet.visibility !== 'public') {
      return next(new AppError('Only public snippets can be forked', 403, 'FORK_NOT_ALLOWED'));
    }

    // Create forked snippet
    const forkedSnippet = await Snippet.create({
      title: `${originalSnippet.title} (fork)`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      language: originalSnippet.language,
      tags: originalSnippet.tags,
      author: req.user.id,
      visibility: 'private', // Forks start as private
      parentSnippet: originalSnippet._id,
      executionAllowed: originalSnippet.executionAllowed,
    });

    // Increment fork count on original
    originalSnippet.forks += 1;
    await originalSnippet.save();

    logger.info(`Snippet forked: ${id} -> ${forkedSnippet._id} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { snippet: forkedSnippet },
    });
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Fork snippet error:', error);
    return next(new AppError('Failed to fork snippet', 500, 'FORK_SNIPPET_ERROR'));
  }
};

export const starSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const { id } = req.params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return next(new AppError('Snippet not found', 404, 'SNIPPET_NOT_FOUND'));
    }

    // Check if already starred
    const existingStar = await Star.findOne({
      userId: req.user.id,
      snippetId: id,
    });

    if (existingStar) {
      // Unstar
      await existingStar.deleteOne();
      snippet.stats.stars = Math.max(0, snippet.stats.stars - 1);
      await snippet.save();

      res.status(200).json({
        success: true,
        data: {
          message: 'Snippet unstarred',
          isStarred: false,
          stars: snippet.stats.stars,
        },
      });
    } else {
      // Star
      await Star.create({
        userId: req.user.id,
        snippetId: id,
      });
      snippet.stats.stars += 1;
      await snippet.save();

      res.status(200).json({
        success: true,
        data: {
          message: 'Snippet starred',
          isStarred: true,
          stars: snippet.stats.stars,
        },
      });
    }
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    logger.error('Star snippet error:', error);
    return next(new AppError('Failed to star snippet', 500, 'STAR_SNIPPET_ERROR'));
  }
};

export const getUserSnippets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query: any = { author: userId };

    // If viewing another user's snippets, only show public
    if (!req.user || req.user.id !== userId) {
      query.visibility = 'public';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [snippets, total] = await Promise.all([
      Snippet.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'username displayName')
        .lean(),
      Snippet.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        snippets,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    logger.error('Get user snippets error:', error);
    return next(new AppError('Failed to fetch user snippets', 500, 'GET_USER_SNIPPETS_ERROR'));
  }
};
