function DashboardCards() {
  const cards = [
    { label: "Today's Revenue", value: 'Rp 12,450,000', change: '+12.5%', changeType: 'positive' },
    { label: "Today's Orders", value: '89', change: '+8.2%', changeType: 'positive' },
    { label: 'Total Customers', value: '1,234', change: '+3.1%', changeType: 'positive' },
    { label: 'Weekly Revenue', value: 'Rp 85,200,000', change: '-2.4%', changeType: 'negative' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {card.label}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <span className={`text-sm font-semibold ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;