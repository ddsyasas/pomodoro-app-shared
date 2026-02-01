import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiProps {
    visible: boolean;
    onComplete?: () => void;
}

interface Particle {
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
    size: number;
}

const CONFETTI_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#FF69B4',
];

const PARTICLE_COUNT = 50;

function ConfettiParticle({ particle, visible }: { particle: Particle; visible: boolean }) {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            translateY.value = -100;
            opacity.value = 1;

            translateY.value = withDelay(
                particle.delay,
                withTiming(SCREEN_HEIGHT + 100, {
                    duration: 3000 + Math.random() * 1000,
                    easing: Easing.out(Easing.quad),
                })
            );

            translateX.value = withDelay(
                particle.delay,
                withTiming((Math.random() - 0.5) * 100, {
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                })
            );

            rotate.value = withDelay(
                particle.delay,
                withTiming(particle.rotation + 720, {
                    duration: 3000,
                    easing: Easing.linear,
                })
            );

            opacity.value = withDelay(
                particle.delay + 2000,
                withTiming(0, { duration: 1000 })
            );
        }
    }, [visible, particle, translateY, translateX, rotate, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: particle.x,
                    width: particle.size,
                    height: particle.size * 1.5,
                    backgroundColor: particle.color,
                    borderRadius: particle.size / 4,
                },
                animatedStyle,
            ]}
        />
    );
}

export function Confetti({ visible, onComplete }: ConfettiProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (visible && !isAnimating) {
            setIsAnimating(true);

            // Generate particles
            const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
                id: i,
                x: Math.random() * SCREEN_WIDTH,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                delay: Math.random() * 500,
                rotation: Math.random() * 360,
                size: 8 + Math.random() * 8,
            }));

            setParticles(newParticles);

            // Reset after animation
            const timeout = setTimeout(() => {
                setIsAnimating(false);
                setParticles([]);
                onComplete?.();
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [visible, isAnimating, onComplete]);

    if (!isAnimating || particles.length === 0) {
        return null;
    }

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((particle) => (
                <ConfettiParticle
                    key={particle.id}
                    particle={particle}
                    visible={isAnimating}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    particle: {
        position: 'absolute',
        top: 0,
    },
});
