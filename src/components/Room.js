import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Plane, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraHelper, Vector3 } from 'three';

function Wall({ position, rotation, color, transparent = false, opacity = 1, args }) {
    return (
        <Plane args={args} position={position} rotation={rotation}>
            <meshStandardMaterial attach="material" color={color} side={THREE.DoubleSide} transparent={transparent} opacity={opacity} />
        </Plane>
    );
}

function Stage({ position }) {
    return (
      <>
        {/* Main Stage */}
        <mesh position={[position[0], position[1], position[2]]}>
          <boxGeometry args={[5, 0.5, 2]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
        {/* Stairs */}
        <mesh position={[position[0] - 1.4, position[1] - -0.1, position[2] + 1]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>
        <mesh position={[position[0] - 1.4, position[1] - 0, position[2] + 1.2]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>
        <mesh position={[position[0] - 1.4, position[1] - 0.1, position[2] + 1.3]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>
        <mesh position={[position[0] - 1.4, position[1] - 0.2, position[2] + 1.3]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>
        <mesh position={[position[0] - 1.4, position[1] - 0.3, position[2] + 1.4]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>
      </>
    );
  }

  function CinemaScreen({ position, videoUrl, muted }) {
    const meshRef = useRef();
    const videoRef = useRef(document.createElement('video'));

    useEffect(() => {
        const video = videoRef.current;
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.playsInline = true;
        video.muted = muted;
        video.play().catch(error => console.error("Video play failed:", error));

        return () => {
            video.pause();
            video.src = "";
        };
    }, [videoUrl, muted]);

    useEffect(() => {
        const videoTexture = new THREE.VideoTexture(videoRef.current);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        
        if (meshRef.current) {
            meshRef.current.material.map = videoTexture;
        }

        return () => {
            videoTexture.dispose();
        };
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.material.map.needsUpdate = true;
        }
    });

    const radius = 2.5; // Radius of the cylinder to create enough curvature
    const arc = - Math.PI * 0.6; // Arc of the cylinder to show as the screen

    return (
        <mesh ref={meshRef} position={[position[0], position[1], position[2]]} rotation={[0, Math.PI / 3.3, 0]}>
            <cylinderGeometry args={[radius, radius, 1.5, 32, 1, true, 0, arc]} />
            <meshBasicMaterial attach="material" side={THREE.DoubleSide} />
        </mesh>
    );
}

function Chair({ position, onClick, scale, isSeatSelected }) {
    const rotationY = Math.PI; // Rotate 180 degrees to face the screen

    // Define dimensions based on scale
    const seatSize = [0.5 * scale, 0.1 * scale, 0.5 * scale];
    const legHeight = 0.5 * scale;
    const legThickness = 0.05 * scale;
    const backHeight = 0.4 * scale;
    const backThickness = 0.1 * scale;

    return (
      <>
        {/* Chair Seat */}
        <mesh 
            position={[position[0], position[1], position[2]]} 
            rotation={[0, rotationY, 0]}
            onClick={onClick}
            cursor="pointer"
        >
          <boxGeometry args={seatSize} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "darkred"} />
        </mesh>
        {/* Chair Legs */}
        <mesh position={[position[0] + 0.2 * scale, position[1] - 0.25 * scale, position[2] + 0.2 * scale]}>
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "saddlebrown"}  />
        </mesh>
        <mesh position={[position[0] - 0.2 * scale, position[1] - 0.25 * scale, position[2] + 0.2 * scale]}>
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "saddlebrown"} />
        </mesh>
        <mesh position={[position[0] + 0.2 * scale, position[1] - 0.25 * scale, position[2] - 0.2 * scale]}>
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "saddlebrown"} />
        </mesh>
        <mesh position={[position[0] - 0.2 * scale, position[1] - 0.25 * scale, position[2] - 0.2 * scale]}>
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "saddlebrown"} />
        </mesh>
        {/* Chair Back */}
        <mesh position={[position[0], position[1] + 0.2 * scale, position[2] - 0.25 * scale]}>
          <boxGeometry args={[0.5 * scale, backHeight, backThickness]} />
          <meshStandardMaterial color={isSeatSelected ? "white" : "darkred"}  />
        </mesh>
      </>
    );
}

  
  

