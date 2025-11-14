import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceCard } from "@/components/PerformanceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Artists() {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [performances, setPerformances] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    if (id) {
      fetchArtist();
      fetchPerformances();
    }
  }, [id, platformFilter, typeFilter, yearFilter]);

  const fetchArtist = async () => {
    const { data } = await supabase
      .from("artists")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setArtist(data);
  };

  const fetchPerformances = async () => {
    let query = supabase
      .from("performances")
      .select("*")
      .eq("artist_id", id);

    if (platformFilter !== "all") {
      query = query.eq("platform", platformFilter as any);
    }
    if (typeFilter !== "all") {
      query = query.eq("performance_type", typeFilter as any);
    }
    if (yearFilter !== "all") {
      query = query.eq("year", parseInt(yearFilter));
    }

    const { data } = await query.order("published_at", { ascending: false });
    if (data) setPerformances(data);
  };

  if (!artist) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Artist Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img
            src={artist.picture_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"}
            alt={artist.name}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-card"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{artist.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {performances.length} performances available
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="archive">Archive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="acoustic">Acoustic</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="concert">Concert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Array.from({ length: 50 }, (_, i) => 2024 - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Performances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {performances.map((perf) => (
            <PerformanceCard
              key={perf.id}
              id={perf.id}
              title={perf.title}
              artistName={artist.name}
              thumbnailUrl={perf.thumbnail_url}
              platform={perf.platform}
              year={perf.year}
              tags={perf.tags}
            />
          ))}
        </div>

        {performances.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No performances found with these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
