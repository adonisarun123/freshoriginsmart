-- 0010_product_images.sql
-- Adds a single primary image URL to products and sets the four packshots that
-- have real photography. Images live in a PUBLIC Supabase Storage bucket named
-- `product-images`. Products without an image_url fall back to the brand SVG
-- illustration in the app, so this is safe to run before the files are uploaded.

alter table products
  add column if not exists image_url text;

-- Set the four packshots by slug. The path after /object/public/product-images/
-- must match the file name you upload to the bucket exactly (case-sensitive).
-- These are stored as bucket-relative paths; the app resolves them to a full
-- public URL using NEXT_PUBLIC_SUPABASE_URL, so you don't hardcode the project ref here.

update products set image_url = 'metabolic-balance-khichdi.png'
  where slug = 'metabolic-balance-khichdi';

update products set image_url = 'protein-and-fibre-adai-mix.png'
  where slug = 'protein-and-fibre-adai-mix';

update products set image_url = 'gluten-free-protein-and-fibre-roti-mix.png'
  where slug = 'gluten-free-protein-and-fibre-roti-mix';

update products set image_url = 'heritage-gut-fibre-kanji-mix.png'
  where slug = 'heritage-gut-fibre-kanji-mix';
