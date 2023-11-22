export default function Image({
    src,
    alt,
    style,
                              }) {
    return (
        <img
            src={src}
            alt={alt}
            style={{
            width: "25px",
            height: "25px",
            ...style,
        }} />
    )
}