import "./obj-list-table.css"

export default function ObjListTable({
                                         data,
                                         title
                                     }) {

    console.log(data)


    return (
        <section>
            {!data || Object.keys(data).length === 0 ? <h1 style={{height: "500px"}}>loading...</h1> :
                <div>
                    <section className={"table-container"}>
                        <h3>{title}</h3>
                        <table cellSpacing={0}>
                            <thead>
                            <tr>
                                {Object.keys(data[0]).map(name => {
                                    return (
                                        <td key={name}>
                                            {name}
                                        </td>
                                    )
                                })}
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {Object.keys(item).map(name => {
                                            return (
                                                <td>
                                                    {item[name]}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </section>
                </div>
            }
        </section>
    )
}