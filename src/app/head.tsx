export default function Head() {
    return (
        <>
            <link
                rel="preload"
                as="image"
                href="/herobg.webp"
                imageSrcSet="/smallmobileherobg.webp 480w, /mobileherobg.webp 768w, /herobg.webp 1200w"
                imageSizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 100vw"
                type="image/webp"
            />
        </>
    )
}
