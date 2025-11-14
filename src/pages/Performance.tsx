import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export default function Performance() {
  const { id } = useParams();
  const [performance, setPerformance] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchPerformance();
    }
  }, [id]);

  const fetchPerformance = async () => {
    const { data } = await supabase
      .from("performances")
      .select(`
        *,
        artists (*)
      `)
      .eq("id", id)
      .single();

    if (data) {
      setPerformance(data);
      setArtist(data.artists);
    }
  };

  if (!performance || !artist) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const getEmbedUrl = () => {
    if (performance.platform === "youtube") {
      return `https://www.youtube.com/embed/${performance.platform_video_id}`;
    }
    return performance.embed_url;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link to={`/artists/${artist.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {artist.name}
          </Button>
        </Link>

        {/* Video Player */}
        <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-card bg-black">
          <iframe
            src={getEmbedUrl()}
            title={performance.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Performance Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{performance.platform}</Badge>
              {performance.performance_type && (
                <Badge variant="outline">{performance.performance_type}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{performance.title}</h1>
            <Link to={`/artists/${artist.id}`}>
              <p className="text-xl text-primary hover:underline">{artist.name}</p>
            </Link>
          </div>

          {performance.published_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(performance.published_at).toLocaleDateString()}</span>
            </div>
          )}

          {performance.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{performance.description}</p>
            </div>
          )}

          {performance.tags && performance.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4" />
                <h2 className="text-xl font-semibold">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {performance.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
