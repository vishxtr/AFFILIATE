import { supabase } from './supabase';

/**
 * Log admin activity to database
 * @param action The type of action being performed
 * @param details Additional details about the action
 */
export async function logAdminActivity(action: string, details: any) {
  try {
    // For now, we'll log to console since we may not have admin_activity table
    console.log('Admin Activity:', { action, details, timestamp: new Date().toISOString() });
    
    // If admin_activity table exists, we can insert there
    const { error } = await supabase
      .from('admin_activity')
      .insert({
        action,
        details: JSON.stringify(details),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Failed to log admin activity:', error.message);
    }
  } catch (error) {
    console.warn('Error logging admin activity:', error);
  }
}

/**
 * Log when settings are updated
 * @param category The category of settings being updated
 * @param settings The settings object that was updated
 */
export async function logSettingsUpdated(category: string, settings: any) {
  await logAdminActivity('settings_updated', {
    category,
    settings: Object.keys(settings) // Only log keys, not values for security
  });
}

/**
 * Log when admin user performs authentication actions
 * @param action The authentication action
 * @param userId The user ID (optional)
 */
export async function logAuthAction(action: string, userId?: string) {
  await logAdminActivity('auth_action', {
    action,
    userId,
    timestamp: new Date().toISOString()
  });
}