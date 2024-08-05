"use client";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 400px;
  height: 400px;

  .main-image {
    display: block;
    width: 100%;
    height: auto;
  }

  .zoomed-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 800px;
    height: 800px;
    pointer-events: none;
    transition: opacity 0.3s ease;
    background-repeat: no-repeat;
    background-size: 100%;
    opacity: 1;
    z-index: 10;
  }
`;

export default function PreviewImgZoom(props) {
  const { src, alt } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 400;
    setPosition({ x, y });
  };

  return (
    <Container
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {isHovered ? (
        <div
          className="zoomed-image"
          style={{
            backgroundImage: `url(${src})`,
            top: `-${position.y}px`,
            left: `-${position.x}px`,
          }}
        />
      ) : (
        <Image src={src} alt={alt} fill className="main-image" />
      )}
    </Container>
  );
}
