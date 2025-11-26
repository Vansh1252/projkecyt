/**
 * Constants and helper functions for Current Setup page
 */

import type { Option } from '@/components/option-cards-grid'
import type { SetupOption } from '@/utils/type'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get default selected option
 */
export const getDefaultOption = (): Option['id'] => {
  return 'owner-led'
}

/**
 * Create payload for API submission
 */
export const createSetupTypePayload = (
  userInputId: number,
  setupType: SetupOption
) => {
  return {
    id: userInputId,
    setupType: setupType as
      | 'owner-led'
      | 'internal-team'
      | 'external-agency'
      | 'hybrid',
  }
}
