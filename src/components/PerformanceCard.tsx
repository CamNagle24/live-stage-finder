import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play } from "lucide-react";

interface PerformanceCardProps {
  id: string;
  title: string;
  artistName: string;
  thumbnailUrl?: string;
  platform: string;
  year?: number;
  tags?: string[];
}

export const PerformanceCard = ({ 
  id, 
  title, 
  artistName, 
  thumbnailUrl, 
  platform,
  year,
  tags = []
}: PerformanceCardProps) => {
  return (
    <Link to={`/performances/${id}`}>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary transition-smooth shadow-card hover:shadow-glow">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={thumbnailUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
          <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
            {platform}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{artistName}</p>
          {year && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{year}</span>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
