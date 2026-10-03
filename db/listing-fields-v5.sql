-- BID Create Listing UI fields. Safe to run after the original db/schema.sql.
alter table public.listings add column if not exists condition text not null default 'Good';
alter table public.listings add column if not exists buy_now_price numeric(14,2);
alter table public.listings add column if not exists auction_ends_at timestamptz;
alter table public.listings add column if not exists discount text;
create index if not exists listings_auction_ends_idx on public.listings(auction_ends_at);
