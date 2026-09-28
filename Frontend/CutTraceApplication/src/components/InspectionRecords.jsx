import StatusHistoryCard from './StatusHistoryCard.jsx'
import InspectionValuesCard from './InspectionValuesCard.jsx'

const InspectionRecords = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8">
      <StatusHistoryCard />
      <InspectionValuesCard />
    </div>
  )
}

export default InspectionRecords