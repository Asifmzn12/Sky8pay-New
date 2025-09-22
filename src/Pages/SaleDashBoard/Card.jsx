
const Card = ({ title, value, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-gray-800 dark:text-gray-100 font-medium">{title}</p>
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">₹</div>
        <span className="text-red-500 font-semibold">{value}</span>
      </div>
    </div>
  )
}


export default Card