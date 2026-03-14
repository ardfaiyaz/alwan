-- Create security audit logs table for comprehensive security tracking
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    failure_reason TEXT,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_user_role CHECK (user_role IN ('admin', 'area_manager', 'branch_manager', 'field_officer'))
);

-- Create indexes for efficient querying
CREATE INDEX idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX idx_security_audit_logs_timestamp ON security_audit_logs(timestamp DESC);
CREATE INDEX idx_security_audit_logs_action ON security_audit_logs(action);
CREATE INDEX idx_security_audit_logs_resource ON security_audit_logs(resource);
CREATE INDEX idx_security_audit_logs_success ON security_audit_logs(success);
CREATE INDEX idx_security_audit_logs_user_role ON security_audit_logs(user_role);

-- Create composite index for common queries
CREATE INDEX idx_security_audit_logs_user_timestamp ON security_audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_security_audit_logs_resource_action ON security_audit_logs(resource, action);

-- Enable Row Level Security
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view all security logs
CREATE POLICY "Admins can view all security logs"
    ON security_audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Users can view their own security logs
CREATE POLICY "Users can view their own security logs"
    ON security_audit_logs
    FOR SELECT
    USING (user_id = auth.uid());

-- Policy: System can insert security logs (service role)
CREATE POLICY "System can insert security logs"
    ON security_audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Create function to clean up old audit logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
    -- Delete logs older than 1 year
    DELETE FROM security_audit_logs
    WHERE timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run cleanup (requires pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('cleanup-security-logs', '0 2 * * 0', 'SELECT cleanup_old_security_logs()');

COMMENT ON TABLE security_audit_logs IS 'Comprehensive security audit trail for all user actions';
COMMENT ON COLUMN security_audit_logs.user_id IS 'User who performed the action';
COMMENT ON COLUMN security_audit_logs.user_role IS 'Role of the user at the time of action';
COMMENT ON COLUMN security_audit_logs.action IS 'Action performed (e.g., approvals:approve)';
COMMENT ON COLUMN security_audit_logs.resource IS 'Resource type affected';
COMMENT ON COLUMN security_audit_logs.resource_id IS 'Specific resource ID if applicable';
COMMENT ON COLUMN security_audit_logs.ip_address IS 'IP address of the request';
COMMENT ON COLUMN security_audit_logs.user_agent IS 'User agent string of the request';
COMMENT ON COLUMN security_audit_logs.success IS 'Whether the action was successful';
COMMENT ON COLUMN security_audit_logs.failure_reason IS 'Reason for failure if applicable';
COMMENT ON COLUMN security_audit_logs.metadata IS 'Additional metadata about the action';
