import usePresenterPage from './usePresentersPage.js'
import Presenters from '../../Components/presenters/Presenters.jsx'

export default function PresenterPage() {
    const {
        teachers
    } = usePresenterPage()
    return (
        <main>
            <Presenters presenters={teachers}/>
        </main>
    )
}