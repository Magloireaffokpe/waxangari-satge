import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'orange' | 'green' | 'blue' | 'red'
  trend?: { value: number; label: string }
}

const colorMap = {
  orange: { bg: '#FF820015', icon: '#FF8200', border: '#FF820030' },
  green: { bg: '#4CAF1815', icon: '#4CAF18', border: '#4CAF1830' },
  blue: { bg: '#3B82F615', icon: '#3B82F6', border: '#3B82F630' },
  red: { bg: '#EF444415', icon: '#EF4444', border: '#EF444430' },
}

export function KPICard({ title, value, subtitle, icon: Icon, color = 'orange', trend }: KPICardProps) {
  const c = colorMap[color]
  return (
    <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-all duration-200" style={{ borderColor: c.border }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1.5 tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg }}>
          <Icon className="h-6 w-6" style={{ color: c.icon }} />
        </div>
      </div>
    </div>
  )
}
