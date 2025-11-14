-- Create enum for platform types
CREATE TYPE platform_type AS ENUM ('youtube', 'vimeo', 'archive', 'external_link');

-- Create enum for performance types
CREATE TYPE performance_type AS ENUM ('live', 'acoustic', 'festival', 'concert', 'studio', 'other');

-- Artists table
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  alt_names TEXT[] DEFAULT '{}',
  picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performances table
CREATE TABLE public.performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  platform platform_type NOT NULL,
  platform_video_id TEXT,
  embed_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  performance_type performance_type,
  year INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External platform links table (for paid services like nugs, Qello)
CREATE TABLE public.external_platform_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_platform_links ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for browsing)
CREATE POLICY "Anyone can view artists"
  ON public.artists FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view performances"
  ON public.performances FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view external links"
  ON public.external_platform_links FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_performances_artist_id ON public.performances(artist_id);
CREATE INDEX idx_performances_platform ON public.performances(platform);
CREATE INDEX idx_performances_year ON public.performances(year);
CREATE INDEX idx_performances_published_at ON public.performances(published_at DESC);
CREATE INDEX idx_external_links_artist_id ON public.external_platform_links(artist_id);

-- Full-text search indexes
CREATE INDEX idx_artists_name_search ON public.artists USING gin(to_tsvector('english', name));
CREATE INDEX idx_performances_title_search ON public.performances USING gin(to_tsvector('english', title));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performances_updated_at
  BEFORE UPDATE ON public.performances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some initial data
INSERT INTO public.artists (name, picture_url) VALUES
  ('The Rolling Stones', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'),
  ('Pink Floyd', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400'),
  ('Radiohead', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400');