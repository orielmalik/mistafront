"use client"

import type { Node } from "@/types/graph"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface ScoringNodeEditorProps {
  node: Node
  onUpdate: (data: any) => void
}

export default function ScoringNodeEditor({ node, onUpdate }: ScoringNodeEditorProps) {
  const data = node.data

  return (
    <div className="space-y-6 p-4">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Gender Filter</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={data.filterGender?.male ?? false}
              onCheckedChange={(checked) =>
                onUpdate({
                  filterGender: {
                    ...data.filterGender,
                    male: checked,
                  },
                })
              }
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Male</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={data.filterGender?.female ?? false}
              onCheckedChange={(checked) =>
                onUpdate({
                  filterGender: {
                    ...data.filterGender,
                    female: checked,
                  },
                })
              }
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Female</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Position</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={data.filterPosition?.operator ?? false}
              onCheckedChange={(checked) =>
                onUpdate({
                  filterPosition: {
                    ...data.filterPosition,
                    operator: checked,
                  },
                })
              }
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Operator only</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Age Range: {data.ageRange?.min ?? 18} – {data.ageRange?.max ?? 65}
        </h4>
        <div className="space-y-2">
          <Slider
            min={18}
            max={100}
            step={1}
            defaultValue={[data.ageRange?.min ?? 18]}
            onValueChange={(val) =>
              onUpdate({
                ageRange: { ...data.ageRange, min: val[0] },
              })
            }
          />
          <Slider
            min={18}
            max={100}
            step={1}
            defaultValue={[data.ageRange?.max ?? 65]}
            onValueChange={(val) =>
              onUpdate({
                ageRange: { ...data.ageRange, max: val[0] },
              })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fixed Score</label>
        <input
          type="number"
          value={data.fixedScore ?? 0}
          onChange={(e) => onUpdate({ fixedScore: Number.parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  )
}
