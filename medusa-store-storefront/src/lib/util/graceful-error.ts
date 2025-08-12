/**
 * Graceful error handler for build-time data fetching
 * Returns fallback values instead of throwing errors when backend is not ready
 */
export function handleBuildTimeError<T>(fallback: T) {
  return (error: any): T => {
    // During build time, gracefully handle backend unavailability
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL) {
      console.warn('Build-time data fetching failed, using fallback:', error.message || error)
      return fallback
    }
    
    // In production runtime, still throw errors for proper error handling
    throw error
  }
}

/**
 * Safe data fetcher that handles build-time failures gracefully
 */
export async function safeFetch<T>(
  fetchFn: () => Promise<T>, 
  fallback: T
): Promise<T> {
  try {
    return await fetchFn()
  } catch (error) {
    return handleBuildTimeError(fallback)(error)
  }
}