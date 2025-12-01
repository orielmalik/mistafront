// components/editors/questionnaire-editor.tsx
"use client"

import type { Node } from "@/types/graph"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface QuestionnaireEditorProps {
  node: Node
  onUpdate: (updates: Partial<Node["data"]>) => void
}

export default function QuestionnaireEditor({ node, onUpdate }: QuestionnaireEditorProps) {
  const data = node.data

  const addQuestion = () => {
    onUpdate({
      questions: [...(data.questions || []), `Question ${(data.questions?.length || 0) + 1}`],
      answers: [...(data.answers || []), ["Option 1", "Option 2"]],
      scorePerAnswer: [...(data.scorePerAnswer || []), [1, 2]],
      scorePerQuestion: [...(data.scorePerQuestion || []), 0],
    })
  }

  const updateQuestion = (qIdx: number, value: string) => {
    const newQuestions = [...(data.questions || [])]
    newQuestions[qIdx] = value
    onUpdate({ questions: newQuestions })
  }

  const deleteQuestion = (qIdx: number) => {
    onUpdate({
      questions: data.questions?.filter((_, i) => i !== qIdx),
      answers: data.answers?.filter((_, i) => i !== qIdx),
      scorePerAnswer: data.scorePerAnswer?.filter((_, i) => i !== qIdx),
      scorePerQuestion: data.scorePerQuestion?.filter((_, i) => i !== qIdx),
    })
  }

  const addAnswer = (qIdx: number) => {
    const newAnswers = [...(data.answers || [])]
    const newScores = [...(data.scorePerAnswer || [])]
    newAnswers[qIdx] = [...(newAnswers[qIdx] || []), `Option ${(newAnswers[qIdx]?.length || 0) + 1}`]
    newScores[qIdx] = [...(newScores[qIdx] || []), 1]
    onUpdate({ answers: newAnswers, scorePerAnswer: newScores })
  }

  const updateAnswer = (qIdx: number, aIdx: number, value: string) => {
    const newAnswers = [...(data.answers || [])]
    newAnswers[qIdx][aIdx] = value
    onUpdate({ answers: newAnswers })
  }

  const updateAnswerScore = (qIdx: number, aIdx: number, score: number) => {
    const newScores = [...(data.scorePerAnswer || [])]
    newScores[qIdx][aIdx] = score
    onUpdate({ scorePerAnswer: newScores })
  }

  const deleteAnswer = (qIdx: number, aIdx: number) => {
    if ((data.answers?.[qIdx]?.length || 0) <= 2) return
    const newAnswers = data.answers?.filter((_, i) => i !== qIdx) || []
    const newScores = data.scorePerAnswer?.filter((_, i) => i !== qIdx) || []
    newAnswers[qIdx] = newAnswers[qIdx].filter((_: any, i: number) => i !== aIdx)
    newScores[qIdx] = newScores[qIdx].filter((_: any, i: number) => i !== aIdx)
    onUpdate({ answers: newAnswers, scorePerAnswer: newScores })
  }

  return (
      <div className="space-y-6">
        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-foreground">Category</label>
          <input
              type="text"
              value={data.category || ""}
              onChange={(e) => onUpdate({ category: e.target.value })}
              placeholder="e.g. Personality, Health"
              className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Questions</h3>
            <Button size="sm" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-1" /> Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {(data.questions || []).map((question: string, qIdx: number) => (
                <div key={qIdx} className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  {/* Question + Delete */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <input
                          type="text"
                          value={question}
                          onChange={(e) => updateQuestion(qIdx, e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter question"
                      />
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteQuestion(qIdx)}
                        className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Answers */}
                  <div className="space-y-3 ml-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Answers</p>
                    {(data.answers?.[qIdx] || []).map((answer: string, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-3">
                          {/* Score Input – now wide and clear */}
                          <div className="w-20 shrink-0">
                            <input
                                type="number"
                                value={data.scorePerAnswer?.[qIdx]?.[aIdx] ?? 0}
                                onChange={(e) => updateAnswerScore(qIdx, aIdx, Number(e.target.value) || 0)}
                                className="w-full px-2 py-2 bg-background border border-border rounded-md text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                            />
                          </div>

                          {/* Answer Text */}
                          <input
                              type="text"
                              value={answer}
                              onChange={(e) => updateAnswer(qIdx, aIdx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter answer option"
                          />

                          {/* Delete Answer */}
                          <Button
                              size="sm"
                              variant="ghost"
                              disabled={(data.answers?.[qIdx]?.length || 0) <= 2}
                              onClick={() => deleteAnswer(qIdx, aIdx)}
                              className="text-destructive hover:bg-destructive/10 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                    ))}

                    {/* Add Answer Button */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addAnswer(qIdx)}
                        className="w-full mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Answer
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}