import Image from "../image/Image"
import IMG from "../../assets/brain.png"
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
            <h1>{name}</h1>
            <h3>{role}</h3>
        </div>
    )
}