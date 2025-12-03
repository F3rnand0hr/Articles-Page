-- Create a function to increment likes for an article
CREATE OR REPLACE FUNCTION public.increment_likes(article_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE articles 
  SET likes_count = COALESCE(likes_count, 0) + 1 
  WHERE id = article_id;
$$;

-- Create a function to decrement likes for an article
CREATE OR REPLACE FUNCTION public.decrement_likes(article_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE articles 
  SET likes_count = GREATEST(COALESCE(likes_count, 1) - 1, 0)
  WHERE id = article_id;
$$;
