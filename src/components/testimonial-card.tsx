interface TestimonialCardProps {
  initials: string;
  name: string;
  role: string;
  quote: string;
}

export function TestimonialCard({
  initials,
  name,
  role,
  quote,
}: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          <span className="text-indigo-600 font-semibold">{initials}</span>
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600">{quote}</p>
    </div>
  );
}
