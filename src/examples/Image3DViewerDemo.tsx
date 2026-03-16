import React from "react";
import Image3DViewer from "../components/Image3DViewer/Image3DViewer.tsx";


const DemoPage: React.FC = () => {
    const images = [
        "/images/object/1.jpg",
        "/images/object/2.jpg",
        "/images/object/3.jpg",
        "/images/object/4.jpg",
        "/images/object/5.jpg",
        "/images/object/6.jpg",
        "/images/object/7.jpg",
        "/images/object/8.jpg",
    ];

    return (
        <div style={{ padding: 24 }}>
            <Image3DViewer
                images={images}
                width={600}
                height={500}
                autoPlay={false}
                autoPlayInterval={100}
                dragSensitivity={20}
                showControls={true}
                showIndicator={true}
                objectFit="contain"
            />
        </div>
    );
};

export default DemoPage;
