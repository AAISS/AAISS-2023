import "./obj-list-table.css"
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default function ObjListTable({
                                         data,
                                         title
                                     }) {

    return (
        <section>
            {!data || Object.keys(data).length === 0 ? <h1 id="loading">loading...</h1> :
                <div>
                    <section className={"table-container"}>
                        <h3>{title}</h3>
                        <TableContainer>
                            <Table sx={{
                                "& .MuiTableRow-root:hover:not(.MuiTableRow-head)": {
                                    backgroundColor: "#ec6803"
                                }
                            }} cellSpacing={0}>
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(data[0]).map(name => {
                                            return (
                                                <TableCell key={name}>
                                                    {name}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((item, index) => {
                                        return (
                                            <TableRow
                                                sx={{
                                                    "& .MuiTableRow-root:hover": {
                                                        backgroundColor: "#ff0000"
                                                    }
                                                }}
                                                key={index}>
                                                {Object.keys(item).map((name, secondIndex) => {
                                                    return (
                                                        <TableCell

                                                            key={secondIndex}
                                                            sx={{
                                                                "& .MuiTableRow-root:hover": {
                                                                    backgroundColor: "#ff0000"
                                                                }
                                                            }}
                                                        >
                                                            {item[name]}
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </section>
                </div>
            }
            {data && Object.keys(data).length === 0 && "Nothing to display!"}
        </section>
    )
}