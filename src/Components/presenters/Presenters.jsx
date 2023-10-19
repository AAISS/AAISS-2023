import '../../css/Presenters.css'
import PresenterCard from './PresenterCard'

export default function Presenters({presenters}) {


    return (
        <div className="presenters-container">
            {presenters && presenters.map(item => {
                return (
                    <PresenterCard
                    name={item.name}
                    desc={item.bio}/>
                )
            })}
        </div>
    )
}