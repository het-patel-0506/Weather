import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TempChart({ data = [], unit = "C", theme = "dark" }) {
  // Generate mock hourly data if none provided
  const mockData = data.length > 0 ? data : [
    { time: "00:00", temp: 18, feels: 16, humidity: 85 },
    { time: "03:00", temp: 16, feels: 14, humidity: 88 },
    { time: "06:00", temp: 15, feels: 13, humidity: 90 },
    { time: "09:00", temp: 19, feels: 18, humidity: 75 },
    { time: "12:00", temp: 24, feels: 25, humidity: 60 },
    { time: "15:00", temp: 26, feels: 28, humidity: 55 },
    { time: "18:00", temp: 23, feels: 24, humidity: 65 },
    { time: "21:00", temp: 20, feels: 19, humidity: 70 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`backdrop-blur-xl rounded-lg p-3 shadow-2xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-white/10 border border-white/20"
            : "bg-white/90 border border-slate-200/70"
        }`}>
          <p className={`text-sm font-medium transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>{`Time: ${label}`}</p>
          <p className={`text-sm transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            {`Temperature: ${payload[0]?.value || 0}°${unit}`}
          </p>
          <p className={`text-sm transition-colors ${
            theme === "dark" ? "text-white/70" : "text-slate-600"
          }`}>
            {`Feels like: ${payload[1]?.value || 0}°${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${
      theme === "dark" 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-slate-200/50"
    }`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors ${
        theme === "dark" ? "text-white" : "text-slate-900"
      }`}>24-Hour Temperature Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
            />
            <XAxis 
              dataKey="time" 
              stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="feels" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: 'white' }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span className={`transition-colors ${
            theme === "dark" ? "text-white/70" : "text-slate-600"
          }`}>Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-500 border-dashed border-t-2 border-purple-500"></div>
          <span className={`transition-colors ${
            theme === "dark" ? "text-white/70" : "text-slate-600"
          }`}>Feels like</span>
        </div>
      </div>
    </div>
  );
}
