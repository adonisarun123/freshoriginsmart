-- 0010_product_images.sql
-- Adds a primary image URL to products and sets the four packshots that have
-- real photography. Images are hosted on ImageKit (full https URLs). The app's
-- resolver passes full URLs through unchanged, so any CDN works here.
-- Products without an image_url fall back to the brand SVG illustration, so this
-- is safe to run before/without every product having a photo.

alter table products
  add column if not exists image_url text;

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/kichdi-fresh-origins.png'
  where slug = 'metabolic-balance-khichdi';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/adai-mix-fresh-origins.png'
  where slug = 'protein-and-fibre-adai-mix';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/roti-mix-fresh-origins.png'
  where slug = 'gluten-free-protein-and-fibre-roti-mix';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/kanji-mix-fresh-origins.png'
  where slug = 'heritage-gut-fibre-kanji-mix';
