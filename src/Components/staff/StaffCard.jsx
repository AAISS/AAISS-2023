import Image from "../image/Image"
import '../../css/StaffCard.css'
export default function StaffCard({
    name,
    photo,
    role
}) {
    return (
        <div className="staff-card">
            <Image
            src={photo}
            style={{
                width: "200px",
                height: "inherit",
            }}/>
            <h1 style={{fontSize: '20px'}}>{name}</h1>
            <h3 style={{fontSize: '20px'}}>{role}</h3>
        </div>
    )
}