import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ArtistCard } from "@/components/ArtistCard";
import { PerformanceCard } from "@/components/PerformanceCard";
import { supabase } from "@/integrations/supabase/client";
import { Music2 } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [recentPerformances, setRecentPerformances] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtists();
    fetchRecentPerformances();
  }, []);

  const fetchArtists = async () => {
    const { data } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setArtists(data);
  };

  const fetchRecentPerformances = async () => {
    const { data } = await supabase
      .from("performances")
      .select(`
        *,
        artists (name)
      `)
      .order("created_at", { ascending: false })
      .limit(8);
    if (data) setRecentPerformances(data);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music2 className="w-12 h-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent gradient-primary">
                LiveStream
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Discover live performances from across the internet. All in one place.
            </p>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
            />
          </div>
        </div>
      </section>

      {/* Trending Artists */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Trending Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                id={artist.id}
                name={artist.name}
                pictureUrl={artist.picture_url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-12 px-4 pb-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPerformances.map((perf) => (
              <PerformanceCard
                key={perf.id}
                id={perf.id}
                title={perf.title}
                artistName={perf.artists?.name || "Unknown Artist"}
                thumbnailUrl={perf.thumbnail_url}
                platform={perf.platform}
                year={perf.year}
                tags={perf.tags}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