function Room() {
    return (
        <>
            {/* Floor */}
            <Wall args={[5, 7]} position={[0, 0, 2]} rotation={[-Math.PI / 2, 0, 0]} color="grey" />
            {/* Ceiling */}
            <Wall args={[5, 3]} position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} color="grey" />
            {/* Back wall */}
            {/* <Wall args={[5, 3]} position={[0, 1.5, -1.5]} rotation={[0, Math.PI, 0]} color="lightblue" /> */}
            {/* Left wall (with entry gate) */}
            <Wall args={[2, 3]} position={[-2.5, 1.5, 0.5]} rotation={[0, Math.PI / 2, 0]} color="lightblue" />
            <Wall args={[1, 3]} position={[-2.5, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} color="lightblue" transparent={true} opacity={0.5} />
            {/* Right wall (with exit gate) */}
            <Wall args={[2, 3]} position={[2.5, 1.5, 0.5]} rotation={[0, -Math.PI / 2, 0]} color="lightblue" />
            <Wall args={[1, 3]} position={[2.5, 1.5, -1]} rotation={[0, -Math.PI / 2, 0]} color="lightblue" transparent={true} opacity={0.5} />

        </>
    );
}


function ChairComponent({ chair, onClick, scale, setSelectedSeats }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        onClick(chair.position, chair.target); // Propagate the click handling
        setIsSelected(current => !current); // Toggle selection state
        console.log("isSelected", isSelected)
        setSelectedSeats(prev => {

            prev = [...prev]

            const index = prev.indexOf(chair.seat);
            if (index > -1) {
                // Element exists in the array, remove it
                prev.splice(index, 1);
            } else {
                // Element does not exist, add it
                prev.push(chair.seat);
            }

            return prev
        })
    };

    return (
        <Chair 
            position={chair.position.toArray()}
            onClick={handleClick}
            scale={scale}
            isSeatSelected={isSelected}
        />
    );
}

function CameraControls({ chairs, chairScale, setSelectedSeats }) {
    const { camera } = useThree();
    const controlsRef = useRef();
    const [enabled, setEnabled] = useState(true);
    const handleChairClick = (position, target) => {
        // setEnabled(false); // Disable OrbitControls during animation
        // camera.position.set(target.x, target.y, target.z); // Move camera behind the target
        // controlsRef.current.target.copy(position); // Set new controls target
        // setTimeout(() => setEnabled(true), 2000); // Re-enable controls after transition
    };

    useFrame(() => {
        controlsRef.current.update();
    });

    return (
        <>
            {chairs.map(chair =>{
                return <ChairComponent
                setSelectedSeats={setSelectedSeats}
                key={chair.id}
                chair={chair}
                onClick={handleChairClick}
                scale={chairScale}
            />
            }
            )}
            <OrbitControls ref={controlsRef} enableZoom={enabled} enableRotate={enabled} enablePan={enabled} />
        </>
    );
}


function Scene() {
    const [isMuted, setIsMuted] = useState(true);
    const videoUrl = "video.mp4"; // Path to your video
    const [enableControls, setEnableControls] = useState(true);
    const controlsRef = useRef(null);
    const chairScale = 0.2
    const [selectedSeats, setSelectedSeats] = useState([]);
    const alphabetic = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    // Define multiple chairs

    const chairs = [[...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)], [...Array(25)]].map( (row, index) => {
        
        return row.map( (seat, i) => {
            let seatPostion = 13 - i;
            return {
                id: `${index} - ${i}`, 
                position: new Vector3(-1 * (-1 + seatPostion) * chairScale, (0.5 * (-index + 11) ) * chairScale, index * 1.5  * chairScale), 
                target:  new Vector3(-1 * (-1 + seatPostion)  * chairScale, (0.6 )  * chairScale, (-0.355) * chairScale),
                seat: `${alphabetic[index]}${i}`
            }
        })

    }).flat(Infinity)

    return (
        <>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Room />
                <Stage position={[0, 0.2, 5]} />
                <CinemaScreen position={[-0.05, 1.5, 4]} videoUrl={videoUrl} muted={isMuted} />
                <OrbitControls ref={controlsRef} enabled={enableControls} />
                <CameraControls chairs={chairs} chairScale={chairScale} setSelectedSeats={setSelectedSeats} />

            </Canvas>
            <button style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }} onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? "Turn Sound On" : "Turn Sound Off"}
            </button>
            <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 1000 }}>
                Selected Seats :  {JSON.stringify(selectedSeats)}
            </div>
        </>
    );
}

export default Scene;
