create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  image text,
  bio text,
  role text not null default 'buyer' check (role in ('buyer','seller','both')),
  currency text not null default 'USD',
  profile_visibility text not null default 'public',
  bid_notifications boolean not null default true,
  connection_notifications boolean not null default true,
  two_factor_enabled boolean not null default false,
  two_factor_secret text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'Other',
  currency text not null default 'USD',
  minimum_bid numeric(14,2) not null check (minimum_bid >= 0),
  current_bid numeric(14,2),
  status text not null default 'active' check (status in ('draft','active','sold','ended','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  url text not null,
  storage_path text not null,
  sort_order integer not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists one_main_image_per_listing
on listing_images(listing_id) where is_main = true;

create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  bidder_id uuid not null references profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create table if not exists connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> recipient_id)
);

create unique index if not exists unique_open_connection
on connection_requests(requester_id, recipient_id)
where status in ('pending','accepted');

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (user_a <> user_b)
);

create unique index if not exists unique_conversation_pair
on conversations(least(user_a, user_b), greatest(user_a, user_b));

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id),
  buyer_id uuid not null references profiles(id),
  seller_id uuid not null references profiles(id),
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider text not null,
  provider_reference text,
  label text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  payer_id uuid not null references profiles(id),
  seller_id uuid not null references profiles(id),
  provider text not null,
  provider_payment_id text,
  amount numeric(14,2) not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending','authorized','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seller_payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  provider text not null,
  merchant_id text,
  status text not null default 'not_connected',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_created_idx on listings(status, created_at desc);
create index if not exists bids_listing_created_idx on bids(listing_id, created_at desc);
create index if not exists requests_recipient_status_idx on connection_requests(recipient_id, status);
create index if not exists requests_requester_status_idx on connection_requests(requester_id, status);
create index if not exists messages_conversation_created_idx on messages(conversation_id, created_at);
create index if not exists notifications_user_created_idx on notifications(user_id, created_at desc);

create or replace function place_bid(p_listing_id uuid, p_bidder_id uuid, p_amount numeric)
returns jsonb
language plpgsql
security definer
as $$
declare
  l listings%rowtype;
  b bids%rowtype;
begin
  select * into l from listings where id = p_listing_id and status = 'active' for update;
  if not found then raise exception 'LISTING_NOT_ACTIVE'; end if;
  if l.seller_id = p_bidder_id then raise exception 'SELLER_CANNOT_BID'; end if;
  if p_amount < l.minimum_bid then raise exception 'BID_BELOW_MINIMUM'; end if;
  if l.current_bid is not null and p_amount <= l.current_bid then raise exception 'BID_NOT_HIGH_ENOUGH'; end if;

  insert into bids(listing_id, bidder_id, amount) values(p_listing_id, p_bidder_id, p_amount) returning * into b;
  update listings set current_bid = p_amount, updated_at = now() where id = p_listing_id;

  return jsonb_build_object('id', b.id, 'amount', b.amount, 'listing_id', b.listing_id, 'created_at', b.created_at);
end;
$$;
