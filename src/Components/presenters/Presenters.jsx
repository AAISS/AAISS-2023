import '../../css/Presenters.css'
import PresenterCard from './PresenterCard'

export default function Presenters({presenters}) {


    return (
        <div className="presenters-container">
            {!presenters ? <h1 style={{color: "white"}}>loading</h1> : presenters.map(item => {
                return (
                    <PresenterCard
                    name={item.name}
                    desc={item.bio}/>
                )
            })}
        </div>
    )
}