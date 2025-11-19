-- ============================================================================
-- ADD TICKET NUMBER TO SUPPORT_TICKETS TABLE
-- ============================================================================

-- Add ticket_number column
ALTER TABLE support_tickets
ADD COLUMN ticket_number TEXT UNIQUE;

-- Create function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_ticket_number TEXT;
  counter INT := 0;
BEGIN
  LOOP
    -- Generate ticket number: RCP-{first 8 chars of UUID without dashes}
    new_ticket_number := 'RCP-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8));

    -- Check if ticket number already exists
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM support_tickets WHERE ticket_number = new_ticket_number
    );

    -- Safety: prevent infinite loop
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique ticket number after 100 attempts';
    END IF;
  END LOOP;

  RETURN new_ticket_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket number on insert
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_tickets_set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Backfill existing tickets with ticket numbers
UPDATE support_tickets
SET ticket_number = 'RCP-' || UPPER(SUBSTRING(REPLACE(id::TEXT, '-', ''), 1, 8))
WHERE ticket_number IS NULL;

-- Create index for faster ticket number lookups
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);

COMMENT ON COLUMN support_tickets.ticket_number IS 'Unique ticket identifier (format: RCP-XXXXXXXX)';
