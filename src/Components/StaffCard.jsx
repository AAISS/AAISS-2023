import IMG from '../assets/brain.png'
import Image from './image/Image'
import "../css/StaffCard.css"
export default function StaffCard({
    name,
    image,
    role
}) {
    return (
        <div className="staff-card">
            <Image
            src={IMG}
            style={{
                width: "200px",
                height: "inherit",
            }}/>
            <h1>NAME</h1>
            <h3>ROLE</h3>
        </div>
    )
}