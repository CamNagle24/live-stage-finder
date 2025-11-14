import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ArtistCard } from "@/components/ArtistCard";
import { PerformanceCard } from "@/components/PerformanceCard";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [artists, setArtists] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);

  useEffect(() => {
    if (query) {
      searchContent(query);
    }
  }, [query]);

  const searchContent = async (searchTerm: string) => {
    // Search artists
    const { data: artistData } = await supabase
      .from("artists")
      .select("*")
      .ilike("name", `%${searchTerm}%`);
    
    if (artistData) setArtists(artistData);

    // Search performances
    const { data: perfData } = await supabase
      .from("performances")
      .select(`
        *,
        artists (name)
      `)
      .ilike("title", `%${searchTerm}%`);
    
    if (perfData) setPerformances(perfData);
  };

  const handleSearch = () => {
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="artists">Artists ({artists.length})</TabsTrigger>
            <TabsTrigger value="performances">Performances ({performances.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {artists.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Artists</h2>
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
            )}

            {performances.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Performances</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {performances.map((perf) => (
                    <PerformanceCard
                      key={perf.id}
                      id={perf.id}
                      title={perf.title}
                      artistName={perf.artists?.name || "Unknown"}
                      thumbnailUrl={perf.thumbnail_url}
                      platform={perf.platform}
                      year={perf.year}
                      tags={perf.tags}
                    />
                  ))}
                </div>
              </div>
            )}

            {artists.length === 0 && performances.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No results found for "{query}"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="artists" className="mt-8">
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
          </TabsContent>

          <TabsContent value="performances" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {performances.map((perf) => (
                <PerformanceCard
                  key={perf.id}
                  id={perf.id}
                  title={perf.title}
                  artistName={perf.artists?.name || "Unknown"}
                  thumbnailUrl={perf.thumbnail_url}
                  platform={perf.platform}
                  year={perf.year}
                  tags={perf.tags}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
