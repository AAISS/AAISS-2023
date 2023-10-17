import '../css/PresenterCard.css'
import Image from './image/Image'
import IMG from '../assets/brain.png'
export default function PresenterCard({ name, photo, link, desc }) {

    return (
        <div className="presenter-card">
            <Image
            src={IMG}
            style={{
                width: "400px",
                height: "inherit",
            }}/>
            <h1>NAME</h1>
            <p>ABOUT HIM</p>
        </div>
    )
}
