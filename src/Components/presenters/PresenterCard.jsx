import '../../css/PresenterCard.css'
import Image from '../image/Image'
export default function PresenterCard({ name, photo, link, desc }) {

    return (
        <div className="presenter-card">
            <Image
            src={photo}
            style={{
                width: "300px",
                height: "inherit",
            }}/>
            <a href={link}><h1>{name}</h1></a>
            <p>{desc}</p>
        </div>
    )
}
