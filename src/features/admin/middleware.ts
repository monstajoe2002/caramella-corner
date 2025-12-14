import { createMiddleware } from '@tanstack/react-start'

/**
 * Basic Auth middleware for admin routes
 * Validates credentials from Authorization header against environment variables
 */
export const adminAuthMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    // If credentials are not configured, deny access
    if (!adminUsername || !adminPassword) {
      return new Response('Admin credentials not configured', {
        status: 500,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    // Get Authorization header
    const authHeader = request.headers.get('Authorization')

    // If no Authorization header, request authentication
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    // Extract and decode credentials
    try {
      const base64Credentials = authHeader.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      )
      const [username, password] = credentials.split(':')

      // Validate credentials
      if (username === adminUsername && password === adminPassword) {
        // Credentials are valid, proceed to next middleware/handler
        return next()
      }
    } catch (error) {
      // Invalid base64 encoding or malformed credentials
      return new Response('Invalid authentication credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    // Invalid credentials
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  },
)