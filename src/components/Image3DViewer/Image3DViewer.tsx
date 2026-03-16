import React, { useEffect, useMemo, useRef, useState } from "react";

export interface Image3DViewerProps {
    images: string[];
    width?: number | string;
    height?: number | string;
    dragSensitivity?: number; // 拖动多少像素切换一帧
    autoPlay?: boolean;
    autoPlayInterval?: number;
    loop?: boolean;
    className?: string;
    style?: React.CSSProperties;
    showControls?: boolean;
    showIndicator?: boolean;
    objectFit?: "contain" | "cover";
}

const Image3DViewer: React.FC<Image3DViewerProps> = ({
                                                         images,
                                                         width = 520,
                                                         height = 520,
                                                         dragSensitivity = 18,
                                                         autoPlay = false,
                                                         autoPlayInterval = 120,
                                                         loop = true,
                                                         className,
                                                         style,
                                                         showControls = true,
                                                         showIndicator = true,
                                                         objectFit = "contain",
                                                     }) => {
    const safeImages = useMemo(() => images.filter(Boolean), [images]);
    const total = safeImages.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartXRef = useRef(0);
    const lastXRef = useRef(0);
    const accumulatedDeltaRef = useRef(0);
    const autoPlayTimerRef = useRef<number | null>(null);

    const hasEnoughImages = total > 0;

    const goTo = (index: number) => {
        if (!hasEnoughImages) return;

        if (loop) {
            const normalized = ((index % total) + total) % total;
            setCurrentIndex(normalized);
            return;
        }

        if (index < 0) {
            setCurrentIndex(0);
            return;
        }
        if (index >= total) {
            setCurrentIndex(total - 1);
            return;
        }

        setCurrentIndex(index);
    };

    const next = () => goTo(currentIndex + 1);
    const prev = () => goTo(currentIndex - 1);

    const stopAutoPlay = () => {
        if (autoPlayTimerRef.current) {
            window.clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        if (!autoPlay || total <= 1) return;

        autoPlayTimerRef.current = window.setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (loop) {
                    return (prevIndex + 1) % total;
                }
                if (prevIndex >= total - 1) {
                    return 0;
                }
                return prevIndex + 1;
            });
        }, autoPlayInterval);
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, autoPlayInterval, total, loop]);

    const handleDragMove = (clientX: number) => {
        const deltaX = clientX - lastXRef.current;
        lastXRef.current = clientX;
        accumulatedDeltaRef.current += deltaX;

        if (Math.abs(accumulatedDeltaRef.current) >= dragSensitivity) {
            const steps = Math.floor(
                Math.abs(accumulatedDeltaRef.current) / dragSensitivity
            );

            if (accumulatedDeltaRef.current > 0) {
                // 向右拖：看前一个视角
                goTo(currentIndex - steps);
            } else {
                // 向左拖：看后一个视角
                goTo(currentIndex + steps);
            }

            accumulatedDeltaRef.current =
                accumulatedDeltaRef.current % dragSensitivity;
        }
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (total <= 1) return;
        setIsDragging(true);
        stopAutoPlay();

        dragStartXRef.current = e.clientX;
        lastXRef.current = e.clientX;
        accumulatedDeltaRef.current = 0;
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleDragMove(e.clientX);
    };

    const endMouseDrag = () => {
        if (!isDragging) return;
        setIsDragging(false);
        accumulatedDeltaRef.current = 0;
        startAutoPlay();
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (total <= 1) return;
        setIsDragging(true);
        stopAutoPlay();

        const x = e.touches[0].clientX;
        dragStartXRef.current = x;
        lastXRef.current = x;
        accumulatedDeltaRef.current = 0;
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleDragMove(e.touches[0].clientX);
    };

    const endTouchDrag = () => {
        if (!isDragging) return;
        setIsDragging(false);
        accumulatedDeltaRef.current = 0;
        startAutoPlay();
    };

    useEffect(() => {
        const preload = async () => {
            safeImages.forEach((src) => {
                const img = new Image();
                img.src = src;
            });
        };
        preload();
    }, [safeImages]);

    return (
        <div
            className={className}
            style={{
                width,
                ...style,
                userSelect: "none",
            }}
        >
            <div
                ref={containerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={endMouseDrag}
                onMouseLeave={endMouseDrag}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={endTouchDrag}
                onTouchCancel={endTouchDrag}
                style={{
                    position: "relative",
                    width: "100%",
                    height,
                    overflow: "hidden",
                    borderRadius: 16,
                    background:
                        "linear-gradient(180deg, rgba(245,248,255,1) 0%, rgba(235,242,252,1) 100%)",
                    border: "1px solid rgba(120,140,180,0.15)",
                    cursor: isDragging ? "grabbing" : "grab",
                    boxShadow: "0 8px 28px rgba(17, 24, 39, 0.08)",
                }}
            >
                {hasEnoughImages ? (
                    <img
                        src={safeImages[currentIndex]}
                        alt={`view-${currentIndex + 1}`}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit,
                            display: "block",
                            pointerEvents: "none",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                            fontSize: 14,
                        }}
                    >
                        请传入图片数组
                    </div>
                )}

                {showIndicator && hasEnoughImages && (
                    <div
                        style={{
                            position: "absolute",
                            right: 12,
                            top: 12,
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: "rgba(15, 23, 42, 0.55)",
                            color: "#fff",
                            fontSize: 12,
                            lineHeight: 1,
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        {currentIndex + 1} / {total}
                    </div>
                )}

                <div
                    style={{
                        position: "absolute",
                        left: 12,
                        bottom: 12,
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.72)",
                        color: "#334155",
                        fontSize: 12,
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(148,163,184,0.18)",
                    }}
                >
                    拖动可切换视角
                </div>

                {showControls && total > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            style={navBtnStyle("left")}
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            style={navBtnStyle("right")}
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {hasEnoughImages && total > 1 && (
                <div
                    style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                        overflowX: "auto",
                        paddingBottom: 4,
                    }}
                >
                    {safeImages.map((src, index) => {
                        const active = index === currentIndex;
                        return (
                            <button
                                key={`${src}-${index}`}
                                type="button"
                                onClick={() => goTo(index)}
                                style={{
                                    padding: 0,
                                    border: active
                                        ? "2px solid #3b82f6"
                                        : "1px solid rgba(148,163,184,0.25)",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    background: "#fff",
                                    width: 64,
                                    height: 64,
                                    flex: "0 0 auto",
                                    cursor: "pointer",
                                    boxShadow: active
                                        ? "0 6px 18px rgba(59,130,246,0.18)"
                                        : "0 3px 8px rgba(15,23,42,0.06)",
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`thumb-${index + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

function navBtnStyle(position: "left" | "right"): React.CSSProperties {
    return {
        position: "absolute",
        top: "50%",
        [position]: 12,
        transform: "translateY(-50%)",
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: "1px solid rgba(148,163,184,0.2)",
        background: "rgba(255,255,255,0.78)",
        color: "#0f172a",
        fontSize: 26,
        lineHeight: "38px",
        textAlign: "center",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
    };
}

export default Image3DViewer;
