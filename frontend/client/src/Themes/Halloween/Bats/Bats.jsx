import React, { useEffect, useState } from "react";
import './bats.css'

import Bat from '../../../assets/bat.png';

export default function Bats() {
    const [bats, setBats] = useState([]);

    const generateBats = (count) => {
        const bats = [];
        for (let i = 0; i < count; i++) {
            bats.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                dx: (Math.random() - 0.5) * 25,
                dy: (Math.random() - 0.5) * 25,
            });
        }
        return bats;
    };

    const moveBats = () => {
        setBats((prevBats) => {
            return prevBats.map((bat) => {
                const newBat = {
                    ...bat,
                    x: bat.x + bat.dx,
                    y: bat.y + bat.dy,
                };

                if (newBat.x > window.innerWidth || newBat.x < 0) {
                    newBat.dx *= -1;
                }

                if (newBat.y > window.innerHeight || newBat.y < 0) {
                    newBat.dy *= -1;
                }

                return newBat;
            });
        });
    };

    useEffect(() => {
        setBats(generateBats(4));

        const interval = setInterval(moveBats, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {bats.map((bat) => (
                <img
                    key={bat.id}
                    src={Bat}
                    className="bat"
                    style={{ left: bat.x + 'px', top: bat.y + 'px' }}
                    alt="Bat"
                />
            ))}
        </div>
    );
}
