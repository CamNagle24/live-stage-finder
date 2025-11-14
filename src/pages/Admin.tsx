import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Admin() {
  const [artistName, setArtistName] = useState("");
  const [artistPicture, setArtistPicture] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("artists")
      .insert([{ name: artistName, picture_url: artistPicture }]);

    if (error) {
      toast.error("Failed to add artist");
    } else {
      toast.success("Artist added successfully!");
      setArtistName("");
      setArtistPicture("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="performances">Performances</TabsTrigger>
          </TabsList>

          <TabsContent value="artists">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Add New Artist</h2>
              <form onSubmit={handleAddArtist} className="space-y-4">
                <div>
                  <Label htmlFor="artistName">Artist Name</Label>
                  <Input
                    id="artistName"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Enter artist name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="artistPicture">Picture URL</Label>
                  <Input
                    id="artistPicture"
                    value={artistPicture}
                    onChange={(e) => setArtistPicture(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Artist"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="performances">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Add New Performance</h2>
              <p className="text-muted-foreground">
                Performance management coming soon. Use the backend API to add performances for now.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
