import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface CarouselCard {
  imageUrl?: string;
  headline?: string;
  description?: string;
  callToAction?: string;
}

interface FacebookCarouselPreviewProps {
  primaryText?: string;
  cards?: CarouselCard[];
  clientName?: string;
  clientLogoUrl?: string;
}

export const FacebookCarouselPreview = ({
  primaryText,
  cards = [
    { imageUrl: "", headline: "Card 1 Headline", description: "Card 1 description", callToAction: "Learn More" },
    { imageUrl: "", headline: "Card 2 Headline", description: "Card 2 description", callToAction: "Learn More" },
    { imageUrl: "", headline: "Card 3 Headline", description: "Card 3 description", callToAction: "Learn More" },
  ],
  clientName = "Your Brand",
  clientLogoUrl,
}: FacebookCarouselPreviewProps) => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const card = cards[currentCard];

  return (
    <div className="w-full max-w-[500px] bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Profile Header */}
      <div className="p-3 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {clientLogoUrl ? (
            <img src={clientLogoUrl} alt={clientName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">L</span>
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">{clientName}</div>
          <div className="text-xs text-muted-foreground">Sponsored · 🌎</div>
        </div>
        <div className="text-muted-foreground text-xl">⋯</div>
      </div>

      {/* Primary Text */}
      {primaryText && (
        <div className="px-3 pb-2">
          <p className="text-sm text-foreground">{primaryText}</p>
        </div>
      )}

      {/* Carousel Card */}
      <div className="relative group">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.headline} className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Card {currentCard + 1} Image</span>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentCard > 0 && (
          <button
            onClick={prevCard}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
        )}
        {currentCard < cards.length - 1 && (
          <button
            onClick={nextCard}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        )}

        {/* Card Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {cards.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentCard ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Content Below Image */}
      <div className="bg-muted/30 px-3 pt-3 pb-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">www.website.com</div>
        {card.headline && <div className="font-semibold text-sm text-foreground mb-1">{card.headline}</div>}
        {card.description && (
          <p className="text-xs text-muted-foreground mb-3">{card.description}</p>
        )}
        {card.callToAction && (
          <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent">
            {card.callToAction}
          </Button>
        )}
      </div>

      {/* Engagement Bar */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center text-muted-foreground text-xs mb-2">
          <span>👍❤️ 0</span>
        </div>
        <div className="flex items-center justify-around border-t border-border pt-1">
          <button className="flex items-center gap-1 py-1 px-3 hover:bg-muted/50 rounded text-muted-foreground text-sm">
            <ThumbsUp className="w-4 h-4" />
            Like
          </button>
          <button className="flex items-center gap-1 py-1 px-3 hover:bg-muted/50 rounded text-muted-foreground text-sm">
            <MessageCircle className="w-4 h-4" />
            Comment
          </button>
          <button className="flex items-center gap-1 py-1 px-3 hover:bg-muted/50 rounded text-muted-foreground text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
