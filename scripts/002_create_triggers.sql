-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Usuario')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update article likes count
CREATE OR REPLACE FUNCTION public.update_article_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.article_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Triggers for article likes count
DROP TRIGGER IF EXISTS article_likes_insert_trigger ON public.article_likes;
CREATE TRIGGER article_likes_insert_trigger
  AFTER INSERT ON public.article_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_likes_count();

DROP TRIGGER IF EXISTS article_likes_delete_trigger ON public.article_likes;
CREATE TRIGGER article_likes_delete_trigger
  AFTER DELETE ON public.article_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_likes_count();

-- Function to update article comments count
CREATE OR REPLACE FUNCTION public.update_article_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.article_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Triggers for article comments count
DROP TRIGGER IF EXISTS comments_insert_trigger ON public.comments;
CREATE TRIGGER comments_insert_trigger
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_comments_count();

DROP TRIGGER IF EXISTS comments_delete_trigger ON public.comments;
CREATE TRIGGER comments_delete_trigger
  AFTER DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_comments_count();
