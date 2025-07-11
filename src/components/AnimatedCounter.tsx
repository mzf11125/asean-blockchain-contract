
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  trend?: string;
  duration?: number;
}

export function AnimatedCounter({ value, trend, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [displayTrend, setDisplayTrend] = useState("0%");

  useEffect(() => {
    // Extract numeric value from string like "1,247"
    const numericValue = parseInt(value.replace(/,/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    // Animate the counter
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(numericValue * easeOutQuart);
      
      setDisplayValue(currentValue.toLocaleString());
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100);

    return () => clearTimeout(timer);
  }, [value, duration]);

  useEffect(() => {
    if (trend) {
      // Animate trend percentage
      const trendValue = parseFloat(trend.replace(/[+%]/g, ''));
      if (!isNaN(trendValue)) {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentTrend = (trendValue * easeOutQuart).toFixed(1);
          
          setDisplayTrend(`+${currentTrend}%`);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        const timer = setTimeout(() => {
          requestAnimationFrame(animate);
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [trend, duration]);

  return (
    <>
      <div className="text-2xl font-bold text-foreground mb-1">
        {displayValue}
      </div>
      {trend && (
        <span className="text-xs font-medium text-success">
          {displayTrend}
        </span>
      )}
    </>
  );
}
