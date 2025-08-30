import { Star } from 'lucide-react';
import { SOCIAL_PROOF } from '@/lib/constants';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export function TestimonialCard({ name, role, content, rating, avatar }: TestimonialCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
          {avatar}
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-sm mb-4">"{content}"</p>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-muted-foreground'}`} 
          />
        ))}
      </div>
    </div>
  );
}

// Define the testimonial type based on the structure in constants.ts
type Testimonial = {
  name: string;
  role: string;
  content: string;
  avatar: string;
};

type TestimonialWithRating = Testimonial & {
  rating: 5;
};

export function Testimonials() {
  // Create a new array with the rating property added
  const testimonials: TestimonialWithRating[] = (SOCIAL_PROOF.TESTIMONIALS as unknown as Testimonial[]).map((testimonial) => ({
    ...testimonial,
    rating: 5 as const
  }));

  return (
    <div className="text-center mb-8">
      <h3 className="text-2xl font-semibold mb-2">Real Results from Our Funnel System</h3>
      <p className="text-muted-foreground mb-8">See how entrepreneurs like you built profitable sales funnels</p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
}
