"use client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#F5A30A", "#3D0F0A", "#E8590C", "#FACC15", "#9A3412", "#A16207"];
type Point = { name: string; value: number };

export function BarCard({ title, data }: { title: string; data: Point[] }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader><CardTitle className="text-base font-bold text-brand">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={32} />
              <Tooltip />
              <Bar dataKey="value" fill="#F5A30A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PieCard({ title, data }: { title: string; data: Point[] }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <Card className="border shadow-sm">
      <CardHeader><CardTitle className="text-base font-bold text-brand">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64">
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {filtered.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const toPoints = (m: Record<string, number> = {}): Point[] => Object.entries(m).map(([name, value]) => ({ name, value }));