-- Create a function to increment article likes
CREATE OR REPLACE FUNCTION public.increment_article_likes(article_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE articles 
  SET likes_count = COALESCE(likes_count, 0) + 1 
  WHERE id = article_id;
$$;

-- Create a function to decrement article likes
CREATE OR REPLACE FUNCTION public.decrement_article_likes(article_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE articles 
  SET likes_count = GREATEST(COALESCE(likes_count, 1) - 1, 0)
  WHERE id = article_id;
$$;
