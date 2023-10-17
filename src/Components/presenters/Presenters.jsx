import '../../css/Presenters.css'
import DATA from '../../assets/people.json'
import PresenterCard from './PresenterCard'
const _data = DATA[1]
export default function Presenters() {


    return (
        <div className="presenters-container">
            {_data.people.map(item => {
                return (
                    <PresenterCard
                    name={item.name}
                    desc={item.about}/>
                )
            })}
        </div>
    )
}