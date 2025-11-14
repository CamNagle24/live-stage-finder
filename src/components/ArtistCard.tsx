import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ArtistCardProps {
  id: string;
  name: string;
  pictureUrl?: string;
  performanceCount?: number;
}

export const ArtistCard = ({ id, name, pictureUrl, performanceCount }: ArtistCardProps) => {
  return (
    <Link to={`/artists/${id}`}>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary transition-smooth shadow-card hover:shadow-glow">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={pictureUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
          {performanceCount !== undefined && (
            <p className="text-sm text-muted-foreground">{performanceCount} performances</p>
          )}
        </div>
      </Card>
    </Link>
  );
};
