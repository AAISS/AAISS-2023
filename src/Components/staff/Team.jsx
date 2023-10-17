import StaffCard from './StaffCard.jsx'
// import '../../css/Team.css'
import DATA from '../../assets/people.json'

console.log(DATA[0])
export default function({ section }) {
    return (
        <div className="team-container">
            <h1>{section}</h1>
            <div className="team-people-container">
                {DATA[0].people.map(item => { 
                    return (<StaffCard 
                    name={item.name}
                    role={item.role}/>)
                })}
            </div>
        </div>
    )
}