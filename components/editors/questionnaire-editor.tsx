"use client"

import type { Node } from "@/types/graph"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface QuestionnaireEditorProps {
  node: Node
  onUpdate: (data: any) => void
}

export default function QuestionnaireEditor({ node, onUpdate }: QuestionnaireEditorProps) {
  const data = node.data as any
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null)
  const [editingAnswerIdx, setEditingAnswerIdx] = useState<[number | null, number | null]>([null, null])

  const addQuestion = () => {
    const newQuestions = [...(data.questions || []), `Question ${(data.questions?.length || 0) + 1}`]
    const newAnswers = [...(data.answers || []), [`Answer 1`, `Answer 2`]]
    const newScoresPerAnswer = [...(data.scorePerAnswer || []), [1, 2]]
    const newScoresPerQuestion = [...(data.scorePerQuestion || []), 3]

    onUpdate({
      questions: newQuestions,
      answers: newAnswers,
      scorePerAnswer: newScoresPerAnswer,
      scorePerQuestion: newScoresPerQuestion,
    })
  }

  const updateQuestion = (idx: number, value: string) => {
    const newQuestions = [...data.questions]
    newQuestions[idx] = value
    onUpdate({ questions: newQuestions })
  }

  const deleteQuestion = (idx: number) => {
    onUpdate({
      questions: data.questions.filter((_: any, i: number) => i !== idx),
      answers: data.answers.filter((_: any, i: number) => i !== idx),
      scorePerAnswer: data.scorePerAnswer.filter((_: any, i: number) => i !== idx),
      scorePerQuestion: data.scorePerQuestion.filter((_: any, i: number) => i !== idx),
    })
  }

  const addAnswer = (questionIdx: number) => {
    const newAnswers = [...data.answers]
    newAnswers[questionIdx] = [...newAnswers[questionIdx], `Answer ${newAnswers[questionIdx].length + 1}`]

    const newScores = [...data.scorePerAnswer]
    newScores[questionIdx] = [...newScores[questionIdx], 1]

    onUpdate({
      answers: newAnswers,
      scorePerAnswer: newScores,
    })
  }

  const updateAnswer = (qIdx: number, aIdx: number, value: string) => {
    const newAnswers = [...data.answers]
    newAnswers[qIdx][aIdx] = value
    onUpdate({ answers: newAnswers })
  }

  const deleteAnswer = (qIdx: number, aIdx: number) => {
    if (data.answers[qIdx].length <= 2) return // Minimum 2 answers

    const newAnswers = [...data.answers]
    newAnswers[qIdx] = newAnswers[qIdx].filter((_: any, i: number) => i !== aIdx)

    const newScores = [...data.scorePerAnswer]
    newScores[qIdx] = newScores[qIdx].filter((_: any, i: number) => i !== aIdx)

    onUpdate({
      answers: newAnswers,
      scorePerAnswer: newScores,
    })
  }

  const updateAnswerScore = (qIdx: number, aIdx: number, score: number) => {
    const newScores = [...data.scorePerAnswer]
    newScores[qIdx][aIdx] = score
    onUpdate({ scorePerAnswer: newScores })
  }

  const updateQuestionScore = (qIdx: number, score: number) => {
    const newScores = [...data.scorePerQuestion]
    newScores[qIdx] = score
    onUpdate({ scorePerQuestion: newScores })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-foreground">Category</label>
        <input
          type="text"
          value={data.category || ""}
          onChange={(e) => onUpdate({ category: e.target.value })}
          className="mt-1 w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="General"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">Questions</label>
          <Button size="sm" onClick={addQuestion} className="gap-1">
            <Plus className="w-3 h-3" /> Add Question
          </Button>
        </div>

        <div className="space-y-3">
          {(data.questions || []).map((question: string, qIdx: number) => (
            <div key={qIdx} className="bg-background p-3 rounded border border-border space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => updateQuestion(qIdx, e.target.value)}
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="w-16">
                  <label className="text-xs text-muted-foreground block mb-1">Score</label>
                  <input
                    type="number"
                    value={data.scorePerQuestion?.[qIdx] || 0}
                    onChange={(e) => updateQuestionScore(qIdx, Number.parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-card border border-border rounded text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteQuestion(qIdx)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-2 pl-2 border-l border-border">
                <div className="text-xs font-medium text-muted-foreground">Answers:</div>
                {(data.answers?.[qIdx] || []).map((answer: string, aIdx: number) => (
                  <div key={aIdx} className="flex gap-2 items-center">
                    <div className="w-6">
                      <input
                        type="number"
                        value={data.scorePerAnswer?.[qIdx]?.[aIdx] || 0}
                        onChange={(e) => updateAnswerScore(qIdx, aIdx, Number.parseInt(e.target.value) || 0)}
                        className="w-full px-1 py-1 bg-card border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        title="Score"
                      />
                    </div>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => updateAnswer(qIdx, aIdx, e.target.value)}
                      className="flex-1 px-2 py-1 bg-card border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAnswer(qIdx, aIdx)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 px-1"
                      disabled={data.answers[qIdx].length <= 2}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => addAnswer(qIdx)} className="w-full gap-1 text-xs">
                  <Plus className="w-3 h-3" /> Add Answer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
