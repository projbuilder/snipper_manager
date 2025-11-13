import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    displayName: z.string().min(1, 'Display name is required').max(50, 'Display name too long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// Snippet validators
export const createSnippetSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    code: z.string().min(1, 'Code is required').max(100000, 'Code too long'),
    language: z.string().min(1, 'Language is required'),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
    visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
    executionAllowed: z.boolean().default(false),
    license: z.enum(['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'CC0-1.0']).optional(),
  }),
});

export const updateSnippetSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    code: z.string().min(1).max(100000).optional(),
    language: z.string().optional(),
    tags: z.array(z.string()).max(10).optional(),
    visibility: z.enum(['public', 'private', 'unlisted']).optional(),
    executionAllowed: z.boolean().optional(),
    license: z.enum(['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'CC0-1.0']).optional(),
  }),
});

export const searchSnippetsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    language: z.string().optional(),
    tags: z.string().optional(), // comma-separated
    author: z.string().optional(),
    visibility: z.enum(['public', 'private', 'unlisted']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    sortBy: z.enum(['createdAt', 'updatedAt', 'stars', 'forks']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

// Collection validators
export const createCollectionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    visibility: z.enum(['private', 'shared', 'public']).default('private'),
  }),
});

export const updateCollectionSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    visibility: z.enum(['private', 'shared', 'public']).optional(),
  }),
});

export const addSnippetToCollectionSchema = z.object({
  body: z.object({
    snippetId: z.string().min(1, 'Snippet ID is required'),
  }),
});

// Execution validator
export const executeSnippetSchema = z.object({
  body: z.object({
    code: z.string().optional(), // Optional, will use snippet's code if not provided
    language: z.string().optional(),
    timeoutMs: z.number().min(100).max(10000).default(5000),
  }),
});
