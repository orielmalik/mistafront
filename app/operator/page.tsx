// app/operator/page.tsx
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trophy, User } from "lucide-react"

const runs = [
    { id: "r1", userId: "u123", graph: "Premium Lead", score: 87, goalReached: true, location: "Tel Aviv", time: "2 min ago" },
    { id: "r2", userId: "u456", graph: "Job Candidate", score: 92, goalReached: true, location: "Jerusalem", time: "5 min ago" },
    { id: "r3", userId: "u789", graph: "Health Risk", score: 34, goalReached: false, location: null, time: "12 min ago" },
]

export default function OperatorPanel() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Live User Activity</h1>

            <Table>
                <thead>
                <tr>
                    <th>User</th>
                    <th>Flow</th>
                    <th>Score</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {runs.map(r => (
                    <tr key={r.id}>
                        <td className="font-medium">{r.userId}</td>
                        <td>{r.graph}</td>
                        <td><Badge variant={r.score > 70 ? "default" : "secondary"}>{r.score}</Badge></td>
                        <td>{r.location ? <><MapPin className="w-4 h-4 inline" /> {r.location}</> : "-"}</td>
                        <td>
                            {r.goalReached ? (
                                <Badge className="bg-emerald-600"><Trophy className="w-3 h-3 mr-1" /> Goal Reached</Badge>
                            ) : (
                                <Badge variant="secondary">In Progress</Badge>
                            )}
                        </td>
                        <td className="text-muted-foreground">{r.time}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}