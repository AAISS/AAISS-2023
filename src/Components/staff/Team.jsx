import StaffCard from './StaffCard.jsx'
import '../../css/Team.css'

export default function({ people }) {
    return (
        <div className="team-container">
            <h1>{section}</h1>
            <div className="team-people-container">
                {people.map(item => { 
                    return (<StaffCard 
                    name={item.name}
                    role={item.role}/>)
                })}
            </div>
        </div>
    )
}