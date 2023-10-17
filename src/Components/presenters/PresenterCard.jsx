import '../../css/PresenterCard.css'
import Image from '../image/Image'
import IMG from '../../assets/brain.png'
export default function PresenterCard({ name, photo, link, desc }) {

    return (
        <div className="presenter-card">
            <Image
            src={IMG}
            style={{
                width: "400px",
                height: "inherit",
            }}/>
            <h1>{name}</h1>
            <p>{desc}</p>
        </div>
    )
}
