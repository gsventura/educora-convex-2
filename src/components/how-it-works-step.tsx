import { ReactNode } from "react";

interface HowItWorksStepProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function HowItWorksStep({
  icon,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="bg-indigo-100 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
