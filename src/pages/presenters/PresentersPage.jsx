import usePresenterPage from './usePresentersPage.js'
import Presenters from '../../Components/presenters/Presenters.jsx'
import PresenterCard from "../../Components/presenters/PresenterCard";

export default function PresenterPage() {
    const {
        teachers
    } = usePresenterPage()
    return (
        <div>
            {!teachers ? (
                <h1 style={{ height: "1000px" }}>loading</h1>
            ) : (
                <div className="presenters-container">
                    {
                        teachers.map(item => {
                            return (
                                <PresenterCard
                                    name={item.name}
                                    desc={item.workplace}
                                    photo={item.pic}

                                />
                            )
                        })
                    }
                </div>
            )}
        </div>
    )
}