'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UsageData {
  timestamp: string
  requests: number
}

// Fixed dummy data to avoid changing values on re-render
const DUMMY_DATA: UsageData[] = [
  { timestamp: '2024-02-20', requests: 245 }, // Tuesday - high usage
  { timestamp: '2024-02-21', requests: 312 }, // Wednesday - peak
  { timestamp: '2024-02-22', requests: 289 }, // Thursday
  { timestamp: '2024-02-23', requests: 198 }, // Friday
  { timestamp: '2024-02-24', requests: 87 },  // Saturday - weekend dip
  { timestamp: '2024-02-25', requests: 92 },  // Sunday - weekend dip
  { timestamp: '2024-02-26', requests: 267 }  // Monday - back to high
]

export default function AgentUsageGraph() {
  const maxRequests = Math.max(...DUMMY_DATA.map(d => d.requests))
  // Round up to nearest hundred for y-axis max
  const yAxisMax = Math.ceil(maxRequests / 100) * 100
  
  // Generate y-axis labels
  const yAxisLabels = Array.from({ length: 5 }, (_, i) => 
    Math.round(yAxisMax - (i * (yAxisMax / 4)))
  )
  
  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white">Requests Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {/* Y-axis */}
          <div className="flex gap-2">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-[160px] text-xs text-gray-400 pr-2">
              {yAxisLabels.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            
            {/* Graph content */}
            <div className="flex-1">
              {/* Grid lines */}
              <div className="relative h-[160px]">
                {yAxisLabels.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-full border-t border-gray-800"
                    style={{
                      top: `${(index * 100) / (yAxisLabels.length - 1)}%`,
                      height: 1
                    }}
                  />
                ))}
                
                {/* Bars */}
                <div className="absolute inset-0 flex gap-2">
                  {DUMMY_DATA.map((day) => (
                    <div key={day.timestamp} className="flex-1 flex flex-col justify-end">
                      <div 
                        className="w-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-sm relative group"
                        style={{ 
                          height: `${(day.requests / yAxisMax) * 100}%`,
                        }}
                      >
                        <div 
                          className="w-full bg-purple-500 rounded-sm transition-all duration-500"
                          style={{ 
                            height: '100%',
                            opacity: 0.7
                          }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
                          {day.requests.toLocaleString()} requests
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-2">
                {DUMMY_DATA.map((day) => (
                  <div key={day.timestamp} className="flex-1 text-center">
                    <span className="text-xs text-gray-400">
                      {new Date(day.timestamp).toLocaleDateString('en-US', { 
                        weekday: 'short'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 