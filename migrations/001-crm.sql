CREATE SEQUENCE IF NOT EXISTS crm_order_number MINVALUE 1 MAXVALUE 9999 NO CYCLE;
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS crm_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS crm_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES crm_clients(id),
  order_number integer NOT NULL UNIQUE DEFAULT nextval('crm_order_number'),
  request_key uuid NOT NULL UNIQUE,
  fingerprint text NOT NULL,
  title text NOT NULL,
  service text NOT NULL,
  brief text NOT NULL,
  submitted_contact jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Confirmed','Quoted','In progress','Review','Completed','On hold','Cancelled')),
  price_cents integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  paid_cents integer NOT NULL DEFAULT 0 CHECK (paid_cents >= 0 AND paid_cents <= price_cents),
  notes text NOT NULL DEFAULT '',
  maintenance_status text NOT NULL DEFAULT 'None' CHECK (maintenance_status IN ('None','Active','Paused','Ended')),
  maintenance_fee_cents integer NOT NULL DEFAULT 0 CHECK (maintenance_fee_cents >= 0),
  maintenance_cycle text NOT NULL DEFAULT 'Monthly' CHECK (maintenance_cycle IN ('Monthly','Quarterly','Yearly','One-off')),
  maintenance_start date,
  maintenance_end date,
  maintenance_next date,
  maintenance_notes text NOT NULL DEFAULT '',
  version integer NOT NULL DEFAULT 1,
  consent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (order_number BETWEEN 1 AND 9999),
  CHECK (maintenance_end IS NULL OR maintenance_start IS NULL OR maintenance_end >= maintenance_start)
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_projects_client_idx ON crm_projects(client_id,created_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_projects_maintenance_idx ON crm_projects(maintenance_next) WHERE maintenance_status = 'Active';
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS crm_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES crm_projects(id),
  action text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS crm_sessions (
  token_hash text PRIMARY KEY,
  credential_version text NOT NULL,
  expires_at timestamptz NOT NULL
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS crm_rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL,
  expires_at timestamptz NOT NULL
);
