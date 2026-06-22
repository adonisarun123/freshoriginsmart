-- ============================================================================
-- 0007 — Atomic public order number generator: FO-YYYY-NNNN
-- ============================================================================

create or replace function next_order_number()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  n bigint;
begin
  n := nextval('order_number_seq');
  return 'FO-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 4, '0');
end;
$$;

revoke all on function next_order_number() from public;
grant execute on function next_order_number() to service_role;
