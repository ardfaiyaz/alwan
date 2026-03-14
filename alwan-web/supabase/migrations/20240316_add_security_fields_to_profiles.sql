-- Add security-related fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mfa_secret TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_ip TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false;

-- Add branch and area assignments for data scoping
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area_id UUID;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_branch_id ON profiles(branch_id);
CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON profiles(area_id);
CREATE INDEX IF NOT EXISTS idx_profiles_locked_until ON profiles(locked_until);

-- Function to check password expiry (90 days policy)
CREATE OR REPLACE FUNCTION check_password_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_password_change IS NOT NULL THEN
        NEW.password_expires_at := NEW.last_password_change + INTERVAL '90 days';
        
        -- Force password change if expired
        IF NEW.password_expires_at < NOW() THEN
            NEW.force_password_change := true;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for password expiry check
DROP TRIGGER IF EXISTS trigger_check_password_expiry ON profiles;
CREATE TRIGGER trigger_check_password_expiry
    BEFORE INSERT OR UPDATE OF last_password_change ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_password_expiry();

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login(user_id UUID)
RETURNS void AS $$
DECLARE
    current_attempts INTEGER;
BEGIN
    -- Increment failed attempts
    UPDATE profiles
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = user_id
    RETURNING failed_login_attempts INTO current_attempts;
    
    -- Lock account if too many failed attempts (5)
    IF current_attempts >= 5 THEN
        UPDATE profiles
        SET locked_until = NOW() + INTERVAL '15 minutes',
            is_active = false
        WHERE id = user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle successful login
CREATE OR REPLACE FUNCTION handle_successful_login(user_id UUID, ip_address TEXT)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET failed_login_attempts = 0,
        locked_until = NULL,
        is_active = true,
        last_login_at = NOW(),
        last_login_ip = ip_address
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unlock account after lockout period
CREATE OR REPLACE FUNCTION unlock_expired_accounts()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET is_active = true,
        locked_until = NULL,
        failed_login_attempts = 0
    WHERE locked_until IS NOT NULL
    AND locked_until < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scheduled job to unlock accounts (requires pg_cron)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('unlock-accounts', '*/5 * * * *', 'SELECT unlock_expired_accounts()');

COMMENT ON COLUMN profiles.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN profiles.last_password_change IS 'Timestamp of last password change';
COMMENT ON COLUMN profiles.mfa_enabled IS 'Whether multi-factor authentication is enabled';
COMMENT ON COLUMN profiles.mfa_secret IS 'Secret key for MFA (encrypted)';
COMMENT ON COLUMN profiles.failed_login_attempts IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN profiles.locked_until IS 'Timestamp until which the account is locked';
COMMENT ON COLUMN profiles.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN profiles.last_login_ip IS 'IP address of last successful login';
COMMENT ON COLUMN profiles.password_expires_at IS 'Timestamp when password expires';
COMMENT ON COLUMN profiles.force_password_change IS 'Whether user must change password on next login';
COMMENT ON COLUMN profiles.branch_id IS 'Branch assignment for data scoping';
COMMENT ON COLUMN profiles.area_id IS 'Area assignment for data scoping';
