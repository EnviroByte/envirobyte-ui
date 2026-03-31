"use client";

import { Clock } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you this feature. Stay tuned!",
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white rounded-lg">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-50 dark:bg-primary/20 rounded-full">
            <Clock className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-6">
          {description}
        </p>

        <div className="flex justify-center gap-2">
          <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
