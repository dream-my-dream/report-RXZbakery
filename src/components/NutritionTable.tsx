import { NutritionInfo } from "@/lib/index";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface NutritionTableProps {
  nutrition: NutritionInfo;
  allergens: string[];
}

export function NutritionTable({ nutrition, allergens }: NutritionTableProps) {
  const nutritionData = [
    { label: "熱量", value: nutrition.calories, unit: "kcal" },
    { label: "蛋白質", value: nutrition.protein, unit: "g" },
    { label: "脂肪", value: nutrition.fat, unit: "g" },
    { label: "碳水化合物", value: nutrition.carbohydrates, unit: "g" },
    { label: "鈉", value: nutrition.sodium, unit: "mg" },
    { label: "膳食纖維", value: nutrition.fiber, unit: "g" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="bg-secondary/30 px-6 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">營養標示（每100g）</h3>
        </div>
        <div className="divide-y divide-border">
          {nutritionData.map((item, index) => (
            <div
              key={item.label}
              className={`px-6 py-3 flex justify-between items-center transition-colors ${
                index % 2 === 0 ? "bg-background" : "bg-muted/30"
              }`}
            >
              <span className="text-foreground font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {item.value} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {allergens.length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-destructive">過敏原資訊</h3>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <Badge
                    key={allergen}
                    variant="destructive"
                    className="rounded-full px-3 py-1"
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
